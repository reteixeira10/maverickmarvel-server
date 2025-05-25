require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path'); // <<< NEW: Required for path manipulation to serve static files
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

// --- NEW: Serve static files from the React build directory ---
// This assumes your React app builds to a 'build' folder
// within a 'client' folder at the root of your project.
// E.g., your project structure is:
// - your-repo/
//   - app.js  (this file)
//   - routes/
//   - client/          (your React app folder)
//     - build/         (the output of `npm run build` in your React app)
//       - index.html
//       - static/
//       - ...
//
// If your `app.js` is in a subfolder (e.g., 'server'), and 'client' is its sibling,
// you might need `path.join(__dirname, '..', 'client', 'build')`.
// Adjust `client/build` if your React build output directory is named differently
// (e.g., 'dist') or located elsewhere.
const reactBuildPath = path.join(__dirname, '..', 'client', 'build');

app.use(express.static(reactBuildPath));
console.log(`[Server] Serving static React files from: ${reactBuildPath}`);


// --- Routes ---
// IMPORTANT: API routes MUST come BEFORE the catch-all route for the SPA.
// If the catch-all came first, it would serve index.html for API requests too.
app.use('/api/products', productsRouter);

app.get('/', (req, res) => {
  // This route might still be hit if someone goes directly to '/',
  // but it's generally superseded by the static `index.html` being served
  // if `express.static` is configured correctly for the root.
  // For an SPA, the root 'index.html' is what's generally expected.
  // The catch-all below will also handle it.
  res.send('Maverick Marvel Server is running!');
});

// --- NEW: Catch-all route for SPA client-side routing ---
// For any GET request that hasn't been handled by a static file (e.g., /main.js)
// or an explicit API route (e.g., /api/products),
// send back the React app's `index.html` file.
// This allows React Router to take over and handle client-side routes like `/products`,
// `/about`, etc., when a user directly accesses or reloads those URLs.
app.get('*', (req, res) => {
  // Use path.resolve to ensure the path is absolute and correct across operating systems
  res.sendFile(path.resolve(reactBuildPath, 'index.html'));
  console.log(`[Server] Served index.html for unknown route: ${req.originalUrl}`);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}.`);
});