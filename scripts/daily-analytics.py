#!/usr/bin/env python3
"""
scripts/daily-analytics.py
Ежедневный сборщик аналитики mspro-ltd.ru.

Этап 2 (MSP-52): Block A (Я.Вебмастер индексация) + Block C (Я.Метрика поведение).
Этап 3 (MSP-53): Block B (GSC поисковый трафик) + Block C дополнение (GA4).

Запуск:
    python3 scripts/daily-analytics.py

Credentials (из env или файла):
    YA_OAUTH_TOKEN       — Yandex OAuth-токен (Вебмастер + Метрика)
    YA_WEBMASTER_USER    — ID пользователя Вебмастера
    YA_WEBMASTER_HOST    — Host в формате https:mspro-ltd.ru:443
    YA_METRIKA_COUNTER   — Counter ID Метрики (72249244)

Output:
    _data/analytics/YYYY-MM-DD.json   — полный архив (не коммитится)
    shared/icos/daily/YYYY-MM-DD.md   — ежедневный отчёт (коммитится)
"""

import json
import os
import sys
import io
from datetime import date, timedelta
from pathlib import Path

import requests

# UTF-8 stdout
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding="utf-8")

# ---------------------------------------------------------------------------
# Конфигурация
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).parent
REPO_DIR = SCRIPT_DIR.parent

# Credentials — из env (cron-env-файл загружается runner-ом)
YA_TOKEN = (
    os.environ.get("YA_OAUTH_TOKEN")
    or os.environ.get("YA_OAUTH")
    or os.environ.get("YM_TOKEN", "")
)
YA_USER = os.environ.get("YA_WEBMASTER_USER", "239393595")
YA_HOST = os.environ.get("YA_WEBMASTER_HOST", "https:mspro-ltd.ru:443")
YA_COUNTER = os.environ.get("YA_METRIKA_COUNTER", "72249244")

TODAY = date.today().isoformat()
YESTERDAY = (date.today() - timedelta(days=1)).isoformat()
WEEK_AGO = (date.today() - timedelta(days=7)).isoformat()
DAY_BEFORE_YESTERDAY = (date.today() - timedelta(days=2)).isoformat()

DATA_DIR = REPO_DIR / "_data" / "analytics"
REPORT_DIR = REPO_DIR / "shared" / "icos" / "daily"
DATA_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

OUTPUT_JSON = DATA_DIR / f"{TODAY}.json"
OUTPUT_MD = REPORT_DIR / f"{TODAY}.md"

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def log_err(msg: str) -> None:
    print(f"[ERR] {msg}", file=sys.stderr)


def ya_headers() -> dict:
    return {"Authorization": f"OAuth {YA_TOKEN}"}


def safe_get(url: str, params: dict = None, label: str = "") -> dict | None:
    """GET с обработкой ошибок → dict или None."""
    try:
        r = requests.get(url, headers=ya_headers(), params=params, timeout=20)
        if r.ok:
            return r.json()
        log_err(f"{label}: HTTP {r.status_code} — {r.text[:200]}")
        return None
    except Exception as e:
        log_err(f"{label}: {e}")
        return None


# ---------------------------------------------------------------------------
# Block A — Yandex Webmaster (индексация)
# ---------------------------------------------------------------------------

def fetch_ywm_summary() -> dict:
    """Сводка по сайту: sqi, indexed, excluded, problems."""
    d = safe_get(
        f"https://api.webmaster.yandex.net/v4/user/{YA_USER}/hosts/{YA_HOST}/summary",
        label="YWM summary",
    )
    if not d:
        return {"error": "no data"}
    return {
        "sqi": d.get("sqi"),
        "indexed": d.get("searchable_pages_count"),
        "excluded": d.get("excluded_pages_count"),
        "problems": d.get("site_problems", {}),
    }


def fetch_ywm_index_history() -> dict:
    """История индексации за последние 2 дня → дельта."""
    d = safe_get(
        f"https://api.webmaster.yandex.net/v4/user/{YA_USER}/hosts/{YA_HOST}/search-urls/in-search/history",
        params={"date_from": WEEK_AGO, "date_to": TODAY},
        label="YWM index history",
    )
    if not d:
        return {"error": "no data"}

    points = d.get("history", [])
    if len(points) >= 2:
        last = points[-1]
        prev = points[-2]
        # API returns "value" for in-search history
        last_val = last.get("value") or last.get("count")
        prev_val = prev.get("value") or prev.get("count")
        delta = (last_val or 0) - (prev_val or 0)
        return {
            "today_count": last_val,
            "prev_count": prev_val,
            "delta": delta,
            "date": last.get("date"),
        }
    return {"points": len(points), "raw": points[-3:] if points else []}


