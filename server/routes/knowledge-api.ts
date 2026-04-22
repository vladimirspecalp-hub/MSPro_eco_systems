/**
 * Knowledge API — база знаний MSPRO
 * @module server/routes/knowledge-api
 *
 * Статьи хранятся в content/knowledge/articles/<slug>.json и индексируются
 * через content/knowledge/index.json. Содержимое не генерируется автоматически,
 * пишется вручную content-агентом.
 */

import { Router, type Request, type Response } from "express";
import { promises as fs } from "fs";
import { resolve } from "path";

const router = Router();

const KNOWLEDGE_DIR = resolve(process.cwd(), "content", "knowledge");
const INDEX_PATH = resolve(KNOWLEDGE_DIR, "index.json");
const ARTICLES_DIR = resolve(KNOWLEDGE_DIR, "articles");

interface KnowledgeIndex {
  title: string;
  description: string;
  categories: Array<{
    slug: string;
    title: string;
    description: string;
    icon: string;
  }>;
  articles: Array<{
    slug: string;
    category: string;
    title: string;
    description: string;
    publishedAt?: string;
    updatedAt?: string;
  }>;
}

let cachedIndex: KnowledgeIndex | null = null;
let cachedAt = 0;
const CACHE_TTL_MS = 60_000;

async function loadIndex(): Promise<KnowledgeIndex> {
  const now = Date.now();
  if (cachedIndex && now - cachedAt < CACHE_TTL_MS) return cachedIndex;
  const raw = await fs.readFile(INDEX_PATH, "utf-8");
  cachedIndex = JSON.parse(raw) as KnowledgeIndex;
  cachedAt = now;
  return cachedIndex;
}

/**
 * GET /api/knowledge
 * Возвращает индекс базы знаний: категории + список статей.
 */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const index = await loadIndex();
    res.json(index);
  } catch (err) {
    console.error("[knowledge-api] index load error:", err);
    res.status(500).json({ error: "Knowledge index unavailable" });
  }
});

/**
 * GET /api/knowledge/:slug
 * Возвращает полную статью по slug.
 */
router.get("/:slug", async (req: Request, res: Response) => {
  const { slug } = req.params;
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).json({ error: "Invalid slug" });
  }
  try {
    const articlePath = resolve(ARTICLES_DIR, `${slug}.json`);
    const raw = await fs.readFile(articlePath, "utf-8");
    res.json(JSON.parse(raw));
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return res.status(404).json({ error: "Article not found", slug });
    }
    console.error("[knowledge-api] article load error:", err);
    res.status(500).json({ error: "Article load failed" });
  }
});

export default router;
