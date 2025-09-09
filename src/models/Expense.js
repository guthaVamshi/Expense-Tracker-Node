const { pool } = require('../../config/database');

class Expense {
  constructor(id, expense, expenseType, expenseAmount, paymentMethod, date) {
    this.id = id;
    this.expense = expense;
    this.expenseType = expenseType;
    this.expenseAmount = expenseAmount;
    this.paymentMethod = paymentMethod;
    this.date = date;
  }

  // Get all expenses
  static async findAll() {
    const query = `
      SELECT id, expense, expense_type as "expenseType", expense_amount as "expenseAmount", 
             payment_method as "paymentMethod", date
      FROM expenses 
      ORDER BY date DESC, id DESC
    `;
    
    try {
      const result = await pool.query(query);
      return result.rows.map(row => new Expense(
        row.id,
        row.expense,
        row.expenseType,
        row.expenseAmount,
        row.paymentMethod,
        row.date
      ));
    } catch (error) {
      throw error;
    }
  }

  // Find expenses by date range (for monthly filtering)
  static async findByDateBetween(startDate, endDate) {
    const query = `
      SELECT id, expense, expense_type as "expenseType", expense_amount as "expenseAmount", 
             payment_method as "paymentMethod", date
      FROM expenses 
      WHERE date BETWEEN $1 AND $2
      ORDER BY date DESC, id DESC
    `;
    
    try {
      const result = await pool.query(query, [startDate, endDate]);
      return result.rows.map(row => new Expense(
        row.id,
        row.expense,
        row.expenseType,
        row.expenseAmount,
        row.paymentMethod,
        row.date
      ));
    } catch (error) {
      throw error;
    }
  }

  // Create a new expense
  static async create(expenseData) {
    const { expense, expenseType, expenseAmount, paymentMethod } = expenseData;
    
    const query = `
      INSERT INTO expenses (expense, expense_type, expense_amount, payment_method, date)
      VALUES ($1, $2, $3, $4, CURRENT_DATE)
      RETURNING id, expense, expense_type as "expenseType", expense_amount as "expenseAmount", 
                payment_method as "paymentMethod", date
    `;
    
    const values = [expense, expenseType, expenseAmount, paymentMethod];
    
    try {
      const result = await pool.query(query, values);
      const row = result.rows[0];
      return new Expense(
        row.id,
        row.expense,
        row.expenseType,
        row.expenseAmount,
        row.paymentMethod,
        row.date
      );
    } catch (error) {
      throw error;
    }
  }

  // Update an expense
  static async update(id, expenseData) {
    const { expense, expenseType, expenseAmount, paymentMethod } = expenseData;
    
    const query = `
      UPDATE expenses 
      SET expense = $1, expense_type = $2, expense_amount = $3, payment_method = $4
      WHERE id = $5
      RETURNING id, expense, expense_type as "expenseType", expense_amount as "expenseAmount", 
                payment_method as "paymentMethod", date
    `;
    
    const values = [expense, expenseType, expenseAmount, paymentMethod, id];
    
    try {
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return new Expense(
        row.id,
        row.expense,
        row.expenseType,
        row.expenseAmount,
        row.paymentMethod,
        row.date
      );
    } catch (error) {
      throw error;
    }
  }

  // Delete an expense
  static async delete(id) {
    const query = 'DELETE FROM expenses WHERE id = $1 RETURNING id';
    
    try {
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw error;
    }
  }

  // Find expense by ID
  static async findById(id) {
    const query = `
      SELECT id, expense, expense_type as "expenseType", expense_amount as "expenseAmount", 
             payment_method as "paymentMethod", date
      FROM expenses 
      WHERE id = $1
    `;
    
    try {
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return new Expense(
        row.id,
        row.expense,
        row.expenseType,
        row.expenseAmount,
        row.paymentMethod,
        row.date
      );
    } catch (error) {
      throw error;
    }
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      expense: this.expense,
      expenseType: this.expenseType,
      expenseAmount: this.expenseAmount,
      paymentMethod: this.paymentMethod,
      date: this.date
    };
  }
}

module.exports = Expense;
