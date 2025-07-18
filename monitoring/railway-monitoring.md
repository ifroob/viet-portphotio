# Railway Usage Monitoring & Cost Control Guide

## 📊 Setting Up Railway Monitoring

### 1. Railway Dashboard Monitoring

#### Access Your Usage Dashboard
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Click on "Usage" tab
4. View real-time metrics:
   - CPU usage (vCPU seconds)
   - Memory usage (GB seconds)
   - Network usage (GB outbound)
   - Build time usage

#### Understanding the Metrics
```
CPU Usage: $0.000463 per vCPU second
- 1 hour at 100% CPU = 3,600 vCPU seconds = $1.67
- 1 hour at 50% CPU = 1,800 vCPU seconds = $0.83

Memory Usage: $0.000231 per GB second
- 1 hour with 512MB = 1,800 GB seconds = $0.42
- 1 hour with 1GB = 3,600 GB seconds = $0.83

Network: $0.10 per GB outbound
- 1GB of API responses = $0.10
- 10GB of traffic = $1.00
```

### 2. Built-in Railway Alerts

#### Enable Usage Alerts
1. Go to your Railway project
2. Click "Settings" → "Notifications"
3. Enable these alerts:
   - **Usage threshold**: Set to $3 (60% of free tier)
   - **Monthly limit**: Set to $5 (100% of free tier)
   - **Daily spending**: Set to $0.50

#### Email Notifications
Railway will email you when:
- You reach 60% of monthly limit ($3)
- You reach 80% of monthly limit ($4)
- You reach 100% of monthly limit ($5)
- Daily spending exceeds $0.50

### 3. Custom Monitoring Setup

#### Add Monitoring Endpoint to Your App
Add this to your FastAPI app for custom monitoring:

```python
# Add to your server.py
from datetime import datetime, timedelta
import asyncio
import psutil
import os

@api_router.get("/monitoring/usage")
async def get_usage_stats():
    """Get current resource usage stats"""
    return {
        "timestamp": datetime.utcnow().isoformat(),
        "cpu_percent": psutil.cpu_percent(interval=1),
        "memory_percent": psutil.virtual_memory().percent,
        "memory_used_mb": psutil.virtual_memory().used / (1024 * 1024),
        "disk_usage_percent": psutil.disk_usage('/').percent,
        "active_connections": len(psutil.net_connections()),
        "uptime_seconds": (datetime.utcnow() - datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)).total_seconds()
    }

@api_router.get("/monitoring/health-detailed")
async def detailed_health_check():
    """Detailed health check with resource usage"""
    try:
        # Test database connection
        await db.admin.command('ping')
        db_status = "connected"
        
        # Get collection counts
        photos_count = await db.photos.count_documents({})
        articles_count = await db.articles.count_documents({})
        comments_count = await db.comments.count_documents({})
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": {
                "status": db_status,
                "photos": photos_count,
                "articles": articles_count,
                "comments": comments_count
            },
            "system": {
                "cpu_percent": psutil.cpu_percent(interval=1),
                "memory_percent": psutil.virtual_memory().percent,
                "memory_used_mb": round(psutil.virtual_memory().used / (1024 * 1024), 2)
            }
        }
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Health check failed: {str(e)}")
```

### 4. External Monitoring Tools

