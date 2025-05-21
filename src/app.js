require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <<<< 1. Import cors at the top
const productsRouter = require('./routes/products');

const app = express();

const PORT = process.env.PORT || 5001; // Render will set process.env.PORT

// --- CORS Configuration ---
// This should come BEFORE your routes
const allowedOrigins = [
  process.env.FRONTEND_URL,                 // For your Render.com frontend (set this in Render's env vars)
  'http://localhost:3000',                // Common default for local React dev
  'http://localhost:5173'                 // Common default for local Vite/React dev
  // Add any other local development origins if needed
].filter(Boolean); // filter(Boolean) removes any undefined/null if FRONTEND_URL isn't set locally

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests) during development or if explicitly allowed
    // For production, you might want to be stricter and only allow if origin is in allowedOrigins
    if (process.env.NODE_ENV !== 'production' && !origin) {
      return callback(null, true);
    }
    if (allowedOrigins.length === 0 && process.env.NODE_ENV !== 'production') {
        // Fallback to allow all if no FRONTEND_URL is set and in development (be cautious)
        // console.warn("CORS: Allowing all origins because FRONTEND_URL is not set and not in production.");
        return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // console.error(`CORS Error: Origin ${origin} not allowed.`); // Log the blocked origin for debugging
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  }
};

app.use(cors(corsOptions)); // <<<< 2. Use cors middleware with specific options BEFORE routes

// --- Other Middleware ---
app.use(express.json()); // For parsing application/json

// --- Routes ---
app.use('/api/products', productsRouter); // Your product routes

// Simple root route for health checks or basic info
app.get('/', (req, res) => {
  res.send('Maverick Marvel Server is running!');
});

app.listen(PORT, () => {
  // Important: In production on Render, it won't be localhost.
  // Render exposes the app on its own network structure.
  // This console log is mostly for local verification.
  console.log(`Server running on port ${PORT}. Access locally if applicable.`);
});