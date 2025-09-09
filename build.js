#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Building Expense Tracker Node.js Backend...\n');

const buildSteps = [
  {
    name: 'Clean previous build',
    command: 'rm -rf dist',
    description: 'Removing existing dist directory'
  },
  {
    name: 'Create dist directory',
    command: 'mkdir -p dist',
    description: 'Creating distribution directory'
  },
  {
    name: 'Copy source files',
    command: 'cp -r src dist/',
    description: 'Copying source code'
  },
  {
    name: 'Copy config files',
    command: 'cp -r config dist/',
    description: 'Copying configuration files'
  },
  {
    name: 'Copy package.json',
    command: 'cp package.json dist/',
    description: 'Copying package configuration'
  },
  {
    name: 'Copy README',
    command: 'cp README.md dist/',
    description: 'Copying documentation'
  }
];

// Execute build steps
for (const step of buildSteps) {
  try {
    console.log(`📦 ${step.description}...`);
    execSync(step.command, { stdio: 'inherit' });
    console.log(`✅ ${step.name} completed\n`);
  } catch (error) {
    console.error(`❌ ${step.name} failed:`, error.message);
    process.exit(1);
  }
}

// Create production environment template file
console.log('📝 Creating production environment template file...');
const prodEnvContent = `# Production Database Configuration
# Configure these values based on your deployment environment
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# Server Configuration
PORT=your_server_port
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=your_frontend_url

# Production Settings
LOG_LEVEL=info
`;

fs.writeFileSync(path.join('dist', '.env.template'), prodEnvContent);
console.log('✅ Production environment template file created\n');

// Install production dependencies
console.log('📥 Installing production dependencies...');
try {
  execSync('cd dist && npm install --production', { stdio: 'inherit' });
  console.log('✅ Production dependencies installed\n');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Create start script
console.log('📝 Creating start script...');
const startScript = `#!/bin/bash

# Production start script for Expense Tracker Backend

echo "🚀 Starting Expense Tracker Node.js Backend (Production)"
echo "=================================================="

# Set production environment
export NODE_ENV=production

# Load production environment variables
if [ -f .env.production ]; then
  export $(cat .env.production | xargs)
fi

# Start the server
echo "📍 Server will start on port $PORT"
echo "🗄️  Database: $DB_HOST:$DB_PORT/$DB_NAME"
echo ""

node src/server.js
`;

fs.writeFileSync(path.join('dist', 'start.sh'), startScript);
fs.chmodSync(path.join('dist', 'start.sh'), '755');
console.log('✅ Start script created\n');

// Create deployment info
const deploymentInfo = {
  buildDate: new Date().toISOString(),
  version: require('./package.json').version,
  nodeVersion: process.version,
  platform: process.platform,
  arch: process.arch
};

fs.writeFileSync(
  path.join('dist', 'deployment-info.json'), 
  JSON.stringify(deploymentInfo, null, 2)
);

console.log('🎉 Build completed successfully!\n');
console.log('📁 Distribution files created in: ./dist/');
console.log('');
console.log('🚀 To run the production build:');
console.log('   cd dist');
console.log('   ./start.sh');
console.log('   # or');
console.log('   NODE_ENV=production node src/server.js');
console.log('');
console.log('📋 Build Information:');
console.log(`   Version: ${deploymentInfo.version}`);
console.log(`   Build Date: ${deploymentInfo.buildDate}`);
console.log(`   Node Version: ${deploymentInfo.nodeVersion}`);
console.log(`   Platform: ${deploymentInfo.platform}-${deploymentInfo.arch}`);
console.log('');
