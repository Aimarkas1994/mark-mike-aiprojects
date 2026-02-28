const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    // For Render, use persistent storage path
    const renderDataDir = process.env.RENDER_EXTERNAL_PATH || '/opt/render/project/backend';
    this.dbPath = path.join(renderDataDir, 'database.sqlite');
    this.db = null;
    
    // Ensure the directory exists
    const fs = require('fs');
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error connecting to database:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          resolve();
        }
      });
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      const createTables = [
        // Projects table
        `CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          technologies TEXT,
          github_url TEXT,
          live_url TEXT,
          image_url TEXT,
          featured BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Skills table
        `CREATE TABLE IF NOT EXISTS skills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          proficiency_level INTEGER DEFAULT 1,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Contact messages table
        `CREATE TABLE IF NOT EXISTS contact_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT NOT NULL,
          subject TEXT,
          message TEXT NOT NULL,
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          is_read BOOLEAN DEFAULT 0
        )`,

        // Blog posts table
        `CREATE TABLE IF NOT EXISTS blog_posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          content TEXT NOT NULL,
          excerpt TEXT,
          featured_image TEXT,
          published BOOLEAN DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Blog categories table
        `CREATE TABLE IF NOT EXISTS blog_categories (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          slug TEXT UNIQUE NOT NULL,
          description TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,

        // Project tags table
        `CREATE TABLE IF NOT EXISTS project_tags (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT UNIQUE NOT NULL,
          color TEXT DEFAULT '#007bff',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`
      ];

      let completed = 0;
      const totalTables = createTables.length;

      createTables.forEach((sql, index) => {
        this.db.run(sql, (err) => {
          if (err) {
            console.error(`Error creating table ${index}:`, err.message);
            reject(err);
          } else {
            completed++;
            if (completed === totalTables) {
              console.log(`✅ Created ${totalTables} database tables`);
              resolve();
            }
          }
        });
      });
    });
  }

  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err.message);
          } else {
            console.log('✅ Database connection closed');
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  getDb() {
    return this.db;
  }
}

// Create singleton instance
const database = new Database();

module.exports = database;