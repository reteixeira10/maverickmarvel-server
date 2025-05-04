const express = require('express');
const router = express.Router();
const db = require('../db/farmilusion');

// Get all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Insert a new product
router.post('/', (req, res) => {
  const { name, material, weight } = req.body;
  if (!name || !material || !weight) {
    return res.status(400).json({ error: "Name, material, and weight are required." });
  }
  const sql = 'INSERT INTO products (name, material, weight) VALUES (?, ?, ?)';
  db.run(sql, [name, material, weight], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: this.lastID, name, material, weight });
  });
});


// Delete a product by id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM products WHERE id = ?';
  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  });
});

module.exports = router;