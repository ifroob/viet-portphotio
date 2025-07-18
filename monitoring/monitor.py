#!/usr/bin/env python3
"""
Railway Usage Monitor Script
Run this script locally to monitor your Railway deployment
"""

import requests
import json
import time
import os
from datetime import datetime
from typing import Dict, Any

class RailwayMonitor:
    def __init__(self, backend_url: str):
        self.backend_url = backend_url.rstrip('/')
        self.log_file = "railway_usage_log.json"
        self.alert_thresholds = {
            'cpu': 80,
            'memory': 80,
            'connections': 100,
            'cost': 4.0  # Alert at $4 (80% of free tier)
        }
    
    def check_health(self) -> Dict[str, Any]:
        """Check if the service is healthy"""
        try:
            response = requests.get(f"{self.backend_url}/health", timeout=10)
            return {
                "status": "healthy" if response.status_code == 200 else "unhealthy",
                "status_code": response.status_code,
                "response_time": response.elapsed.total_seconds()
            }
        except Exception as e:
            return {
                "status": "unreachable",
                "error": str(e),
                "response_time": None
            }
    
    def get_detailed_metrics(self) -> Dict[str, Any]:
        """Get detailed monitoring metrics"""
        try:
            response = requests.get(f"{self.backend_url}/api/monitoring/dashboard", timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                return {"error": f"HTTP {response.status_code}"}
        except Exception as e:
            return {"error": str(e)}
    
    def log_metrics(self, metrics: Dict[str, Any]) -> None:
        """Log metrics to file"""
        log_entry = {
            "timestamp": datetime.utcnow().isoformat(),
            "metrics": metrics
        }
        
        try:
            with open(self.log_file, "a") as f:
                f.write(json.dumps(log_entry) + "\n")
        except Exception as e:
            print(f"❌ Failed to log metrics: {e}")
    
    def check_alerts(self, metrics: Dict[str, Any]) -> list:
        """Check for alert conditions"""
        alerts = []
        
        if "usage" in metrics:
            usage = metrics["usage"]
            
            if usage.get("cpu_percent", 0) > self.alert_thresholds['cpu']:
                alerts.append(f"🔥 High CPU usage: {usage['cpu_percent']:.1f}%")
            
            if usage.get("memory_percent", 0) > self.alert_thresholds['memory']:
                alerts.append(f"🧠 High memory usage: {usage['memory_percent']:.1f}%")
            
            if usage.get("active_connections", 0) > self.alert_thresholds['connections']:
                alerts.append(f"🌐 High connections: {usage['active_connections']}")
        
        if "cost_estimate" in metrics:
            cost = metrics["cost_estimate"].get("estimated_total", 0)
            if cost > self.alert_thresholds['cost']:
                alerts.append(f"💰 High estimated cost: ${cost:.2f}")
        
        return alerts
    
    def print_summary(self, health: Dict[str, Any], metrics: Dict[str, Any]) -> None:
        """Print a summary of current status"""
        print("\n" + "="*60)
        print(f"📊 Railway Monitor - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60)
        
        # Health status
        status_emoji = "✅" if health["status"] == "healthy" else "❌"
        print(f"{status_emoji} Service Status: {health['status'].upper()}")
        if health.get("response_time"):
            print(f"⏱️  Response Time: {health['response_time']:.2f}s")
        
        if "error" in metrics:
            print(f"❌ Metrics Error: {metrics['error']}")
            return
        
        # Usage metrics
        if "usage" in metrics:
            usage = metrics["usage"]
            print(f"\n📈 Resource Usage:")
            print(f"   CPU: {usage.get('cpu_percent', 0):.1f}%")
            print(f"   Memory: {usage.get('memory_percent', 0):.1f}% ({usage.get('memory_used_mb', 0):.1f} MB)")
            print(f"   Connections: {usage.get('active_connections', 0)}")
        
        # Database metrics
        if "database" in metrics:
            db = metrics["database"]
            print(f"\n🗄️  Database Stats:")
            print(f"   Photos: {db.get('photos', 0)}")
            print(f"   Articles: {db.get('articles', 0)}")
            print(f"   Comments: {db.get('comments', 0)}")
            print(f"   Gallery: {db.get('gallery', 0)}")
        
        # Cost estimate
        if "cost_estimate" in metrics:
            cost = metrics["cost_estimate"]
            print(f"\n💰 Cost Estimate (Monthly):")
            print(f"   CPU: ${cost.get('cpu_cost', 0):.2f}")
            print(f"   Memory: ${cost.get('memory_cost', 0):.2f}")
            print(f"   Total: ${cost.get('estimated_total', 0):.2f}")
            
            # Free tier usage
            free_tier_usage = (cost.get('estimated_total', 0) / 5) * 100
            print(f"   Free Tier Usage: {free_tier_usage:.1f}%")
        
        # Alerts
        alerts = self.check_alerts(metrics)
        if alerts:
            print(f"\n🚨 Alerts:")
            for alert in alerts:
                print(f"   {alert}")
        else:
            print(f"\n✅ No alerts - all systems normal")
    
    def run_once(self) -> None:
        """Run monitoring check once"""
        print("🔍 Checking Railway deployment...")
        
        # Check health
        health = self.check_health()
        
        # Get detailed metrics
        metrics = self.get_detailed_metrics()
        
        # Log metrics
        self.log_metrics({"health": health, "metrics": metrics})
        
        # Print summary
        self.print_summary(health, metrics)
        
        # Check for alerts
        alerts = self.check_alerts(metrics)
        if alerts:
            self.send_notifications(alerts)
    
    def send_notifications(self, alerts: list) -> None:
        """Send notifications (placeholder for email/SMS integration)"""
        print(f"\n📧 Notifications would be sent for {len(alerts)} alerts")
        # TODO: Implement email/SMS notifications
    
    def run_continuous(self, interval: int = 300) -> None:
        """Run monitoring continuously"""
        print(f"🔄 Starting continuous monitoring (every {interval}s)")
        print("Press Ctrl+C to stop")
        
        try:
            while True:
                self.run_once()
                print(f"\n⏸️  Waiting {interval}s for next check...")
                time.sleep(interval)
        except KeyboardInterrupt:
            print("\n🛑 Monitoring stopped by user")

def main():
    """Main function"""
    import argparse
    
    parser = argparse.ArgumentParser(description="Railway Usage Monitor")
    parser.add_argument("--url", required=True, help="Backend URL (e.g., https://your-app.railway.app)")
    parser.add_argument("--continuous", action="store_true", help="Run continuously")
    parser.add_argument("--interval", type=int, default=300, help="Check interval in seconds (default: 300)")
    
    args = parser.parse_args()
    
    monitor = RailwayMonitor(args.url)
    
    if args.continuous:
        monitor.run_continuous(args.interval)
    else:
        monitor.run_once()

if __name__ == "__main__":
    main()