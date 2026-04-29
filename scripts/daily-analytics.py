#!/usr/bin/env python3
"""
scripts/daily-analytics.py
Ежедневный сборщик аналитики mspro-ltd.ru.

Этап 2 (MSP-52): Блок A (Я.Вебмастер) + Блок C (Я.Метрика).
Этап 3 (MSP-53): Блок B (GSC) + Блок D (GA4).
Этап 4 (MSP-54): Блок E (TG/IMAP заявки) + полный markdown render.
Этап 6 (MSP-56): Алерт-логика (alerts.py) + Telegram-push (notifier.py).

Запуск:
    python3 scripts/daily-analytics.py [--date YYYY-MM-DD] [--dry-run]

Credentials (env-файл или переменные окружения):
    YA_OAUTH_TOKEN / YM_TOKEN    — Yandex OAuth-токен
    YA_WEBMASTER_USER            — ID пользователя Вебмастера (239393595)
    YA_WEBMASTER_HOST            — https:mspro-ltd.ru:443
    YA_METRIKA_COUNTER           — ID счётчика Метрики (72249244)
    GOOGLE_CLIENT_ID             — Google OAuth client_id
    GOOGLE_CLIENT_SECRET         — Google OAuth client_secret
    GOOGLE_REFRESH_TOKEN         — Google refresh_token
    GA4_PROPERTY_ID              — GA4 property ID (534148832)
    GSC_SITE_URL                 — sc-domain:mspro-ltd.ru
    TELEGRAM_BOT_TOKEN           — токен бота Telegram
    IMAP_HOST                    — IMAP сервер (default: mail.beget.com)
    IMAP_USER                    — sale@mspro-ltd.ru
    IMAP_PASS                    — пароль IMAP (= SMTP_PASS)

Output:
    _data/analytics/YYYY-MM-DD.json   — полный архив (не коммитится)
    shared/icos/daily/YYYY-MM-DD.md   — ежедневный отчёт (коммитится)
"""

import argparse
import email
import imaplib
import json
import os
import sys
import traceback
from datetime import datetime, timedelta, date
from pathlib import Path

try:
    import requests
except ImportError:
    print("ERROR: requests not installed. Run: pip install requests", file=sys.stderr)
    sys.exit(1)

# Алерт-модули (MSP-56 этап 6); импорт мягкий — не ломаем pipeline если отсутствуют
try:
    from scripts.alerts import evaluate_alerts, load_snapshot as alerts_load_snapshot
    from scripts.notifier import send_alerts
    _ALERTS_AVAILABLE = True
except ImportError:
    try:
        # Fallback: если запускаем из корня repo без пакета
        _scripts_dir = Path(__file__).resolve().parent
        sys.path.insert(0, str(_scripts_dir.parent))
        from scripts.alerts import evaluate_alerts, load_snapshot as alerts_load_snapshot
        from scripts.notifier import send_alerts
        _ALERTS_AVAILABLE = True
    except ImportError:
        _ALERTS_AVAILABLE = False
        print("WARN: alerts.py / notifier.py not found — alert stage skipped", file=sys.stderr)


# ---------------------------------------------------------------------------
# Helpers: env loading
# ---------------------------------------------------------------------------

