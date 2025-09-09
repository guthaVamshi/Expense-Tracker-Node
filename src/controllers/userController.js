const User = require('../models/User');

class UserController {
  // POST /register - User registration
  static async register(req, res) {
    try {
      const { username, password, role } = req.body;
      
      // Check if user already exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: 'Username already exists' });
      }
      
      // Create new user
      const newUser = await User.create({ username, password, role });
      
      console.log(`User registered successfully: ${username}`);
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error registering user:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Username already exists' });
      }
      
      res.status(500).json({ error: 'Failed to register user' });
    }
  }

  // POST /login - User login (basic auth verification)
  static async login(req, res) {
    try {
      // This endpoint is mainly for testing basic auth
      // In practice, login happens through basic auth middleware
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
      }

      const base64Credentials = authHeader.split(' ')[1];
      const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
      const [username, password] = credentials.split(':');

      if (!username || !password) {
        return res.status(401).json({ error: 'Invalid credentials format' });
      }

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      const isValidPassword = await user.verifyPassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid username or password' });
      }

      res.json({ 
        message: 'Login successful',
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /me - Get current user info (requires auth)
  static async getCurrentUser(req, res) {
    try {
      // User is attached by auth middleware
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      
      res.json(req.user.toJSON());
    } catch (error) {
      console.error('Error getting current user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

module.exports = UserController;
