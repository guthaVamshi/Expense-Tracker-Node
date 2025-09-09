#!/usr/bin/env node

require('dotenv').config();
const { pool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function createTestUser() {
  try {
    const client = await pool.connect();
    
    console.log('🔧 Creating/updating test user...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('ram', 12);
    
    // Update or insert the user
    try {
      // First try to update existing user
      const updateResult = await client.query(`
        UPDATE users 
        SET password = $1 
        WHERE username = $2
        RETURNING id, username, role
      `, [hashedPassword, 'ram']);
      
      if (updateResult.rows.length > 0) {
        console.log('✅ Updated existing user "ram" with new password');
        console.log(`   User details: ID=${updateResult.rows[0].id}, Role=${updateResult.rows[0].role}`);
      } else {
        // If no user was updated, create a new one
        const insertResult = await client.query(`
          INSERT INTO users (username, password, role) 
          VALUES ($1, $2, $3)
          RETURNING id, username, role
        `, ['ram', hashedPassword, 'ADMIN']);
        
        console.log('✅ Created new user "ram"');
        console.log(`   User details: ID=${insertResult.rows[0].id}, Role=${insertResult.rows[0].role}`);
      }
      
      // Test the password immediately
      console.log('\n🔐 Testing password verification...');
      const userResult = await client.query('SELECT * FROM users WHERE username = $1', ['ram']);
      if (userResult.rows.length > 0) {
        const user = userResult.rows[0];
        const isValid = await bcrypt.compare('ram', user.password);
        console.log(`Password verification: ${isValid ? '✅ Valid' : '❌ Invalid'}`);
        
        if (isValid) {
          console.log('\n🎉 Success! You can now use these credentials:');
          console.log('   Username: ram');
          console.log('   Password: ram');
          console.log('\nTest with:');
          console.log(`   curl -X GET http://localhost:${process.env.PORT || '8080'}/all -H "Authorization: Basic $(echo -n 'ram:ram' | base64)")`);
        }
      }
      
    } catch (err) {
      console.log('❌ Error creating/updating user:', err.message);
    }
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

createTestUser();

