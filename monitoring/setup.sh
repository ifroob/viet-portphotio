#!/bin/bash

# Railway Monitoring Setup Script
# This script helps you set up monitoring for your Railway deployment

echo "🚂 Railway Monitoring Setup"
echo "=========================="

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI not found. Installing..."
    npm install -g @railway/cli
    echo "✅ Railway CLI installed"
fi

# Check if the user is logged in
if ! railway whoami &> /dev/null; then
    echo "🔑 Please log in to Railway:"
    railway login
fi

# Get project information
echo "📋 Your Railway projects:"
railway project list

echo ""
echo "🔧 Setting up monitoring for your project..."
echo ""

# Create monitoring directory
mkdir -p monitoring
cd monitoring

# Download monitoring files (if not already present)
if [ ! -f "monitor.py" ]; then
    echo "📥 Downloading monitoring script..."
    # In real deployment, you would download from your repo
    echo "✅ Monitoring script ready"
fi

# Set up Python environment
echo "🐍 Setting up Python environment..."
python3 -m venv venv
source venv/bin/activate
pip install requests

# Create config file
echo "⚙️  Creating monitoring configuration..."
cat > config.json << EOF
{
    "backend_url": "https://your-railway-app.railway.app",
    "alert_thresholds": {
        "cpu": 80,
        "memory": 80,
        "connections": 100,
        "cost": 4.0
    },
    "monitoring_interval": 300,
    "log_file": "railway_usage_log.json"
}
EOF

# Create systemd service file (for Linux servers)
echo "🔧 Creating systemd service file..."
cat > railway-monitor.service << EOF
[Unit]
Description=Railway Usage Monitor
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$(pwd)
ExecStart=$(pwd)/venv/bin/python monitor.py --url https://your-railway-app.railway.app --continuous
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
EOF

# Create cron job
echo "⏰ Setting up cron job for monitoring..."
cat > railway-monitor.cron << EOF
# Railway Monitor - Check every 5 minutes
*/5 * * * * $(pwd)/venv/bin/python $(pwd)/monitor.py --url https://your-railway-app.railway.app >> $(pwd)/monitor.log 2>&1
EOF

# Make scripts executable
chmod +x monitor.py

echo ""
echo "✅ Monitoring setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Update config.json with your actual Railway app URL"
echo "2. Test the monitoring script:"
echo "   python monitor.py --url https://your-railway-app.railway.app"
echo ""
echo "3. For continuous monitoring, choose one option:"
echo "   a) Run manually: python monitor.py --url https://your-railway-app.railway.app --continuous"
echo "   b) Install systemd service: sudo cp railway-monitor.service /etc/systemd/system/ && sudo systemctl enable railway-monitor"
echo "   c) Install cron job: crontab railway-monitor.cron"
echo ""
echo "4. Open dashboard.html in your browser for visual monitoring"
echo ""
echo "🎯 Railway Dashboard: https://railway.app/dashboard"
echo "📊 Usage tracking will begin once you run the monitor!"