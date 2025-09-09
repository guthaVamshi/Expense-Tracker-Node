const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '0000',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
  max: 10
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Successfully connected to PostgreSQL database');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Error connecting to PostgreSQL database:', err.message);
    console.log('💡 Tips for fixing database connection:');
    console.log('   - Make sure PostgreSQL is running');
    console.log('   - Check database credentials in .env file');
    console.log('   - Verify the database exists');
    console.log('   - For local development, you might need to create the database first');
    return false;
  }
};

// Create tables if they don't exist
const initDatabase = async () => {
  // First test the connection
  const isConnected = await testConnection();
  if (!isConnected) {
    throw new Error('Cannot initialize database: connection failed');
  }

  const client = await pool.connect();
  try {
    console.log('🔧 Initializing database tables...');
    
    // Create Users table (compatible with Java backend)
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'USER'
      )
    `);

    // Create Expenses table (compatible with Java backend)
    await client.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id SERIAL PRIMARY KEY,
        expense VARCHAR(100) NOT NULL,
        expense_type VARCHAR(50) NOT NULL,
        expense_amount VARCHAR(20) NOT NULL,
        payment_method VARCHAR(50),
        date DATE DEFAULT CURRENT_DATE
      )
    `);

    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing database tables:', err.message);
    throw err;
  } finally {
    client.release();
  }
};

module.exports = { pool, initDatabase, testConnection };
