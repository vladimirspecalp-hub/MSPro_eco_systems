#!/usr/bin/env python3
"""
scripts/alerts.py
Модуль алерт-правил для daily-analytics pipeline (MSP-56, этап 6).

Реализует 4 Critical + 3 Warning правила на основе JSON-снапшотов,
создаваемых daily-analytics.py в _data/analytics/YYYY-MM-DD.json.

Использование:
    from scripts.alerts import evaluate_alerts
    alerts = evaluate_alerts(today_data, yesterday_data, date_str)

Или напрямую:
    python3 scripts/alerts.py --date YYYY-MM-DD [--dry-run]
"""

from __future__ import annotations

import argparse
import json
import os
import sys
from datetime import datetime, timedelta
from pathlib import Path
from typing import Any, Optional


# ---------------------------------------------------------------------------
# Типы алертов
# ---------------------------------------------------------------------------

SEVERITY_CRITICAL = "CRITICAL"
SEVERITY_WARNING  = "WARNING"


class Alert:
    """Один алерт."""

    def __init__(
        self,
        severity: str,
        rule_id: str,
        title: str,
        details: str,
        value: Optional[Any] = None,
        threshold: Optional[Any] = None,
    ) -> None:
        self.severity  = severity   # CRITICAL / WARNING
        self.rule_id   = rule_id    # уникальный ключ правила (для dedup)
        self.title     = title      # короткий заголовок
        self.details   = details    # подробное описание для уведомления
        self.value     = value      # фактическое значение
        self.threshold = threshold  # порог срабатывания

    def to_dict(self) -> dict:
        return {
            "severity":  self.severity,
            "rule_id":   self.rule_id,
            "title":     self.title,
            "details":   self.details,
            "value":     self.value,
            "threshold": self.threshold,
        }

    def __repr__(self) -> str:
        return f"[{self.severity}] {self.rule_id}: {self.title}"


# ---------------------------------------------------------------------------
# Вспомогательные функции
# ---------------------------------------------------------------------------

def _load_json(path: Path) -> Optional[dict]:
    """Загружает JSON-файл или возвращает None."""
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        return None
    except Exception as e:
        print(f"WARN: alerts.py: cannot load {path}: {e}", file=sys.stderr)
        return None


def find_data_dir(date_str: str) -> Path:
    """Ищет _data/analytics/ от текущей директории вверх."""
    cur = Path(__file__).resolve().parent
    if cur.name == "scripts":
        cur = cur.parent
    return cur / "_data" / "analytics"


def find_daily_report_dir(date_str: str) -> Path:
    """Ищет shared/icos/daily/ от текущей директории вверх."""
    cur = Path(__file__).resolve().parent
    if cur.name == "scripts":
        cur = cur.parent
    return cur / "shared" / "icos" / "daily"


# ---------------------------------------------------------------------------
# Правило C-1: daily-job упал (нет файла к дедлайну)
# ---------------------------------------------------------------------------

def rule_c1_daily_job_missing(date_str: str) -> Optional[Alert]:
    """
    CRITICAL: нет markdown-файла shared/icos/daily/YYYY-MM-DD.md к 06:30 МСК.
    Проверяем наличие файла на момент вызова.
    """
    daily_dir = find_daily_report_dir(date_str)
    md_file = daily_dir / f"{date_str}.md"

    if not md_file.exists():
        return Alert(
            severity  = SEVERITY_CRITICAL,
            rule_id   = "C1_daily_job_missing",
            title     = f"Daily-job упал: нет файла {date_str}.md",
            details   = (
                f"Файл `shared/icos/daily/{date_str}.md` не создан.\n"
                f"Ожидаемый путь: {md_file}\n"
                f"Причина: daily-analytics.py не запустился или завершился с ошибкой.\n"
                f"Действие: проверить cron на beget, запустить вручную."
            ),
            value     = "file_missing",
            threshold = "file_exists",
        )
    return None


# ---------------------------------------------------------------------------
# Правило C-2: падение не-индексируемых страниц YWM > 10% сутки-к-суткам
# ---------------------------------------------------------------------------

