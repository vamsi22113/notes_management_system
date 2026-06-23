const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRouter = require('./routers/authRoutes');
const noteRouter = require('./routers/noteRoutes');
require('dotenv').config();

const app = express();

// ── Middlewares ──
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  res.on('finish', () => {
    console.log(`  └─ Status: ${res.statusCode}`);
  });
  next();
});

// ── Routes ──
app.use('/api/auth', authRouter);
app.use('/api/notes', noteRouter);

app.get('/', (req, res) => {
  res.json({ message: 'Notes Manager API is running', port: process.env.PORT || 3450 });
});

// ── MongoDB connection ──
const connectdb = async () => {
  try {
    await mongoose.connect(process.env.mongodb);
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    console.error('\n🔧 Fix: Go to MongoDB Atlas → Network Access → Add your current IP address.\n');
    // Do NOT exit — let the server keep running so you see the error
  }
};

connectdb();

const PORT = process.env.PORT || 3450;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});