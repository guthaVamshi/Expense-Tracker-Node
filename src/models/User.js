const { pool } = require('../../config/database');
const bcrypt = require('bcryptjs');

class User {
  constructor(id, username, password, role) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.role = role || 'USER';
  }

  // Create a new user
  static async create(userData) {
    const { username, password, role = 'USER' } = userData;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, role
    `;
    
    const values = [username, hashedPassword, role];
    
    try {
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  }

  // Find user by username
  static async findByUsername(username) {
    const query = 'SELECT * FROM users WHERE username = $1';
    
    try {
      const result = await pool.query(query, [username]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = result.rows[0];
      return new User(user.id, user.username, user.password, user.role);
    } catch (error) {
      throw error;
    }
  }

  // Find user by ID
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const user = result.rows[0];
      return new User(user.id, user.username, user.password, user.role);
    } catch (error) {
      throw error;
    }
  }

  // Verify password
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  // Convert to JSON (excluding password)
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      role: this.role
    };
  }
}

module.exports = User;
