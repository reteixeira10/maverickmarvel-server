// This script initializes the SQLite database for the MaverickMarvel project.
// It creates the necessary tables for products and product photos.
// Run this script once to set up the database schema.

// A PRIORI TEM QUE EXECUTAR ESSE ARQUIVO NA UNHA UMA VEZ QUANDO FAZER O DEPLOYMENT COMO O COMANDO NO SSH DO SERVER
//node src/db/init.js OU npm run init-db
//You only need to do this once, unless you change your schema.

//OBSOLETO


const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/farmilusion.db');

// Enable foreign key constraints
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  // Create products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      material TEXT NOT NULL,
      weight REAL NOT NULL
    )
  `);

  // Create productsphotos table with ON DELETE CASCADE
  db.run(`
    CREATE TABLE IF NOT EXISTS productsphotos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image BLOB NOT NULL,
      filename TEXT,
      mimetype TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    )
  `);
});

db.close();