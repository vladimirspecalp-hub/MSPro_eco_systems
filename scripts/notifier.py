#!/usr/bin/env python3
"""
scripts/notifier.py
Доставка алертов: Telegram-push + email-fallback + dedup по часу (MSP-56, этап 6).

Использование:
    from scripts.notifier import send_alerts
    sent = send_alerts(alerts, cfg)

Конфигурация (из build_cfg / env):
    TELEGRAM_BOT_TOKEN        — токен бота-алертёра
    TELEGRAM_ALERT_CHAT_ID    — chat_id Board-канала (default: 1109424728)
    ALERT_EMAIL_TO            — email Head для fallback (default: из IMAP_USER)
    ALERT_EMAIL_FROM          — from-адрес fallback (default: из IMAP_USER)
    SMTP_HOST, SMTP_PORT      — SMTP для fallback email
    SMTP_USER, SMTP_PASSWORD  — SMTP-аутентификация
"""

from __future__ import annotations

import json
import os
import smtplib
import sys
import urllib.request
import urllib.parse
import urllib.error
from datetime import datetime, timedelta
from email.mime.text import MIMEText
from pathlib import Path
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from scripts.alerts import Alert


# ---------------------------------------------------------------------------
# Dedup store
# ---------------------------------------------------------------------------

DEFAULT_DEDUP_TTL_HOURS = 1


def _dedup_path() -> Path:
    """Путь к файлу состояния dedup."""
    cur = Path(__file__).resolve().parent
    if cur.name == "scripts":
        cur = cur.parent
    return cur / "_data" / "analytics" / "alert-dedup.json"


def _load_dedup() -> dict:
    path = _dedup_path()
    if not path.exists():
        return {}
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}


def _save_dedup(state: dict) -> None:
    path = _dedup_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def _is_deduped(rule_id: str, state: dict, ttl_hours: int = DEFAULT_DEDUP_TTL_HOURS) -> bool:
    """Возвращает True если алерт уже был отправлен в течение ttl_hours."""
    last_sent = state.get(rule_id)
    if not last_sent:
        return False
    try:
        last_dt = datetime.fromisoformat(last_sent)
        return (datetime.utcnow() - last_dt) < timedelta(hours=ttl_hours)
    except Exception:
        return False


def _mark_sent(rule_id: str, state: dict) -> None:
    state[rule_id] = datetime.utcnow().isoformat()


# ---------------------------------------------------------------------------
# Форматирование сообщения
# ---------------------------------------------------------------------------

_SEVERITY_EMOJI = {
    "CRITICAL": "🔴",
    "WARNING":  "🟡",
}


def _format_tg_message(alert: "Alert") -> str:
    emoji = _SEVERITY_EMOJI.get(alert.severity, "⚠️")
    lines = [
        f"{emoji} *{alert.severity}* — {alert.title}",
        "",
        alert.details.replace("*", "\\*").replace("_", "\\_").replace("`", "\\`"),
        "",
        f"_rule\\_id: {alert.rule_id}_",
    ]
    return "\n".join(lines)


def _format_email_body(alert: "Alert") -> str:
    return (
        f"SEVERITY: {alert.severity}\n"
        f"RULE: {alert.rule_id}\n"
        f"TITLE: {alert.title}\n"
        f"\n{alert.details}\n"
        f"\nvalue={alert.value}  threshold={alert.threshold}\n"
    )


# ---------------------------------------------------------------------------
# Telegram
# ---------------------------------------------------------------------------

