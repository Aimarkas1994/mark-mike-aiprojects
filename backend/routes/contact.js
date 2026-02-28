const express = require('express');
const database = require('../config/database');
const router = express.Router();

// Get all contact messages (admin use)
router.get('/', async (req, res) => {
  try {
    const db = database.getDb();
    const is_read = req.query.is_read;
    
    let query = "SELECT * FROM contact_messages";
    let params = [];
    
    if (is_read !== undefined) {
      query += " WHERE is_read = ?";
      params.push(is_read === 'true' ? 1 : 0);
    }
    
    query += " ORDER BY created_at DESC";
    
    db.all(query, params, (err, rows) => {
      if (err) {
        console.error('Error fetching contact messages:', err.message);
        return res.status(500).json({ error: 'Failed to fetch contact messages' });
      }
      res.json(rows);
    });
  } catch (error) {
    console.error('Error in contact messages route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new contact message
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Name, email, and message are required' 
      });
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    
    const db = database.getDb();
    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, subject, message, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      name,
      email,
      subject || null,
      message,
      req.ip || null,
      req.get('User-Agent') || null
    , function(err) {
      if (err) {
        console.error('Error creating contact message:', err.message);
        return res.status(500).json({ error: 'Failed to create contact message' });
      }
      
      res.status(201).json({
        id: this.lastID,
        message: 'Contact message sent successfully'
      });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in create contact message route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Mark contact message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const db = database.getDb();
    const id = req.params.id;
    
    const stmt = db.prepare(`
      UPDATE contact_messages 
      SET is_read = 1 
      WHERE id = ?
    `);
    
    stmt.run(id, function(err) {
      if (err) {
        console.error('Error marking message as read:', err.message);
        return res.status(500).json({ error: 'Failed to mark message as read' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Contact message not found' });
      }
      
      res.json({ message: 'Message marked as read' });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in mark as read route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete contact message
router.delete('/:id', async (req, res) => {
  try {
    const db = database.getDb();
    const id = req.params.id;
    
    const stmt = db.prepare("DELETE FROM contact_messages WHERE id = ?");
    stmt.run(id, function(err) {
      if (err) {
        console.error('Error deleting contact message:', err.message);
        return res.status(500).json({ error: 'Failed to delete contact message' });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Contact message not found' });
      }
      
      res.json({ message: 'Contact message deleted successfully' });
    });
    
    stmt.finalize();
  } catch (error) {
    console.error('Error in delete contact message route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get contact statistics
router.get('/stats', async (req, res) => {
  try {
    const db = database.getDb();
    
    // Get total messages
    db.get("SELECT COUNT(*) as total FROM contact_messages", (err, totalRow) => {
      if (err) {
        console.error('Error getting total messages:', err.message);
        return res.status(500).json({ error: 'Failed to get statistics' });
      }
      
      // Get unread messages
      db.get("SELECT COUNT(*) as unread FROM contact_messages WHERE is_read = 0", (err, unreadRow) => {
        if (err) {
          console.error('Error getting unread messages:', err.message);
          return res.status(500).json({ error: 'Failed to get statistics' });
        }
        
        // Get recent messages (last 7 days)
        db.get(`
          SELECT COUNT(*) as recent 
          FROM contact_messages 
          WHERE created_at >= datetime('now', '-7 days')
        `, (err, recentRow) => {
          if (err) {
            console.error('Error getting recent messages:', err.message);
            return res.status(500).json({ error: 'Failed to get statistics' });
          }
          
          res.json({
            total: totalRow.total,
            unread: unreadRow.unread,
            recent: recentRow.recent
          });
        });
      });
    });
  } catch (error) {
    console.error('Error in contact stats route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;