#!/usr/bin/env node

const { Pool } = require('pg');

// Connection for creating database (connects to default 'postgres' database)
const createDbPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'postgres', // Connect to default database to create new one
  user: process.env.USER || 'postgres', // Use current user or postgres
  password: process.env.DB_ADMIN_PASSWORD || '', // Usually empty for local
});

// Connection for the actual database
const dbPool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'expensetracker_local',
  user: process.env.USER || 'postgres',
  password: process.env.DB_ADMIN_PASSWORD || '',
});

async function createLocalDatabase() {
  console.log('🔧 Setting up local database for development...');
  
  try {
    // Create database
    console.log('📝 Creating database "expensetracker_local"...');
    const createClient = await createDbPool.connect();
    
    try {
      await createClient.query(`CREATE DATABASE expensetracker_local`);
      console.log('✅ Database created successfully');
    } catch (err) {
      if (err.code === '42P04') {
        console.log('ℹ️  Database already exists');
      } else {
        throw err;
      }
    } finally {
      createClient.release();
    }

    // Create tables
    console.log('📝 Creating tables...');
    const dbClient = await dbPool.connect();
    
    try {
      // Create Users table
      await dbClient.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          username VARCHAR(255) NOT NULL UNIQUE,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'USER'
        )
      `);

      // Create Expenses table
      await dbClient.query(`
        CREATE TABLE IF NOT EXISTS expenses (
          id SERIAL PRIMARY KEY,
          expense VARCHAR(100) NOT NULL,
          expensetype VARCHAR(50) NOT NULL,
          expenseamount VARCHAR(20) NOT NULL,
          payment_method VARCHAR(50),
          date DATE DEFAULT CURRENT_DATE
        )
      `);

      console.log('✅ Tables created successfully');
      
      // Create local .env file
      const fs = require('fs');
      const path = require('path');
      
      const localEnvContent = `# Local Development Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expensetracker_local
DB_USER=${process.env.USER || 'postgres'}
DB_PASSWORD=${process.env.DB_ADMIN_PASSWORD || ''}

# Server Configuration
PORT=8080
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
`;

      fs.writeFileSync(path.join(__dirname, '.env'), localEnvContent);
      console.log('✅ Created .env file with local database configuration');
      
    } finally {
      dbClient.release();
    }

    console.log(`
🎉 Local database setup complete!

Database Details:
- Host: localhost:5432
- Database: expensetracker_local
- User: ${process.env.USER || 'postgres'}

You can now start the server with:
npm start

Or for development mode:
npm run dev
`);
    
  } catch (error) {
    console.error('❌ Error setting up local database:', error.message);
    console.log(`
💡 Troubleshooting:
1. Make sure PostgreSQL is installed and running
2. Make sure you have permission to create databases
3. Try running: createdb expensetracker_local
4. Or use the remote database by keeping the original .env configuration
`);
  } finally {
    await createDbPool.end();
    await dbPool.end();
  }
}

createLocalDatabase();
