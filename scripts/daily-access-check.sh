#!/usr/bin/env bash
# =============================================================================
# scripts/daily-access-check.sh
# Ежедневная проверка доступов: SSH beget, Yandex.Metrika, GA4
#
# Запуск: bash scripts/daily-access-check.sh
# Cron:   30 8 * * 1-5  /path/to/mspro-site/scripts/daily-access-check.sh
#
# Credentials (задать в ~/.config/mspro/access-check.env или переменными среды):
#   YM_TOKEN          — Yandex.Metrika OAuth-токен
#   GA4_CLIENT_ID     — OAuth 2.0 Client ID из Google Cloud Console
#   GA4_CLIENT_SECRET — OAuth 2.0 Client Secret
#   GA4_REFRESH_TOKEN — Refresh token GA4
#   PAPERCLIP_API_KEY — JWT-ключ Paperclip агента (Сисадмин)
#   PAPERCLIP_API_URL — http://127.0.0.1:3100 (self-hosted)
#   PAPERCLIP_COMPANY_ID — UUID компании в Paperclip
#
# .env.access-check лежит вне репо (НЕ коммитить!):
#   ~/.config/mspro/access-check.env
#
# Логи: logs/access-check-YYYY-MM-DD.log (создаются автоматически)
# Зависимости: bash, curl, node (или python3 для GA4 JSON)
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

SYSADMIN_AGENT_ID="eca71b89-b53e-4738-8f41-5b1be989fecf"
YM_COUNTER_ID="72249244"
GA4_PROPERTY_ID="534148832"

# Определяем JSON-парсер (node предпочтительнее для кросс-платформ)
if command -v node >/dev/null 2>&1; then
  JSON_PARSER="node"
elif command -v python3 >/dev/null 2>&1; then
  JSON_PARSER="python3"
else
  JSON_PARSER="none"
fi

# ---------------------------------------------------------------------------
# Загрузка credentials
# ---------------------------------------------------------------------------
ENV_FILE="${MSPRO_ENV_FILE:-$HOME/.config/mspro/access-check.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

# ---------------------------------------------------------------------------
# 1. Вспомогательные функции
# ---------------------------------------------------------------------------
mkdir -p "$LOG_DIR"

log() {
  local ts
  ts="$(date '+%Y-%m-%dT%H:%M:%S')"
  echo "$ts | $1 | $2 | $3" | tee -a "$LOG_FILE"
}

# Парсинг JSON через node или python3
# Usage: json_get <key.path> <<< "$json_body"
json_get() {
  local keypath="$1"
  local body
  body="$(cat)"
  if [[ "$JSON_PARSER" == "node" ]]; then
    echo "$body" | node -e "
const chunks=[];
process.stdin.on('data',c=>chunks.push(c));
process.stdin.on('end',()=>{
  try{
    let d=JSON.parse(chunks.join(''));
    '$keypath'.split('.').forEach(k=>{d=d&&d[k];});
    console.log(d!=null?d:'');
  }catch(e){console.log('');}
});"
  elif [[ "$JSON_PARSER" == "python3" ]]; then
    echo "$body" | python3 -c "
import json,sys
try:
    d=json.load(sys.stdin)
    for k in '$keypath'.split('.'):
        d=d.get(k,{}) if isinstance(d,dict) else {}
    print(d if d else '')
except: print('')" 2>/dev/null
  fi
}

