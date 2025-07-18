#!/usr/bin/env python3
"""
Railway Configuration Verification Script
This script verifies that your Railway configuration is correct
"""

import os
import json
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists and print status"""
    if os.path.exists(filepath):
        print(f"✅ {description}: {filepath}")
        return True
    else:
        print(f"❌ {description}: {filepath} (MISSING)")
        return False

def check_railway_json():
    """Check railway.json configuration"""
    if not os.path.exists('railway.json'):
        print("❌ railway.json not found")
        return False
    
    try:
        with open('railway.json', 'r') as f:
            config = json.load(f)
        
        print("✅ railway.json found and valid")
        
        # Check required fields
        if 'build' in config and 'deploy' in config:
            print("✅ railway.json has required build and deploy sections")
            
            # Check build command
            build_cmd = config.get('build', {}).get('buildCommand', '')
            if 'cd backend' in build_cmd:
                print("✅ Build command correctly references backend directory")
            else:
                print("⚠️  Build command might not reference backend directory")
            
            # Check start command
            start_cmd = config.get('deploy', {}).get('startCommand', '')
            if 'cd backend' in start_cmd:
                print("✅ Start command correctly references backend directory")
            else:
                print("⚠️  Start command might not reference backend directory")
            
            return True
        else:
            print("❌ railway.json missing required sections")
            return False
            
    except json.JSONDecodeError:
        print("❌ railway.json is not valid JSON")
        return False

def check_requirements():
    """Check requirements.txt"""
    req_file = 'backend/requirements.txt'
    if not os.path.exists(req_file):
        print(f"❌ {req_file} not found")
        return False
    
    with open(req_file, 'r') as f:
        requirements = f.read()
    
    print(f"✅ {req_file} found")
    
    # Check for essential packages
    essential_packages = ['fastapi', 'uvicorn', 'motor', 'pymongo', 'psutil']
    missing_packages = []
    
    for package in essential_packages:
        if package not in requirements.lower():
            missing_packages.append(package)
    
    if missing_packages:
        print(f"⚠️  Missing packages in requirements.txt: {', '.join(missing_packages)}")
        return False
    else:
        print("✅ All essential packages found in requirements.txt")
        return True

def check_server_file():
    """Check server.py file"""
    server_file = 'backend/server.py'
    if not os.path.exists(server_file):
        print(f"❌ {server_file} not found")
        return False
    
    with open(server_file, 'r') as f:
        content = f.read()
    
    print(f"✅ {server_file} found")
    
    # Check for essential imports and configurations
    checks = [
        ('FastAPI', 'from fastapi import FastAPI'),
        ('MongoDB Motor', 'from motor.motor_asyncio import AsyncIOMotorClient'),
        ('CORS', 'from starlette.middleware.cors import CORSMiddleware'),
        ('Health endpoint', '@app.get("/health")'),
        ('API router', 'APIRouter(prefix="/api")'),
        ('Monitoring endpoints', '/monitoring/'),
        ('Environment variables', 'os.environ')
    ]
    
    all_good = True
    for name, pattern in checks:
        if pattern in content:
            print(f"✅ {name} configuration found")
        else:
            print(f"⚠️  {name} configuration might be missing")
            all_good = False
    
    return all_good

def main():
    """Main verification function"""
    print("🔍 Railway Configuration Verification")
    print("=" * 40)
    
    # Check current directory
    if not os.path.exists('backend') or not os.path.exists('frontend'):
        print("❌ Error: Please run this script from the portfolio root directory")
        print("   Expected structure: backend/ and frontend/ directories")
        sys.exit(1)
    
    print("✅ Directory structure looks correct")
    
    # Check configuration files
    files_to_check = [
        ('railway.json', 'Railway configuration'),
        ('Procfile', 'Process definition'),
        ('nixpacks.toml', 'Nixpacks configuration'),
        ('.railwayignore', 'Railway ignore file'),
        ('runtime.txt', 'Python runtime specification'),
        ('backend/server.py', 'Main server file'),
        ('backend/requirements.txt', 'Python dependencies'),
        ('backend/.env.example', 'Backend environment example'),
        ('frontend/.env.example', 'Frontend environment example'),
        ('frontend/package.json', 'Frontend package configuration'),
        ('DEPLOYMENT.md', 'Deployment guide')
    ]
    
    all_files_present = True
    for filepath, description in files_to_check:
        if not check_file_exists(filepath, description):
            all_files_present = False
    
    print()
    
    # Check railway.json configuration
    railway_config_ok = check_railway_json()
    
    print()
    
    # Check requirements.txt
    requirements_ok = check_requirements()
    
    print()
    
    # Check server.py
    server_ok = check_server_file()
    
    print()
    print("=" * 40)
    
    if all_files_present and railway_config_ok and requirements_ok and server_ok:
        print("🎉 All checks passed! Your configuration is ready for Railway deployment.")
        print()
        print("📋 Next steps:")
        print("1. Push your code to GitHub")
        print("2. Connect your GitHub repo to Railway")
        print("3. Set environment variables in Railway:")
        print("   - MONGO_URL: Your MongoDB Atlas connection string")
        print("   - DB_NAME: portfolio_db")
        print("4. Deploy and test!")
        return True
    else:
        print("❌ Some issues found. Please fix them before deploying.")
        print()
        print("💡 Tips:")
        print("- Run setup-deployment.sh to create missing files")
        print("- Check DEPLOYMENT.md for detailed instructions")
        print("- Ensure all required files are present")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)