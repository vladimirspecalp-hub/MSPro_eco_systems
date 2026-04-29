#!/usr/bin/env bash
# =============================================================================
# scripts/daily-analytics-runner.sh
# Cron-обёртка для daily-analytics.py
#
# Запуск cron (beget, МСК = UTC+3):
#   0 6 * * *  /home/mspro/mspro-ltd.ru/scripts/daily-analytics-runner.sh
#
# Что делает:
#   1. Idempotent старт через lock-file (если предыдущий запуск ещё не завершён — пропуск)
#   2. Запускает scripts/daily-analytics.py
#   3. При успехе: git commit + push только shared/icos/daily/YYYY-MM-DD.md
#   4. Логирует в _logs/daily-analytics-YYYY-MM-DD.log
#   5. Удаляет логи старше 30 дней (rotation)
#
# Зависимости на beget:
#   - python3 в PATH
#   - git настроен (user.email, user.name), push по deploy key
#   - _logs/ в .gitignore (не коммитится)
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Конфигурация
# ---------------------------------------------------------------------------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$(dirname "$SCRIPT_DIR")"
DATE_TAG="$(date +%Y-%m-%d)"
LOG_DIR="$REPO_DIR/_logs"
LOG_FILE="$LOG_DIR/daily-analytics-$DATE_TAG.log"
LOCK_FILE="/tmp/daily-analytics-mspro.lock"
REPORT_FILE="$REPO_DIR/shared/icos/daily/$DATE_TAG.md"
ANALYTICS_SCRIPT="$SCRIPT_DIR/daily-analytics.py"
LOG_RETENTION_DAYS=30

# Env-файл с credentials (не в репо)
ENV_FILE="${MSPRO_ENV_FILE:-$HOME/.config/mspro/access-check.env}"

# ---------------------------------------------------------------------------
# 0. Инициализация лога
# ---------------------------------------------------------------------------
mkdir -p "$LOG_DIR"

log() {
  local step="$1" status="$2" detail="$3"
  local ts
  ts="$(date '+%Y-%m-%dT%H:%M:%S')"
  echo "$ts | $step | $status | $detail" | tee -a "$LOG_FILE"
}

# ---------------------------------------------------------------------------
# 1. Загрузка credentials
# ---------------------------------------------------------------------------
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck disable=SC1090
  set -a
  source "$ENV_FILE"
  set +a
fi

# ---------------------------------------------------------------------------
# 2. Lock-file: idempotent старт
# ---------------------------------------------------------------------------
if [[ -f "$LOCK_FILE" ]]; then
  LOCK_PID="$(cat "$LOCK_FILE" 2>/dev/null || echo '')"
  if [[ -n "$LOCK_PID" ]] && kill -0 "$LOCK_PID" 2>/dev/null; then
    log "LOCK" "SKIP" "Previous run (PID $LOCK_PID) still running — skipping today's run"
    exit 0
  else
    log "LOCK" "WARN" "Stale lock file found (PID $LOCK_PID not running) — removing and continuing"
    rm -f "$LOCK_FILE"
  fi
fi

# Создаём lock
echo $$ > "$LOCK_FILE"
trap 'rm -f "$LOCK_FILE"' EXIT

log "START" "INFO" "daily-analytics-runner started (PID $$, date=$DATE_TAG)"

# ---------------------------------------------------------------------------
# 3. Проверка наличия скрипта аналитики
# ---------------------------------------------------------------------------
if [[ ! -f "$ANALYTICS_SCRIPT" ]]; then
  log "ANALYTICS" "FAIL" "Script not found: $ANALYTICS_SCRIPT — analytics not deployed yet"
  exit 1
fi

# ---------------------------------------------------------------------------
# 4. Запуск daily-analytics.py
# ---------------------------------------------------------------------------
log "ANALYTICS" "INFO" "Running $ANALYTICS_SCRIPT..."
python3 "$ANALYTICS_SCRIPT" >> "$LOG_FILE" 2>&1
ANALYTICS_EXIT=$?
if [[ $ANALYTICS_EXIT -eq 0 ]]; then
  log "ANALYTICS" "OK" "Script completed successfully"
elif [[ $ANALYTICS_EXIT -eq 2 ]]; then
  log "ANALYTICS" "WARN" "Script completed with partial errors (exit 2) — continuing with git commit"
else
  log "ANALYTICS" "FAIL" "Script exited with code $ANALYTICS_EXIT — aborting"
  exit $ANALYTICS_EXIT
fi

# ---------------------------------------------------------------------------
# 5. Git pipeline: коммитим только daily-отчёт
#    НЕ коммитим: _data/analytics/*.json (full archive остаётся локально)
# ---------------------------------------------------------------------------
if [[ ! -f "$REPORT_FILE" ]]; then
  log "GIT" "FAIL" "Expected report not found: $REPORT_FILE"
  exit 1
fi

log "GIT" "INFO" "Committing daily report: shared/icos/daily/$DATE_TAG.md"

cd "$REPO_DIR"

# Проверяем, что git настроен
if ! git config user.email > /dev/null 2>&1; then
  git config user.email "cron@mspro-ltd.ru"
  git config user.name "mspro-cron"
fi

# git pull перед commit (защита от race condition с ручными пушами)
log "GIT" "INFO" "git pull --rebase..."
if ! git pull --rebase origin main >> "$LOG_FILE" 2>&1; then
  log "GIT" "WARN" "git pull failed — attempting commit anyway"
fi

# Добавляем ТОЛЬКО daily-отчёт (никаких _data/, никакого *.json)
git add "shared/icos/daily/$DATE_TAG.md"

# Проверяем, есть ли что коммитить
if git diff --cached --quiet; then
  log "GIT" "SKIP" "Nothing to commit — report already committed or unchanged"
else
  git commit -m "feat(analytics): daily report $DATE_TAG

Auto-generated by cron daily-analytics-runner.sh

Co-Authored-By: Paperclip <noreply@paperclip.ing>"

  log "GIT" "INFO" "git push origin HEAD:main..."
  if git push origin HEAD:main >> "$LOG_FILE" 2>&1; then
    log "GIT" "OK" "Pushed shared/icos/daily/$DATE_TAG.md to main"
  else
    log "GIT" "FAIL" "git push failed — report committed locally but not pushed"
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 6. Ротация логов (удаляем файлы старше 30 дней)
# ---------------------------------------------------------------------------
log "ROTATE" "INFO" "Rotating logs older than ${LOG_RETENTION_DAYS} days..."
find "$LOG_DIR" -name "daily-analytics-*.log" -mtime +"$LOG_RETENTION_DAYS" -delete 2>/dev/null || true
log "ROTATE" "OK" "Log rotation complete"

# ---------------------------------------------------------------------------
# 7. Финал
# ---------------------------------------------------------------------------
log "DONE" "OK" "daily-analytics-runner finished for $DATE_TAG"
exit 0