def _send_telegram(text: str, cfg: dict) -> bool:
    """Отправляет текст в Telegram. Возвращает True при успехе."""
    token   = cfg.get("TELEGRAM_BOT_TOKEN", "")
    chat_id = cfg.get("TELEGRAM_ALERT_CHAT_ID", "1109424728")

    if not token:
        print("WARN: notifier.py: TELEGRAM_BOT_TOKEN not set — skipping TG", file=sys.stderr)
        return False

    url     = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = json.dumps({
        "chat_id":    chat_id,
        "text":       text,
        "parse_mode": "Markdown",
    }).encode("utf-8")

    proxy_url = cfg.get("TELEGRAM_PROXY_URL", "")
    if proxy_url:
        proxy_handler = urllib.request.ProxyHandler({"https": proxy_url, "http": proxy_url})
        opener = urllib.request.build_opener(proxy_handler)
    else:
        opener = urllib.request.build_opener()

    try:
        req = urllib.request.Request(
            url,
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with opener.open(req, timeout=15) as resp:
            body = json.loads(resp.read())
            if body.get("ok"):
                return True
            print(f"WARN: notifier.py: TG API returned ok=false: {body}", file=sys.stderr)
            return False
    except urllib.error.URLError as e:
        print(f"WARN: notifier.py: TG send failed: {e}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"WARN: notifier.py: TG unexpected error: {e}", file=sys.stderr)
        return False


# ---------------------------------------------------------------------------
# Email fallback
# ---------------------------------------------------------------------------

def _send_email_fallback(alert: "Alert", cfg: dict) -> bool:
    """Отправляет email-алерт через SMTP. Возвращает True при успехе."""
    smtp_host = cfg.get("SMTP_HOST", "")
    smtp_port = int(cfg.get("SMTP_PORT", 587))
    smtp_user = cfg.get("SMTP_USER", "") or cfg.get("IMAP_USER", "")
    smtp_pass = cfg.get("SMTP_PASSWORD", "") or cfg.get("IMAP_PASSWORD", "")
    to_addr   = cfg.get("ALERT_EMAIL_TO", "") or cfg.get("IMAP_USER", "")
    from_addr = cfg.get("ALERT_EMAIL_FROM", "") or smtp_user

    if not smtp_host or not smtp_user or not to_addr:
        print("WARN: notifier.py: SMTP config incomplete — skipping email fallback", file=sys.stderr)
        return False

    subject = f"[{alert.severity}] mspro-alert: {alert.title}"
    body    = _format_email_body(alert)

    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"]    = from_addr
    msg["To"]      = to_addr

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
            server.ehlo()
            server.starttls()
            if smtp_pass:
                server.login(smtp_user, smtp_pass)
            server.sendmail(from_addr, [to_addr], msg.as_string())
        return True
    except Exception as e:
        print(f"WARN: notifier.py: email fallback failed: {e}", file=sys.stderr)
        return False


# ---------------------------------------------------------------------------
# Публичный API
# ---------------------------------------------------------------------------

def send_alerts(
    alerts: list["Alert"],
    cfg: dict,
    ttl_hours: int = DEFAULT_DEDUP_TTL_HOURS,
    dry_run: bool = False,
) -> list[dict]:
    """
    Отправляет алерты в TG (с dedup).
    При недоступности TG — email-fallback для Critical.

    Args:
        alerts:    список Alert из evaluate_alerts()
        cfg:       конфиг (из build_cfg())
        ttl_hours: окно дедупликации в часах (default: 1)
        dry_run:   не отправлять, только логировать

    Returns:
        список dict {rule_id, severity, channel, status}
    """
    if not alerts:
        return []

    dedup = _load_dedup()
    results = []

    for alert in alerts:
        if _is_deduped(alert.rule_id, dedup, ttl_hours):
            print(
                f"[INFO] notifier.py: dedup skip {alert.rule_id} "
                f"(last sent: {dedup.get(alert.rule_id)})",
                file=sys.stderr,
            )
            results.append({
                "rule_id":  alert.rule_id,
                "severity": alert.severity,
                "channel":  "dedup_skip",
                "status":   "skipped",
            })
            continue

        if dry_run:
            print(f"[DRY-RUN] notifier.py: would send {alert.rule_id} via TG")
            results.append({
                "rule_id":  alert.rule_id,
                "severity": alert.severity,
                "channel":  "dry_run",
                "status":   "dry_run",
            })
            continue

        tg_msg = _format_tg_message(alert)
        tg_ok  = _send_telegram(tg_msg, cfg)

        if tg_ok:
            _mark_sent(alert.rule_id, dedup)
            results.append({
                "rule_id":  alert.rule_id,
                "severity": alert.severity,
                "channel":  "telegram",
                "status":   "sent",
            })
            print(f"[INFO] notifier.py: sent {alert.rule_id} via TG", file=sys.stderr)
        else:
            # Fallback email только для Critical
            if alert.severity == "CRITICAL":
                email_ok = _send_email_fallback(alert, cfg)
                if email_ok:
                    _mark_sent(alert.rule_id, dedup)
                    results.append({
                        "rule_id":  alert.rule_id,
                        "severity": alert.severity,
                        "channel":  "email_fallback",
                        "status":   "sent",
                    })
                    print(
                        f"[INFO] notifier.py: sent {alert.rule_id} via email fallback",
                        file=sys.stderr,
                    )
                else:
                    results.append({
                        "rule_id":  alert.rule_id,
                        "severity": alert.severity,
                        "channel":  "failed",
                        "status":   "failed",
                    })
                    print(
                        f"ERROR: notifier.py: {alert.rule_id} failed both TG and email!",
                        file=sys.stderr,
                    )
            else:
                # Warning: TG failed, no email fallback
                results.append({
                    "rule_id":  alert.rule_id,
                    "severity": alert.severity,
                    "channel":  "tg_failed",
                    "status":   "failed",
                })
                print(
                    f"WARN: notifier.py: {alert.rule_id} TG failed, no email for WARNING",
                    file=sys.stderr,
                )

    _save_dedup(dedup)
    return results
