# Runbook: Daily Analytics Alerts (MSP-56)

**Система:** daily-analytics pipeline → alerts.py → notifier.py → Telegram / Email
**Ответственный:** Аналитик (Head of Quality Measurement)
**Обновлён:** 2026-04-28

---

## Архитектура

```
cron (06:00 МСК, beget)
  └─> daily-analytics.py
        ├─> Сбор блоков A-E (YWM, GSC, YM, GA4, Leads)
        ├─> Запись _data/analytics/YYYY-MM-DD.json
        ├─> Запись shared/icos/daily/YYYY-MM-DD.md
        └─> alerts.py → evaluate_alerts()
              └─> notifier.py → send_alerts()
                    ├─> Telegram (primary): @mspro_alerts_bot → chat 1109424728
                    └─> Email fallback (Critical only): SMTP → Head
```

---

## Правила алертов

### Critical (немедленное действие)

| ID | Условие | Порог | Действие |
|----|---------|-------|---------|
| C1 | Файл `shared/icos/daily/YYYY-MM-DD.md` отсутствует | - | Проверить cron beget, запустить вручную |
| C2 | Рост исключённых страниц YWM | > 10% за сутки | Яндекс.Вебмастер → «Ошибки индексации» |
| C3 | Падение трафика по донор-запросу (топ-5 GSC) | > 30% за сутки | Проверить позиции GSC, технические ошибки |
| C4 | Лиды (TG+IMAP) = 0 за 24ч при baseline > 1 | 0 лидов | Форма калькулятора, IMAP, TG-бот |

### Warning (наблюдение, обработать в тот же день)

| ID | Условие | Порог | Действие |
|----|---------|-------|---------|
| W1 | Quota GSC API | > 80% | Снизить row_limit / частоту запросов |
| W2 | Расхождение YWM summary vs history | > 5% | Сверить вручную в Вебмастере |
| W3 | OAuth refresh failed / токен истекает | < 7 дней | Пересоздать refresh_token |

---

## Конфигурация

### Credentials (в `_secrets/telegram.env`)

```env
TELEGRAM_BOT_TOKEN=<токен бота-алертёра>
TELEGRAM_ALERT_CHAT_ID=1109424728
```

### Email fallback (в `_secrets/mspro-site-production.env`)

```env
SMTP_HOST=mail.beget.com
SMTP_PORT=587
SMTP_USER=sale@mspro-ltd.ru
SMTP_PASSWORD=<пароль>
ALERT_EMAIL_TO=head@mspro-ltd.ru
```

### Dedup-хранилище

`_data/analytics/alert-dedup.json` — JSON-файл с временными метками последней отправки каждого `rule_id`. Не коммитится (в `.gitignore`).

---

## Ручной запуск алертов

### Полный цикл (со сборкой данных)

```bash
cd /home/username/mspro-site
set -a && source _secrets/telegram.env && set -a
python3 scripts/daily-analytics.py --date 2026-04-28
```

### Только проверка алертов (dry-run, без отправки)

```bash
python3 scripts/alerts.py --date 2026-04-28 --dry-run
```

### Тест TG-доставки (dry-run notifier)

```bash
python3 -c "
import json
from pathlib import Path
from scripts.alerts import Alert, SEVERITY_CRITICAL
from scripts.notifier import send_alerts

# Загрузить cfg как в основном скрипте
import os
cfg = dict(os.environ)

# Создать тестовый алерт
test_alert = Alert(
    severity=SEVERITY_CRITICAL,
    rule_id='TEST_alert',
    title='Test-алерт из runbook',
    details='Проверка доставки в Telegram. Игнорировать.',
)

results = send_alerts([test_alert], cfg, dry_run=False)
print(results)
"
```

---

## Эскалация по правилам

| Сценарий | Действие |
|----------|---------|
| TG недоступен | Email-fallback для Critical автоматически |
| TG + Email оба упали | Проверить WARN в логах beget, исправить вручную |
| Нет алерта при очевидной проблеме | Проверить `_data/analytics/alert-dedup.json` (dedup-TTL 1ч) |
| C1 сработал (нет дневного файла) | 1. Проверить cron: `crontab -l` 2. Проверить логи: `~/_logs/daily-analytics.log` 3. Запустить вручную |
| C4 (лиды = 0) | 1. Проверить форму: `https://mspro-ltd.ru/calculator` 2. Тест IMAP: `scripts/test-imap.py` 3. Тест TG-бота: отправить `/start` в бот |

---

## Сброс dedup вручную

Если нужно повторно получить алерт который уже был отправлен:

```bash
python3 -c "
import json
from pathlib import Path
p = Path('_data/analytics/alert-dedup.json')
d = json.loads(p.read_text()) if p.exists() else {}
del d['C4_leads_zero']  # удалить нужный rule_id
p.write_text(json.dumps(d, indent=2))
print('Done:', d)
"
```

---

## Связанные тикеты

- [MSP-50](/MSP/issues/MSP-50) — программа P-2026-012 Daily Analytics Pipeline
- [MSP-56](/MSP/issues/MSP-56) — этап 6: Алерт-логика + Telegram-push
- [MSP-55](/MSP/issues/MSP-55) — этап 5: cron на beget

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-04-28 | Создан runbook (MSP-56 этап 6) |
