const express = require('express');
const router = express.Router();
const db = require('../db/farmilusion');
const multer = require('multer');
const upload = multer();

// Get all products
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    if (products.length === 0) return res.json([]);
    const productIds = products.map(p => p.id);
    db.all(
      `SELECT * FROM productsphotos WHERE product_id IN (${productIds.map(() => '?').join(',')})`,
      productIds,
      (err, photos) => {
        if (err) return res.status(500).json({ error: err.message });
        const photosByProduct = {};
        photos.forEach(photo => {
          if (!photosByProduct[photo.product_id]) photosByProduct[photo.product_id] = [];
          photosByProduct[photo.product_id].push({
            id: photo.id,
            filename: photo.filename,
            mimetype: photo.mimetype,
            image: `data:${photo.mimetype};base64,${photo.image.toString('base64')}`
          });
        });
        const result = products.map(product => ({
          ...product,
          photos: photosByProduct[product.id] || []
        }));
        res.json(result);
      }
    );
  });
});

// Insert a new product
router.post('/', upload.array('photos'), (req, res) => {
  const { name, material, weight } = req.body;
  if (!name || !material || !weight) {
    return res.status(400).json({ error: "Name, material, and weight are required." });
  }
  const sql = 'INSERT INTO products (name, material, weight) VALUES (?, ?, ?)';
  db.run(sql, [name, material, weight], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    const productId = this.lastID;
    // Save photos if any
    if (req.files && req.files.length > 0) {
      const photoSql = 'INSERT INTO productsphotos (product_id, image, filename, mimetype) VALUES (?, ?, ?, ?)';
      const stmt = db.prepare(photoSql);
      req.files.forEach(file => {
        stmt.run(productId, file.buffer, file.originalname, file.mimetype);
      });
      stmt.finalize();
    }
    res.status(201).json({ id: productId, name, material, weight });
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