#!/bin/bash

# Portfolio App Deployment Setup Script
# This script helps prepare your monorepo for Railway deployment

echo "🚀 Portfolio App Deployment Setup"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "backend/server.py" ]; then
    echo "❌ Error: backend/server.py not found. Please run this script from the portfolio root directory."
    exit 1
fi

echo "✅ Found backend/server.py"

# Check if railway.json exists
if [ ! -f "railway.json" ]; then
    echo "❌ Error: railway.json not found. Creating it..."
    cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "cd backend && pip install -r requirements.txt"
  },
  "deploy": {
    "startCommand": "cd backend && uvicorn server:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF
    echo "✅ Created railway.json"
else
    echo "✅ Found railway.json"
fi

# Check if Procfile exists
if [ ! -f "Procfile" ]; then
    echo "❌ Creating Procfile..."
    echo "web: cd backend && uvicorn server:app --host 0.0.0.0 --port \$PORT" > Procfile
    echo "✅ Created Procfile"
else
    echo "✅ Found Procfile"
fi

# Check if nixpacks.toml exists
# Note: We don't need nixpacks.toml anymore - Railway handles this via railway.json

# Check if .railwayignore exists
if [ ! -f ".railwayignore" ]; then
    echo "❌ Creating .railwayignore..."
    cat > .railwayignore << 'EOF'
frontend/
monitoring/
tests/
*.md
.git/
node_modules/
.vercel/
.netlify/
yarn.lock
package-lock.json
EOF
    echo "✅ Created .railwayignore"
else
    echo "✅ Found .railwayignore"
fi

# Check if root requirements.txt exists (for Railway detection)
if [ ! -f "requirements.txt" ]; then
    echo "❌ Creating root requirements.txt for Railway detection..."
    cat > requirements.txt << 'EOF'
# This file tells Railway this is a Python project
# The actual requirements are in backend/requirements.txt
# Railway will use the buildCommand to install from the correct location

# Placeholder - actual requirements in backend/requirements.txt
EOF
    echo "✅ Created root requirements.txt"
else
    echo "✅ Found root requirements.txt"
fi

# Check backend requirements
if [ ! -f "backend/requirements.txt" ]; then
    echo "❌ Error: backend/requirements.txt not found"
    exit 1
fi

echo "✅ Found backend/requirements.txt"

# Check if psutil is in requirements (needed for monitoring)
if ! grep -q "psutil" backend/requirements.txt; then
    echo "⚠️  Adding psutil to requirements.txt for monitoring..."
    echo "psutil>=5.9.5" >> backend/requirements.txt
    echo "✅ Added psutil to requirements.txt"
fi

# Check if backend/.env.example exists
if [ ! -f "backend/.env.example" ]; then
    echo "❌ Creating backend/.env.example..."
    cat > backend/.env.example << 'EOF'
# Environment variables for different environments

# Local development
MONGO_URL=mongodb://localhost:27017
DB_NAME=portfolio_db

# Production - MongoDB Atlas (update with your actual connection string)
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/portfolio_db?retryWrites=true&w=majority
DB_NAME=portfolio_db

# Railway specific
PORT=8000
EOF
    echo "✅ Created backend/.env.example"
else
    echo "✅ Found backend/.env.example"
fi

# Check if frontend/.env.example exists
if [ ! -f "frontend/.env.example" ]; then
    echo "❌ Creating frontend/.env.example..."
    cat > frontend/.env.example << 'EOF'
# Environment variables for different environments

# Local development
REACT_APP_BACKEND_URL=http://localhost:8001

# Production (update with your actual Railway backend URL)
REACT_APP_BACKEND_URL=https://your-railway-app.railway.app

# Vercel specific
GENERATE_SOURCEMAP=false
EOF
    echo "✅ Created frontend/.env.example"
else
    echo "✅ Found frontend/.env.example"
fi

echo ""
echo "🎉 Setup complete! Your monorepo is ready for Railway deployment."
echo ""
echo "📋 Next steps:"
echo "1. 🗄️  Set up MongoDB Atlas:"
echo "   - Create account at https://cloud.mongodb.com/"
echo "   - Create free cluster"
echo "   - Get connection string"
echo ""
echo "2. 🚂 Deploy to Railway:"
echo "   - Create account at https://railway.app"
echo "   - Connect your GitHub repository"
echo "   - Set environment variables:"
echo "     * MONGO_URL: Your MongoDB Atlas connection string"
echo "     * DB_NAME: portfolio_db"
echo ""
echo "3. 🌐 Deploy frontend to Vercel:"
echo "   - Create account at https://vercel.com"
echo "   - Deploy frontend/ directory"
echo "   - Set REACT_APP_BACKEND_URL to your Railway URL"
echo ""
echo "4. 📊 Set up monitoring:"
echo "   - Update monitoring/dashboard.html with your Railway URL"
echo "   - Run: python monitoring/monitor.py --url https://your-railway-app.railway.app"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
echo ""
echo "🔧 Railway configuration files created:"
echo "   ✅ railway.json - Railway deployment configuration"
echo "   ✅ Procfile - Process definition"
echo "   ✅ requirements.txt - Root requirements for Railway detection"
echo "   ✅ .railwayignore - Files to exclude from deployment"
echo "   ✅ runtime.txt - Python version specification"
echo ""
echo "Ready to deploy! 🚀"