const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const database = require('./config/database');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for Render (important for rate limiting)
app.set('trust proxy', true);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration - allow both local development and production
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  'https://aimarkas1994.github.io',
  'https://mark-mike-aiprojects.onrender.com'
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Rate limiting - more relaxed for Render free tier
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Increased limit for Render
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 900
  }
});
app.use('/api/', limiter);

// Body parsing middleware with increased limits for Render
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static file serving (for uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Render health check (they use this for monitoring)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'portfolio-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Import routes
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const contactRoutes = require('./routes/contact');
const blogRoutes = require('./routes/blog');

// Use routes
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Portfolio API Server',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      projects: '/api/projects',
      skills: '/api/skills',
      contact: '/api/contact',
      blog: '/api/blog'
    },
    documentation: 'https://github.com/Aimarkas1994/mark-mike-aiprojects#readme'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Connect to database and start server
async function startServer() {
  try {
    await database.connect();
    console.log('🔗 Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`🚀 Portfolio API server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      
      if (process.env.RENDER_EXTERNAL_URL) {
        console.log(`🎯 Render URL: ${process.env.RENDER_EXTERNAL_URL}`);
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  database.close().then(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  database.close().then(() => {
    process.exit(0);
  });
});

startServer();

module.exports = app;