def fetch_ywm_excluded() -> list:
    """Страницы не в индексе (исключённые) — топ-10."""
    d = safe_get(
        f"https://api.webmaster.yandex.net/v4/user/{YA_USER}/hosts/{YA_HOST}/search-urls/excluded/samples",
        params={"limit": 10},
        label="YWM excluded",
    )
    if not d:
        return []
    samples = d.get("samples", [])
    result = []
    for s in samples:
        result.append({
            "url": s.get("url"),
            "reason": s.get("exclusion_reason"),
            "date": s.get("date"),
        })
    return result


def fetch_ywm_diagnostics() -> list:
    """Проблемы сайта по диагностике — только PRESENT-состояния."""
    d = safe_get(
        f"https://api.webmaster.yandex.net/v4/user/{YA_USER}/hosts/{YA_HOST}/diagnostics",
        label="YWM diagnostics",
    )
    if not d:
        return []
    problems = d.get("problems") or {}
    result = []
    if isinstance(problems, dict):
        for problem_type, info in problems.items():
            if not isinstance(info, dict):
                continue
            state = info.get("state", "ABSENT")
            if state == "PRESENT":
                result.append({
                    "type": problem_type,
                    "severity": info.get("severity"),
                    "last_updated": info.get("last_state_update"),
                })
    return result


def fetch_ywm_sitemaps() -> list:
    """Статус sitemap.xml."""
    d = safe_get(
        f"https://api.webmaster.yandex.net/v4/user/{YA_USER}/hosts/{YA_HOST}/sitemaps",
        label="YWM sitemaps",
    )
    if not d:
        return []
    return [
        {
            "url": s.get("sitemap_url"),
            "pages": s.get("searchable_urls_count"),
            "last_access": s.get("last_access_date"),
        }
        for s in d.get("sitemaps", [])[:5]
    ]


def fetch_ywm_top_queries() -> list:
    """Топ-10 запросов за неделю."""
    d = safe_get(
        f"https://api.webmaster.yandex.net/v4/user/{YA_USER}/hosts/{YA_HOST}/search-queries/popular",
        params={
            "order_by": "TOTAL_CLICKS",
            "query_indicator": ["TOTAL_CLICKS", "TOTAL_SHOWS", "AVG_CLICK_POSITION"],
            "date_from": WEEK_AGO,
            "date_to": TODAY,
            "limit": 10,
        },
        label="YWM queries",
    )
    if not d:
        return []
    result = []
    for q in d.get("queries", [])[:10]:
        ind = q.get("indicators", {})
        result.append({
            "query": q.get("query_text"),
            "clicks": int(ind.get("TOTAL_CLICKS") or 0),
            "shows": int(ind.get("TOTAL_SHOWS") or 0),
            "avg_position": round(float(ind.get("AVG_CLICK_POSITION") or ind.get("AVG_SHOW_POSITION") or 0), 1),
        })
    return result


def fetch_block_a() -> dict:
    print("[A] Yandex Webmaster — индексация...", flush=True)
    return {
        "summary": fetch_ywm_summary(),
        "index_history": fetch_ywm_index_history(),
        "excluded_pages": fetch_ywm_excluded(),
        "diagnostics": fetch_ywm_diagnostics(),
        "sitemaps": fetch_ywm_sitemaps(),
        "top_queries_week": fetch_ywm_top_queries(),
    }


# ---------------------------------------------------------------------------
# Block C — Yandex Metrika (поведение)
# ---------------------------------------------------------------------------

def ym_stat(metrics: list, dimensions: list = None, params: dict = None) -> dict | None:
    """Запрос к stat/v1/data."""
    base_params = {
        "ids": YA_COUNTER,
        "metrics": ",".join(metrics),
        "date1": WEEK_AGO,
        "date2": YESTERDAY,
        "limit": 20,
    }
    if dimensions:
        base_params["dimensions"] = ",".join(dimensions)
        base_params["sort"] = f"-{metrics[0]}"
    if params:
        base_params.update(params)

    return safe_get(
        "https://api-metrika.yandex.net/stat/v1/data",
        params=base_params,
        label=f"YM stat {metrics[0]}",
    )


def fetch_ym_totals() -> dict:
    """Суммарные метрики за неделю: сессии, пользователи, отказы, глубина, время."""
    d = ym_stat(
        ["ym:s:visits", "ym:s:users", "ym:s:bounceRate", "ym:s:pageDepth", "ym:s:avgVisitDurationSeconds"],
    )
    if not d:
        return {"error": "no data"}
    totals = d.get("totals", [])
    if not totals:
        return {"error": "empty totals"}
    return {
        "visits": int(totals[0]) if totals else None,
        "users": int(totals[1]) if len(totals) > 1 else None,
        "bounce_rate_pct": round(float(totals[2]), 1) if len(totals) > 2 else None,
        "page_depth": round(float(totals[3]), 2) if len(totals) > 3 else None,
        "avg_duration_sec": int(totals[4]) if len(totals) > 4 else None,
        "period": f"{WEEK_AGO} → {YESTERDAY}",
    }


