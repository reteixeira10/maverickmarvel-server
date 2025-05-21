require('dotenv').config();
const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');

const app = express();

const PORT = process.env.PORT || 5001;

// --- CORS Configuration ---
const frontendUrlFromEnv = process.env.FRONTEND_URL; // Get it once

// Log for debugging what your server sees from Render's environment
console.log(`[CORS Setup] FRONTEND_URL from environment: ${frontendUrlFromEnv}`);

const allowedOrigins = [
  frontendUrlFromEnv, // For your Render.com frontend
  'http://localhost:3000', // Common default for local React dev
  'http://localhost:5173'  // Common default for local Vite/React dev
].filter(Boolean); // filter(Boolean) removes undefined/null if FRONTEND_URL isn't set

console.log(`[CORS Setup] Allowed origins configured: ${allowedOrigins.join(', ') || 'NONE (Check FRONTEND_URL env var!)'}`);

const corsOptions = {
  origin: function (origin, callback) {
    // If there's no origin (e.g., server-to-server, curl, Render health check), allow it.
    // Browsers will always send an Origin header for actual cross-origin requests.
    if (!origin) {
      // console.log('[CORS] Request without origin header allowed (e.g., health check or server-to-server)');
      return callback(null, true);
    }

    // If an origin is present, check if it's in the allowed list.
    if (allowedOrigins.includes(origin)) {
      // console.log(`[CORS] Origin ${origin} allowed.`);
      callback(null, true);
    } else {
      console.error(`[CORS Error] Origin ${origin} not allowed. Allowed origins list: [${allowedOrigins.join(', ')}]`);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  }
};

app.use(cors(corsOptions));

// --- Other Middleware ---
app.use(express.json());

// --- Routes ---
app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
  res.send('Maverick Marvel Server is running!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});