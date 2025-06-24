import Expense from '../models/Expense.js';
import { asyncHandler } from '../middlewares/error.js';

// @desc    Get all expenses for user
// @route   GET /api/expenses
// @access  Private
export const getExpenses = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, category, startDate, endDate, search } = req.query;

  const query = { user: req.user.id };

  // Filter by category
  if (category && category !== 'all') {
    query.category = category;
  }

  // Filter by date range
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }

  // Search by description
  if (search) {
    query.description = { $regex: search, $options: 'i' };
  }

  const expenses = await Expense.find(query)
    .sort({ date: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const total = await Expense.countDocuments(query);

  res.json({
    success: true,
    data: {
      expenses,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
export const getExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found'
    });
  }

  // Make sure user owns expense
  if (expense.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this expense'
    });
  }

  res.json({
    success: true,
    data: expense
  });
});

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
export const createExpense = asyncHandler(async (req, res) => {
  const { description, amount, category, date, paymentMethod, receipt, notes } = req.body;

  const expense = await Expense.create({
    user: req.user.id,
    description,
    amount,
    category,
    date: date || new Date(),
    paymentMethod,
    receipt,
    notes,
    detailsSnapshot: req.body
  });

  res.status(201).json({
    success: true,
    message: 'Expense created successfully',
    data: expense
  });
});

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
export const updateExpense = asyncHandler(async (req, res) => {
  let expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found'
    });
  }

  // Make sure user owns expense
  if (expense.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this expense'
    });
  }

  const { description, amount, category, date, paymentMethod, receipt, notes } = req.body;

  expense = await Expense.findByIdAndUpdate(
    req.params.id,
    {
      description,
      amount,
      category,
      date,
      paymentMethod,
      receipt,
      notes
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    message: 'Expense updated successfully',
    data: expense
  });
});

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
export const deleteExpense = asyncHandler(async (req, res) => {
  const expense = await Expense.findById(req.params.id);

  if (!expense) {
    return res.status(404).json({
      success: false,
      message: 'Expense not found'
    });
  }

  // Make sure user owns expense
  if (expense.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this expense'
    });
  }

  await expense.deleteOne();

  res.json({
    success: true,
    message: 'Expense deleted successfully'
  });
});

// @desc    Get expense statistics
// @route   GET /api/expenses/stats
// @access  Private
export const getExpenseStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const matchStage = { user: req.user.id };
  if (startDate || endDate) {
    matchStage.date = {};
    if (startDate) matchStage.date.$gte = new Date(startDate);
    if (endDate) matchStage.date.$lte = new Date(endDate);
  }

  // Get expenses by category
  const categoryStats = await Expense.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$category',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    { $sort: { total: -1 } }
  ]);

  // Get total expenses
  const totalExpenses = await Expense.aggregate([
    { $match: matchStage },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  // Get monthly expenses for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyStats = await Expense.aggregate([
    {
      $match: {
        user: req.user.id,
        date: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$date' },
          month: { $month: '$date' }
        },
        total: { $sum: '$amount' }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } }
  ]);

  res.json({
    success: true,
    data: {
      categoryStats,
      totalExpenses: totalExpenses[0]?.total || 0,
      monthlyStats
    }
  });
});

// @desc    Get expense categories
// @route   GET /api/expenses/categories
// @access  Private
export const getExpenseCategories = asyncHandler(async (req, res) => {
  const categories = [
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
  ];

  res.json({
    success: true,
    data: categories
  });
}); 