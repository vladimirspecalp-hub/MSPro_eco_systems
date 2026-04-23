/**
 * 301 redirects middleware
 * @module server/middleware/redirects
 *
 * Читает content/redirects.json (с кешированием 60 сек) и применяет
 * постоянные редиректы для устаревших URL (например старый сайт /uslugi/*
 * → новый /services/*). Порядок проверки:
 *   1. Точное совпадение пути в redirects.json
 *   2. Префиксное совпадение через _prefix_redirects
 *   3. Пропускаем на следующий middleware
 */

import type { Request, Response, NextFunction } from "express";
import { promises as fs } from "fs";
import { resolve } from "path";

const REDIRECTS_PATH = resolve(process.cwd(), "content", "redirects.json");
const CACHE_TTL_MS = 60_000;

interface RedirectsFile {
  [key: string]: any;
  _prefix_redirects?: { [prefix: string]: string };
}

let cached: RedirectsFile | null = null;
let cachedAt = 0;
let exact: Map<string, string> = new Map();
let prefixes: Array<[string, string]> = [];

async function loadRedirects(): Promise<void> {
  const now = Date.now();
  if (cached && now - cachedAt < CACHE_TTL_MS) return;

  try {
    const raw = await fs.readFile(REDIRECTS_PATH, "utf-8");
    const data = JSON.parse(raw) as RedirectsFile;

    const newExact = new Map<string, string>();
    const newPrefixes: Array<[string, string]> = [];

    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("_")) continue; // _comment, _updated, _prefix_redirects
      if (typeof value === "string" && key.startsWith("/")) {
        newExact.set(key, value);
      }
    }

    const prefMap = data._prefix_redirects || {};
    for (const [prefix, target] of Object.entries(prefMap)) {
      if (typeof target === "string" && prefix.startsWith("/")) {
        newPrefixes.push([prefix, target]);
      }
    }
    // Длинные префиксы первыми (more specific wins)
    newPrefixes.sort((a, b) => b[0].length - a[0].length);

    cached = data;
    cachedAt = now;
    exact = newExact;
    prefixes = newPrefixes;
  } catch (err) {
    // Если файл отсутствует или битый — работаем без редиректов
    cached = {};
    cachedAt = now;
    exact = new Map();
    prefixes = [];
  }
}

export function redirectsMiddleware() {
  return async (req: Request, res: Response, next: NextFunction) => {
    await loadRedirects();

    const path = req.path.replace(/\/$/, "") || "/";

    // 1. Точное совпадение
    const exactMatch = exact.get(path) || exact.get(req.path);
    if (exactMatch) {
      return res.redirect(301, exactMatch);
    }

    // 2. Префиксные редиректы
    for (const [prefix, target] of prefixes) {
      if (req.path.startsWith(prefix)) {
        return res.redirect(301, target);
      }
    }

    next();
  };
}
