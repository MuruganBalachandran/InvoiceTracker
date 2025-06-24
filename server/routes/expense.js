import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/error.js';
import {
  getExpenses,
  getExpense,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats,
  getExpenseCategories
} from '../controllers/expenseController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const expenseValidation = [
  body('description')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .isIn([
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Healthcare',
      'Education',
      'Housing',
      'Utilities',
      'Insurance',
      'Travel',
      'Business',
      'Other'
    ])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required'),
  body('paymentMethod')
    .optional()
    .isIn(['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'])
    .withMessage('Invalid payment method'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

const updateExpenseValidation = [
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Description must be between 1 and 200 characters'),
  body('amount')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('category')
    .optional()
    .isIn([
      'Food & Dining',
      'Transportation',
      'Shopping',
      'Entertainment',
      'Healthcare',
      'Education',
      'Housing',
      'Utilities',
      'Insurance',
      'Travel',
      'Business',
      'Other'
    ])
    .withMessage('Invalid category'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Valid date is required'),
  body('paymentMethod')
    .optional()
    .isIn(['Cash', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Digital Wallet', 'Other'])
    .withMessage('Invalid payment method'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters')
];

// Routes
router.get('/', getExpenses);
router.get('/stats', getExpenseStats);
router.get('/categories', getExpenseCategories);
router.get('/:id', getExpense);
router.post('/', expenseValidation, handleValidationErrors, createExpense);
router.put('/:id', updateExpenseValidation, handleValidationErrors, updateExpense);
router.delete('/:id', deleteExpense);

export default router; 