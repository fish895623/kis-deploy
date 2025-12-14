#!/bin/bash
set -e

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
sudo mkdir -p /var/www/kis/frontend
sudo mkdir -p /var/www/kis/backend
sudo mkdir -p /var/log/kis
sudo chown -R admin:admin /var/www/kis
sudo chown -R admin:admin /var/log/kis

# Clone repository (if not already cloned)
if [ ! -d "/var/www/kis/.git" ]; then
    echo "Cloning repository..."
    cd /var/www
    git clone https://github.com/YOUR_USERNAME/kis.git kis
else
    echo "Repository already exists, pulling latest..."
    cd /var/www/kis
    git pull origin master
fi

cd /var/www/kis

# Setup backend
echo "Setting up backend..."
cd backend
uv sync
uv run python manage.py migrate
uv run python manage.py collectstatic --noinput

# Setup nginx
echo "Configuring nginx..."
sudo cp /var/www/kis/deploy/nginx.conf /etc/nginx/sites-available/kis
sudo ln -sf /etc/nginx/sites-available/kis /etc/nginx/sites-enabled/kis
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx

# Setup systemd service
echo "Configuring systemd service..."
sudo cp /var/www/kis/deploy/kis-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable kis-backend
sudo systemctl start kis-backend

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "1. Create /var/www/kis/.env file with your environment variables"
echo "2. Add your GitHub repository URL to this script"
echo "3. Configure your domain name in nginx.conf if needed"
echo ""
echo "Commands:"
echo "  - View backend logs: sudo journalctl -u kis-backend -f"
echo "  - Restart backend: sudo systemctl restart kis-backend"
echo "  - Restart nginx: sudo systemctl restart nginx"
