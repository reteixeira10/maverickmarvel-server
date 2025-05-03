const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
      {
        id: 1,
        name: "Mario",
        material: "PLA",
        weight: 0.100
      },
      {
        id: 2,
        name: "Zelda",
        material: "PLA",
        weight: 0.150
      },
      {
        id: 3,
        name: "Luigi",
        material: "PLA",
        weight: 0.1
      }
]);
});

module.exports = router;