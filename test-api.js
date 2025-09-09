#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:8080';

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Test functions
async function testWelcome() {
  console.log('🔍 Testing welcome endpoint...');
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/',
      method: 'GET'
    });
    console.log(`✅ Welcome: ${result.status} - ${JSON.stringify(result.data)}`);
  } catch (error) {
    console.log(`❌ Welcome failed: ${error.message}`);
  }
}

async function testApiDocs() {
  console.log('🔍 Testing API docs endpoint...');
  try {
    const result = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/api-docs',
      method: 'GET'
    });
    console.log(`✅ API Docs: ${result.status} - Title: ${result.data.title}`);
  } catch (error) {
    console.log(`❌ API Docs failed: ${error.message}`);
  }
}

async function testRegister() {
  console.log('🔍 Testing user registration...');
  try {
    const userData = {
      username: `testuser_${Date.now()}`,
      password: 'password123'
    };
    
    const result = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, userData);
    
    if (result.status === 201) {
      console.log(`✅ Registration: ${result.status} - User: ${result.data.username}`);
      return userData;
    } else {
      console.log(`⚠️  Registration: ${result.status} - ${JSON.stringify(result.data)}`);
    }
  } catch (error) {
    console.log(`❌ Registration failed: ${error.message}`);
  }
  return null;
}

async function testAuth(user) {
  if (!user) return;
  
  console.log('🔍 Testing authentication...');
  try {
    const auth = Buffer.from(`${user.username}:${user.password}`).toString('base64');
    const result = await makeRequest({
      hostname: 'localhost',
      port: 8080,
      path: '/all',
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`
      }
    });
    
    console.log(`✅ Auth Test: ${result.status} - Found ${result.data.length || 0} expenses`);
  } catch (error) {
    console.log(`❌ Auth Test failed: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testWelcome();
  await testApiDocs();
  const user = await testRegister();
  await testAuth(user);
  
  console.log('\n✨ Tests completed!');
  console.log('\n💡 Tips:');
  console.log('- Make sure the server is running on http://localhost:8080');
  console.log('- Make sure PostgreSQL is running and accessible');
  console.log('- Check the server logs for detailed information');
}

runTests().catch(console.error);