def fetch_ym_top_entries() -> list:
    """Топ-10 страниц входа за неделю."""
    d = ym_stat(
        ["ym:s:visits"],
        dimensions=["ym:s:startURL"],
    )
    if not d:
        return []
    result = []
    for row in d.get("data", [])[:10]:
        dim = row.get("dimensions", [{}])[0]
        url = dim.get("name") or dim.get("id", "")
        visits = int(row.get("metrics", [0])[0])
        result.append({"url": url, "visits": visits})
    return result


def fetch_ym_sources() -> list:
    """Источники трафика за неделю."""
    d = ym_stat(
        ["ym:s:visits"],
        dimensions=["ym:s:lastTrafficSource"],
    )
    if not d:
        return []
    result = []
    for row in d.get("data", [])[:10]:
        dim = row.get("dimensions", [{}])[0]
        src = dim.get("name") or dim.get("id", "")
        visits = int(row.get("metrics", [0])[0])
        result.append({"source": src, "visits": visits})
    return result


def fetch_ym_funnel() -> dict:
    """Воронка: главная → услуга → калькулятор → заявка.
    Используем фильтрацию по URL startsWith для каждого шага.
    """
    steps = {
        "homepage": "/",
        "service": "/uslugi",
        "calculator": "/calculator",
        "lead": "/spasibo",  # thank-you page или event submit
    }
    funnel_data = {}
    for step_name, url_filter in steps.items():
        d = safe_get(
            "https://api-metrika.yandex.net/stat/v1/data",
            params={
                "ids": YA_COUNTER,
                "metrics": "ym:s:visits",
                "date1": WEEK_AGO,
                "date2": YESTERDAY,
                "filters": f"ym:s:startURL=~'{url_filter}'",
            },
            label=f"YM funnel {step_name}",
        )
        if d and d.get("totals"):
            funnel_data[step_name] = int(d["totals"][0])
        else:
            funnel_data[step_name] = None

    # Конверсии между шагами
    result = {"raw": funnel_data}
    steps_list = list(steps.keys())
    conversions = {}
    for i in range(1, len(steps_list)):
        prev = steps_list[i - 1]
        curr = steps_list[i]
        prev_val = funnel_data.get(prev)
        curr_val = funnel_data.get(curr)
        if prev_val and curr_val is not None:
            conversions[f"{prev}->{curr}"] = round(curr_val / prev_val * 100, 1)
        else:
            conversions[f"{prev}->{curr}"] = None
    # Дополнительно: homepage→calculator напрямую
    hp = funnel_data.get("homepage")
    calc = funnel_data.get("calculator")
    if hp and calc is not None:
        conversions["homepage->calculator"] = round(calc / hp * 100, 1)
    result["conversions_pct"] = conversions
    return result


def fetch_block_c() -> dict:
    print("[C] Yandex Metrika — поведение...", flush=True)
    return {
        "totals_week": fetch_ym_totals(),
        "top_entries": fetch_ym_top_entries(),
        "sources": fetch_ym_sources(),
        "funnel": fetch_ym_funnel(),
    }


# ---------------------------------------------------------------------------
# Render Markdown report
# ---------------------------------------------------------------------------

