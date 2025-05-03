// This script initializes the SQLite database for the Farmilusion project.
// It creates a table for products and populates it with some initial data.
// The database file is located at ./src/db/farmilusion.db.
// The script uses the sqlite3 library to interact with the SQLite database.
// It creates a table named 'products' with columns for id, name, material, and weight.

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/farmilusion.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    material TEXT NOT NULL,
    weight REAL NOT NULL
  )`);

  db.run(`DELETE FROM products`);

  const stmt = db.prepare("INSERT INTO products (id, name, material, weight) VALUES (?, ?, ?, ?)");
  stmt.run(1, "Mario", "PLA", 0.100);
  stmt.run(2, "Zelda", "PLA", 0.150);
  stmt.run(3, "Luigi", "PLA", 0.1);
  stmt.finalize();
});

db.close();