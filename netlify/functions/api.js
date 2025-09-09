const serverless = require('serverless-http');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { initDatabase } = require('../../config/database');

// Import routes
const expenseRoutes = require('../../src/routes/expenseRoutes');
const userRoutes = require('../../src/routes/userRoutes');

const app = express();

// Middleware
app.use(morgan('combined')); // Logging
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes - Netlify Functions automatically handle the /.netlify/functions/api prefix
app.use('/', expenseRoutes);
app.use('/', userRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Initialize database
let dbInitialized = false;
const initializeDatabase = async () => {
  if (!dbInitialized) {
    try {
      await initDatabase();
      dbInitialized = true;
      console.log('Database initialized successfully');
    } catch (error) {
      console.error('Failed to initialize database:', error);
      // Don't throw error - let API work without database for testing
      console.log('API will continue without database connection');
    }
  }
};

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Expense Tracker API is running on Netlify Functions',
    timestamp: new Date().toISOString(),
    database: dbInitialized ? 'Connected' : 'Not Connected'
  });
});

// Serverless handler
const handler = serverless(app, {
  binary: false
});

module.exports.handler = async (event, context) => {
  // Set execution context for serverless
  context.callbackWaitsForEmptyEventLoop = false;
  
  // Initialize database on first request (non-blocking)
  initializeDatabase().catch(console.error);
  
  // Handle the request
  return await handler(event, context);
};