# Создание Paperclip issue при FAIL
fail_and_create_issue() {
  local summary="$1"
  log "PAPERCLIP" "INFO" "Creating issue: $summary"

  if [[ -z "${PAPERCLIP_API_KEY:-}" || -z "${PAPERCLIP_API_URL:-}" || -z "${PAPERCLIP_COMPANY_ID:-}" ]]; then
    log "PAPERCLIP" "SKIP" "Credentials not set — skipping issue creation"
    return
  fi

  local body
  if [[ "$JSON_PARSER" == "node" ]]; then
    body="$(node -e "console.log(JSON.stringify({
      title:'access-check FAIL: ${summary//\'/\\\'}',
      description:'Auto check failed ${DATE_TAG}.\n\nError: ${summary//\'/\\\'}\n\nLog: logs/access-check-${DATE_TAG}.log',
      priority:'high',
      status:'todo',
      assigneeAgentId:'${SYSADMIN_AGENT_ID}',
      goalId:'02bd1612-63ff-4fd1-9faa-95ff028d2295'
    }));")"
  elif [[ "$JSON_PARSER" == "python3" ]]; then
    body="$(python3 -c "import json; print(json.dumps({'title':'access-check FAIL: ${summary}','description':'Auto check failed ${DATE_TAG}. Error: ${summary}. Log: logs/access-check-${DATE_TAG}.log','priority':'high','status':'todo','assigneeAgentId':'${SYSADMIN_AGENT_ID}','goalId':'02bd1612-63ff-4fd1-9faa-95ff028d2295'}))" 2>/dev/null)"
  else
    # Минимальный fallback без JSON-парсера
    body="{\"title\":\"access-check FAIL: ${summary//\"/\\\"}\",\"priority\":\"high\",\"status\":\"todo\",\"assigneeAgentId\":\"${SYSADMIN_AGENT_ID}\"}"
  fi

  local http_code
  http_code="$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -H "Authorization: Bearer $PAPERCLIP_API_KEY" \
    -H "X-Paperclip-Run-Id: ${PAPERCLIP_RUN_ID:-access-check-cron}" \
    -H "Content-Type: application/json" \
    -d "$body" \
    "$PAPERCLIP_API_URL/api/companies/$PAPERCLIP_COMPANY_ID/issues")"

  if [[ "$http_code" == "201" || "$http_code" == "200" ]]; then
    log "PAPERCLIP" "OK" "Issue created (HTTP $http_code)"
  else
    log "PAPERCLIP" "ERROR" "Failed: HTTP $http_code"
  fi
}

# ---------------------------------------------------------------------------
# 2. Трекинг
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
  log "YM" "SKIP" "YM_TOKEN not set"
else
  # Единственный запрос: тело + HTTP-код
  YM_RAW="$(curl -s -w "\n__STATUS__%{http_code}" \
    -H "Authorization: OAuth $YM_TOKEN" \
    "https://api-metrika.yandex.net/management/v1/counter/$YM_COUNTER_ID")"

  YM_HTTP="${YM_RAW##*__STATUS__}"
  YM_BODY="${YM_RAW%__STATUS__*}"

  if [[ "$YM_HTTP" == "200" ]]; then
    # Используем bash string matching для надёжности
    if [[ "$YM_BODY" == *'"status":"Active"'* ]]; then
      log "YM" "OK" "Counter $YM_COUNTER_ID is Active"
    else
      # Попытка достать status через парсер
      YM_STATUS="$(json_get "counter.status" <<< "$YM_BODY" 2>/dev/null || echo "unknown")"
      log "YM" "FAIL" "Counter status: '$YM_STATUS' (expected Active)"
      mark_fail "Yandex.Metrika counter not Active (status='$YM_STATUS')"
    fi
  else
    log "YM" "FAIL" "HTTP $YM_HTTP — ${YM_BODY:0:200}"
    mark_fail "Yandex.Metrika API HTTP $YM_HTTP"
  fi
fi

# ---------------------------------------------------------------------------
# ШАГ 6: GA4 (refresh → access token → runReport)
# ---------------------------------------------------------------------------
log "GA4" "INFO" "Checking GA4 property $GA4_PROPERTY_ID..."

if [[ -z "${GA4_CLIENT_ID:-}" || -z "${GA4_CLIENT_SECRET:-}" || -z "${GA4_REFRESH_TOKEN:-}" ]]; then
  log "GA4" "SKIP" "GA4_CLIENT_ID/SECRET/REFRESH_TOKEN not set"
