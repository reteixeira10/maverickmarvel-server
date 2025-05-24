// const sqlite3 = require('sqlite3').verbose();
// const db = new sqlite3.Database('./src/db/farmilusion.db');
// db.run('PRAGMA foreign_keys = ON'); //pra deletar os registros filhos quando o pai for deletado

// module.exports = db;

require('dotenv').config();
const { createClient } = require('@libsql/client');

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});


// // --- Turso Client Configuration --- VERSÃO APRIMORADA
// const tursoConfig = {
//   url: process.env.TURSO_DATABASE_URL,
//   authToken: process.env.TURSO_AUTH_TOKEN,
// };

// if (!tursoConfig.url) {
//   console.error("FATAL ERROR: TURSO_DATABASE_URL is not defined.");
//   process.exit(1);
// }
// if (!tursoConfig.authToken && !tursoConfig.url.startsWith("file:")) { // Auth token not needed for local file DBs
//   console.error("FATAL ERROR: TURSO_AUTH_TOKEN is not defined for remote database.");
//   process.exit(1);
// }

// const db = createClient(tursoConfig);


module.exports = db;