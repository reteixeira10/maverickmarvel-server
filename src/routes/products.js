const express = require('express');
const router = express.Router();
const db = require('../db/farmilusion');
const multer = require('multer');
const upload = multer();

// Get all products with only the first photo for each product
router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, products) => {
    if (err) return res.status(500).json({ error: err.message });
    if (products.length === 0) return res.json([]);
    const productIds = products.map(p => p.id);
    db.all(
      `SELECT p1.*
         FROM productsphotos p1
         INNER JOIN (
           SELECT product_id, MIN(id) as min_id
           FROM productsphotos
           WHERE product_id IN (${productIds.map(() => '?').join(',')})
           GROUP BY product_id
         ) p2 ON p1.product_id = p2.product_id AND p1.id = p2.min_id`,
      productIds,
      (err, photos) => {
        if (err) return res.status(500).json({ error: err.message });
        const photoByProduct = {};
        photos.forEach(photo => {
          photoByProduct[photo.product_id] = {
            id: photo.id,
            filename: photo.filename,
            mimetype: photo.mimetype,
            image: `data:${photo.mimetype};base64,${photo.image.toString('base64')}`
          };
        });
        const result = products.map(product => ({
          ...product,
          photo: photoByProduct[product.id] || null
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