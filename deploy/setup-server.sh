#!/bin/bash
set -e

REPO_URL="https://github.com/fish895623/kis-deploy.git"

echo "=== KIS Server Setup Script ==="

# Update system packages
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install system dependencies
echo "Installing system dependencies..."
sudo apt install -y \
    curl \
    git \
    nginx \
    python3.11 \
    python3.11-venv \
    python3-pip

# Install Node.js 20
echo "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install uv
echo "Installing uv..."
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"

# Create directory structure
echo "Creating directory structure..."
sudo mkdir -p /var/www
sudo mkdir -p /var/log/kis
sudo chown -R admin:admin /var/www
sudo chown -R admin:admin /var/log/kis

# Clone repository (if not already cloned)
if [ ! -d "/var/www/kis/.git" ]; then
    echo "Cloning repository..."
    rm -rf /var/www/kis 2>/dev/null || true
    git clone "$REPO_URL" /var/www/kis
else
    echo "Repository already exists, pulling latest..."
    cd /var/www/kis
    git pull origin master 2>/dev/null || git pull origin main
fi

cd /var/www/kis

# Setup backend
echo "Setting up backend..."
cd /var/www/kis/backend
uv sync
uv run python manage.py migrate --noinput
uv run python manage.py collectstatic --noinput

# Build and deploy frontend
echo "Building frontend..."
cd /var/www/kis/frontend
npm ci
npm run build
rm -rf /var/www/kis/frontend-serve
cp -r dist /var/www/kis/frontend-serve

# Setup nginx
echo "Configuring nginx..."
sudo cp /var/www/kis/deploy/nginx.conf /etc/nginx/sites-available/kis
sudo ln -sf /etc/nginx/sites-available/kis /etc/nginx/sites-enabled/kis
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Setup systemd backend service
echo "Configuring backend systemd service..."
sudo cp /var/www/kis/deploy/kis-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable kis-backend
sudo systemctl start kis-backend

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Services Status:"
sudo systemctl status kis-backend --no-pager || true
echo ""
echo "Next steps:"
echo "1. Create /var/www/kis/backend/.env file with your environment variables:"
echo "   DJANGO_SECRET_KEY=<your-secret-key>"
echo "   DATABASE_URL=<your-neon-connection-string>"
echo ""
echo "2. Restart the backend after creating .env:"
echo "   sudo systemctl restart kis-backend"
echo ""
echo "3. Add LIGHTSAIL_SSH_KEY secret to GitHub repository for CI/CD deployment"
echo ""
echo "Commands:"
echo "  - View backend logs: sudo journalctl -u kis-backend -f"
echo "  - Restart backend: sudo systemctl restart kis-backend"
echo "  - Restart nginx: sudo systemctl restart nginx"
