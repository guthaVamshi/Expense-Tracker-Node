# Expense Tracker - Node.js Backend

This is a Node.js backend implementation of the Expense Tracker application, providing the same functionality as the original Java Spring Boot backend. It uses the same PostgreSQL database and maintains API compatibility with the existing frontend.

## Features

- **Same API Endpoints**: Complete compatibility with the existing frontend
- **Database Compatibility**: Uses the same PostgreSQL database and schema
- **Authentication**: Basic Auth with BCrypt password hashing
- **Validation**: Input validation using express-validator
- **Logging**: Request logging with Morgan
- **CORS**: Configured for frontend integration
- **Error Handling**: Comprehensive error handling

## API Endpoints

### Public Endpoints
- `GET /` - Welcome message
- `GET /api-docs` - API documentation
- `POST /register` - User registration
- `POST /login` - User login verification

### Protected Endpoints (Basic Auth Required)
- `GET /all` - Get all expenses
- `GET /by-month/{yearMonth}` - Get expenses by month (YYYY-MM format)
- `POST /add` - Add new expense
- `PUT /updateExpense` - Update existing expense
- `DELETE /delete/{id}` - Delete expense by ID
- `GET /me` - Get current user information

## Data Models

### User
```json
{
  "id": "integer",
  "username": "string",
  "password": "string (hashed)",
  "role": "string (USER/ADMIN)"
}
```

### Expense
```json
{
  "id": "integer",
  "expense": "string (max 100 chars)",
  "expenseType": "string (max 50 chars)",
  "expenseAmount": "string (max 20 chars)",
  "paymentMethod": "string (optional, max 50 chars)",
  "date": "date (auto-generated)"
}
```

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL database (same as Java backend)
- npm or yarn

### Installation

1. **Navigate to the Node.js backend directory:**
   ```bash
   cd backend-nodejs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
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
   ```

4. **Start the server:**
   ```bash
   # Development mode (with auto-reload)
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:8080` and automatically:
- Connect to the PostgreSQL database
- Create necessary tables if they don't exist
- Display server information in the console

## Database Setup

The application automatically creates the required tables:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'USER'
);

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  expense VARCHAR(100) NOT NULL,
  expensetype VARCHAR(50) NOT NULL,
  expenseamount VARCHAR(20) NOT NULL,
  payment_method VARCHAR(50),
  date DATE DEFAULT CURRENT_DATE
);
```

## Authentication

The API uses HTTP Basic Authentication:

1. **Register a user:**
   ```bash
   curl -X POST http://localhost:8080/register \
     -H "Content-Type: application/json" \
     -d '{"username": "testuser", "password": "password123"}'
   ```

2. **Access protected endpoints:**
   ```bash
   curl -X GET http://localhost:8080/all \
     -H "Authorization: Basic $(echo -n 'testuser:password123' | base64)"
   ```

## Frontend Integration

This Node.js backend is designed to work seamlessly with the existing React frontend. The frontend's API client (`src/lib/api.ts`) will work without any modifications.

To use this backend with the frontend:

1. Start the Node.js backend on port 8080
2. Start the React frontend on port 5173
3. The frontend will automatically connect to the Node.js backend

## Differences from Java Backend

While maintaining API compatibility, this Node.js implementation includes some improvements:

1. **Better Error Handling**: More detailed error messages and proper HTTP status codes
2. **Enhanced Logging**: Better request logging and debugging information
3. **Additional Endpoints**: 
   - `GET /me` - Get current user information
   - `POST /login` - Explicit login endpoint for testing
4. **Validation**: More comprehensive input validation
5. **Documentation**: Built-in API documentation endpoint

## Development

### Project Structure
```
backend-nodejs/
├── config/
│   └── database.js          # Database connection and setup
├── src/
│   ├── controllers/         # Request handlers
│   │   ├── expenseController.js
│   │   └── userController.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.js         # Authentication middleware
│   │   └── validation.js   # Validation middleware
│   ├── models/             # Data models
│   │   ├── Expense.js
│   │   └── User.js
│   ├── routes/             # Route definitions
│   │   ├── expenseRoutes.js
│   │   └── userRoutes.js
│   └── server.js           # Main application file
├── package.json
└── README.md
```

### Scripts
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload
- `npm test` - Run tests (to be implemented)

## Troubleshooting

### Common Issues

1. **Database Connection Error:**
   - Verify PostgreSQL is running
   - Check database credentials in `.env` file
   - Ensure database `expensetracker_bcph` exists

2. **Port Already in Use:**
   - Change the PORT in `.env` file
   - Or kill the process using port 8080: `lsof -ti:8080 | xargs kill -9`

3. **CORS Issues:**
   - Ensure CORS_ORIGIN in `.env` matches your frontend URL
   - Check that the frontend is running on the expected port

### Logging

The application provides detailed logging:
- Request logs via Morgan
- Database operation logs
- Error logs with stack traces (in development mode)

## Testing

You can test the API using curl, Postman, or any HTTP client:

```bash
# Get API documentation
curl http://localhost:8080/api-docs

# Register a user
curl -X POST http://localhost:8080/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'

# Get all expenses (with auth)
curl -X GET http://localhost:8080/all \
  -H "Authorization: Basic $(echo -n 'testuser:password123' | base64)"

# Add an expense
curl -X POST http://localhost:8080/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic $(echo -n 'testuser:password123' | base64)" \
  -d '{"expense": "Coffee", "expenseType": "Food", "expenseAmount": "5.00"}'
```

## License

This project is part of the Expense Tracker application.