def rule_c2_excluded_pages_spike(today: dict, yesterday: dict) -> Optional[Alert]:
    """
    CRITICAL: excluded_urls_count вырос > 10% от total_urls_count за сутки.
    Используем indexing_history_latest из блока A.
    """
    block_today = (today.get("blocks") or {}).get("A_indexing") or {}
    block_yest  = (yesterday.get("blocks") or {}).get("A_indexing") or {}

    ih_today = block_today.get("indexing_history_latest") or {}
    ih_yest  = block_yest.get("indexing_history_latest") or {}

    excl_today = ih_today.get("excluded_urls_count")
    excl_yest  = ih_yest.get("excluded_urls_count")
    total      = ih_today.get("total_urls_count")

    if excl_today is None or excl_yest is None or total is None or total == 0:
        return None  # нет данных — не тревожим

    delta = excl_today - excl_yest
    if delta <= 0:
        return None  # исключённых стало меньше или столько же

    pct = delta / total
    threshold = 0.10  # 10%

    if pct > threshold:
        return Alert(
            severity  = SEVERITY_CRITICAL,
            rule_id   = "C2_excluded_pages_spike",
            title     = f"Рост исключённых страниц Яндекс: +{round(pct * 100, 1)}% за сутки",
            details   = (
                f"Исключённых страниц вчера: {excl_yest}, сегодня: {excl_today}\n"
                f"Рост: +{delta} стр. ({round(pct * 100, 1)}% от {total} всего)\n"
                f"Порог: > {round(threshold * 100)}%\n"
                f"Действие: проверить Яндекс.Вебмастер → «Ошибки индексации»."
            ),
            value     = round(pct, 4),
            threshold = threshold,
        )
    return None


# ---------------------------------------------------------------------------
# Правило C-3: падение поискового трафика по запросу-донору > 30%
# ---------------------------------------------------------------------------

def rule_c3_donor_query_traffic_drop(today: dict, yesterday: dict) -> Optional[Alert]:
    """
    CRITICAL: топ-1 запрос (донор) потерял > 30% кликов сутки-к-суткам (GSC).
    Сравниваем GSC top_queries блок B.
    """
    block_today = (today.get("blocks") or {}).get("B_gsc") or {}
    block_yest  = (yesterday.get("blocks") or {}).get("B_gsc") or {}

    queries_today = block_today.get("top_queries") or []
    queries_yest  = block_yest.get("top_queries") or []

    if not queries_today or not queries_yest:
        return None

    # Словарь вчерашних кликов по запросу
    yest_map = {q["query"]: q.get("clicks", 0) for q in queries_yest}

    threshold = 0.30  # 30%
    worst_query = None
    worst_drop  = 0.0

    for q in queries_today[:5]:  # анализируем топ-5 доноров
        qname = q.get("query", "")
        clicks_today = q.get("clicks", 0)
        clicks_yest  = yest_map.get(qname, 0)

        if clicks_yest == 0:
            continue

        drop = (clicks_yest - clicks_today) / clicks_yest
        if drop > worst_drop:
            worst_drop  = drop
            worst_query = qname

    if worst_drop > threshold and worst_query:
        return Alert(
            severity  = SEVERITY_CRITICAL,
            rule_id   = "C3_donor_query_traffic_drop",
            title     = f"Трафик донора «{worst_query}» упал на {round(worst_drop * 100, 1)}%",
            details   = (
                f"Запрос-донор: «{worst_query}»\n"
                f"Клики (вчера → сегодня): "
                f"{yest_map.get(worst_query, 0)} → {next((q['clicks'] for q in queries_today if q['query'] == worst_query), 0)}\n"
                f"Падение: {round(worst_drop * 100, 1)}% (порог: > {round(threshold * 100)}%)\n"
                f"Действие: проверить позиции в GSC, технические ошибки страницы."
            ),
            value     = round(worst_drop, 4),
            threshold = threshold,
        )
    return None


# ---------------------------------------------------------------------------
# Правило C-4: падение лидов до 0 за 24ч (при baseline > 1)
# ---------------------------------------------------------------------------

def rule_c4_leads_zero(today: dict, yesterday: dict) -> Optional[Alert]:
    """
    CRITICAL: лиды (TG+IMAP) = 0 за сутки, если за последние 7 дней был хотя бы 1 лид/день.
    Используем блок E.
    """
    block_today = (today.get("blocks") or {}).get("E_leads") or {}

    total_today = block_today.get("total")
    if total_today is None:
        return None  # нет данных

    if total_today > 0:
        return None  # лиды есть — всё ок

    # Считаем baseline: берём вчерашний total как прокси
    block_yest  = (yesterday.get("blocks") or {}).get("E_leads") or {}
    total_yest  = block_yest.get("total", 0)

    # Baseline > 1: хотя бы вчера был лид
    baseline = total_yest
    if baseline < 1:
        return None  # baseline тоже 0, нормально

    return Alert(
        severity  = SEVERITY_CRITICAL,
        rule_id   = "C4_leads_zero",
        title     = "Лиды = 0 за 24 часа (baseline > 1)",
        details   = (
            f"Сегодня заявок: 0 (email: 0, TG: 0)\n"
            f"Вчера заявок: {baseline}\n"
            f"Действие: проверить форму калькулятора, IMAP-подключение, TG-бот."
        ),
        value     = 0,
        threshold = 1,
    )


