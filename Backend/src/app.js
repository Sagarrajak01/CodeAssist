const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const repoRoutes = require('./routes/repoRoutes')
const chatRoutes = require('./routes/chatRoutes');
const axios = require('axios');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Request Parsing Middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Logging Middleware 
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/repos', repoRoutes)
app.use('/api/v1/chat', chatRoutes);

// Unhandled Route & Global Error Handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;