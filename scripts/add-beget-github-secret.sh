#!/usr/bin/env bash
# =============================================================================
# scripts/add-beget-github-secret.sh
# Добавляет BEGET_SSH_KEY secret в GitHub repo для daily-analytics workflow
#
# Запуск:
#   export GITHUB_TOKEN=ghp_...  # Personal Access Token с правами на secrets
#   bash scripts/add-beget-github-secret.sh
#
# Требования:
#   - curl, python3
#   - GITHUB_TOKEN с правами repo:admin или secrets:write
# =============================================================================

set -euo pipefail

REPO="vladimirspecalp-hub/MSPro_eco_systems"
SECRET_NAME="BEGET_SSH_KEY"
KEY_FILE="${BEGET_SSH_KEY_FILE:-$HOME/.ssh/mspro_beget_ed25519}"

if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  echo "ERROR: GITHUB_TOKEN not set"
  echo "Export a GitHub PAT with repo/admin:secrets scope:"
  echo "  export GITHUB_TOKEN=ghp_..."
  exit 1
fi

if [[ ! -f "$KEY_FILE" ]]; then
  echo "ERROR: SSH key not found: $KEY_FILE"
  exit 1
fi

echo "=== Adding $SECRET_NAME to $REPO ==="
echo "Key file: $KEY_FILE ($(wc -c < "$KEY_FILE") bytes)"

# Get repo public key for secret encryption
echo "--- Getting repo public key..."
PUB_KEY_RESPONSE=$(curl -sf \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  "https://api.github.com/repos/${REPO}/actions/secrets/public-key")

KEY_ID=$(echo "$PUB_KEY_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['key_id'])")
KEY_B64=$(echo "$PUB_KEY_RESPONSE" | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['key'])")

echo "Got repo public key: $KEY_ID"

# Encrypt secret using libsodium (via Python)
SECRET_VALUE=$(cat "$KEY_FILE")

ENCRYPTED=$(python3 - <<PYEOF
import base64, sys
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PublicKey
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

# GitHub uses sealed_box from libsodium / PyNaCl
try:
    from nacl.public import PublicKey, SealedBox
    import nacl.encoding
    pub_key = PublicKey(base64.b64decode("$KEY_B64"), encoder=nacl.encoding.RawEncoder)
    box = SealedBox(pub_key)
    encrypted = box.encrypt(b"""$SECRET_VALUE""")
    print(base64.b64encode(encrypted).decode())
except ImportError:
    print("NACL_MISSING")
PYEOF
)

if [[ "$ENCRYPTED" == "NACL_MISSING" ]]; then
  echo "ERROR: PyNaCl not installed. Install with: pip install PyNaCl"
  echo ""
  echo "Manual alternative:"
  echo "  1. Go to https://github.com/${REPO}/settings/secrets/actions"
  echo "  2. New repository secret"
  echo "  3. Name: ${SECRET_NAME}"
  echo "  4. Value: contents of ${KEY_FILE}"
  exit 1
fi

# Upload the encrypted secret
echo "--- Uploading secret..."
HTTP_STATUS=$(curl -sf -o /dev/null -w "%{http_code}" \
  -X PUT \
  -H "Authorization: Bearer $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Content-Type: application/json" \
  "https://api.github.com/repos/${REPO}/actions/secrets/${SECRET_NAME}" \
  -d "{\"encrypted_value\":\"${ENCRYPTED}\",\"key_id\":\"${KEY_ID}\"}")

if [[ "$HTTP_STATUS" == "201" ]] || [[ "$HTTP_STATUS" == "204" ]]; then
  echo "SUCCESS: $SECRET_NAME added to $REPO (HTTP $HTTP_STATUS)"
else
  echo "ERROR: Unexpected HTTP status $HTTP_STATUS"
  exit 1
fi

echo ""
echo "=== Done. Verify at: ==="
echo "https://github.com/${REPO}/settings/secrets/actions"
echo ""
echo "Next: test the workflow with workflow_dispatch:"
echo "https://github.com/${REPO}/actions/workflows/daily-analytics.yml"
