const database = require('../config/database');

async function initDatabase() {
  try {
    await database.connect();
    await database.init();
    console.log('🎉 Database initialization completed successfully!');
    
    // Insert some sample data if tables are empty
    const db = database.getDb();
    
    // Check if projects table is empty
    db.get("SELECT COUNT(*) as count FROM projects", (err, row) => {
      if (err) {
        console.error('Error checking projects count:', err.message);
        return;
      }
      
      if (row.count === 0) {
        console.log('📝 Inserting sample project data...');
        const sampleProjects = [
          {
            title: 'Professional Portfolio Website',
            description: 'A modern, responsive portfolio website built with HTML5, CSS3, and JavaScript, featuring GitHub API integration and professional sections.',
            technologies: 'HTML5, CSS3, JavaScript, GitHub API',
            github_url: 'https://github.com/Aimarkas1994/mark-mike-aiprojects',
            live_url: 'https://aimarkas1994.github.io/mark-mike-aiprojects/',
            featured: 1
          },
          {
            title: 'Full-Stack Portfolio API',
            description: 'RESTful API backend for portfolio management with database integration, built with Node.js, Express, and SQLite.',
            technologies: 'Node.js, Express, SQLite, REST API',
            github_url: 'https://github.com/Aimarkas1994/mark-mike-aiprojects',
            featured: 1
          }
        ];
        
        const stmt = db.prepare("INSERT INTO projects (title, description, technologies, github_url, live_url, featured) VALUES (?, ?, ?, ?, ?, ?)");
        sampleProjects.forEach(project => {
          stmt.run(project.title, project.description, project.technologies, project.github_url, project.live_url, project.featured);
        });
        stmt.finalize();
        console.log('✅ Sample projects inserted');
      }
    });
    
    // Check if skills table is empty
    db.get("SELECT COUNT(*) as count FROM skills", (err, row) => {
      if (err) {
        console.error('Error checking skills count:', err.message);
        return;
      }
      
      if (row.count === 0) {
        console.log('📝 Inserting sample skills data...');
        const sampleSkills = [
          { name: 'JavaScript', category: 'Frontend', proficiency_level: 4, description: 'Modern ES6+ JavaScript' },
          { name: 'React', category: 'Frontend', proficiency_level: 4, description: 'Building interactive user interfaces' },
          { name: 'Node.js', category: 'Backend', proficiency_level: 4, description: 'Server-side JavaScript runtime' },
          { name: 'Express.js', category: 'Backend', proficiency_level: 4, description: 'Web application framework' },
          { name: 'HTML5/CSS3', category: 'Frontend', proficiency_level: 5, description: 'Modern web markup and styling' },
          { name: 'Git/GitHub', category: 'Tools', proficiency_level: 4, description: 'Version control and collaboration' },
          { name: 'API Development', category: 'Backend', proficiency_level: 3, description: 'RESTful API design and implementation' },
          { name: 'Database Design', category: 'Backend', proficiency_level: 3, description: 'SQL database schema design' }
        ];
        
        const stmt = db.prepare("INSERT INTO skills (name, category, proficiency_level, description) VALUES (?, ?, ?, ?)");
        sampleSkills.forEach(skill => {
          stmt.run(skill.name, skill.category, skill.proficiency_level, skill.description);
        });
        stmt.finalize();
        console.log('✅ Sample skills inserted');
      }
    });
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  } finally {
    await database.close();
  }
}

// Run initialization if this script is executed directly
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;