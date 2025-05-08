-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  material TEXT NOT NULL,
  weight REAL NOT NULL
);

-- Create productsphotos table with ON DELETE CASCADE
CREATE TABLE IF NOT EXISTS productsphotos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  image BLOB NOT NULL,
  filename TEXT,
  mimetype TEXT,
  FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
);