const express = require('express');
const database = require('../config/database');
const router = express.Router();

// Get all blog posts
router.get('/', async (req, res) => {
  try {
    const db = database.getDb();
    const published = req.query.published;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    
    let query = "SELECT * FROM blog_posts";
    let params = [];
    
    if (published !== undefined) {
      query += " WHERE published = ?";
      params.push(published === 'true' ? 1 : 0);
    }
    
    query += " ORDER BY created_at DESC LIMIT ? OFFSET ?";
    params.push(limit, offset);
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error fetching blog posts:', err.message);
        return res.status(500).json({ error: 'Failed to fetch blog posts' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error in blog posts route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single blog post by slug or ID
router.get('/:identifier', async (req, res) => {
  try {
    const db = database.getDb();
    const identifier = req.params.identifier;
    
    // Check if identifier is a number (ID) or string (slug)
    const isId = /^\d+$/.test(identifier);
    
    let query, params;
    if (isId) {
      query = "SELECT * FROM blog_posts WHERE id = ?";
      params = [parseInt(identifier)];
    } else {
      query = "SELECT * FROM blog_posts WHERE slug = ?";
      params = [identifier];
    }
    
    db.get(query, params, (err, row) => {
      if (err) {
        console.error('Error fetching blog post:', err.message);
        return res.status(500).json({ error: 'Failed to fetch blog post' });
      }
      
      if (!row) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      res.json(row);
    });
  } catch (error) {
    console.error('Error in blog post route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new blog post
router.post('/', async (req, res) => {
  try {
    const { title, slug, content, excerpt, featured_image, published } = req.body;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ 
        error: 'Title, slug, and content are required' 
      });
    }
    
    // Validate slug format (alphanumeric with hyphens)
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (!slugRegex.test(slug)) {
      return res.status(400).json({ 
        error: 'Slug must contain only lowercase letters, numbers, and hyphens' 
      });
    }
    
    const db = database.getDb();
    
    // Check if slug already exists
    db.get("SELECT id FROM blog_posts WHERE slug = ?", [slug], (err, row) => {
      if (err) {
        console.error('Error checking slug:', err.message);
        return res.status(500).json({ error: 'Failed to create blog post' });
      }
      
      if (row) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      
      const stmt = db.prepare(`
        INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, published)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        title,
        slug,
        content,
        excerpt || null,
        featured_image || null,
        published ? 1 : 0
      , function(err) {
        if (err) {
          console.error('Error creating blog post:', err.message);
          return res.status(500).json({ error: 'Failed to create blog post' });
        }
        
        res.status(201).json({
          id: this.lastID,
          message: 'Blog post created successfully'
        });
      });
      
      stmt.finalize();
    });
  } catch (error) {
    console.error('Error in create blog post route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update blog post
router.put('/:id', async (req, res) => {
  try {
    const { title, slug, content, excerpt, featured_image, published } = req.body;
    const id = req.params.id;
    
    if (!title || !slug || !content) {
      return res.status(400).json({ 
        error: 'Title, slug, and content are required' 
      });
    }
    
    const db = database.getDb();
    
    // Check if slug already exists (excluding current post)
    db.get("SELECT id FROM blog_posts WHERE slug = ? AND id != ?", [slug, id], (err, row) => {
      if (err) {
        console.error('Error checking slug:', err.message);
        return res.status(500).json({ error: 'Failed to update blog post' });
      }
      
      if (row) {
        return res.status(400).json({ error: 'Slug already exists' });
      }
      
      const stmt = db.prepare(`
        UPDATE blog_posts 
        SET title = ?, slug = ?, content = ?, excerpt = ?, 
            featured_image = ?, published = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `);
      
      stmt.run(
        title,
        slug,
        content,
        excerpt || null,
        featured_image || null,
        published ? 1 : 0,
        id
      , function(err) {
        if (err) {
          console.error('Error updating blog post:', err.message);
          return res.status(500).json({ error: 'Failed to update blog post' });
        }
        
        if (this.changes === 0) {
          return res.status(404).json({ error: 'Blog post not found' });
        }
        
        res.json({ message: 'Blog post updated successfully' });
      });
      
      stmt.finalize();
    });
  } catch (error) {
    console.error('Error in update blog post route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete blog post
router.delete('/:id', async (req, res) => {
  try {
    const db = database.getDb();
    const id = req.params.id;
    
    const stmt = db.prepare("DELETE FROM blog_posts WHERE id = ?");
    stmt.run(id, function(err) {
      if (err) {
        console.error('Error deleting blog post:', err.message);
        return res.status(500).json({ error: 'Failed to delete blog post' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      res.json({ message: 'Blog post deleted successfully' });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in delete blog post route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle publish status
router.patch('/:id/publish', async (req, res) => {
  try {
    const db = database.getDb();
    const id = req.params.id;
    const { published } = req.body;
    
    const stmt = db.prepare(`
      UPDATE blog_posts 
      SET published = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    
    stmt.run(
      published ? 1 : 0,
      id
    , function(err) {
      if (err) {
        console.error('Error updating publish status:', err.message);
        return res.status(500).json({ error: 'Failed to update publish status' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Blog post not found' });
      }
      
      res.json({ 
        message: `Blog post ${published ? 'published' : 'unpublished'} successfully` 
      });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in publish route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;