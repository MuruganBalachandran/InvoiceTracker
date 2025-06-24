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

const router = express.Router();

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