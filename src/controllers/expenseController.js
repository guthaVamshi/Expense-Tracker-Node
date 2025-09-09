const Expense = require('../models/Expense');

class ExpenseController {
  // GET / - Welcome endpoint
  static async welcome(req, res) {
    try {
      res.json({ message: 'welcome' });
    } catch (error) {
      console.error('Welcome endpoint error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /all - Get all expenses
  static async getAllExpenses(req, res) {
    try {
      console.log('Fetching all expenses');
      const expenses = await Expense.findAll();
      console.log(`Found ${expenses.length} expenses`);
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching all expenses:', error);
      res.status(500).json({ error: 'Failed to fetch expenses' });
    }
  }

  // GET /by-month/:yearMonth - Get expenses by month
  static async getExpensesByMonth(req, res) {
    try {
      const { yearMonth } = req.params;
      console.log(`Fetching expenses for month ${yearMonth}`);
      
      // Parse YYYY-MM format
      const [year, month] = yearMonth.split('-');
      const startDate = new Date(year, month - 1, 1); // month is 0-indexed
      const endDate = new Date(year, month, 0); // last day of month
      
      const expenses = await Expense.findByDateBetween(startDate, endDate);
      console.log(`Found ${expenses.length} expenses for ${yearMonth}`);
      res.json(expenses);
    } catch (error) {
      console.error('Error fetching expenses by month:', error);
      res.status(500).json({ error: 'Failed to fetch expenses by month' });
    }
  }

  // POST /add - Add new expense
  static async addExpense(req, res) {
    try {
      const expenseData = req.body;
      console.log('Adding new expense:', expenseData);
      
      const newExpense = await Expense.create(expenseData);
      console.log(`Successfully added expense with ID: ${newExpense.id}`);
      res.status(201).json(newExpense);
    } catch (error) {
      console.error('Error adding expense:', error);
      res.status(500).json({ error: 'Failed to add expense' });
    }
  }

  // PUT /updateExpense - Update expense
  static async updateExpense(req, res) {
    try {
      const expenseData = req.body;
      const { id } = expenseData;
      
      if (!id) {
        return res.status(400).json({ error: 'Expense ID is required for update' });
      }
      
      console.log(`Updating expense with ID: ${id}`);
      
      const updatedExpense = await Expense.update(id, expenseData);
      if (!updatedExpense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      console.log(`Successfully updated expense with ID: ${id}`);
      res.json(updatedExpense);
    } catch (error) {
      console.error('Error updating expense:', error);
      res.status(500).json({ error: 'Failed to update expense' });
    }
  }

  // DELETE /delete/:id - Delete expense
  static async deleteExpense(req, res) {
    try {
      const { id } = req.params;
      console.log(`Deleting expense with ID: ${id}`);
      
      const deleted = await Expense.delete(parseInt(id));
      if (!deleted) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      
      console.log(`Successfully deleted expense with ID: ${id}`);
      res.json(`Expense with ID ${id} deleted successfully`);
    } catch (error) {
      console.error('Error deleting expense:', error);
      res.status(500).json({ error: 'Failed to delete expense' });
    }
  }

  // GET /api-docs - API Documentation
  static async getApiDocumentation(req, res) {
    try {
      const apiDocs = {
        title: 'Expense Tracker API',
        version: '1.0',
        description: 'REST API for managing personal expenses',
        endpoints: {
          welcome: {
            method: 'GET',
            path: '/',
            description: 'Welcome endpoint - returns welcome message',
            response: 'JSON object with message'
          },
          getAllExpenses: {
            method: 'GET',
            path: '/all',
            description: 'Get all expenses',
            response: 'Array of Expense objects'
          },
          getByMonth: {
            method: 'GET',
            path: '/by-month/{yearMonth}',
            description: 'Get expenses for a given month (YYYY-MM)',
            pathVariable: 'yearMonth (String)',
            response: 'Array of Expense objects'
          },
          addExpense: {
            method: 'POST',
            path: '/add',
            description: 'Create a new expense',
            requestBody: 'Expense object (JSON)',
            response: 'Expense object',
            validation: 'All fields are required'
          },
          updateExpense: {
            method: 'PUT',
            path: '/updateExpense',
            description: 'Update an existing expense',
            requestBody: 'Expense object with ID (JSON)',
            response: 'Expense object',
            validation: 'All fields are required'
          },
          deleteExpense: {
            method: 'DELETE',
            path: '/delete/{id}',
            description: 'Delete an expense by ID',
            pathVariable: 'id (Integer)',
            response: 'Success message string'
          }
        },
        expenseModel: {
          id: 'Integer (auto-generated)',
          expense: 'String (required, max 100 chars)',
          expenseType: 'String (required, max 50 chars)',
          expenseAmount: 'String (required, max 20 chars)',
          paymentMethod: 'String (optional, max 50 chars)',
          date: 'Date (auto-generated)'
        },
        exampleRequest: {
          expense: 'Groceries',
          expenseType: 'Food',
          expenseAmount: '50.00',
          paymentMethod: 'Credit Card'
        }
      };
      
      res.json(apiDocs);
    } catch (error) {
      console.error('Error generating API documentation:', error);
      res.status(500).json({ error: 'Failed to generate API documentation' });
    }
  }
}

module.exports = ExpenseController;
