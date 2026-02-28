# Portfolio Backend API - Render Optimized

A RESTful API backend for the Mark portfolio website, built with Node.js, Express, and SQLite, **optimized for Render free hosting**.

## 🚀 Why Render?

Render is currently the **best free hosting option** for Node.js applications:

- ✅ **Always Free Tier**: No sudden shutdowns like Heroku
- ✅ **Persistent Storage**: Perfect for SQLite database
- ✅ **SSL Included**: Automatic HTTPS
- ✅ **Custom Domains**: Free custom domain support
- ✅ **Health Monitoring**: Built-in health checks
- ✅ **Auto-Deployments**: Direct from GitHub
- ✅ **Generous Limits**: 512MB RAM, 1024MB disk space

## Features

- **Projects Management**: CRUD operations for portfolio projects
- **Skills Management**: Organize skills by category and proficiency level
- **Contact Form**: Handle contact messages with validation
- **Blog System**: Full blog post management with draft/published states
- **Security**: Rate limiting, CORS, helmet security headers
- **Database**: SQLite with Render persistent storage
- **Render-Optimized**: Health checks, graceful shutdown, proper logging

## 🎯 Quick Deploy to Render (5 Minutes)

### Step 1: Connect Your GitHub Repository
1. Go to [Render.com](https://render.com)
2. Sign up (free)
3. Click "New +" → "Web Service"
4. Connect your GitHub repository: `Aimarkas1994/mark-mike-aiprojects`
5. Select the repository

### Step 2: Configure the Service
- **Name**: `portfolio-api` (or your preferred name)
- **Region**: Choose nearest to your audience
- **Branch**: `main`
- **Runtime**: `Node`
- **Build Command**: `cd backend && npm install && npm run init-db`
- **Start Command**: `cd backend && npm start`
- **Instance Type**: Free

### Step 3: Environment Variables
Add these environment variables in Render dashboard:
```
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://aimarkas1994.github.io
```

### Step 4: Persistent Storage
1. Go to the "Storage" tab in your Render service
2. Click "Create Disk"
3. **Name**: `sqlite-data`
4. **Mount Path**: `/opt/render/project/backend`
5. **Size**: 1GB (free)
6. Save

### Step 5: Deploy and Test
1. Click "Create Web Service"
2. Wait for deployment (2-3 minutes)
3. Your API will be available at: `https://your-service-name.onrender.com`
4. Test health check: `https://your-service-name.onrender.com/health`

## 📡 API Endpoints

### Health Check
- `GET /health` - Render health monitoring
- `GET /api/health` - API health status

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects?featured=true` - Get featured projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Skills
- `GET /api/skills` - Get all skills
- `GET /api/skills/categories` - Get skill categories
- `GET /api/skills?category=Frontend` - Get skills by category
- `GET /api/skills/:id` - Get single skill
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Contact
- `GET /api/contact` - Get all contact messages (admin)
- `GET /api/contact/stats` - Get contact statistics
- `POST /api/contact` - Submit contact form
- `PATCH /api/contact/:id/read` - Mark message as read
- `DELETE /api/contact/:id` - Delete contact message

### Blog
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get blog post by slug
- `GET /api/blog/:id` - Get blog post by ID
- `POST /api/blog` - Create new blog post
- `PUT /api/blog/:id` - Update blog post
- `DELETE /api/blog/:id` - Delete blog post
- `PATCH /api/blog/:id/publish` - Toggle publish status

## 🔧 Update Frontend API URL

After deploying to Render, update the API URL in your frontend:

Edit `docs/js/api-client.js` and change:
```javascript
// Replace this line:
return 'https://portfolio-api.onrender.com/api';

// With your actual Render URL:
return 'https://your-service-name.onrender.com/api';
```

## 💻 Local Development

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Environment setup:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database:**
   ```bash
   npm run init-db
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The API uses SQLite with Render persistent storage for these tables:

- `projects` - Portfolio projects
- `skills` - Technical skills with categories
- `contact_messages` - Contact form submissions
- `blog_posts` - Blog articles with draft/published states
- `blog_categories` - Blog categories
- `project_tags` - Project tags

## 🎮 Sample Data

The database initialization includes sample projects and skills to get you started.

## 🚨 Render-Specific Features

### Health Checks
Render monitors `/health` endpoint for service availability
- Response: 200 OK with service info
- Monitored every 30 seconds
- Automatic restart on failure

### Persistent Storage
SQLite database stored at `/opt/render/project/backend/database.sqlite`
- Survives service restarts
- 1GB free storage included
- Automatic backups (Render feature)

### Graceful Shutdown
Properly handles SIGTERM/SIGINT for Render deployments
- Closes database connections
- Finishes active requests
- Clean process termination

### Error Handling
Enhanced error logging for Render debugging:
- Detailed error messages in development
- Generic errors in production
- Timestamps and request info

## 📊 Monitoring

### Render Dashboard
- Service health status
- Resource usage (CPU, Memory, Disk)
- Request metrics
- Error logs
- Deployment history

### Custom Endpoints
- `GET /health` - Health status for Render
- `GET /api/health` - API health check
- `GET /` - API information and endpoints

## 🔄 Auto-Deployments

Render automatically deploys when you push to the `main` branch:
1. Push changes to GitHub
2. Render detects changes
3. Runs build command: `cd backend && npm install && npm run init-db`
4. Restarts service with new code
5. Zero downtime (rolling restarts)

## 🛡️ Security Features

- **CORS**: Configured for GitHub Pages and Render
- **Helmet**: Security headers
- **Rate Limiting**: 200 requests per 15 minutes
- **Input Validation**: All endpoints validate input
- **Error Handling**: No sensitive data leaked
- **Environment Variables**: Sensitive data in env vars

## 💰 Cost

**Completely Free:**
- Web Service: $0/month (Free tier)
- Persistent Storage: $0/month (1GB included)
- SSL Certificate: $0/month (included)
- Custom Domain: $0/month (included)
- Bandwidth: $0/month (generous free tier)

**Total Cost: $0/month** 🎉

## 🔗 Links

- [Render Dashboard](https://dashboard.render.com)
- [Render Docs](https://render.com/docs)
- [GitHub Repository](https://github.com/Aimarkas1994/mark-mike-aiprojects)
- [Live Portfolio](https://aimarkas1994.github.io/mark-mike-aiprojects/)

## 🆘 Support

If you encounter issues:
1. Check Render dashboard logs
2. Verify environment variables
3. Ensure persistent storage is mounted
4. Test health endpoint: `/health`
5. Check GitHub Actions deployment status

---

**Built for Render free tier** - Professional hosting at zero cost! 🚀