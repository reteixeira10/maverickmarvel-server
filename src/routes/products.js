const express = require('express');
const router = express.Router();
const db = require('../db/farmilusion');
const multer = require('multer');
const upload = multer();

// Get all products with only the first photo for each product
router.get('/', async (req, res) => {
  try {
    const productsResult = await db.execute('SELECT * FROM products');
    const products = productsResult.rows;
    if (products.length === 0) return res.json([]);
    const productIds = products.map(p => p.id);

    // Get first photo for each product
    const placeholders = productIds.map(() => '?').join(',');
    const photosResult = await db.execute({
      sql: `
        SELECT p1.*
        FROM productsphotos p1
        INNER JOIN (
          SELECT product_id, MIN(id) as min_id
          FROM productsphotos
          WHERE product_id IN (${placeholders})
          GROUP BY product_id
        ) p2 ON p1.product_id = p2.product_id AND p1.id = p2.min_id
      `,
      args: productIds,
    });
    const photoByProduct = {};
    photosResult.rows.forEach(photo => {
      photoByProduct[photo.product_id] = {
        id: photo.id,
        filename: photo.filename,
        mimetype: photo.mimetype,
        image: `data:${photo.mimetype};base64,${Buffer.from(photo.image).toString('base64')}`
      };
    });
    const result = products.map(product => ({
      ...product,
      photo: photoByProduct[product.id] || null
    }));
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to retrieve products' });
  }
});

// Insert a new product
router.post('/', upload.array('photos'), async (req, res) => {
  const { name, material, weight } = req.body;
  if (!name || !material || !weight) {
    return res.status(400).json({ error: "Name, material, and weight are required." });
  }
  try {
    const result = await db.execute({
      sql: 'INSERT INTO products (name, material, weight) VALUES (?, ?, ?)',
      args: [name, material, weight],
    });
    const productId = result.lastInsertRowid;

    // Save photos if any
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await db.execute({
          sql: 'INSERT INTO productsphotos (product_id, image, filename, mimetype) VALUES (?, ?, ?, ?)',
          args: [productId, file.buffer, file.originalname, file.mimetype],
        });
      }
    }
    // res.status(201).json({ id: productId, name, material, weight }); gera erro
    // res.status(201).json({ id: productId.toString(), name, material, weight });
    //option
    res.status(201).json({ id: Number(productId), name, material, weight });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Delete a product by id
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.execute({
      sql: 'DELETE FROM products WHERE id = ?',
      args: [id],
    });
    if (result.rowsAffected === 0) {
      return res.status(404).json({ error: "Product not found." });
    }
    res.json({ message: "Product deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

module.exports = router;