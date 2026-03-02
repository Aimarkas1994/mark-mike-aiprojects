# 📊 Render Monitoring Checklist

## Quick Reference for Daily/Weekly Monitoring

### 🔍 Service Health (Daily)
- [ ] **Service Status**: Running (green) in Render dashboard
- [ ] **CPU Usage**: Below 90% on free tier
- [ ] **Memory Usage**: Below 512MB on free tier
- [ ] **Response Time**: Under 5 seconds
- [ ] **Error Rate**: Below 1%

### 💾 Database & Storage (Daily)
- [ ] **Disk Status**: Mounted and accessible
- [ ] **Disk Usage**: Below 1GB (free tier limit)
- [ ] **Database File**: `database.sqlite` exists and accessible
- [ ] **Database Size**: Monitor growth trend

### 🌐 API Endpoints (Daily)
- [ ] **Health Check**: `GET /health` → 200 OK
- [ ] **API Health**: `GET /api/health` → 200 OK
- [ ] **Projects API**: `GET /api/projects` → 200 OK
- [ ] **Skills API**: `GET /api/skills` → 200 OK
- [ ] **Contact API**: `GET /api/contact` → 200 OK
- [ ] **Blog API**: `GET /api/blog` → 200 OK

### 📈 Performance Metrics (Weekly)
- [ ] **Average Response Time**: < 3 seconds
- [ ] **Peak Response Time**: < 10 seconds
- [ ] **Request Volume**: Monitor trends
- [ ] **Error Rate**: Below 1%
- [ ] **Uptime**: 99.9% or higher

### 🔒 Security & Reliability (Weekly)
- [ ] **SSL Certificate**: Valid and not expiring
- [ ] **Rate Limiting**: Working correctly
- [ ] **CORS Configuration**: Allowing frontend
- [ ] **Environment Variables**: All set correctly
- [ ] **Database Backups**: Created and tested

### 🚨 Alerting Setup
Configure these alerts (using free services like UptimeRobot):

#### Critical Alerts (Immediate)
- **Service Down**: 2 consecutive failed health checks
- **High Error Rate**: > 5% errors over 5 minutes
- **Database Unavailable**: Cannot connect to SQLite

#### Warning Alerts (Daily)
- **High Memory Usage**: > 400MB for 1 hour
- **High CPU Usage**: > 80% for 1 hour
- **Slow Response**: > 10 seconds average

### 📝 Quick Test Commands
```bash
# Health checks
curl https://your-service.onrender.com/health
curl https://your-service.onrender.com/api/health

# API endpoints
curl https://your-service.onrender.com/api/projects
curl https://your-service.onrender.com/api/skills

# Response time test
time curl https://your-service.onrender.com/api/health
```

### 🎯 Key Metrics to Watch
| Metric | Good | Warning | Critical |
|--------|------|---------|----------|
| **Uptime** | > 99.9% | 99-99.9% | < 99% |
| **Response Time** | < 3s | 3-10s | > 10s |
| **Error Rate** | < 1% | 1-5% | > 5% |
| **CPU Usage** | < 50% | 50-80% | > 80% |
| **Memory Usage** | < 256MB | 256-400MB | > 400MB |
| **Disk Usage** | < 500MB | 500-800MB | > 800MB |

### 📞 When to Take Action
- **Immediate**: Service down, database inaccessible, SSL expired
- **Within 1 hour**: High error rates, very slow responses
- **Within 24 hours**: Warning thresholds breached, disk space growing
- **Within 1 week**: Performance trends, security updates needed

---

*Print this checklist and keep it handy for daily monitoring!*