else
  # Refresh access token
  TOKEN_RAW="$(curl -s -w "\n__STATUS__%{http_code}" -X POST \
    -d "client_id=$GA4_CLIENT_ID" \
    -d "client_secret=$GA4_CLIENT_SECRET" \
    -d "refresh_token=$GA4_REFRESH_TOKEN" \
    -d "grant_type=refresh_token" \
    "https://oauth2.googleapis.com/token")"

  TOKEN_HTTP="${TOKEN_RAW##*__STATUS__}"
  TOKEN_BODY="${TOKEN_RAW%__STATUS__*}"

  if [[ "$TOKEN_HTTP" != "200" ]]; then
    log "GA4" "FAIL" "Token refresh failed: HTTP $TOKEN_HTTP"
    mark_fail "GA4 token refresh HTTP $TOKEN_HTTP"
  else
    GA4_ACCESS_TOKEN="$(json_get "access_token" <<< "$TOKEN_BODY" 2>/dev/null || echo "")"

    if [[ -z "$GA4_ACCESS_TOKEN" ]]; then
      log "GA4" "FAIL" "Empty access_token in refresh response"
      mark_fail "GA4 access_token empty"
    else
      YESTERDAY="$(date -d 'yesterday' '+%Y-%m-%d' 2>/dev/null || \
                   date -v-1d '+%Y-%m-%d' 2>/dev/null || \
                   date '+%Y-%m-%d')"

      # Build report request body
      if [[ "$JSON_PARSER" == "node" ]]; then
        REPORT_BODY="$(node -e "console.log(JSON.stringify({
          dateRanges:[{startDate:'${YESTERDAY}',endDate:'${YESTERDAY}'}],
          metrics:[{name:'activeUsers'}]
        }));")"
      else
        REPORT_BODY="{\"dateRanges\":[{\"startDate\":\"${YESTERDAY}\",\"endDate\":\"${YESTERDAY}\"}],\"metrics\":[{\"name\":\"activeUsers\"}]}"
      fi

      REPORT_RAW="$(curl -s -w "\n__STATUS__%{http_code}" -X POST \
        -H "Authorization: Bearer $GA4_ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$REPORT_BODY" \
        "https://analyticsdata.googleapis.com/v1beta/properties/$GA4_PROPERTY_ID:runReport")"

      REPORT_HTTP="${REPORT_RAW##*__STATUS__}"
      REPORT_BODY_CONTENT="${REPORT_RAW%__STATUS__*}"

      if [[ "$REPORT_HTTP" == "200" ]]; then
        ROW_COUNT="$(json_get "rowCount" <<< "$REPORT_BODY_CONTENT" 2>/dev/null || echo "0")"
        if [[ "${ROW_COUNT:-0}" -gt 0 ]] 2>/dev/null; then
          log "GA4" "OK" "rowCount=$ROW_COUNT for $YESTERDAY"
        else
          log "GA4" "FAIL" "rowCount=${ROW_COUNT:-0} (no data for $YESTERDAY)"
          mark_fail "GA4 rowCount=${ROW_COUNT:-0} for $YESTERDAY"
        fi
      else
        log "GA4" "FAIL" "HTTP $REPORT_HTTP — ${REPORT_BODY_CONTENT:0:200}"
        mark_fail "GA4 runReport HTTP $REPORT_HTTP"
      fi
    fi
  fi
fi

# ---------------------------------------------------------------------------
# Итог
# ---------------------------------------------------------------------------
log "SUMMARY" "$OVERALL_STATUS" "Checks done. Fails: ${#FAIL_DETAILS[@]}"

if [[ "$OVERALL_STATUS" == "FAIL" ]]; then
  for detail in "${FAIL_DETAILS[@]}"; do
    fail_and_create_issue "$detail"
  done
  exit 1
fi

exit 0
