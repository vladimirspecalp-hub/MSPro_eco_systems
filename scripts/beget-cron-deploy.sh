#!/usr/bin/env bash
# =============================================================================
# scripts/beget-cron-deploy.sh
# Устанавливает cron для daily-analytics на beget
#
# Запуск с локалки:
#   bash scripts/beget-cron-deploy.sh
#
# Что делает:
#   1. SSH на beget
#   2. Проверяет путь репозитория
#   3. Добавляет crontab entry (idempotent — не дублирует если уже есть)
#   4. Проверяет git config (user.email, user.name) для cron-коммитов
#   5. Создаёт директории _logs/, shared/icos/daily/ если не существуют
#   6. Выводит результат `crontab -l` для верификации
#
# Pre-conditions:
#   - SSH alias mspro-beget настроен (см. credentials-registry.md)
#   - scripts/daily-analytics-runner.sh уже задеплоен в репо на beget
#   - scripts/daily-analytics.py создан analytics-постом (MSP-49 закрыт)
# =============================================================================

set -euo pipefail

SSH_ALIAS="mspro-beget"

# Путь к репозиторию на beget (определяем автоматически через SSH)
REMOTE_REPO_PATH="$(ssh "$SSH_ALIAS" 'find /home -name "package.json" -path "*/mspro*" 2>/dev/null | head -1 | xargs dirname 2>/dev/null || echo ""')"

if [[ -z "$REMOTE_REPO_PATH" ]]; then
  # Fallback: стандартный путь beget shared hosting
  REMOTE_REPO_PATH='$HOME/mspro-ltd.ru'
  echo "WARNING: Could not auto-detect repo path. Using fallback: $REMOTE_REPO_PATH"
fi

RUNNER_SCRIPT="$REMOTE_REPO_PATH/scripts/daily-analytics-runner.sh"

# Cron schedule: 06:00 МСК
# Beget серверы используют МСК (UTC+3) — проверить: `ssh mspro-beget date`
# Если UTC — поменять на: 0 3 * * *
CRON_SCHEDULE="0 6 * * *"
CRON_COMMENT="# mspro daily-analytics"
CRON_LINE="$CRON_SCHEDULE $RUNNER_SCRIPT >> $REMOTE_REPO_PATH/_logs/cron-wrapper.log 2>&1 $CRON_COMMENT"

echo "=== Deploying cron to beget ==="
echo "SSH:    $SSH_ALIAS"
echo "Repo:   $REMOTE_REPO_PATH"
echo "Script: $RUNNER_SCRIPT"
echo "Cron:   $CRON_LINE"
echo ""

# Проверяем соединение
echo "--- Checking SSH connection..."
ssh "$SSH_ALIAS" 'echo "SSH OK: $(hostname) / $(date)"'

# Разворачиваем всё в одном SSH-сеансе
ssh "$SSH_ALIAS" bash -s << REMOTE_EOF
set -euo pipefail

REPO="$REMOTE_REPO_PATH"
RUNNER="$RUNNER_SCRIPT"

echo "--- Checking repo..."
if [[ ! -d "\$REPO" ]]; then
  echo "ERROR: Repo not found at \$REPO"
  exit 1
fi
echo "Repo OK: \$REPO"

echo "--- Checking runner script..."
if [[ ! -f "\$RUNNER" ]]; then
  echo "ERROR: Runner not found: \$RUNNER"
  echo "Make sure scripts/daily-analytics-runner.sh is in the repo and deployed"
  exit 1
fi
chmod +x "\$RUNNER"
echo "Runner OK: \$RUNNER"

echo "--- Creating directories..."
mkdir -p "\$REPO/_logs"
mkdir -p "\$REPO/shared/icos/daily"
echo "Dirs OK"

echo "--- Checking git config..."
cd "\$REPO"
if ! git config user.email > /dev/null 2>&1; then
  git config user.email "cron@mspro-ltd.ru"
  git config user.name "mspro-cron"
  echo "Git config set: cron@mspro-ltd.ru"
else
  echo "Git config OK: \$(git config user.email)"
fi

echo "--- Installing cron (idempotent)..."
CRON_MARKER="daily-analytics-runner"

# Читаем текущий crontab (игнорируем ошибку если пуст)
CURRENT_CRON="\$(crontab -l 2>/dev/null || true)"

if echo "\$CURRENT_CRON" | grep -q "\$CRON_MARKER"; then
  echo "Cron already installed — skipping (idempotent)"
else
  # Добавляем новую строку
  (echo "\$CURRENT_CRON"; echo "$CRON_LINE") | crontab -
  echo "Cron installed OK"
fi

echo ""
echo "--- Current crontab -l:"
crontab -l

echo ""
echo "--- Server time (check timezone):"
date
echo "=== Deploy complete ==="
REMOTE_EOF

echo ""
echo "Next steps:"
echo "  1. Verify cron schedule matches 06:00 МСК (check server timezone above)"
echo "  2. Confirm scripts/daily-analytics.py exists on beget (MSP-49 dependency)"
echo "  3. After first run, check: ssh mspro-beget 'cat $REMOTE_REPO_PATH/_logs/daily-analytics-\$(date +%Y-%m-%d).log'"
