require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const seedDB = require('./seed');
const User = require('./models/User');
const { initCron } = require('./services/cronService');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const offerRoutes = require('./routes/offerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// DB Middleware for Serverless Environment
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('DB Connection error in middleware:', err);
    next(err);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'LEMON ELEGANCE PMS Backend API',
    tagline: 'Your Beauty, Our Care',
    timestamp: new Date(),
  });
});

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Connect DB, Auto Seed if Empty & Start Server when executed directly
if (process.env.VERCEL !== '1') {
  connectDB().then(async () => {
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('[Server Startup] Database empty. Triggering automatic database seeder...');
        await seedDB(false);
      } else {
        console.log(`[Server Startup] Database ready with ${userCount} registered users.`);
      }
    } catch (e) {
      console.log('Auto seed check skipped:', e.message);
    }

    app.listen(PORT, () => {
      console.log(`=================================================`);
      console.log(`  ✨ LEMON ELEGANCE PMS Backend Server Running  `);
      console.log(`  📍 Port: ${PORT}`);
      console.log(`  🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=================================================`);
      
      initCron();
    });
  });
}

module.exports = app;
