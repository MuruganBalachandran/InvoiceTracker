import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/error.js';
import {
  getInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  updateInvoiceStatus,
  getInvoiceStats
} from '../controllers/invoiceController.js';
import Client from '../models/Client.js';
import Expense from '../models/Expense.js';
import User from '../models/User.js';

const router = express.Router();

// Public route for testing: GET /api/invoices/public
router.get('/public', async (req, res) => {
  try {
    // Optionally, you can limit the number of invoices returned for public view
    const invoices = await getInvoices(req, res, true); // Pass a flag if you want to handle differently in controller
    // If your controller sends the response, you may need to fetch directly from the model here instead
    // For now, just send a placeholder response
    res.json({ success: true, message: 'Public invoices route is working!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Public route for clients
router.get('/public-clients', async (req, res) => {
  try {
    const clients = await Client.find().limit(5).select('-__v');
    res.json({ success: true, data: clients });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Public route for expenses
router.get('/public-expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().limit(5).select('-__v');
    res.json({ success: true, data: expenses });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// Public route for users (basic info only)
router.get('/public-users', async (req, res) => {
  try {
    const users = await User.find().limit(5).select('name email');
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

// All routes are protected
router.use(protect);

// Validation rules
const invoiceValidation = [
  body('clientId')
    .isMongoId()
    .withMessage('Valid client ID is required'),
  body('items')
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.description')
    .trim()
    .notEmpty()
    .withMessage('Item description is required'),
  body('items.*.quantity')
    .isFloat({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.rate')
    .isFloat({ min: 0 })
    .withMessage('Rate must be non-negative'),
  body('issueDate')
    .isISO8601()
    .withMessage('Valid issue date is required'),
  body('dueDate')
    .isISO8601()
    .withMessage('Valid due date is required'),
  body('tax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax must be non-negative')
];

const updateInvoiceValidation = [
  body('items')
    .optional()
    .isArray({ min: 1 })
    .withMessage('At least one item is required'),
  body('items.*.description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Item description is required'),
  body('items.*.quantity')
    .optional()
    .isFloat({ min: 1 })
    .withMessage('Quantity must be at least 1'),
  body('items.*.rate')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Rate must be non-negative'),
  body('issueDate')
    .optional()
    .isISO8601()
    .withMessage('Valid issue date is required'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Valid due date is required'),
  body('tax')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Tax must be non-negative'),
  body('status')
    .optional()
    .isIn(['draft', 'sent', 'paid', 'overdue'])
    .withMessage('Invalid status')
];

const statusValidation = [
  body('status')
    .isIn(['draft', 'sent', 'paid', 'overdue'])
    .withMessage('Invalid status')
];

// Routes
router.get('/', getInvoices);
router.get('/stats', getInvoiceStats);
router.get('/:id', getInvoice);
router.post('/', invoiceValidation, handleValidationErrors, createInvoice);
router.put('/:id', updateInvoiceValidation, handleValidationErrors, updateInvoice);
router.delete('/:id', deleteInvoice);
router.patch('/:id/status', statusValidation, handleValidationErrors, updateInvoiceStatus);

export default router;