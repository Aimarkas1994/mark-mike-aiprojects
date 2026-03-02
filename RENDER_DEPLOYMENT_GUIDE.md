# Render Deployment Guide & Monitoring Setup

## 📋 Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Deployment Process](#step-by-step-deployment-process)
4. [Testing Procedures for Live API](#testing-procedures-for-live-api)
5. [Monitoring Checklist](#monitoring-checklist)
6. [Post-Deployment Verification Steps](#post-deployment-verification-steps)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance & Updates](#maintenance--updates)

---

## 🎯 Overview

This guide provides a comprehensive deployment process for the Portfolio API backend to Render, including monitoring setup and post-deployment verification. The application consists of:

- **Backend**: Node.js/Express REST API with SQLite database
- **Frontend**: Static HTML/CSS/JS (hosted on GitHub Pages)
- **Database**: SQLite with persistent storage on Render

### Why Render?
- ✅ **Free Tier** - No credit card required, no sudden shutdowns
- ✅ **Persistent Storage** - Essential for SQLite database
- ✅ **Auto-Deployments** - Direct from GitHub
- ✅ **SSL Included** - Automatic HTTPS
- ✅ **Health Monitoring** - Built-in service monitoring

---

## 🛠️ Prerequisites

### Before You Start
1. **GitHub Repository**: Ensure your code is in `https://github.com/Aimarkas1994/mark-mike-aiprojects`
2. **Render Account**: Sign up at [render.com](https://render.com)
3. **Domain (Optional)**: Custom domain for professional branding
4. **Local Testing**: Verify the app works locally with `npm run dev`

### Required Files
Your repository should contain:
- `backend/render.yaml` - Render configuration ✅
- `backend/package.json` - Dependencies and scripts ✅
- `backend/server.js` - Main application file ✅
- `backend/.env.example` - Environment template ✅
- `backend/scripts/init-database.js` - Database initialization ✅

---

## 🚀 Step-by-Step Deployment Process

### Step 1: Sign Up for Render
1. Go to [render.com](https://render.com)
2. Click "Sign Up" (free account)
3. Choose GitHub authentication (recommended)
4. Authorize Render to access your repositories

### Step 2: Create New Web Service
1. **Dashboard**: Click "New +" → "Web Service"
2. **Repository Selection**:
   - Select: `Aimarkas1994/mark-mike-aiprojects`
   - Branch: `main`
3. **Service Configuration**:
   ```
   Name: portfolio-api
   Region: Choose nearest to your users
   Runtime: Node
   Instance Type: Free (recommended for testing)
   ```

### Step 3: Configure Build & Start Commands
Render will automatically detect `render.yaml`, but verify these settings:

**Build Command**:
```bash
cd backend && npm install && npm run init-db
```

**Start Command**:
```bash
cd backend && npm start
```

### Step 4: Environment Variables
Add these environment variables in Render dashboard:

```env
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://aimarkas1994.github.io
```

**Optional Variables** (for production):
```env
# Security
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password

# Email (for contact form notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=your-contact-email@gmail.com
```

### Step 5: Configure Persistent Storage
**CRITICAL** for SQLite database persistence:

1. **Go to Storage Tab**: In your Render service dashboard
2. **Create Disk**:
   ```
   Name: sqlite-data
   Mount Path: /opt/render/project/backend
   Size: 1GB (Free tier limit)
   ```
3. **Save Changes**

### Step 6: Configure Health Check
Render automatically detects the `/health` endpoint from `render.yaml`, but verify:

```yaml
healthCheck:
  path: /health
  interval: 30
  timeout: 10
  unhealthyThreshold: 3
  healthyThreshold: 2
```

### Step 7: Deploy Service
1. **Click "Create Web Service"**
2. **Wait 2-3 minutes** for deployment
3. **Check logs** for any errors
4. **Verify service is running**

### Step 8: Update Frontend Configuration
Edit `docs/js/api-client.js` to point to your Render URL:

```javascript
// Change this line:
const baseURL = 'https://your-service-name.onrender.com/api';
```

### Step 9: Commit & Push Changes
```bash
git add .
git commit -m "Configure Render deployment"
git push origin main
```

Render will automatically redeploy with the new configuration.

---

## 🧪 Testing Procedures for Live API

### Pre-Deployment Testing (Local)
Before deploying, run these tests locally:

```bash
# 1. Install dependencies
cd backend && npm install

# 2. Initialize database
npm run init-db

# 3. Start development server
npm run dev

# 4. Test basic endpoints in another terminal:
curl http://localhost:3001/health
curl http://localhost:3001/api/health
curl http://localhost:3001/api/projects
curl http://localhost:3001/api/skills
```

### Post-Deployment Testing (Live API)

#### 1. Health Check Tests
```bash
# Test basic health endpoint
curl https://your-service-name.onrender.com/health

# Test API health endpoint
curl https://your-service-name.onrender.com/api/health

# Expected response:
{
  "status": "OK",
  "timestamp": "2026-02-28T19:56:00.000Z",
  "service": "portfolio-api",
  "version": "1.0.0",
  "environment": "production"
}
```

#### 2. API Endpoint Tests
Create a test script `test-api.js`:

```javascript
const API_BASE = 'https://your-service-name.onrender.com/api';

const tests = [
  // Health Check
  () => fetch(`${API_BASE}/health`).then(r => r.json()),
  
  // Get Projects
  () => fetch(`${API_BASE}/projects`).then(r => r.json()),
  
  // Get Featured Projects
  () => fetch(`${API_BASE}/projects?featured=true`).then(r => r.json()),
  
  // Get Skills
  () => fetch(`${API_BASE}/skills`).then(r => r.json()),
  
  // Get Skills by Category
  () => fetch(`${API_BASE}/skills?category=Frontend`).then(r => r.json())
];

async function runTests() {
  console.log('🧪 Running API Tests...\n');
  
  for (let i = 0; i < tests.length; i++) {
    try {
      const result = await tests[i]();
      console.log(`✅ Test ${i + 1}: PASSED`);
      console.log('  Response:', JSON.stringify(result, null, 2));
    } catch (error) {
      console.log(`❌ Test ${i + 1}: FAILED`);
      console.log('  Error:', error.message);
    }
    console.log('---');
  }
}

runTests();
```

Run the test:
```bash
node test-api.js
```

#### 3. Data Persistence Test
```bash
# 1. Create a test project
curl -X POST https://your-service-name.onrender.com/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Project",
    "description": "This is a test project",
    "technologies": "Node.js, Express",
    "featured": false
  }'

# 2. Verify it was created
curl https://your-service-name.onrender.com/api/projects

# 3. Delete the test project
curl -X DELETE https://your-service-name.onrender.com/api/projects/[insert-id]
```

#### 4. CORS Configuration Test
Test that your frontend can access the API:

1. **Open browser dev tools** on your frontend
2. **Check Network tab** for any CORS errors
3. **Verify API calls** are successful

#### 5. Rate Limiting Test
Test rate limiting (should allow 200 requests per 15 minutes):

```javascript
// Test rate limiting with multiple requests
const testRateLimit = async () => {
  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises.push(
      fetch('https://your-service-name.onrender.com/api/health')
        .then(r => r.json())
    );
  }
  
  const results = await Promise.all(promises);
  results.forEach((result, i) => {
    console.log(`Request ${i + 1}:`, result.status);
  });
};

testRateLimit();
```

---

## 📊 Monitoring Checklist

### Render Dashboard Monitoring
Check these metrics in your Render dashboard:

#### Service Health
- [ ] **Service Status**: Running (green)
- [ ] **CPU Usage**: Below 90% on free tier
- [ ] **Memory Usage**: Below 512MB on free tier
- [ ] **Response Time**: Under 5 seconds
- [ ] **Error Rate**: Below 1%

#### Health Check Status
- [ ] **Health Check Path**: `/health` responding
- [ ] **Health Check Interval**: 30 seconds
- [ ] **Healthy Threshold**: 2 consecutive successes
- [ ] **Unhealthy Threshold**: 3 consecutive failures

#### Database Storage
- [ ] **Disk Status**: Mounted and accessible
- [ ] **Disk Usage**: Below 1GB (free tier limit)
- [ ] **Database File**: `database.sqlite` exists and is accessible
- [ ] **Database Permissions**: Read/write access confirmed

### External Monitoring Tools

#### Uptime Monitoring
Set up external monitoring (free services available):

1. **UptimeRobot** (Free tier: 50 monitors)
   - URL: `https://your-service-name.onrender.com/health`
   - Check interval: 5 minutes
   - Alert on: 2 consecutive failures

2. **Better Uptime** (Free tier available)
   - Similar setup to UptimeRobot
   - SMS/email alerts

#### Performance Monitoring
```javascript
// Add this to your server.js for basic performance monitoring
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
});
```

#### Error Tracking
1. **Render Logs**: Check service logs regularly
2. **Console Errors**: Monitor browser console for API errors
3. **Error Reporting**: Consider free tier of Sentry or similar

### Daily/Weekly Monitoring Routine

#### Daily Checks
- [ ] **Service Status**: Check Render dashboard
- [ ] **Health Endpoint**: Verify `/health` response
- [ ] **Error Logs**: Review Render service logs
- [ ] **Database Size**: Check `database.sqlite` file size

#### Weekly Checks
- [ ] **Performance Metrics**: Review response times
- [ ] **Error Rates**: Check for increasing error trends
- [ ] **Storage Usage**: Monitor disk space usage
- [ ] **API Usage**: Check request volumes

#### Monthly Checks
- [ ] **Database Backup**: Export database if needed
- [ ] **Dependency Updates**: Check for npm updates
- [ ] **Performance Review**: Analyze monthly metrics
- [ ] **Cost Review**: Verify still within free tier limits

---

## ✅ Post-Deployment Verification Steps

### Immediate Verification (After Deployment)

#### 1. Service Accessibility
```bash
# Test main service URL
curl -I https://your-service-name.onrender.com

# Expected: 200 OK response
```

#### 2. API Endpoints Verification
Test all major API endpoints:

```bash
# Health endpoints
curl https://your-service-name.onrender.com/health
curl https://your-service-name.onrender.com/api/health

# Data endpoints
curl https://your-service-name.onrender.com/api/projects
curl https://your-service-name.onrender.com/api/skills
curl https://your-service-name.onrender.com/api/contact
curl https://your-service-name.onrender.com/api/blog
```

#### 3. Database Persistence Test
```bash
# 1. Add test data
curl -X POST https://your-service-name.onrender.com/api/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Deployment Test Project",
    "description": "Testing database persistence",
    "featured": false
  }'

# 2. Retrieve and verify
curl https://your-service-name.onrender.com/api/projects

# 3. Clean up (delete test project)
curl -X DELETE https://your-service-name.onrender.com/api/projects/[test-project-id]
```

#### 4. Frontend-Backend Integration
1. **Open your frontend**: `https://aimarkas1994.github.io/mark-mike-aiprojects/`
2. **Test dynamic content**: Projects, skills, blog sections
3. **Test contact form**: Submit a test message
4. **Check browser console**: No CORS or API errors

#### 5. SSL/HTTPS Verification
```bash
# Test SSL certificate
curl -I https://your-service-name.onrender.com

# Look for: 200 OK and proper SSL headers
```

### Extended Verification (24-48 Hours After)

#### 1. Continuous Monitoring
- [ ] **Service remains running** without restarts
- [ ] **Health checks passing** consistently
- [ ] **No error spikes** in logs
- [ ] **Database persistence** after service restart

#### 2. Load Testing
```javascript
// Basic load test script
const loadTest = async () => {
  const requests = [];
  const concurrentUsers = 10;
  const testsPerUser = 5;
  
  for (let i = 0; i < concurrentUsers; i++) {
    for (let j = 0; j < testsPerUser; j++) {
      requests.push(
        fetch('https://your-service-name.onrender.com/api/health')
          .then(r => r.json())
          .then(data => ({ success: true, data }))
          .catch(err => ({ success: false, error: err.message }))
      );
    }
  }
  
  const results = await Promise.all(requests);
  const successCount = results.filter(r => r.success).length;
  const failCount = results.filter(r => !r.success).length;
  
  console.log(`Load Test Results:`);
  console.log(`Total requests: ${results.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  console.log(`Success rate: ${((successCount/results.length) * 100).toFixed(2)}%`);
};

loadTest();
```

#### 3. Cross-Origin Verification
Test from different origins:

```javascript
// Test CORS from different origins
const testCORS = async () => {
  const origins = [
    'https://aimarkas1994.github.io',
    'http://localhost:3000',
    'https://your-custom-domain.com'
  ];
  
  for (const origin of origins) {
    try {
      const response = await fetch('https://your-service-name.onrender.com/api/health', {
        headers: { 'Origin': origin }
      });
      console.log(`✅ CORS OK for ${origin}: ${response.status}`);
    } catch (error) {
      console.log(`❌ CORS Failed for ${origin}: ${error.message}`);
    }
  }
};

testCORS();
```

### Production Readiness Checklist

#### Final Verification
- [ ] **All API endpoints** functional
- [ ] **Database operations** working (CRUD)
- [ ] **CORS configured** correctly for frontend
- [ ] **SSL certificate** valid and working
- [ ] **Rate limiting** active and functional
- [ ] **Error handling** graceful and informative
- [ ] **Health monitoring** active
- [ ] **Logging** enabled and accessible
- [ ] **Environment variables** properly set
- [ ] **Persistent storage** mounted and working

#### Documentation Update
- [ ] **Render URL** documented
- [ ] **API documentation** updated with live URL
- [ ] **Frontend updated** with new API URL
- [ ] **Monitoring setup** documented
- [ ] **Troubleshooting guide** available

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Service Won't Start
**Symptoms**: Service shows "Crashed" or won't start
**Solutions**:
- Check Render service logs for specific errors
- Verify `package.json` has correct start script
- Ensure all dependencies are in `package.json`
- Check Node.js version compatibility

#### 2. Database Connection Issues
**Symptoms**: "Database locked" or "Cannot open database" errors
**Solutions**:
- Verify persistent disk is mounted at `/opt/render/project/backend`
- Check database file permissions
- Ensure `init-db` script ran successfully
- Restart service if needed

#### 3. CORS Errors
**Symptoms**: Frontend cannot access API, browser shows CORS errors
**Solutions**:
- Verify `FRONTEND_URL` environment variable is set correctly
- Check CORS configuration in `server.js`
- Ensure frontend URL is in allowed origins list
- Test with curl to verify API works independently

#### 4. Health Check Failures
**Symptoms**: Service shows "Unhealthy" status
**Solutions**:
- Verify `/health` endpoint is accessible
- Check if service is actually running
- Look for high CPU/memory usage
- Review application logs for errors

#### 5. High Response Times
**Symptoms**: API calls take more than 5 seconds
**Solutions**:
- Check Render service metrics
- Review database query performance
- Monitor for memory leaks
- Consider scaling up if consistently slow

### Getting Help

1. **Render Documentation**: [docs.render.com](https://docs.render.com)
2. **Render Status**: [status.render.com](https://status.render.com)
3. **Community Support**: Render community forums
4. **Project Issues**: GitHub repository issues

---

## 🔄 Maintenance & Updates

### Regular Updates

#### Dependency Updates
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Test before deployment
npm test
```

#### Node.js Updates
- Render supports Node.js versions 14.x, 16.x, 18.x, 20.x
- Test locally before updating
- Update `engines` field in `package.json`

### Deployment Updates

#### Automated Deployments
Your service is set to auto-deploy when you push to the `main` branch. To deploy:

```bash
git add .
git commit -m "Update: description of changes"
git push origin main
```

#### Manual Deployments
If auto-deployment fails, you can trigger a manual deploy:
1. Go to Render dashboard
2. Select your service
3. Click "Manual Deploy"
4. Choose branch and commit
5. Click "Deploy"

### Database Maintenance

#### Database Backups
Since SQLite is a file-based database, backups are simple:

```bash
# Create backup (via Render shell or SSH)
cp /opt/render/project/backend/database.sqlite /opt/render/project/backend/database_backup.sqlite

# Download backup via Render dashboard or rsync
```

#### Database Optimization
```bash
# Run SQLite vacuum (via Render shell)
sqlite3 /opt/render/project/backend/database.sqlite "VACUUM;"
```

### Scaling Considerations

#### When to Scale Up
- Consistent high CPU usage (>80%)
- Memory usage approaching limits
- Slow response times (>5 seconds)
- High request volumes

#### Free Tier Limits
- **CPU**: Shared, may be throttled
- **Memory**: 512MB limit
- **Storage**: 1GB persistent disk
- **Bandwidth**: 100GB/month
- **Requests**: No hard limit, but fair usage applies

---

## 🎉 Conclusion

Your Portfolio API is now deployed on Render with comprehensive monitoring and testing procedures. This setup provides:

- **Zero-cost professional hosting**
- **Reliable persistent storage**
- **Automated deployments**
- **Comprehensive monitoring**
- **Robust testing procedures**

### Next Steps
1. **Set up custom domain** (optional)
2. **Configure email notifications** (optional)
3. **Set up alerting** for downtime
4. **Regular monitoring** and maintenance

### Support
For issues or questions:
- **Render Support**: support@render.com
- **Project Issues**: GitHub repository
- **Documentation**: This guide and project README

---

**🚀 Your full-stack portfolio is now live and monitored!**