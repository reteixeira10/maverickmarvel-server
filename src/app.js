require('dotenv').config();
const express = require('express');
const productsRouter = require('./routes/products');
const app = express();

app.use(express.json());
app.use('/api/products', productsRouter);

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});