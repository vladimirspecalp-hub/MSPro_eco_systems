# Credentials Registry — mspro-ltd.ru

Документ хранит **метаданные доступов** (алиасы, IDs, fingerprints, где лежат секреты).
**Секреты сюда не вносить.** Реальные токены/пароли хранятся в `~/.config/mspro/access-check.env` (вне репо).

---

## SSH — Beget

| Поле        | Значение                                                    |
|-------------|-------------------------------------------------------------|
| host alias  | `mspro-beget`                                               |
| login       | `mspro@dazed`                                               |
| key path    | `~/.ssh/mspro_beget_ed25519`                                |
| key type    | Ed25519                                                     |
| fingerprint | `SHA256:gdYeFdY1a3BWt07BROqVK4DAVaAwfqWC8wSSLht+9YI`        |
| last_checked | 2026-04-27                                                 |

**~/.ssh/config** (фрагмент):
```
Host mspro-beget
    HostName mspro-ltd.ru
    User mspro
    IdentityFile ~/.ssh/mspro_beget_ed25519
```

> **TODO (техдолг):** На Windows права ключа `644` вместо обязательных `600`.
> Git Bash / WSL: `chmod 600 ~/.ssh/mspro_beget_ed25519`.
> Пока SSH работает через PuTTY/Pageant, который игнорирует Unix-права —
> при переходе на нативный OpenSSH поправить обязательно.

---

## Яндекс.Метрика

| Поле         | Значение        |
|--------------|-----------------|
| counter      | `72249244`      |
| counter name | «сайт»          |
| owner login  | `specalp`       |
| permission   | `own`           |
| API endpoint | `https://api-metrika.yandex.net/management/v1/counter/72249244` |
| last_checked | 2026-04-27      |

**Где хранится токен:**
OAuth-токен `YM_TOKEN` — в файле `~/.config/mspro/access-check.env`.
Ротация: каждые 90 дней (OAuth-приложение Яндекс).
Получить новый: `https://oauth.yandex.ru/authorize?response_type=token&client_id=<APP_ID>`

---

## GA4 (Google Analytics 4)

| Поле          | Значение                    |
|---------------|-----------------------------|
| property ID   | `534148832`                 |
| tracking ID   | `G-7L2GPTVY5F`              |
| last_checked  | 2026-04-27                  |

**Где хранятся credentials:**
Файл `~/.config/mspro/access-check.env`, переменные:
- `GA4_CLIENT_ID` — OAuth 2.0 Client ID (Google Cloud Console)
- `GA4_CLIENT_SECRET` — OAuth 2.0 Client Secret
- `GA4_REFRESH_TOKEN` — refresh token (получить через OAuth flow один раз)

Ротация refresh token: при отзыве приложения Google — повторить OAuth flow.

---

## Шаблон обновления last_checked

Скрипт `scripts/daily-access-check.sh` проверяет все три доступа автоматически.
После успешного прогона нужно обновить `last_checked` для соответствующих записей:

```bash
# Пример: обновить дату вручную
DATE=$(date +%Y-%m-%d)
sed -i "s/last_checked | .*/last_checked | $DATE/" shared/credentials-registry.md
```

Или вручную найти строки `| last_checked |` и проставить дату в формате `YYYY-MM-DD`.

> В будущем `daily-access-check.sh` может патчить этот файл автоматически при OK-прогоне.

---

## Файл .env.access-check (пример структуры)

Хранится в `~/.config/mspro/access-check.env` (НЕ коммитить в репо!):

```env
# Яндекс.Метрика
YM_TOKEN=ya29.xxx...

# GA4
GA4_CLIENT_ID=123456789-xxx.apps.googleusercontent.com
GA4_CLIENT_SECRET=GOCSPX-xxx...
GA4_REFRESH_TOKEN=1//xxx...

# Paperclip (Сисадмин)
PAPERCLIP_API_KEY=eyJhbGci...
PAPERCLIP_API_URL=https://api.paperclip.ing
PAPERCLIP_COMPANY_ID=9bdd1254-4b9d-490d-aafa-04e26c81c329
```