# ---------------------------------------------------------------------------
# Правило W-1: quota GSC > 80%
# ---------------------------------------------------------------------------

def rule_w1_gsc_quota(today: dict) -> Optional[Alert]:
    """
    WARNING: превышение 80% квоты GSC API.
    GSC имеет лимит ~50k запросов/день. Отслеживаем через totals_90d queries_count.
    Проксируем: если totals_90d пустой при non-empty запросе — возможно quota-issue.
    Также можно проверить через заголовок X-RateLimit если добавить в collect_block_b.
    """
    block = (today.get("blocks") or {}).get("B_gsc") or {}

    # Если блок вернул ошибку связанную с quota — алертим
    err = block.get("error", "")
    if "quota" in err.lower() or "429" in str(err):
        return Alert(
            severity  = SEVERITY_WARNING,
            rule_id   = "W1_gsc_quota",
            title     = "GSC API quota превышена",
            details   = (
                f"Ошибка GSC: {err}\n"
                f"Действие: уменьшить частоту запросов, дождаться сброса квоты (полночь UTC)."
            ),
            value     = "quota_error",
            threshold = "< 80% quota",
        )

    # Если quota_remaining передаётся в meta
    quota_used = (today.get("meta") or {}).get("gsc_quota_used_pct")
    if quota_used is not None and quota_used > 0.80:
        return Alert(
            severity  = SEVERITY_WARNING,
            rule_id   = "W1_gsc_quota",
            title     = f"GSC API quota: {round(quota_used * 100, 1)}% использовано",
            details   = (
                f"Использовано {round(quota_used * 100, 1)}% дневной квоты GSC.\n"
                f"Порог: > 80%.\n"
                f"Действие: снизить row_limit или частоту запросов."
            ),
            value     = round(quota_used, 4),
            threshold = 0.80,
        )
    return None


# ---------------------------------------------------------------------------
# Правило W-2: расхождение YWM vs sample-check > 5%
# ---------------------------------------------------------------------------

def rule_w2_ywm_sample_discrepancy(today: dict) -> Optional[Alert]:
    """
    WARNING: разница между searchable_pages_count (YWM summary) и
    total_urls_count (indexing history) > 5%.

    YWM summary.searchable_pages_count — «проиндексированные» по Вебмастеру.
    indexing_history.total_urls_count — все URL в индексе.
    Расхождение > 5% означает рассинхронизацию данных.
    """
    block = (today.get("blocks") or {}).get("A_indexing") or {}
    summary = block.get("summary") or {}
    ih      = block.get("indexing_history_latest") or {}

    searchable = summary.get("searchable_pages_count")
    total_hist = ih.get("total_urls_count")

    if searchable is None or total_hist is None or total_hist == 0:
        return None

    discrepancy = abs(searchable - total_hist) / total_hist
    threshold   = 0.05  # 5%

    if discrepancy > threshold:
        return Alert(
            severity  = SEVERITY_WARNING,
            rule_id   = "W2_ywm_sample_discrepancy",
            title     = f"Расхождение YWM summary vs history: {round(discrepancy * 100, 1)}%",
            details   = (
                f"YWM summary.searchable_pages: {searchable}\n"
                f"YWM indexing_history.total_urls: {total_hist}\n"
                f"Расхождение: {round(discrepancy * 100, 1)}% (порог: > {round(threshold * 100)}%)\n"
                f"Возможная причина: задержка обновления API или технические ошибки сайта.\n"
                f"Действие: вручную сверить данные в Яндекс.Вебмастере."
            ),
            value     = round(discrepancy, 4),
            threshold = threshold,
        )
    return None


# ---------------------------------------------------------------------------
# Правило W-3: OAuth refresh ошибка / истечение < 7д
# ---------------------------------------------------------------------------

