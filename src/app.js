require('dotenv').config();
const express = require('express');
const productsRouter = require('./routes/products');
const app = express();

app.use(express.json());
app.use('/api/products', productsRouter);

//const PORT = 5001;
const PORT = process.env.PORT || 5001; // Render will set process.env.PORT

// Example: CORS configuration (CRITICAL for frontend communication)
const cors = require('cors');
app.use(cors({
  origin: '*' // For development. In production, restrict this to your frontend's URL
}));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});