#### UptimeRobot (Free)
1. Sign up at [UptimeRobot](https://uptimerobot.com)
2. Add your Railway URL for monitoring
3. Set up alerts for:
   - Service downtime
   - Response time alerts
   - SSL certificate expiration

#### Pingdom (Free Tier)
1. Sign up at [Pingdom](https://www.pingdom.com)
2. Monitor your Railway app
3. Set up alerts for performance issues

### 5. Cost Optimization Strategies

#### Backend Optimization
```python
# Add to requirements.txt
psutil==5.9.5

# Connection pooling for MongoDB
from motor.motor_asyncio import AsyncIOMotorClient
import motor.motor_asyncio

# Optimize MongoDB connection
client = AsyncIOMotorClient(
    mongo_url,
    maxPoolSize=10,  # Limit connections
    minPoolSize=1,   # Minimum connections
    maxIdleTimeMS=30000,  # Close idle connections
    serverSelectionTimeoutMS=5000  # Timeout quickly
)
```

#### Query Optimization
```python
# Add indexes for better performance
@app.on_event("startup")
async def create_indexes():
    """Create database indexes for better performance"""
    # Index for articles
    await db.articles.create_index([("slug", 1)], unique=True)
    await db.articles.create_index([("is_published", 1), ("publish_date", -1)])
    await db.articles.create_index([("tags", 1)])
    
    # Index for photos
    await db.photos.create_index([("timestamp", -1)])
    
    # Index for comments
    await db.comments.create_index([("photo_id", 1), ("timestamp", -1)])
    
    # Index for gallery
    await db.gallery.create_index([("category", 1), ("timestamp", -1)])
```

#### Response Caching
```python
# Add caching for expensive operations
from functools import lru_cache
import json

@lru_cache(maxsize=100)
async def get_cached_articles(skip: int = 0, limit: int = 10):
    """Cache article queries"""
    articles = await db.articles.find({"is_published": True}).sort("publish_date", -1).skip(skip).limit(limit).to_list(limit)
    return [Article(**article) for article in articles]
```

### 6. Usage Monitoring Script

Create a monitoring script to track usage:

```python
# monitoring/track_usage.py
import requests
import json
from datetime import datetime

def check_railway_usage():
    """Check current usage and send alerts if needed"""
    
    # Your Railway API endpoints
    health_url = "https://your-app.railway.app/api/monitoring/health-detailed"
    usage_url = "https://your-app.railway.app/api/monitoring/usage"
    
    try:
        # Check health
        health_response = requests.get(health_url, timeout=10)
        health_data = health_response.json()
        
        # Check usage
        usage_response = requests.get(usage_url, timeout=10)
        usage_data = usage_response.json()
        
        # Log usage
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "health": health_data,
            "usage": usage_data
        }
        
        # Save to log file
        with open("usage_log.json", "a") as f:
            f.write(json.dumps(log_entry) + "\n")
        
        # Check for alerts
        if usage_data["cpu_percent"] > 80:
            send_alert(f"High CPU usage: {usage_data['cpu_percent']}%")
        
        if usage_data["memory_percent"] > 80:
            send_alert(f"High memory usage: {usage_data['memory_percent']}%")
        
        print(f"✅ Monitoring check completed at {datetime.utcnow()}")
        
    except Exception as e:
        print(f"❌ Monitoring check failed: {str(e)}")

def send_alert(message):
    """Send alert notification"""
    print(f"🚨 ALERT: {message}")
    # Add email/SMS integration here if needed

if __name__ == "__main__":
    check_railway_usage()
```

### 7. Weekly Cost Review Checklist

#### Every Sunday Review:
- [ ] Check Railway dashboard usage
- [ ] Review weekly spending
- [ ] Check performance metrics
- [ ] Verify all services are running efficiently
- [ ] Review error logs
- [ ] Check database query performance

#### Monthly Review:
- [ ] Analyze monthly spending trends
- [ ] Review traffic patterns
- [ ] Optimize slow queries
- [ ] Check for unused resources
- [ ] Update monitoring thresholds

### 8. Automated Cost Alerts

#### Railway CLI Monitoring
```bash
# Install Railway CLI
npm install -g @railway/cli

# Check project status
railway status

# Check logs
railway logs

# Check usage (requires API access)
railway usage
```

### 9. Emergency Cost Controls

#### If Usage Spikes:
1. **Immediate Actions**:
   - Check Railway dashboard for usage spike
   - Review recent deployments
   - Check for DDoS or unusual traffic
   - Temporarily scale down if needed

2. **Pause Service** (if necessary):
   - Go to Railway dashboard
   - Click "Settings" → "Danger Zone"
   - Click "Pause Service"
   - Service will stop (costs stop too)

3. **Resume Service**:
   - Click "Resume Service"
   - Service will restart

### 10. Cost-Effective Deployment Patterns

#### Optimal Settings:
```python
# In your server.py
import uvicorn

# Optimize for cost
if __name__ == "__main__":
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
        workers=1,  # Single worker for cost efficiency
        loop="asyncio",
        log_level="info"
    )
```

#### Environment Variables for Cost Control:
```bash
# Add to Railway environment variables
WORKERS=1
MAX_CONNECTIONS=50
KEEP_ALIVE_TIMEOUT=10
```

### 11. Monitoring Dashboard Setup

Create a simple monitoring dashboard:

```python
# Add to your server.py
@api_router.get("/monitoring/dashboard")
async def monitoring_dashboard():
    """Simple monitoring dashboard data"""
    
    # Get current usage
    usage_stats = await get_usage_stats()
    
    # Get database stats
    db_stats = {
        "photos": await db.photos.count_documents({}),
        "articles": await db.articles.count_documents({}),
        "comments": await db.comments.count_documents({}),
        "gallery": await db.gallery.count_documents({})
    }
    
    # Estimate monthly cost (rough calculation)
    estimated_monthly_cost = {
        "cpu_cost": usage_stats["cpu_percent"] * 0.01,  # Rough estimate
        "memory_cost": usage_stats["memory_used_mb"] * 0.001,  # Rough estimate
        "estimated_total": round(usage_stats["cpu_percent"] * 0.01 + usage_stats["memory_used_mb"] * 0.001, 2)
    }
    
    return {
        "usage": usage_stats,
        "database": db_stats,
        "cost_estimate": estimated_monthly_cost,
        "alerts": {
            "high_cpu": usage_stats["cpu_percent"] > 80,
            "high_memory": usage_stats["memory_percent"] > 80,
            "high_connections": usage_stats["active_connections"] > 100
        }
    }
```

### 12. Quick Setup Commands

Run these commands to set up monitoring:

```bash
# Update requirements.txt
echo "psutil==5.9.5" >> requirements.txt

# Install monitoring dependencies
pip install psutil

# Test monitoring endpoint
curl https://your-app.railway.app/api/monitoring/usage
```

## 🎯 Key Takeaways

1. **Monitor Weekly**: Check Railway dashboard every Sunday
2. **Set Alerts**: Use Railway's built-in alerts at $3 threshold
3. **Optimize Queries**: Use indexes and connection pooling
4. **Track Trends**: Keep usage logs for pattern analysis
5. **Have Emergency Plan**: Know how to pause service if needed

This monitoring setup will help you stay within the free tier and catch any usage spikes early! 🚀