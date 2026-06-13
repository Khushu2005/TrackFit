// backend/src/app.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./Routes/auth.routes');

const app = express();

// --- STRICT CORS SETUP ---
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local Development (Vite default port)
    'https://trackfit-p6zp.onrender.com' // Tera Render wala PWA link (add your exact frontend live link here)
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Sirf ye methods allowed hain
  credentials: true, // Agar future me cookies/sessions use karne ho toh ye zaroori hai
  optionsSuccessStatus: 200
};

// CORS Middleware Apply kar diya
app.use(cors(corsOptions));

app.use(express.json());

// Routes Mount
app.use('/api/auth', authRoutes);

// Base route for testing
app.get('/', (req, res) => {
  res.send('TrackFit API is running smoothly.');
});

module.exports = app;