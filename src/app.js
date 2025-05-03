const express = require('express');
const productsRouter = require('./routes/products');
const app = express();

app.use('/api/products', productsRouter);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});