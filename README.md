# Mark's Full-Stack Portfolio

A modern, responsive portfolio website with a RESTful API backend, built with HTML5, CSS3, JavaScript, and Node.js/Express.

## 🚀 Features

### Frontend Features
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional design with smooth animations
- **Dynamic Content**: Loads projects, skills, and data from API
- **Contact Form**: Functional contact form with validation
- **GitHub Integration**: Displays live GitHub statistics and repositories
- **Smooth Navigation**: Smooth scrolling between sections
- **Mobile-Friendly**: Fully responsive mobile navigation

### Backend Features
- **RESTful API**: Complete API with CRUD operations
- **Database**: SQLite database with proper schema
- **Projects Management**: Create, read, update, delete portfolio projects
- **Skills Management**: Organize skills by category with proficiency levels
- **Contact System**: Handle and manage contact form submissions
- **Blog System**: Full blog post management with draft/published states
- **Security**: Rate limiting, CORS, helmet security headers
- **Error Handling**: Comprehensive error handling and logging

## 📁 Project Structure

```
├── backend/                 # Node.js/Express backend
│   ├── config/             # Database configuration
│   ├── routes/             # API route handlers
│   ├── scripts/            # Database initialization scripts
│   ├── server.js           # Main server file
│   ├── package.json        # Dependencies and scripts
│   └── README.md           # Backend documentation
├── docs/                   # Frontend (GitHub Pages)
│   ├── index.html          # Main portfolio page
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   └── assets/             # Images and static assets
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with animations
- **JavaScript (ES6+)**: Dynamic functionality and API integration
- **Font Awesome**: Icon library
- **Google Fonts**: Typography

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **SQLite**: Database
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security middleware
- **Rate Limiting**: API protection

## 🚀 Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Initialize database:**
   ```bash
   npm run init-db
   ```

5. **Start the server:**
   ```bash
   # Development mode (with hot reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The backend server will run on `http://localhost:3001`

### Frontend Setup

The frontend is designed to be served via GitHub Pages:

1. **Configure API base URL:**
   Edit `docs/js/api-client.js` and update the `baseURL` to point to your deployed backend.

2. **Serve locally (optional):**
   ```bash
   # Use any static server
   npx serve docs/
   
   # Or Python's built-in server
   cd docs && python -m http.server 3000
   ```

3. **Deploy to GitHub Pages:**
   - The `docs/` directory is configured for GitHub Pages
   - Push to your repository and enable GitHub Pages in repository settings

## 📡 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Health Check
- `GET /health` - Server health status

#### Projects
- `GET /projects` - Get all projects
- `GET /projects?featured=true` - Get featured projects
- `GET /projects/:id` - Get single project
- `POST /projects` - Create new project
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

#### Skills
- `GET /skills` - Get all skills
- `GET /skills/categories` - Get skill categories
- `GET /skills?category=Frontend` - Get skills by category
- `GET /skills/:id` - Get single skill
- `POST /skills` - Create new skill
- `PUT /skills/:id` - Update skill
- `DELETE /skills/:id` - Delete skill

#### Contact
- `GET /contact` - Get all contact messages (admin)
- `GET /contact/stats` - Get contact statistics
- `POST /contact` - Submit contact form
- `PATCH /contact/:id/read` - Mark message as read
- `DELETE /contact/:id` - Delete contact message

#### Blog
- `GET /blog` - Get all blog posts
- `GET /blog/:slug` - Get blog post by slug
- `GET /blog/:id` - Get blog post by ID
- `POST /blog` - Create new blog post
- `PUT /blog/:id` - Update blog post
- `DELETE /blog/:id` - Delete blog post
- `PATCH /blog/:id/publish` - Toggle publish status

## 🗄️ Database Schema

The API uses SQLite with the following tables:

### Projects
```sql
CREATE TABLE projects (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  technologies TEXT,
  github_url TEXT,
  live_url TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Skills
```sql
CREATE TABLE skills (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  proficiency_level INTEGER DEFAULT 1,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Contact Messages
```sql
CREATE TABLE contact_messages (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT 0
);
```

### Blog Posts
```sql
CREATE TABLE blog_posts (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## 🌐 Deployment

### Backend Deployment Options

1. **Vercel**: Deploy the backend as a serverless function
2. **Heroku**: Traditional Node.js deployment
3. **AWS Lambda**: Serverless deployment
4. **DigitalOcean/Any VPS**: Traditional server deployment

### Frontend Deployment

The frontend is designed for GitHub Pages:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add full-stack portfolio"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to repository settings
   - Enable GitHub Pages
   - Select `docs/` folder as source

3. **Update API URL:**
   - Edit `docs/js/api-client.js`
   - Change `baseURL` to your deployed backend URL

## 🔄 Development Workflow

### Adding New Projects

1. **Via API:**
   ```bash
   curl -X POST http://localhost:3001/api/projects \
     -H "Content-Type: application/json" \
     -d '{
       "title": "Project Name",
       "description": "Project description",
       "technologies": "React, Node.js, MongoDB",
       "github_url": "https://github.com/user/repo",
       "live_url": "https://project-demo.com",
       "featured": true
     }'
   ```

2. **Via Database:**
   ```bash
   cd backend
   node -e "const db = require('./config/database');"
   ```

### Adding New Skills

```bash
curl -X POST http://localhost:3001/api/skills \
  -H "Content-Type: application/json" \
  -d '{
    "name": "JavaScript",
    "category": "Frontend",
    "proficiency_level": 4,
    "description": "Modern ES6+ JavaScript"
  }'
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_PATH=./database.sqlite
```

## 🐛 Troubleshooting

### Common Issues

1. **Database connection errors:**
   - Run `npm run init-db` to create the database
   - Check database file permissions

2. **CORS errors:**
   - Update `FRONTEND_URL` in `.env`
   - Ensure frontend and backend URLs match

3. **API not responding:**
   - Check if backend server is running
   - Verify port is not already in use

4. **Frontend not loading data:**
   - Check browser console for errors
   - Verify API base URL is correct
   - Ensure backend is running and accessible

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Mark - [GitHub](https://github.com/Aimarkas1994)

---

Built with ❤️ by Mark & Mike