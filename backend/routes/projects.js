const express = require('express');
const database = require('../config/database');
const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    const db = database.getDb();
    const featured = req.query.featured === 'true' ? 1 : 0;
    
    let query = "SELECT * FROM projects WHERE 1=1";
    let params = [];
    
    if (req.query.featured) {
      query += " AND featured = ?";
      params.push(featured);
    }
    
    query += " ORDER BY featured DESC, created_at DESC";
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error fetching projects:', err.message);
        return res.status(500).json({ error: 'Failed to fetch projects' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error in projects route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const db = database.getDb();
    const id = req.params.id;
    
    db.get("SELECT * FROM projects WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error('Error fetching project:', err.message);
        return res.status(500).json({ error: 'Failed to fetch project' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json(row);
    });
  } catch (error) {
    console.error('Error in project route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    const { title, description, technologies, github_url, live_url, image_url, featured } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const db = database.getDb();
    const stmt = db.prepare(`
      INSERT INTO projects (title, description, technologies, github_url, live_url, image_url, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      title,
      description,
      technologies || null,
      github_url || null,
      live_url || null,
      image_url || null,
      featured ? 1 : 0
    , function(err) {
      if (err) {
        console.error('Error creating project:', err.message);
        return res.status(500).json({ error: 'Failed to create project' });
      }
      
      res.status(201).json({
        id: this.lastID,
        message: 'Project created successfully'
      });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in create project route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { title, description, technologies, github_url, live_url, image_url, featured } = req.body;
    const id = req.params.id;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const db = database.getDb();
    const stmt = db.prepare(`
      UPDATE projects 
      SET title = ?, description = ?, technologies = ?, github_url = ?, 
          live_url = ?, image_url = ?, featured = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      title,
      description,
      technologies || null,
      github_url || null,
      live_url || null,
      image_url || null,
      featured ? 1 : 0,
      id
    , function(err) {
      if (err) {
        console.error('Error updating project:', err.message);
        return res.status(500).json({ error: 'Failed to update project' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json({ message: 'Project updated successfully' });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in update project route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const db = database.getDb();
    const id = req.params.id;
    
    const stmt = db.prepare("DELETE FROM projects WHERE id = ?");
    stmt.run(id, function(err) {
      if (err) {
        console.error('Error deleting project:', err.message);
        return res.status(500).json({ error: 'Failed to delete project' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      res.json({ message: 'Project deleted successfully' });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in delete project route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;