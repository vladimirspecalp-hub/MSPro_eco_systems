#!/usr/bin/env bash
# =============================================================================
# scripts/daily-access-check.sh
# Ежедневная проверка доступов: SSH beget, Yandex.Metrika, GA4
#
# Запуск: bash scripts/daily-access-check.sh
# Cron:   30 8 * * 1-5  /path/to/mspro-site/scripts/daily-access-check.sh
#
# Credentials (задать в .env.access-check или переменными среды):
#   YM_TOKEN          — Yandex.Metrika OAuth-токен
#                       Получить: https://oauth.yandex.ru/authorize?response_type=token&client_id=<APP_ID>
#                       Ротация: каждые 90 дней, обновить вручную и перезаписать .env.access-check
#   GA4_CLIENT_ID     — OAuth 2.0 Client ID из Google Cloud Console
#   GA4_CLIENT_SECRET — OAuth 2.0 Client Secret
#   GA4_REFRESH_TOKEN — Refresh token GA4 (получить через OAuth flow один раз)
#                       Ротация: при отзыве приложения Google, повторить OAuth flow
#   PAPERCLIP_API_KEY — JWT-ключ Paperclip агента (Сисадмин)
#   PAPERCLIP_API_URL — https://api.paperclip.ing (или self-hosted URL)
#   PAPERCLIP_COMPANY_ID — UUID компании в Paperclip
#
# .env.access-check лежит вне репо (НЕ коммитить!):
#   Рекомендуемый путь: ~/.config/mspro/access-check.env
#   Или: /etc/mspro/access-check.env (для cron на сервере)
#
# Логи: logs/access-check-YYYY-MM-DD.log (создаются автоматически)
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# 0. Конфигурация
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
LOG_DIR="$REPO_DIR/logs"
DATE_TAG="$(date +%Y-%m-%d)"
LOG_FILE="$LOG_DIR/access-check-$DATE_TAG.log"

# Агент-Сисадмин
SYSADMIN_AGENT_ID="eca71b89-b53e-4738-8f41-5b1be989fecf"

# YM counter ID
YM_COUNTER_ID="72249244"

# GA4 property ID
GA4_PROPERTY_ID="534148832"

# ---------------------------------------------------------------------------
# Загрузка credentials из .env файла (если существует)
# ---------------------------------------------------------------------------
ENV_FILE="${MSPRO_ENV_FILE:-$HOME/.config/mspro/access-check.env}"
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
fi

# ---------------------------------------------------------------------------
# 1. Вспомогательные функции
# ---------------------------------------------------------------------------
mkdir -p "$LOG_DIR"

log() {
  local step="$1" status="$2" detail="$3"
  local ts
  ts="$(date '+%Y-%m-%dT%H:%M:%S')"
  echo "$ts | $step | $status | $detail" | tee -a "$LOG_FILE"
}

