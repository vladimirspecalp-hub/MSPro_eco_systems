# scripts/

Вспомогательные скрипты для mspro-site.

---

## daily-access-check.sh

Ежедневная проверка трёх ключевых доступов:

| Шаг | Что проверяет | Pass-критерий |
|-----|---------------|---------------|
| SSH | `ssh mspro-beget 'uptime'` | exit 0 |
| YM  | Yandex.Metrika counter 72249244 | HTTP 200 + `status: Active` |
| GA4 | GA4 property 534148832 runReport | HTTP 200 + `rowCount > 0` |

На любой FAIL → `exit 1` + создаётся issue в Paperclip (priority: high, assignee: Сисадмин).

### Credentials

Создать файл `~/.config/mspro/access-check.env` (не коммитить, не в репо):

```env
# Yandex.Metrika OAuth token
# Получить: https://oauth.yandex.ru/authorize?response_type=token&client_id=<APP_ID>
# Ротация: каждые 90 дней вручную
YM_TOKEN=y0_AgAAAA...

# Google OAuth 2.0 (из Google Cloud Console → APIs → Credentials)
GA4_CLIENT_ID=123456789-abc.apps.googleusercontent.com
GA4_CLIENT_SECRET=GOCSPX-...
GA4_REFRESH_TOKEN=1//0g...

# Paperclip (devops agent)
PAPERCLIP_API_KEY=<JWT от Paperclip>
PAPERCLIP_API_URL=https://api.paperclip.ing
PAPERCLIP_COMPANY_ID=9bdd1254-4b9d-490d-aafa-04e26c81c329
```

Альтернативный путь: задать через переменную `MSPRO_ENV_FILE`:
```bash
MSPRO_ENV_FILE=/etc/mspro/access-check.env bash scripts/daily-access-check.sh
```

### Где получить GA4 Refresh Token (один раз)

1. Google Cloud Console → OAuth 2.0 Client ID типа Desktop / Web
2. Запустить OAuth Playground (https://developers.google.com/oauthplayground):
   - Scope: `https://www.googleapis.com/auth/analytics.readonly`
   - Подставить свои client_id / client_secret
   - Получить `refresh_token` — сохранить в `.env`
3. Токен действует, пока не отозван вручную или приложение не нарушит TOS.

### Ротация токенов

| Токен | Срок | Как ротировать |
|-------|------|----------------|
| `YM_TOKEN` | ~90 дней (Яндекс Директ) | Повторить OAuth flow, перезаписать .env |
| GA4 Access Token | 1 час (автоматически) | Скрипт refresh каждый запуск |
| GA4 Refresh Token | бессрочно (до отзыва) | При нарушении — повторить OAuth Playground |
| `PAPERCLIP_API_KEY` | Задаётся ротацией агента | Заменить в .env после ротации в Paperclip |

### Запуск вручную

```bash
bash scripts/daily-access-check.sh
```

Логи: `logs/access-check-YYYY-MM-DD.log`

### Cron

Рекомендуемое место: **dev-машина** (Windows + WSL / Git Bash) — там есть deploy key и credentials.

#### Windows Task Scheduler (dev-машина)

```
Trigger: Daily, 08:30, weekdays (Mon–Fri)
Action:  "C:\Program Files\Git\bin\bash.exe" -c "bash /c/CODE/mspro-site/scripts/daily-access-check.sh >> /c/CODE/mspro-site/logs/cron-runner.log 2>&1"
```

Или через WSL crontab:
```
crontab -e
# Добавить:
30 8 * * 1-5 bash /mnt/c/CODE/mspro-site/scripts/daily-access-check.sh >> /mnt/c/CODE/mspro-site/logs/cron-runner.log 2>&1
```

#### На сервере beget (если credentials там)

```bash
# Через SSH:
ssh mspro-beget "crontab -e"

# Добавить (путь к репо на beget — уточнить):
30 8 * * 1-5 bash ~/www/mspro-ltd.ru/scripts/daily-access-check.sh >> ~/logs/access-check-cron.log 2>&1
```

> **Примечание:** На beget не хранятся GA4/YM credentials, поэтому предпочтительнее запуск с dev-машины.

### Первый автоматический запуск

После настройки cron дождаться следующего рабочего дня 08:30. Проверить:

```bash
tail -f logs/access-check-$(date +%Y-%m-%d).log
```

### Искусственный FAIL (тест)

```bash
YM_TOKEN=invalid_token bash scripts/daily-access-check.sh
# Ожидаемо: YM | FAIL + создаётся Paperclip issue
```
