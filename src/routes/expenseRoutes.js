const express = require('express');
const ExpenseController = require('../controllers/expenseController');
const { basicAuth } = require('../middleware/auth');
const { validateExpense, validateExpenseId, validateYearMonth } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', ExpenseController.welcome);
router.get('/api-docs', ExpenseController.getApiDocumentation);

// Protected routes (require authentication)
router.get('/all', basicAuth, ExpenseController.getAllExpenses);
router.get('/by-month/:yearMonth', basicAuth, validateYearMonth, ExpenseController.getExpensesByMonth);
router.post('/add', basicAuth, validateExpense, ExpenseController.addExpense);
router.put('/updateExpense', basicAuth, validateExpense, ExpenseController.updateExpense);
router.delete('/delete/:id', basicAuth, validateExpenseId, ExpenseController.deleteExpense);

module.exports = router;
