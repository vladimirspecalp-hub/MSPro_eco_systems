#!/usr/bin/env node
/**
 * Конвертер MD-статей базы знаний → JSON для knowledge-api.
 * Используется для статей в content/knowledge/articles/<category>/<slug>.md.
 *
 * Поддерживаемая разметка (минимально достаточная для текущих статей):
 *  - H1 (#) — берётся как заголовок раздела (но title задаётся через front-matter ниже)
 *  - H2 (##), H3 (###)
 *  - параграфы
 *  - **bold**, *italic*
 *  - [text](url) ссылки
 *  - "- " ненумерованные списки
 *  - "1. " нумерованные списки
 *  - --- — разделитель секций (игнорируется в HTML)
 *
 * Front-matter ожидается в верхней части между # H1 и первым ---:
 *   **URL:** `/knowledge/articles/...`
 *   **title:** ...
 *   **description:** ...
 *
 * FAQ выделяется по разделу "## FAQ ..." — каждый "### Вопрос?" + параграф = пара.
 *
 * Использование:
 *   node scripts/convert-knowledge-md.mjs <input.md> <output.json>
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

function escapeHtml(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function inlineMd(text) {
  // экранируем сначала
  let s = escapeHtml(text);
  // ссылки [text](url) — url НЕ экранируем больше чем уже сделали (& уже &amp;)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) => {
    const isExternal = /^https?:\/\//.test(u);
    const rel = isExternal ? ' rel="noopener noreferrer" target="_blank"' : '';
    return `<a href="${u}"${rel}>${t}</a>`;
  });
  // **bold**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // *italic* (одиночные звёздочки)
  s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
  return s;
}

function renderMdToHtml(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;

  // Парсер блоков
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '' || trimmed === '---') {
      i++;
      continue;
    }

    // Заголовки
    if (trimmed.startsWith('### ')) {
      out.push(`<h3>${inlineMd(trimmed.slice(4))}</h3>`);
      i++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      out.push(`<h2>${inlineMd(trimmed.slice(3))}</h2>`);
      i++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      // H1 пропускаем — title идёт из front-matter
      i++;
      continue;
    }

    // Ненумерованный список
    if (/^- /.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^- /.test(lines[i].trim())) {
        items.push(inlineMd(lines[i].trim().slice(2)));
        i++;
      }
      out.push(`<ul>${items.map((it) => `<li>${it}</li>`).join('')}</ul>`);
      continue;
    }

    // Нумерованный список
    if (/^\d+\.\s/.test(trimmed)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        items.push(inlineMd(lines[i].trim().replace(/^\d+\.\s/, '')));
        i++;
      }
      out.push(`<ol>${items.map((it) => `<li>${it}</li>`).join('')}</ol>`);
      continue;
    }

    // Параграф (мульти-строчный до пустой строки)
    const paraLines = [];
    while (i < lines.length && lines[i].trim() !== '' && !/^(#|-|\d+\.\s|---)/.test(lines[i].trim())) {
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length) {
      out.push(`<p>${inlineMd(paraLines.join(' '))}</p>`);
    }
  }

  return out.join('\n');
}

function parseFrontMatter(md) {
  // Front-matter — bold-метки между H1 и первым ---
  const meta = {};
  const lines = md.split(/\r?\n/);
  for (const line of lines) {
    const m = line.match(/^\*\*([^*:]+):\*\*\s*`?([^`]+)`?\s*$/);
    if (m) {
      meta[m[1].trim().toLowerCase()] = m[2].trim();
    }
    if (line.trim() === '---') break;
  }
  return meta;
}

function parseFaq(md) {
  // Ищем секцию "## FAQ — частые вопросы" и собираем ### Q + параграф = A
  const faqStart = md.search(/^##\s+FAQ\b.*$/m);
  if (faqStart < 0) return { faq: [], bodyMd: md };
  const bodyMd = md.slice(0, faqStart).trim();
  const faqMd = md.slice(faqStart);
  const faq = [];
  const re = /^###\s+([^\n]+)\n+([\s\S]*?)(?=^###\s+|\n+\*[^*]|\n+---|\Z)/gm;
  let m;
  while ((m = re.exec(faqMd)) !== null) {
    const question = m[1].trim();
    // Берём всё до следующего ### / *italic закрывающего параграфа / ---
    const answerRaw = m[2].split(/\n---|\n\*[^*]/)[0].trim();
    if (question && answerRaw) {
      faq.push({ question, answer: answerRaw.replace(/\s+/g, ' ').trim() });
    }
  }
  return { faq, bodyMd };
}

async function main() {
  const [inputPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !outputPath) {
    console.error('Usage: node scripts/convert-knowledge-md.mjs <input.md> <output.json>');
    process.exit(1);
  }
  const md = await readFile(inputPath, 'utf-8');
  const front = parseFrontMatter(md);
  const { faq, bodyMd } = parseFaq(md);

  // Заголовок раздела — первая # H1
  const h1Match = md.match(/^#\s+(.+)$/m);
  const h1Title = h1Match ? h1Match[1].trim() : '';

  // URL → category + slug
  const url = (front['url'] || '').replace(/^\/+|\/+$/g, '');
  const parts = url.split('/');
  // Ожидаемо: knowledge/articles/<category>/<slug>
  const slug = parts[parts.length - 1];
  const category = parts[parts.length - 2];

  // bodyHtml: парсим bodyMd, исключая front-matter (всё до первого --- после H1)
  const afterFront = bodyMd.replace(/^#\s+[^\n]+\n[\s\S]*?\n---\n/, '');
  const bodyHtml = renderMdToHtml(afterFront);

  // Closing CTA-line (вне FAQ) — добавим если есть
  // Пропускаем — она уже включена в bodyMd.

  const article = {
    slug,
    category,
    url: '/' + parts.join('/'),
    title: h1Title,
    metaTitle: front['title'] || h1Title,
    description: front['description'] || '',
    publishedAt: new Date().toISOString().slice(0, 10),
    updatedAt: new Date().toISOString().slice(0, 10),
    bodyHtml,
    faq,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, JSON.stringify(article, null, 2) + '\n', 'utf-8');
  console.log(`Wrote ${outputPath}: ${bodyHtml.length} bytes HTML, ${faq.length} FAQ items`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