def load_env_file(path: str) -> dict:
    """Загружает KEY=VALUE из файла .env."""
    env = {}
    try:
        with open(path, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                if "=" in line:
                    k, _, v = line.partition("=")
                    env[k.strip()] = v.strip()
    except FileNotFoundError:
        pass
    return env


def find_secrets_dir() -> Path:
    """Ищет _secrets/ от скрипта вверх по дереву."""
    cur = Path(__file__).resolve().parent
    for _ in range(6):
        candidate = cur / "_secrets"
        if candidate.is_dir():
            return candidate
        cur = cur.parent
    return Path("_secrets")


def find_repo_dir() -> Path:
    """Ищет корень репозитория (содержит scripts/)."""
    cur = Path(__file__).resolve().parent
    if cur.name == "scripts":
        return cur.parent
    return cur


def build_cfg(secrets_dir: Path) -> dict:
    """Склеивает env из файлов + переменных окружения (env побеждает)."""
    cfg: dict = {}
    # _secrets/ относительно repo
    for fname in ("yandex.env", "google-analytics.env",
                  "mspro-site-production.env", "telegram.env"):
        cfg.update(load_env_file(str(secrets_dir / fname)))
    # ~/.config/mspro/access-check.env (локальный dev env)
    home_env = Path.home() / ".config" / "mspro" / "access-check.env"
    cfg.update(load_env_file(str(home_env)))
    # Переменные окружения переопределяют файлы
    cfg.update({k: v for k, v in os.environ.items() if v})
    # Алиасы Yandex
    if not cfg.get("YA_OAUTH_TOKEN"):
        cfg["YA_OAUTH_TOKEN"] = cfg.get("YM_TOKEN", "")
    # Алиасы Google (access-check.env использует GA4_* префикс)
    if not cfg.get("GOOGLE_CLIENT_ID"):
        cfg["GOOGLE_CLIENT_ID"] = cfg.get("GA4_CLIENT_ID", "")
    if not cfg.get("GOOGLE_CLIENT_SECRET"):
        cfg["GOOGLE_CLIENT_SECRET"] = cfg.get("GA4_CLIENT_SECRET", "")
    if not cfg.get("GOOGLE_REFRESH_TOKEN"):
        cfg["GOOGLE_REFRESH_TOKEN"] = cfg.get("GA4_REFRESH_TOKEN", "")
    # Алиасы IMAP (берём из SMTP если нет явного)
    if not cfg.get("IMAP_HOST"):
        cfg["IMAP_HOST"] = "mail.beget.com"
    if not cfg.get("IMAP_USER") and cfg.get("SMTP_USER"):
        cfg["IMAP_USER"] = cfg["SMTP_USER"]
    if not cfg.get("IMAP_PASS") and cfg.get("SMTP_PASS"):
        cfg["IMAP_PASS"] = cfg["SMTP_PASS"]
    return cfg


# ---------------------------------------------------------------------------
# Блок A: Yandex Webmaster API v4
# ---------------------------------------------------------------------------

def ywm_headers(token: str) -> dict:
    return {"Authorization": f"OAuth {token}", "Content-Type": "application/json"}


def ywm_get_summary(token: str, user_id: str, host_id: str) -> dict:
    url = f"https://api.webmaster.yandex.net/v4/user/{user_id}/hosts/{host_id}/summary"
    try:
        r = requests.get(url, headers=ywm_headers(token), timeout=15)
        if r.status_code == 200:
            d = r.json()
            return {
                "pages_count": d.get("pages_count"),
                "searchable_pages_count": d.get("searchable_pages_count"),
                "excluded_pages_count": d.get("excluded_pages_count"),
                "sqi": d.get("sqi"),
            }
        print(f"WARN: YWM summary {r.status_code}: {r.text[:200]}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: YWM summary: {e}", file=sys.stderr)
    return {}


def ywm_get_indexing_history(token: str, user_id: str, host_id: str, date_str: str) -> dict:
    end_dt = datetime.strptime(date_str, "%Y-%m-%d")
    start_dt = end_dt - timedelta(days=30)
    url = (
        f"https://api.webmaster.yandex.net/v4/user/{user_id}/hosts/{host_id}/indexing/history"
        f"?date_from={start_dt.strftime('%Y-%m-%d')}&date_to={end_dt.strftime('%Y-%m-%d')}"
    )
    try:
        r = requests.get(url, headers=ywm_headers(token), timeout=15)
        if r.status_code == 200:
            d = r.json()
            history = d.get("history", [])
            if history:
                latest = history[-1]
                prev = history[-2] if len(history) > 1 else {}
                return {
                    "date": latest.get("date"),
                    "added_urls_count": latest.get("added_urls_count"),
                    "excluded_urls_count": latest.get("excluded_urls_count"),
                    "total_urls_count": latest.get("total_urls_count"),
                    "prev_total": prev.get("total_urls_count"),
                    "history_points": len(history),
                }
        print(f"WARN: YWM indexing history {r.status_code}: {r.text[:200]}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: YWM indexing history: {e}", file=sys.stderr)
    return {}


def ywm_get_top_queries(token: str, user_id: str, host_id: str) -> list:
    url = f"https://api.webmaster.yandex.net/v4/user/{user_id}/hosts/{host_id}/query-analytics/list"
    body = {"offset": 0, "limit": 20, "device_type_indicator": "ALL"}
    try:
        r = requests.post(url, headers=ywm_headers(token), json=body, timeout=15)
        if r.status_code == 200:
            d = r.json()
            queries = []
            for item in d.get("text_indicator_to_statistics_list", []):
                q = item.get("text_indicator", {}).get("value", "")
                stats = item.get("statistics", [{}])[0]
                queries.append({
                    "query": q,
                    "clicks": stats.get("clicks", 0),
                    "impressions": stats.get("impressions", 0),
                    "position": stats.get("position"),
                })
            return queries
        print(f"WARN: YWM queries {r.status_code}: {r.text[:200]}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: YWM queries: {e}", file=sys.stderr)
    return []


def collect_block_a(cfg: dict, date_str: str) -> dict:
    token = cfg.get("YA_OAUTH_TOKEN", "")
    user_id = cfg.get("YA_WEBMASTER_USER", "")
    host_id = cfg.get("YA_WEBMASTER_HOST", "")

    if not all([token, user_id, host_id]):
        return {"error": "missing_credentials"}

    result = {"source": "yandex_webmaster"}
    summary = ywm_get_summary(token, user_id, host_id)
    result["summary"] = summary or None

    indexing = ywm_get_indexing_history(token, user_id, host_id, date_str)
    result["indexing_history_latest"] = indexing or None

    queries = ywm_get_top_queries(token, user_id, host_id)
    result["top_queries"] = queries
    if not queries:
        print("WARN: Block A top_queries empty", file=sys.stderr)

    return result


# ---------------------------------------------------------------------------
# Блок B: Google Search Console API v1
# ---------------------------------------------------------------------------

def gsc_get_access_token(client_id: str, client_secret: str, refresh_token: str) -> str:
    try:
        r = requests.post(
            "https://oauth2.googleapis.com/token",
            data={
                "client_id": client_id,
                "client_secret": client_secret,
                "refresh_token": refresh_token,
                "grant_type": "refresh_token",
            },
            timeout=15,
        )
        if r.status_code == 200:
            return r.json().get("access_token", "")
        print(f"ERROR: GSC token refresh {r.status_code}: {r.text[:200]}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: GSC token refresh: {e}", file=sys.stderr)
    return ""


def gsc_search_analytics(access_token: str, site_url: str, date_str: str,
                          dimensions: list, row_limit: int = 30) -> list:
    end_dt = datetime.strptime(date_str, "%Y-%m-%d") - timedelta(days=3)
    start_dt = end_dt - timedelta(days=90)

    url = (
        f"https://www.googleapis.com/webmasters/v3/sites/"
        f"{requests.utils.quote(site_url, safe='')}/searchAnalytics/query"
    )
    body = {
        "startDate": start_dt.strftime("%Y-%m-%d"),
        "endDate": end_dt.strftime("%Y-%m-%d"),
        "dimensions": dimensions,
        "rowLimit": row_limit,
    }
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    try:
        r = requests.post(url, headers=headers, json=body, timeout=20)
        if r.status_code == 200:
            return r.json().get("rows", [])
        print(f"ERROR: GSC searchAnalytics {r.status_code}: {r.text[:300]}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: GSC searchAnalytics: {e}", file=sys.stderr)
    return []


def collect_block_b(cfg: dict, date_str: str) -> dict:
    client_id = cfg.get("GOOGLE_CLIENT_ID", "")
    client_secret = cfg.get("GOOGLE_CLIENT_SECRET", "")
    refresh_token = cfg.get("GOOGLE_REFRESH_TOKEN", "")
    site_url = cfg.get("GSC_SITE_URL", "")

    if not all([client_id, client_secret, refresh_token, site_url]):
        return {"error": "missing_credentials"}

    access_token = gsc_get_access_token(client_id, client_secret, refresh_token)
    if not access_token:
        return {"error": "token_refresh_failed"}

    result = {"source": "google_search_console", "site_url": site_url}

    query_rows = gsc_search_analytics(access_token, site_url, date_str, ["query"], row_limit=30)
    result["top_queries"] = [
        {
            "query": r.get("keys", [""])[0],
            "clicks": r.get("clicks", 0),
            "impressions": r.get("impressions", 0),
            "ctr": round(r.get("ctr", 0), 4),
            "position": round(r.get("position", 0), 1),
        }
        for r in query_rows
    ]

    page_rows = gsc_search_analytics(access_token, site_url, date_str, ["page"], row_limit=20)
    result["top_pages"] = [
        {
            "page": r.get("keys", [""])[0],
            "clicks": r.get("clicks", 0),
            "impressions": r.get("impressions", 0),
            "ctr": round(r.get("ctr", 0), 4),
            "position": round(r.get("position", 0), 1),
        }
        for r in page_rows
    ]

    total_clicks = sum(q["clicks"] for q in result["top_queries"])
    total_impr = sum(q["impressions"] for q in result["top_queries"])
    result["totals_90d"] = {
        "total_clicks": total_clicks,
        "total_impressions": total_impr,
        "avg_ctr": round(total_clicks / total_impr, 4) if total_impr > 0 else 0,
        "queries_count": len(result["top_queries"]),
    }

    if not query_rows:
        print("WARN: Block B top_queries empty", file=sys.stderr)

    return result


# ---------------------------------------------------------------------------
# Блок C: Yandex Metrika API stat/v1
# ---------------------------------------------------------------------------

def ym_headers(token: str) -> dict:
    return {"Authorization": f"OAuth {token}"}


def ym_stat(token: str, counter: str, metrics: str, dimensions: str = None,
            date1: str = "7daysAgo", date2: str = "today", limit: int = 20) -> dict:
    params = {
        "id": counter,
        "metrics": metrics,
        "date1": date1,
        "date2": date2,
        "limit": limit,
        "accuracy": "full",
    }
    if dimensions:
        params["dimensions"] = dimensions
    try:
        r = requests.get(
            "https://api-metrika.yandex.net/stat/v1/data",
            headers=ym_headers(token),
            params=params,
            timeout=20,
        )
        if r.status_code == 200:
            return r.json()
        print(f"WARN: YM stat {r.status_code} [{metrics}]: {r.text[:200]}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: YM stat [{metrics}]: {e}", file=sys.stderr)
    return {}


def collect_block_c(cfg: dict, date_str: str) -> dict:
    token = cfg.get("YA_OAUTH_TOKEN", "")
    counter = cfg.get("YA_METRIKA_COUNTER", "")

    if not all([token, counter]):
        return {"error": "missing_credentials"}

    result = {"source": "yandex_metrika", "counter": counter}

    totals = ym_stat(token, counter,
                     "ym:s:visits,ym:s:users,ym:s:bounceRate,ym:s:pageDepth,ym:s:avgVisitDurationSeconds")
    if totals:
        vals = totals.get("totals", [])
        if vals:
            result["totals_7d"] = {
                "visits": vals[0],
                "users": vals[1],
                "bounce_rate": round(vals[2], 3) if len(vals) > 2 else None,
                "page_depth": round(vals[3], 2) if len(vals) > 3 else None,
                "avg_visit_duration_sec": round(vals[4], 1) if len(vals) > 4 else None,
            }

    entries = ym_stat(token, counter, "ym:s:visits,ym:s:users",
                      dimensions="ym:s:startURL", limit=10)
    result["top_entries"] = [
        {
            "url": row.get("dimensions", [{}])[0].get("name", ""),
            "visits": row.get("metrics", [0, 0])[0],
            "users": row.get("metrics", [0, 0])[1],
        }
        for row in entries.get("data", [])
    ] if entries else []

    sources = ym_stat(token, counter, "ym:s:visits",
                      dimensions="ym:s:trafficSource", limit=10)
    result["traffic_sources"] = [
        {
            "source": row.get("dimensions", [{}])[0].get("name", ""),
            "visits": row.get("metrics", [0])[0],
        }
        for row in sources.get("data", [])
    ] if sources else []

    return result


# ---------------------------------------------------------------------------
# Блок D: GA4 Data API v1beta
# ---------------------------------------------------------------------------

def ga4_run_report(access_token: str, property_id: str, dimensions: list,
                   metrics: list, date_ranges: list, limit: int = 20) -> dict:
    url = f"https://analyticsdata.googleapis.com/v1beta/properties/{property_id}:runReport"
    body = {
        "dateRanges": date_ranges,
        "dimensions": [{"name": d} for d in dimensions],
        "metrics": [{"name": m} for m in metrics],
        "limit": limit,
    }
    headers = {"Authorization": f"Bearer {access_token}", "Content-Type": "application/json"}
    try:
        r = requests.post(url, headers=headers, json=body, timeout=20)
        if r.status_code == 200:
            return r.json()
        print(f"ERROR: GA4 runReport {r.status_code} [{metrics}]: {r.text[:300]}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: GA4 runReport [{metrics}]: {e}", file=sys.stderr)
    return {}


def collect_block_d(cfg: dict, date_str: str) -> dict:
    client_id = cfg.get("GOOGLE_CLIENT_ID", "")
    client_secret = cfg.get("GOOGLE_CLIENT_SECRET", "")
    refresh_token = cfg.get("GOOGLE_REFRESH_TOKEN", "")
    property_id = cfg.get("GA4_PROPERTY_ID", "")

    if not all([client_id, client_secret, refresh_token, property_id]):
        return {"error": "missing_credentials"}

    access_token = gsc_get_access_token(client_id, client_secret, refresh_token)
    if not access_token:
        return {"error": "token_refresh_failed"}

    result = {"source": "ga4", "property_id": property_id}
    dr_7d = [{"startDate": "7daysAgo", "endDate": "yesterday"}]
    dr_30d = [{"startDate": "30daysAgo", "endDate": "yesterday"}]

    totals = ga4_run_report(
        access_token, property_id,
        dimensions=[],
        metrics=["sessions", "activeUsers", "bounceRate",
                 "screenPageViewsPerSession", "averageSessionDuration"],
        date_ranges=dr_7d, limit=1,
    )
    if totals and totals.get("rows"):
        vals = [v.get("value", "0") for v in totals["rows"][0].get("metricValues", [])]
        result["totals_7d"] = {
            "sessions": int(float(vals[0])) if len(vals) > 0 else None,
            "active_users": int(float(vals[1])) if len(vals) > 1 else None,
            "bounce_rate": round(float(vals[2]), 3) if len(vals) > 2 else None,
            "pages_per_session": round(float(vals[3]), 2) if len(vals) > 3 else None,
            "avg_session_duration_sec": round(float(vals[4]), 1) if len(vals) > 4 else None,
        }
    else:
        result["totals_7d"] = None
        print("WARN: Block D totals_7d empty", file=sys.stderr)

    sources = ga4_run_report(
        access_token, property_id,
        dimensions=["sessionDefaultChannelGrouping"],
        metrics=["sessions", "activeUsers"],
        date_ranges=dr_30d, limit=10,
    )
    result["traffic_sources_30d"] = [
        {
            "channel": row.get("dimensionValues", [{}])[0].get("value", ""),
            "sessions": int(float(row.get("metricValues", [{"value": "0"}])[0].get("value", 0))),
            "users": int(float(row.get("metricValues", [{}, {"value": "0"}])[1].get("value", 0))),
        }
        for row in sources.get("rows", [])
    ] if sources else []

    leads = ga4_run_report(
        access_token, property_id,
        dimensions=["eventName"],
        metrics=["eventCount"],
        date_ranges=dr_30d, limit=50,
    )
    lead_count = 0
    if leads:
        for row in leads.get("rows", []):
            if row.get("dimensionValues", [{}])[0].get("value") == "lead_submit":
                lead_count = int(float(row.get("metricValues", [{"value": "0"}])[0].get("value", 0)))
                break
    result["lead_submit_30d"] = lead_count

    return result


# ---------------------------------------------------------------------------
# Блок E: Заявки (IMAP + Telegram bot)
# ---------------------------------------------------------------------------

def fetch_imap_leads(cfg: dict, date_str: str) -> list:
    """Читает входящие письма за дату из IMAP и возвращает список заявок."""
    host = cfg.get("IMAP_HOST", "mail.beget.com")
    user = cfg.get("IMAP_USER", "")
    passwd = cfg.get("IMAP_PASS", "")

    if not all([user, passwd]):
        print("WARN: IMAP credentials missing", file=sys.stderr)
        return []

    leads = []
    try:
        conn = imaplib.IMAP4_SSL(host, 993)
        conn.login(user, passwd)
        conn.select("INBOX")

        # Поиск писем за дату
        target_date = datetime.strptime(date_str, "%Y-%m-%d")
        imap_date = target_date.strftime("%d-%b-%Y")
        _, msg_ids = conn.search(None, f'ON "{imap_date}"')

        for mid in (msg_ids[0] or b"").split():
            _, data = conn.fetch(mid, "(RFC822)")
            raw = data[0][1] if data and data[0] else None
            if not raw:
                continue
            msg = email.message_from_bytes(raw)
            subject = msg.get("Subject", "")
            from_addr = msg.get("From", "")
            date_header = msg.get("Date", "")

            # Определяем источник по Referer/utm в теле
            body_text = ""
            if msg.is_multipart():
                for part in msg.walk():
                    if part.get_content_type() == "text/plain":
                        body_text = part.get_payload(decode=True).decode("utf-8", errors="ignore")
                        break
            else:
                payload = msg.get_payload(decode=True)
                if payload:
                    body_text = payload.decode("utf-8", errors="ignore")

            source = "email_unknown"
            body_lower = body_text.lower()
            if "utm_source=yandex" in body_lower or "yandex" in body_lower:
                source = "organic_yandex"
            elif "utm_source=google" in body_lower or "google" in body_lower:
                source = "organic_google"
            elif "utm_medium=referral" in body_lower:
                source = "referral"
            elif "direct" in body_lower:
                source = "direct"

            leads.append({
                "channel": "email",
                "source": source,
                "subject": subject[:100],
                "from": from_addr[:100],
                "date": date_header[:50],
            })

        conn.logout()
    except imaplib.IMAP4.error as e:
        print(f"ERROR: IMAP auth/connection: {e}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: IMAP fetch: {e}", file=sys.stderr)

    return leads


def fetch_telegram_leads(cfg: dict, date_str: str) -> list:
    """
    Собирает заявки из Telegram-бота за дату.
    Использует Bot API getUpdates (работает локально; на продакшне — через лог-файл).
    """
    token = cfg.get("TELEGRAM_BOT_TOKEN", "")
    if not token:
        print("WARN: TELEGRAM_BOT_TOKEN not set — skipping TG leads", file=sys.stderr)
        return []

    target_dt = datetime.strptime(date_str, "%Y-%m-%d")
    start_ts = int(target_dt.timestamp())
    end_ts = int((target_dt + timedelta(days=1)).timestamp())

    proxy = cfg.get("TELEGRAM_PROXY_URL", "")
    proxies = {"http": proxy, "https": proxy} if proxy else None

    leads = []
    try:
        url = f"https://api.telegram.org/bot{token}/getUpdates"
        params = {"limit": 100, "timeout": 5}
        r = requests.get(url, params=params, proxies=proxies, timeout=20)
        if r.status_code != 200:
            print(f"WARN: TG getUpdates {r.status_code}", file=sys.stderr)
            return []

        updates = r.json().get("result", [])
        for upd in updates:
            msg = upd.get("message", {})
            ts = msg.get("date", 0)
            if not (start_ts <= ts < end_ts):
                continue
            text = msg.get("text", "")
            # Считаем заявкой сообщение с контактными данными или словом "заявка"
            keywords = ["заявк", "телефон", "перезвон", "звоните", "свяжи", "калькулятор"]
            if any(kw in text.lower() for kw in keywords):
                leads.append({
                    "channel": "telegram",
                    "source": "direct_tg",
                    "text_preview": text[:100],
                    "date": datetime.utcfromtimestamp(ts).isoformat() + "Z",
                })
    except Exception as e:
        print(f"ERROR: TG fetch: {e}", file=sys.stderr)

    return leads


def collect_block_e(cfg: dict, date_str: str) -> dict:
    """Блок E: заявки из IMAP + Telegram."""
    print("[INFO] Collecting Block E: TG + IMAP leads...", file=sys.stderr)

    imap_leads = fetch_imap_leads(cfg, date_str)
    tg_leads = fetch_telegram_leads(cfg, date_str)

    all_leads = imap_leads + tg_leads
    return {
        "source": "leads_aggregator",
        "date": date_str,
        "total": len(all_leads),
        "email_count": len(imap_leads),
        "telegram_count": len(tg_leads),
        "leads": all_leads,
    }


# ---------------------------------------------------------------------------
# Markdown render
# ---------------------------------------------------------------------------

def _pct(val) -> str:
    if val is None:
        return "n/a"
    return f"{round(float(val) * 100, 1)}%"


def render_markdown(data: dict, date_str: str) -> str:
    ts = data.get("meta", {}).get("generated", date_str)
    blocks = data.get("blocks", {})
    a = blocks.get("A_indexing", {})
    b = blocks.get("B_gsc", {})
    c = blocks.get("C_behavior", {})
    d = blocks.get("D_ga4", {})
    e = blocks.get("E_leads", {})

    lines = [
        f"# Ежедневный отчёт mspro-ltd.ru — {date_str}",
        f"",
        f"_Собрано: {ts}_",
        f"",
        f"---",
        f"",
    ]

    # ── Блок A: Индексация Яндекс ───────────────────────────────────────────
    lines += ["## Блок A. Индексация Яндекс", ""]
    if a.get("error"):
        lines.append(f"- Ошибка: {a['error']}")
    else:
        s = a.get("summary") or {}
        lines += [
            f"- **SQI:** {s.get('sqi', 'n/a')}",
            f"- **Страниц в индексе:** {s.get('searchable_pages_count', 'n/a')}",
            f"- **Всего страниц:** {s.get('pages_count', 'n/a')}",
            f"- **Исключено:** {s.get('excluded_pages_count', 'n/a')}",
            "",
        ]
        ih = a.get("indexing_history_latest") or {}
        if ih:
            prev = ih.get("prev_total") or 0
            total = ih.get("total_urls_count") or 0
            delta = total - prev if prev else 0
            sign = "+" if delta >= 0 else ""
            lines.append(f"**Дельта индексации (сутки):** {sign}{delta} (было: {prev}, стало: {total})")
            lines.append("")

        ywm_queries = a.get("top_queries", [])
        if ywm_queries:
            lines += [
                "### Топ запросов Яндекс (7 дней)",
                "| Запрос | Клики | Показы | Позиция |",
                "|--------|-------|--------|---------|",
            ]
            for q in ywm_queries[:10]:
                lines.append(f"| {q.get('query', 'n/a')} | {q.get('clicks', 0)} | {q.get('impressions', 0)} | {q.get('position', 'n/a')} |")
            lines.append("")

    # ── Блок B: Поисковый трафик Google ─────────────────────────────────────
    lines += ["---", "", "## Блок B. Поисковый трафик Google (GSC)", ""]
    if b.get("error"):
        lines.append(f"- Ошибка: {b['error']}")
    else:
        t = b.get("totals_90d", {})
        lines += [
            f"**Период:** 90 дней (с лагом GSC ~3 дня)",
            f"",
            f"| Метрика | Значение |",
            f"|---------|----------|",
            f"| Клики | {t.get('total_clicks', 'n/a')} |",
            f"| Показы | {t.get('total_impressions', 'n/a')} |",
            f"| Ср. CTR | {round(t.get('avg_ctr', 0) * 100, 2)}% |",
            f"| Запросов (уник.) | {t.get('queries_count', 'n/a')} |",
            f"",
        ]

        gsc_queries = b.get("top_queries", [])
        if gsc_queries:
            lines += [
                "### Топ-30 запросов Google",
                "| Запрос | Клики | Показы | CTR | Позиция |",
                "|--------|-------|--------|-----|---------|",
            ]
            for q in gsc_queries[:15]:
                ctr_str = f"{round(q.get('ctr', 0) * 100, 1)}%"
                lines.append(f"| {q.get('query', 'n/a')} | {q.get('clicks', 0)} | {q.get('impressions', 0)} | {ctr_str} | {q.get('position', 'n/a')} |")
            lines.append("")

        gsc_pages = b.get("top_pages", [])
        if gsc_pages:
            lines += [
                "### Топ страниц Google",
                "| Страница | Клики | Показы | Позиция |",
                "|----------|-------|--------|---------|",
            ]
            for p in gsc_pages[:10]:
                lines.append(f"| {p.get('page', 'n/a')} | {p.get('clicks', 0)} | {p.get('impressions', 0)} | {p.get('position', 'n/a')} |")
            lines.append("")

    # ── Блок C: Поведение Яндекс.Метрика ────────────────────────────────────
    lines += ["---", "", "## Блок C. Поведение (Яндекс.Метрика + GA4)", ""]

    if c.get("error"):
        lines.append(f"- Яндекс.Метрика ошибка: {c['error']}")
    else:
        ct = c.get("totals_7d") or {}
        if ct:
            br = ct.get("bounce_rate")
            br_str = f"{round(float(br), 1)}%" if br is not None else "n/a"
            lines += [
                "### Яндекс.Метрика (7 дней)",
                "",
                "| Метрика | Значение |",
                "|---------|----------|",
                f"| Сессии | {int(ct.get('visits', 0)) if ct.get('visits') is not None else 'n/a'} |",
                f"| Пользователи | {int(ct.get('users', 0)) if ct.get('users') is not None else 'n/a'} |",
                f"| Отказы | {br_str} |",
                f"| Глубина | {ct.get('page_depth', 'n/a')} стр. |",
                f"| Ср. время | {ct.get('avg_visit_duration_sec', 'n/a')} сек |",
                "",
            ]

        ym_entries = c.get("top_entries", [])
        if ym_entries:
            lines += [
                "### Топ-10 страниц входа (YM)",
                "| URL | Визиты |",
                "|-----|--------|",
            ]
            for e_row in ym_entries[:10]:
                v = e_row.get("visits", 0)
                lines.append(f"| {e_row.get('url', 'n/a')} | {int(v) if v is not None else 0} |")
            lines.append("")

        ym_src = c.get("traffic_sources", [])
        if ym_src:
            lines += [
                "### Источники трафика (YM)",
                "| Источник | Визиты |",
                "|----------|--------|",
            ]
            for s_row in ym_src[:8]:
                v = s_row.get("visits", 0)
                lines.append(f"| {s_row.get('source', 'n/a')} | {int(v) if v is not None else 0} |")
            lines.append("")

    if d.get("error"):
        lines.append(f"- GA4 ошибка: {d['error']}")
    else:
        dt = d.get("totals_7d") or {}
        if dt:
            lines += [
                "### GA4 (7 дней)",
                "",
                "| Метрика | Значение |",
                "|---------|----------|",
                f"| Сессии | {dt.get('sessions', 'n/a')} |",
                f"| Пользователи | {dt.get('active_users', 'n/a')} |",
                f"| Bounce | {_pct(dt.get('bounce_rate'))} |",
                f"| Стр./сессию | {dt.get('pages_per_session', 'n/a')} |",
                f"| Ср. длит. (сек) | {dt.get('avg_session_duration_sec', 'n/a')} |",
                "",
            ]

        ga4_src = d.get("traffic_sources_30d", [])
        if ga4_src:
            lines += [
                "### Источники трафика GA4 (30 дней)",
                "| Канал | Сессии | Пользователи |",
                "|-------|--------|--------------|",
            ]
            for s_row in ga4_src:
                lines.append(f"| {s_row.get('channel', 'n/a')} | {s_row.get('sessions', 0)} | {s_row.get('users', 0)} |")
            lines.append("")

    # ── Блок D: Конверсии ────────────────────────────────────────────────────
    lines += ["---", "", "## Блок D. Конверсии", ""]

    ga4_leads = d.get("lead_submit_30d", 0) if not d.get("error") else "n/a"
    e_total = e.get("total", 0) if not e.get("error") else "n/a"
    e_email = e.get("email_count", 0)
    e_tg = e.get("telegram_count", 0)

    lines += [
        "| Источник | Заявок |",
        "|----------|--------|",
        f"| GA4 lead_submit (30д) | {ga4_leads} |",
        f"| Email (IMAP, сутки) | {e_email} |",
        f"| Telegram (бот, сутки) | {e_tg} |",
        f"| **Итого за сутки** | **{e_total}** |",
        "",
    ]

    if e.get("leads"):
        lines += ["### Детали заявок", ""]
        for lead in e["leads"][:10]:
            ch = lead.get("channel", "?")
            src = lead.get("source", "?")
            dt_str = lead.get("date", "?")
            preview = lead.get("text_preview") or lead.get("subject") or ""
            lines.append(f"- [{ch}] {src} — {dt_str[:16]} — {preview[:60]}")
        lines.append("")

    lines += [
        "---",
        "",
        f"_Отчёт создан автоматически daily-analytics.py v2.0 (MSP-54)._",
    ]

    return "\n".join(lines)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def run(date_str: str, dry_run: bool = False, secrets_dir: Path = None) -> dict:
    if secrets_dir is None:
        secrets_dir = find_secrets_dir()

    cfg = build_cfg(secrets_dir)

    if not cfg.get("YA_OAUTH_TOKEN"):
        print("ERROR: YA_OAUTH_TOKEN not set — Yandex blocks will fail", file=sys.stderr)

    errors = []
    result = {
        "meta": {
            "generated": datetime.utcnow().isoformat() + "Z",
            "date": date_str,
            "script": "daily-analytics.py",
            "version": "2.0.0",
        },
        "blocks": {},
    }

    for block_id, label, collect_fn in [
        ("A_indexing", "Yandex Webmaster", lambda: collect_block_a(cfg, date_str)),
        ("B_gsc",      "Google Search Console", lambda: collect_block_b(cfg, date_str)),
        ("C_behavior", "Yandex Metrika", lambda: collect_block_c(cfg, date_str)),
        ("D_ga4",      "GA4 Data API", lambda: collect_block_d(cfg, date_str)),
        ("E_leads",    "TG/IMAP Leads", lambda: collect_block_e(cfg, date_str)),
    ]:
        print(f"[INFO] Collecting Block {block_id}: {label}...", file=sys.stderr)
        try:
            block = collect_fn()
            result["blocks"][block_id] = block
            if block.get("error"):
                errors.append(f"Block {block_id}: {block['error']}")
        except Exception as exc:
            traceback.print_exc(file=sys.stderr)
            result["blocks"][block_id] = {"error": str(exc)}
            errors.append(f"Block {block_id} fatal: {exc}")

    result["errors"] = errors
    result["status"] = "partial" if errors else "ok"

    if not dry_run:
        repo_dir = find_repo_dir()

        # JSON архив
        out_dir = repo_dir / "_data" / "analytics"
        out_dir.mkdir(parents=True, exist_ok=True)
        out_file = out_dir / f"{date_str}.json"
        with open(out_file, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        print(f"[INFO] JSON written: {out_file}", file=sys.stderr)

        # Markdown отчёт
        md_dir = repo_dir / "shared" / "icos" / "daily"
        md_dir.mkdir(parents=True, exist_ok=True)
        md_file = md_dir / f"{date_str}.md"
        md_content = render_markdown(result, date_str)
        with open(md_file, "w", encoding="utf-8") as f:
            f.write(md_content)
        print(f"[INFO] Markdown written: {md_file}", file=sys.stderr)
    else:
        print("[INFO] DRY RUN — not writing files", file=sys.stderr)
        md_content = render_markdown(result, date_str)
        print("\n=== MARKDOWN PREVIEW ===\n")
        print(md_content[:3000])

    # -----------------------------------------------------------------------
    # Этап 6 (MSP-56): алерт-проверка + Telegram-push
    # -----------------------------------------------------------------------
    if _ALERTS_AVAILABLE:
        try:
            yesterday_str = (datetime.strptime(date_str, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d")
            yest_data = alerts_load_snapshot(yesterday_str) or {}

            alerts = evaluate_alerts(result, yest_data, date_str)
            result["alerts"] = [a.to_dict() for a in alerts]

            if alerts:
                print(
                    f"[INFO] alerts: {len(alerts)} triggered: "
                    + ", ".join(a.rule_id for a in alerts),
                    file=sys.stderr,
                )
                notify_results = send_alerts(alerts, cfg, dry_run=dry_run)
                result["alert_notifications"] = notify_results
            else:
                print("[INFO] alerts: none triggered — all clear", file=sys.stderr)
                result["alerts"] = []
                result["alert_notifications"] = []

            # Сохранить alerts JSON рядом со снапшотом
            if not dry_run:
                _alert_dir = repo_dir / "_data" / "analytics"
                _alert_dir.mkdir(parents=True, exist_ok=True)
                alert_file = _alert_dir / f"{date_str}-alerts.json"
                with open(alert_file, "w", encoding="utf-8") as f:
                    json.dump(result["alerts"], f, ensure_ascii=False, indent=2)
        except Exception as exc:
            traceback.print_exc(file=sys.stderr)
            result["alerts"] = []
            print(f"ERROR: alert stage failed: {exc}", file=sys.stderr)

    return result


def main():
    parser = argparse.ArgumentParser(
        description="Daily Analytics Pipeline v2.0 (MSP-54) — YWM + GSC + YM + GA4 + Leads"
    )
    parser.add_argument("--date", default=datetime.utcnow().strftime("%Y-%m-%d"),
                        help="Дата отчёта YYYY-MM-DD (default: today UTC)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Не записывать файлы, только вывести результат")
    parser.add_argument("--output", choices=["file", "stdout", "both"], default="file",
                        help="Куда выводить JSON (default: file)")
    args = parser.parse_args()

    result = run(args.date, dry_run=args.dry_run)

    if args.output in ("stdout", "both") or args.dry_run:
        print(json.dumps(result, ensure_ascii=False, indent=2))

    if result["status"] != "ok":
        print(f"[WARN] Completed with errors: {result['errors']}", file=sys.stderr)
        sys.exit(2)


if __name__ == "__main__":
    main()