def render_markdown(data: dict) -> str:
    a = data.get("block_a", {})
    c = data.get("block_c", {})
    ts = data.get("collected_at", TODAY)

    lines = [
        f"# Ежедневный отчёт mspro-ltd.ru — {TODAY}",
        f"",
        f"_Собрано: {ts}_",
        f"",
        f"---",
        f"",
        f"## Блок A. Индексация Яндекс",
        f"",
    ]

    # Summary
    summary = a.get("summary", {})
    if "error" not in summary:
        lines += [
            f"- **SQI:** {summary.get('sqi', 'n/a')}",
            f"- **Страниц в индексе:** {summary.get('indexed', 'n/a')}",
            f"- **Исключено:** {summary.get('excluded', 'n/a')}",
        ]
        probs = summary.get("problems", {})
        if probs:
            for k, v in probs.items():
                lines.append(f"- **Проблемы [{k}]:** {v}")
    else:
        lines.append(f"- Сводка: нет данных")

    lines.append("")

    # Index history delta
    hist = a.get("index_history", {})
    if "error" not in hist and hist.get("delta") is not None:
        delta = hist["delta"]
        sign = "+" if delta >= 0 else ""
        lines.append(f"**Дельта индексации за сутки:** {sign}{delta} страниц (было: {hist.get('prev_count')}, стало: {hist.get('today_count')})")
    else:
        lines.append("**Дельта индексации:** нет данных")

    lines.append("")

    # Diagnostics
    diag = a.get("diagnostics", [])
    if diag:
        lines.append("### Проблемы диагностики")
        for d in diag[:5]:
            lines.append(f"- [{d.get('severity', '?')}] {d.get('title', d.get('type', '?'))}")
        lines.append("")

    # Excluded pages
    excl = a.get("excluded_pages", [])
    if excl:
        lines.append("### Исключённые страницы (топ-10)")
        lines.append("| URL | Причина | Дата |")
        lines.append("|-----|---------|------|")
        for p in excl[:10]:
            lines.append(f"| {p.get('url', 'n/a')} | {p.get('reason', 'n/a')} | {p.get('date', 'n/a')} |")
        lines.append("")

    # Top queries
    queries = a.get("top_queries_week", [])
    if queries:
        lines.append("### Топ запросов (7 дней)")
        lines.append("| Запрос | Клики | Показы | Позиция |")
        lines.append("|--------|-------|--------|---------|")
        for q in queries[:10]:
            lines.append(f"| {q.get('query', 'n/a')} | {q.get('clicks', 0)} | {q.get('shows', 0)} | {q.get('avg_position', 'n/a')} |")
        lines.append("")

    # Sitemaps
    sitemaps = a.get("sitemaps", [])
    if sitemaps:
        lines.append("### Sitemap.xml")
        for s in sitemaps:
            lines.append(f"- {s.get('url', 'n/a')} | страниц: {s.get('pages', 'n/a')} | последний доступ: {s.get('last_access', 'n/a')}")
        lines.append("")

    lines += [
        "---",
        "",
        "## Блок C. Поведение Яндекс.Метрика",
        "",
    ]

    # Totals
    totals = c.get("totals_week", {})
    if "error" not in totals:
        lines += [
            f"**Период:** {totals.get('period', 'n/a')}",
            f"",
            f"| Метрика | Значение |",
            f"|---------|----------|",
            f"| Сессии | {totals.get('visits', 'n/a')} |",
            f"| Пользователи | {totals.get('users', 'n/a')} |",
            f"| Отказы | {totals.get('bounce_rate_pct', 'n/a')}% |",
            f"| Глубина просмотра | {totals.get('page_depth', 'n/a')} стр. |",
            f"| Среднее время (сек) | {totals.get('avg_duration_sec', 'n/a')} |",
            f"",
        ]
    else:
        lines.append("Данные Метрики: нет данных\n")

    # Top entries
    entries = c.get("top_entries", [])
    if entries:
        lines.append("### Топ-10 страниц входа")
        lines.append("| URL | Визиты |")
        lines.append("|-----|--------|")
        for e in entries[:10]:
            lines.append(f"| {e.get('url', 'n/a')} | {e.get('visits', 0)} |")
        lines.append("")

    # Sources
    sources = c.get("sources", [])
    if sources:
        lines.append("### Источники трафика")
        lines.append("| Источник | Визиты |")
        lines.append("|----------|--------|")
        for s in sources[:10]:
            lines.append(f"| {s.get('source', 'n/a')} | {s.get('visits', 0)} |")
        lines.append("")

    # Funnel
    funnel = c.get("funnel", {})
    raw = funnel.get("raw", {})
    conversions = funnel.get("conversions_pct", {})
    if raw:
        lines.append("### Воронка конверсий")
        lines.append("| Шаг | Визиты |")
        lines.append("|-----|--------|")
        for step, val in raw.items():
            lines.append(f"| {step} | {val if val is not None else 'n/a'} |")
        lines.append("")
        if conversions:
            lines.append("**Конверсии:**")
            for transition, pct in conversions.items():
                lines.append(f"- {transition}: {pct}%" if pct is not None else f"- {transition}: n/a")
        lines.append("")

    lines += [
        "---",
        "",
        f"_Отчёт создан автоматически daily-analytics.py (MSP-52, этап 2)._",
        f"_Этапы 3–4 (GSC, GA4, заявки) будут добавлены в MSP-53 / MSP-54._",
    ]

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> int:
    print(f"=== daily-analytics.py start — {TODAY} ===", flush=True)

    if not YA_TOKEN:
        log_err("YA_OAUTH_TOKEN не задан — выход")
        return 1

    payload = {
        "date": TODAY,
        "collected_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
        "block_a": fetch_block_a(),
        "block_b": {"status": "pending_msP53"},  # будет в MSP-53
        "block_c": fetch_block_c(),
        "block_d": {"status": "pending_msP54"},  # будет в MSP-54
    }

    # Сохраняем JSON
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    print(f"[OK] JSON сохранён: {OUTPUT_JSON}", flush=True)

    # Рендерим Markdown
    md = render_markdown(payload)
    with open(OUTPUT_MD, "w", encoding="utf-8") as f:
        f.write(md)
    print(f"[OK] Markdown сохранён: {OUTPUT_MD}", flush=True)

    print(f"=== done ===", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
