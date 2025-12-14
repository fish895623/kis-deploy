#!/bin/bash
set -e

LOG_PREFIX="[KIS-UPDATE]"
REPO_DIR="/var/www/kis"
FRONTEND_SERVE_DIR="/var/www/kis/frontend-serve"

log() {
    echo "$LOG_PREFIX $(date '+%Y-%m-%d %H:%M:%S') $1"
}

cd "$REPO_DIR"

# Fetch latest changes
log "Fetching latest changes from origin..."
git fetch origin

# Check if there are new commits
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse origin/master 2>/dev/null || git rev-parse origin/main)

if [ "$LOCAL" = "$REMOTE" ]; then
    log "Already up to date. No changes detected."
    exit 0
fi

log "New changes detected. Updating..."
log "Local:  $LOCAL"
log "Remote: $REMOTE"

# Pull latest changes
git pull origin master 2>/dev/null || git pull origin main

# Update backend
log "Updating backend dependencies..."
cd "$REPO_DIR/backend"
export PATH="$HOME/.local/bin:$PATH"
uv sync

log "Running database migrations..."
uv run python manage.py migrate --noinput

log "Collecting static files..."
uv run python manage.py collectstatic --noinput

# Update frontend
log "Building frontend..."
cd "$REPO_DIR/frontend"
npm ci
npm run build

# Copy frontend build to serve directory
log "Deploying frontend build..."
rm -rf "$FRONTEND_SERVE_DIR"
cp -r "$REPO_DIR/frontend/dist" "$FRONTEND_SERVE_DIR"

# Restart backend service
log "Restarting backend service..."
sudo systemctl restart kis-backend

log "Update completed successfully!"
