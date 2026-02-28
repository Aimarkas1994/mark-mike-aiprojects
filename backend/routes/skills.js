const express = require('express');
const database = require('../config/database');
const router = express.Router();

// Get all skills
router.get('/', async (req, res) => {
  try {
    const db = database.getDb();
    const category = req.query.category;
    
    let query = "SELECT * FROM skills";
    let params = [];
    
    if (category) {
      query += " WHERE category = ?";
      params.push(category);
    }
    
    query += " ORDER BY category, proficiency_level DESC";
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error fetching skills:', err.message);
        return res.status(500).json({ error: 'Failed to fetch skills' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error in skills route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get skill categories
router.get('/categories', async (req, res) => {
  try {
    const db = database.getDb();
    
    db.all("SELECT DISTINCT category FROM skills ORDER BY category", (err, rows) => {
      if (err) {
        console.error('Error fetching categories:', err.message);
        return res.status(500).json({ error: 'Failed to fetch categories' });
      }
      
      const categories = rows.map(row => row.category);
      res.json(categories);
    });
  } catch (error) {
    console.error('Error in categories route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single skill by ID
router.get('/:id', async (req, res) => {
  try {
    const db = database.getDb();
    const id = req.params.id;
    
    db.get("SELECT * FROM skills WHERE id = ?", [id], (err, row) => {
      if (err) {
        console.error('Error fetching skill:', err.message);
        return res.status(500).json({ error: 'Failed to fetch skill' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      
      res.json(row);
    });
  } catch (error) {
    console.error('Error in skill route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new skill
router.post('/', async (req, res) => {
  try {
    const { name, category, proficiency_level, description } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const db = database.getDb();
    const stmt = db.prepare(`
      INSERT INTO skills (name, category, proficiency_level, description)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(
      name,
      category,
      proficiency_level || 1,
      description || null
    , function(err) {
      if (err) {
        console.error('Error creating skill:', err.message);
        return res.status(500).json({ error: 'Failed to create skill' });
      }
      
      res.status(201).json({
        id: this.lastID,
        message: 'Skill created successfully'
      });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in create skill route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update skill
router.put('/:id', async (req, res) => {
  try {
    const { name, category, proficiency_level, description } = req.body;
    const id = req.params.id;
    
    if (!name || !category) {
      return res.status(400).json({ error: 'Name and category are required' });
    }
    
    const db = database.getDb();
    const stmt = db.prepare(`
      UPDATE skills 
      SET name = ?, category = ?, proficiency_level = ?, description = ?
      WHERE id = ?
    `);
    
    stmt.run(
      name,
      category,
      proficiency_level || 1,
      description || null,
      id
    , function(err) {
      if (err) {
        console.error('Error updating skill:', err.message);
        return res.status(500).json({ error: 'Failed to update skill' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      
      res.json({ message: 'Skill updated successfully' });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in update skill route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete skill
router.delete('/:id', async (req, res) => {
  try {
    const db = database.getDb();
    const id = req.params.id;
    
    const stmt = db.prepare("DELETE FROM skills WHERE id = ?");
    stmt.run(id, function(err) {
      if (err) {
        console.error('Error deleting skill:', err.message);
        return res.status(500).json({ error: 'Failed to delete skill' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Skill not found' });
      }
      
      res.json({ message: 'Skill deleted successfully' });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in delete skill route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;