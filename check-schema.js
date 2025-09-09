#!/usr/bin/env node

require('dotenv').config();
const { pool } = require('./config/database');

async function checkSchema() {
  try {
    const client = await pool.connect();
    
    console.log('🔍 Checking database schema...');
    
    // Check Users table
    const usersResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Users table schema:');
    usersResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check Expenses table
    const expensesResult = await client.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'expenses' 
      ORDER BY ordinal_position;
    `);
    
    console.log('\n📋 Expenses table schema:');
    expensesResult.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (nullable: ${row.is_nullable})`);
    });
    
    // Check if there's existing data
    const usersCount = await client.query('SELECT COUNT(*) FROM users');
    const expensesCount = await client.query('SELECT COUNT(*) FROM expenses');
    
    console.log('\n📊 Data counts:');
    console.log(`  - Users: ${usersCount.rows[0].count}`);
    console.log(`  - Expenses: ${expensesCount.rows[0].count}`);
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error checking schema:', error.message);
  } finally {
    await pool.end();
  }
}

checkSchema();
