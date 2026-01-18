#!/bin/bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

echo "Installing Node.js LTS..."
nvm install --lts
nvm use --lts

echo "Node version:"
node -v
echo "NPM version:"
npm -v

echo "Installing dependencies..."
cd ~/mspro-ltd.ru/public_html/
# Ensure clean slate for dependencies
rm -rf node_modules package-lock.json
npm install
npm list dotenv

echo "Running migrations..."
node remote_migrate.js

echo "Restarting application..."
mkdir -p tmp
touch tmp/restart.txt

echo "Done!"
