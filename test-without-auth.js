#!/usr/bin/env node

require('dotenv').config();
const { pool } = require('./config/database');

async function testDirectAccess() {
  try {
    const client = await pool.connect();
    
    console.log('🧪 Testing direct database access...');
    
    // Test expenses query
    console.log('\n📋 Testing expenses query...');
    const expensesResult = await client.query(`
      SELECT id, expense, expense_type as "expenseType", expense_amount as "expenseAmount", 
             payment_method as "paymentMethod", date
      FROM expenses 
      ORDER BY date DESC, id DESC
      LIMIT 5
    `);
    
    console.log(`Found ${expensesResult.rows.length} expenses:`);
    expensesResult.rows.forEach(expense => {
      console.log(`  - ${expense.expense}: ${expense.expenseAmount} (${expense.expenseType})`);
    });
    
    // Test users query
    console.log('\n👥 Testing users query...');
    const usersResult = await client.query('SELECT id, username, role, LEFT(password, 10) as password_preview FROM users LIMIT 3');
    
    console.log(`Found ${usersResult.rows.length} users:`);
    usersResult.rows.forEach(user => {
      console.log(`  - ${user.username} (${user.role}): password starts with ${user.password_preview}...`);
    });
    
    client.release();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await pool.end();
  }
}

testDirectAccess();
