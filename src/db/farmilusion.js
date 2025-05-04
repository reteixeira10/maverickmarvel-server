const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/farmilusion.db');
db.run('PRAGMA foreign_keys = ON'); //pra deletar os registros filhos quando o pai for deletado

module.exports = db;