fail_and_create_issue() {
  local summary="$1"
  log "PAPERCLIP" "INFO" "Creating Paperclip issue: $summary"

  if [[ -z "${PAPERCLIP_API_KEY:-}" || -z "${PAPERCLIP_API_URL:-}" || -z "${PAPERCLIP_COMPANY_ID:-}" ]]; then
    log "PAPERCLIP" "SKIP" "PAPERCLIP_API_KEY/URL/COMPANY_ID not set — issue creation skipped"
    return
  fi

  local body
  body="$(jq -n \
    --arg title "access-check FAIL: $summary" \
    --arg desc "Автоматическая проверка доступов упала $DATE_TAG.\n\n**Ошибка:** $summary\n\nСм. лог: \`logs/access-check-$DATE_TAG.log\`" \
    --arg assignee "$SYSADMIN_AGENT_ID" \
    --arg companyId "$PAPERCLIP_COMPANY_ID" \
    '{
      title: $title,
      description: $desc,
      priority: "high",
      status: "todo",
      assigneeAgentId: $assignee,
      labels: ["access-check-fail"]
    }'
  )"

  local resp
  resp="$(curl -s -w "\n%{http_code}" -X POST \
    -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
    -H "Content-Type: application/json" \
    -d "$body" \
    "$PAPERCLIP_API_URL/api/companies/$PAPERCLIP_COMPANY_ID/issues")"

  local http_code
  http_code="$(echo "$resp" | tail -1)"
  local resp_body
  resp_body="$(echo "$resp" | head -n -1)"

  if [[ "$http_code" == "201" || "$http_code" == "200" ]]; then
    local issue_id
    issue_id="$(echo "$resp_body" | jq -r '.identifier // .id // "unknown"')"
    log "PAPERCLIP" "OK" "Issue created: $issue_id"
  else
    log "PAPERCLIP" "ERROR" "Failed to create issue: HTTP $http_code — $resp_body"
  fi
}

# ---------------------------------------------------------------------------
# 2. Трекинг результатов
# ---------------------------------------------------------------------------
OVERALL_STATUS="OK"
FAIL_DETAILS=()

mark_fail() {
  OVERALL_STATUS="FAIL"
  FAIL_DETAILS+=("$1")
}

# ---------------------------------------------------------------------------
# ШАГ 1: SSH на beget
# ---------------------------------------------------------------------------
log "SSH" "INFO" "Testing ssh mspro-beget..."

if ssh -o BatchMode=yes -o ConnectTimeout=5 mspro-beget 'uptime' >> "$LOG_FILE" 2>&1; then
  log "SSH" "OK" "Connected to beget successfully"
else
  log "SSH" "FAIL" "SSH connection to mspro-beget failed"
  mark_fail "SSH to mspro-beget failed"
fi

# ---------------------------------------------------------------------------
# ШАГ 4: Yandex.Metrika
# ---------------------------------------------------------------------------
log "YM" "INFO" "Checking Yandex.Metrika counter $YM_COUNTER_ID..."

if [[ -z "${YM_TOKEN:-}" ]]; then
  log "YM" "SKIP" "YM_TOKEN not set — skipping"
else
  YM_RESP="$(curl -s -w "\n%{http_code}" \
    -H "Authorization: OAuth $YM_TOKEN" \
    "https://api-metrika.yandex.net/management/v1/counter/$YM_COUNTER_ID")"

  YM_HTTP="$(echo "$YM_RESP" | tail -1)"
  YM_BODY="$(echo "$YM_RESP" | head -n -1)"

  if [[ "$YM_HTTP" == "200" ]]; then
    YM_STATUS="$(echo "$YM_BODY" | jq -r '.counter.status // empty')"
    if [[ "$YM_STATUS" == "Active" ]]; then
      log "YM" "OK" "Counter $YM_COUNTER_ID is Active"
    else
      log "YM" "FAIL" "Counter status: '$YM_STATUS' (expected Active)"
      mark_fail "Yandex.Metrika counter status='$YM_STATUS'"
    fi
  else
    log "YM" "FAIL" "HTTP $YM_HTTP — $(echo "$YM_BODY" | head -c 200)"
    mark_fail "Yandex.Metrika API returned HTTP $YM_HTTP"
  fi
fi

# ---------------------------------------------------------------------------
# ШАГ 6: GA4 (refresh → access token → runReport)
# ---------------------------------------------------------------------------
log "GA4" "INFO" "Checking GA4 property $GA4_PROPERTY_ID..."

if [[ -z "${GA4_CLIENT_ID:-}" || -z "${GA4_CLIENT_SECRET:-}" || -z "${GA4_REFRESH_TOKEN:-}" ]]; then
  log "GA4" "SKIP" "GA4_CLIENT_ID/CLIENT_SECRET/REFRESH_TOKEN not set — skipping"
else
  # Получаем access token через refresh
  TOKEN_RESP="$(curl -s -w "\n%{http_code}" -X POST \
    -d "client_id=$GA4_CLIENT_ID" \
    -d "client_secret=$GA4_CLIENT_SECRET" \
    -d "refresh_token=$GA4_REFRESH_TOKEN" \
    -d "grant_type=refresh_token" \
    "https://oauth2.googleapis.com/token")"

  TOKEN_HTTP="$(echo "$TOKEN_RESP" | tail -1)"
  TOKEN_BODY="$(echo "$TOKEN_RESP" | head -n -1)"

  if [[ "$TOKEN_HTTP" != "200" ]]; then
    log "GA4" "FAIL" "Token refresh failed: HTTP $TOKEN_HTTP — $(echo "$TOKEN_BODY" | head -c 200)"
    mark_fail "GA4 token refresh failed (HTTP $TOKEN_HTTP)"
  else
    GA4_ACCESS_TOKEN="$(echo "$TOKEN_BODY" | jq -r '.access_token')"

    if [[ -z "$GA4_ACCESS_TOKEN" || "$GA4_ACCESS_TOKEN" == "null" ]]; then
      log "GA4" "FAIL" "Empty access_token in refresh response"
      mark_fail "GA4 access_token empty after refresh"
    else
      # Запрос activeUsers за вчера
      YESTERDAY="$(date -d 'yesterday' '+%Y-%m-%d' 2>/dev/null || date -v-1d '+%Y-%m-%d')"

      REPORT_BODY="$(jq -n \
        --arg start "$YESTERDAY" \
        --arg end "$YESTERDAY" \
        '{
          dateRanges: [{startDate: $start, endDate: $end}],
          metrics: [{name: "activeUsers"}]
        }')"

      REPORT_RESP="$(curl -s -w "\n%{http_code}" -X POST \
        -H "Authorization: Bearer $GA4_ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$REPORT_BODY" \
        "https://analyticsdata.googleapis.com/v1beta/properties/$GA4_PROPERTY_ID:runReport")"

      REPORT_HTTP="$(echo "$REPORT_RESP" | tail -1)"
      REPORT_BODY_CONTENT="$(echo "$REPORT_RESP" | head -n -1)"

      if [[ "$REPORT_HTTP" == "200" ]]; then
        ROW_COUNT="$(echo "$REPORT_BODY_CONTENT" | jq -r '.rowCount // 0')"
        if [[ "$ROW_COUNT" -gt 0 ]] 2>/dev/null; then
          ACTIVE_USERS="$(echo "$REPORT_BODY_CONTENT" | jq -r '.rows[0].metricValues[0].value // "?"')"
          log "GA4" "OK" "rowCount=$ROW_COUNT, activeUsers($YESTERDAY)=$ACTIVE_USERS"
        else
          log "GA4" "FAIL" "rowCount=$ROW_COUNT (no data for $YESTERDAY)"
          mark_fail "GA4 runReport returned rowCount=$ROW_COUNT for $YESTERDAY"
        fi
      else
        log "GA4" "FAIL" "HTTP $REPORT_HTTP — $(echo "$REPORT_BODY_CONTENT" | head -c 200)"
        mark_fail "GA4 runReport failed: HTTP $REPORT_HTTP"
      fi
    fi
  fi
fi

# ---------------------------------------------------------------------------
# Итог
# ---------------------------------------------------------------------------
log "SUMMARY" "$OVERALL_STATUS" "Checks complete. Fails: ${#FAIL_DETAILS[@]}"

if [[ "$OVERALL_STATUS" == "FAIL" ]]; then
  for detail in "${FAIL_DETAILS[@]}"; do
    fail_and_create_issue "$detail"
  done
  exit 1
fi

exit 0