def rule_w3_oauth_expiry(today: dict) -> Optional[Alert]:
    """
    WARNING: OAuth-токен истекает < 7 дней или уже истёк (ошибка refresh).
    Детектируем по error: token_refresh_failed в блоках B/D и meta.oauth_expires_in.
    """
    blocks      = today.get("blocks") or {}
    block_b_err = (blocks.get("B_gsc") or {}).get("error", "")
    block_d_err = (blocks.get("D_ga4") or {}).get("error", "")

    failed_blocks = []
    if block_b_err in ("token_refresh_failed",):
        failed_blocks.append("GSC (блок B)")
    if block_d_err in ("token_refresh_failed",):
        failed_blocks.append("GA4 (блок D)")

    if failed_blocks:
        return Alert(
            severity  = SEVERITY_WARNING,
            rule_id   = "W3_oauth_expiry",
            title     = f"OAuth refresh failed: {', '.join(failed_blocks)}",
            details   = (
                f"Не удалось обновить OAuth-токен для: {', '.join(failed_blocks)}\n"
                f"Действие: проверить GOOGLE_REFRESH_TOKEN в _secrets/google-analytics.env,\n"
                f"пересоздать токен через OAuth consent flow."
            ),
            value     = "token_refresh_failed",
            threshold = "valid_token",
        )

    # Если в meta есть информация об истечении
    meta = today.get("meta") or {}
    oauth_exp_days = meta.get("google_token_expires_in_days")
    if oauth_exp_days is not None and oauth_exp_days < 7:
        return Alert(
            severity  = SEVERITY_WARNING,
            rule_id   = "W3_oauth_expiry",
            title     = f"Google OAuth токен истекает через {oauth_exp_days} дн.",
            details   = (
                f"Осталось: {oauth_exp_days} дней до истечения Google OAuth токена.\n"
                f"Порог: < 7 дней.\n"
                f"Действие: пересоздать refresh_token заранее."
            ),
            value     = oauth_exp_days,
            threshold = 7,
        )
    return None


# ---------------------------------------------------------------------------
# Главная функция
# ---------------------------------------------------------------------------

def evaluate_alerts(
    today: dict,
    yesterday: dict,
    date_str: str,
) -> list[Alert]:
    """
    Запускает все 7 правил и возвращает список сработавших алертов.

    Args:
        today:     данные daily-analytics.py за сегодня
        yesterday: данные daily-analytics.py за вчера
        date_str:  строка даты YYYY-MM-DD (для C1)

    Returns:
        список Alert (может быть пустым)
    """
    alerts: list[Alert] = []
    rules = [
        # Critical
        lambda: rule_c1_daily_job_missing(date_str),
        lambda: rule_c2_excluded_pages_spike(today, yesterday),
        lambda: rule_c3_donor_query_traffic_drop(today, yesterday),
        lambda: rule_c4_leads_zero(today, yesterday),
        # Warning
        lambda: rule_w1_gsc_quota(today),
        lambda: rule_w2_ywm_sample_discrepancy(today),
        lambda: rule_w3_oauth_expiry(today),
    ]

    for rule_fn in rules:
        try:
            alert = rule_fn()
            if alert is not None:
                alerts.append(alert)
        except Exception as e:
            print(f"ERROR: alerts.py rule {rule_fn} failed: {e}", file=sys.stderr)

    return alerts


def load_snapshot(date_str: str) -> Optional[dict]:
    """Загружает JSON-снапшот за дату из _data/analytics/."""
    data_dir = find_data_dir(date_str)
    path = data_dir / f"{date_str}.json"
    return _load_json(path)


def run(date_str: str, dry_run: bool = False) -> list[dict]:
    """Точка входа: загружает данные и запускает evaluate_alerts."""
    yesterday_str = (datetime.strptime(date_str, "%Y-%m-%d") - timedelta(days=1)).strftime("%Y-%m-%d")

    today_data = load_snapshot(date_str) or {}
    yest_data  = load_snapshot(yesterday_str) or {}

    if not today_data:
        # Если нет данных за сегодня — само по себе критичный признак
        # C1 проверит наличие md-файла; добавляем общий алерт
        print(f"WARN: alerts.py: no JSON snapshot for {date_str}", file=sys.stderr)

    alerts = evaluate_alerts(today_data, yest_data, date_str)

    result_dicts = [a.to_dict() for a in alerts]

    if dry_run:
        if not alerts:
            print("[INFO] alerts.py: нет алертов — всё в норме")
        else:
            for a in alerts:
                print(f"  {a}")
    else:
        # Сохраняем алерты рядом со снапшотом
        data_dir = find_data_dir(date_str)
        data_dir.mkdir(parents=True, exist_ok=True)
        alert_file = data_dir / f"{date_str}-alerts.json"
        with open(alert_file, "w", encoding="utf-8") as f:
            json.dump(result_dicts, f, ensure_ascii=False, indent=2)
        print(f"[INFO] alerts.py: {len(alerts)} алертов → {alert_file}", file=sys.stderr)

    return result_dicts


def main():
    parser = argparse.ArgumentParser(
        description="alerts.py — проверка 4 Critical + 3 Warning правил (MSP-56)"
    )
    parser.add_argument(
        "--date",
        default=datetime.utcnow().strftime("%Y-%m-%d"),
        help="Дата отчёта YYYY-MM-DD (default: today UTC)",
    )
    parser.add_argument("--dry-run", action="store_true", help="Не писать файлы")
    args = parser.parse_args()

    alerts = run(args.date, dry_run=args.dry_run)

    if alerts:
        sys.exit(2)  # сигнал для caller'а что есть алерты


if __name__ == "__main__":
    main()
