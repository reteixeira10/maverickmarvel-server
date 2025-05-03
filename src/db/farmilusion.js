const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/farmilusion.db');

module.exports = db;