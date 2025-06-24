import express from 'express';
import { body } from 'express-validator';
import { protect } from '../middlewares/auth.js';
import { handleValidationErrors } from '../middlewares/error.js';
import {
  getClients,
  getClient,
  createClient,
  updateClient,
  deleteClient,
  getClientStats
} from '../controllers/clientController.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const clientValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('address')
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('taxId')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Tax ID cannot exceed 50 characters')
];

const updateClientValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('phone')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('address')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Address is required'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('taxId')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Tax ID cannot exceed 50 characters')
];

// Routes
router.get('/', getClients);
router.get('/stats', getClientStats);
router.get('/:id', getClient);
router.post('/', clientValidation, handleValidationErrors, createClient);
router.put('/:id', updateClientValidation, handleValidationErrors, updateClient);
router.delete('/:id', deleteClient);

export default router; 