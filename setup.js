#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Create .env file if it doesn't exist
const envContent = `# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expensetracker_bcph
DB_USER=expensetracker_bcph_user
DB_PASSWORD=TrBH2kIIQdBCJIyCdIAKzkMm6zORHpuE

# Server Configuration
PORT=8080
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
`;

const envPath = path.join(__dirname, '.env');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env file with default configuration');
} else {
  console.log('ℹ️  .env file already exists');
}

console.log(`
🎉 Setup Complete!

Next steps:
1. Install dependencies: npm install
2. Start development server: npm run dev
3. Or start production server: npm start

The server will run on http://localhost:8080
API documentation will be available at http://localhost:8080/api-docs

Database configuration:
- Host: localhost:5432
- Database: expensetracker_bcph
- User: expensetracker_bcph_user

Make sure PostgreSQL is running and the database exists!
`);
