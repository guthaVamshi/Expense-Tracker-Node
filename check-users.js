#!/usr/bin/env node

require('dotenv').config();
const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function checkUsers() {
  try {
    const client = await pool.connect();
    
    console.log('👥 Checking existing users...');
    
    const result = await client.query('SELECT id, username, role FROM users');
    
    if (result.rows.length === 0) {
      console.log('No users found in database');
    } else {
      result.rows.forEach(user => {
        console.log(`  - ID: ${user.id}, Username: ${user.username}, Role: ${user.role}`);
      });
    }
    
    // Create a test user
    console.log('\n🔧 Creating test user...');
    const hashedPassword = await bcrypt.hash('admin', 12);
    
    try {
      await client.query(`
        INSERT INTO users (username, password, role) 
        VALUES ($1, $2, $3) 
        ON CONFLICT (username) DO NOTHING
      `, ['admin', hashedPassword, 'ADMIN']);
      
      console.log('✅ Test user "admin" created or already exists');
    } catch (err) {
      console.log('⚠️  Error creating test user:', err.message);
    }
    
    // Test password verification
    console.log('\n🔐 Testing password verification...');
    const userResult = await client.query('SELECT * FROM users WHERE username = $1', ['admin']);
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const isValid = await bcrypt.compare('admin', user.password);
      console.log(`Password verification for admin: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkUsers();
