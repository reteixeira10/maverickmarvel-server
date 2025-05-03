// const express = require('express');
// const router = express.Router();

// router.get('/', (req, res) => {
//   res.json([
//       {
//         id: 1,
//         name: "Mario",
//         material: "PLA",
//         weight: 0.100
//       },
//       {
//         id: 2,
//         name: "Zelda",
//         material: "PLA",
//         weight: 0.150
//       },
//       {
//         id: 3,
//         name: "Luigi",
//         material: "PLA",
//         weight: 0.1
//       }
// ]);
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const db = require('../db/farmilusion');

router.get('/', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

module.exports = router;