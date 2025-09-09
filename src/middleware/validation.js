const { body, param, validationResult } = require('express-validator');

// Validation middleware to check for errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

// Expense validation rules
const validateExpense = [
  body('expense')
    .notEmpty()
    .withMessage('Expense name is required')
    .isLength({ max: 100 })
    .withMessage('Expense name must be at most 100 characters'),
  
  body('expenseType')
    .notEmpty()
    .withMessage('Expense type is required')
    .isLength({ max: 50 })
    .withMessage('Expense type must be at most 50 characters'),
  
  body('expenseAmount')
    .notEmpty()
    .withMessage('Expense amount is required')
    .isLength({ max: 20 })
    .withMessage('Expense amount must be at most 20 characters'),
  
  body('paymentMethod')
    .optional()
    .isLength({ max: 50 })
    .withMessage('Payment method must be at most 50 characters'),
  
  handleValidationErrors
];

// User registration validation rules
const validateUserRegistration = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  body('role')
    .optional()
    .isIn(['USER', 'ADMIN'])
    .withMessage('Role must be either USER or ADMIN'),
  
  handleValidationErrors
];

// Path parameter validation
const validateExpenseId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Expense ID must be a positive integer'),
  
  handleValidationErrors
];

// Year-month validation for filtering
const validateYearMonth = [
  param('yearMonth')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Year-month must be in YYYY-MM format'),
  
  handleValidationErrors
];

module.exports = {
  validateExpense,
  validateUserRegistration,
  validateExpenseId,
  validateYearMonth,
  handleValidationErrors
};
