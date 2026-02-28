# Portfolio Backend API

A RESTful API backend for the Mark portfolio website, built with Node.js, Express, and SQLite.

## Features

- **Projects Management**: CRUD operations for portfolio projects
- **Skills Management**: Organize skills by category and proficiency level
- **Contact Form**: Handle contact messages with validation
- **Blog System**: Full blog post management with draft/published states
- **Security**: Rate limiting, CORS, helmet security headers
- **Database**: SQLite for easy deployment and development

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

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

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create environment file:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Initialize database:
   ```bash
   npm run init-db
   ```

4. Start server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Database Schema

The API uses SQLite with the following tables:

- `projects` - Portfolio projects
- `skills` - Technical skills with categories
- `contact_messages` - Contact form submissions
- `blog_posts` - Blog articles with draft/published states
- `blog_categories` - Blog categories
- `project_tags` - Project tags

## Sample Data

The database initialization includes sample projects and skills to get you started.

## Development

The server runs on port 3001 by default and includes:
- Hot reload with nodemon
- CORS configuration for frontend development
- Error handling and logging
- Rate limiting for API protection

## Deployment

This backend is designed to be deployed alongside the frontend portfolio. For production:

1. Set `NODE_ENV=production` in environment
2. Use a production database (can still be SQLite for small sites)
3. Configure appropriate rate limiting
4. Set up proper CORS origins
5. Add any required authentication for admin routes