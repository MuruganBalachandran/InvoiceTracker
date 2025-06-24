import Invoice from '../models/Invoice.js';
import Client from '../models/Client.js';
import { asyncHandler } from '../middlewares/error.js';

// @desc    Get all invoices for user
// @route   GET /api/invoices
// @access  Private
export const getInvoices = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, search } = req.query;

  const query = { user: req.user.id };

  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }

  // Search by invoice number or client name
  if (search) {
    query.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { 'client.name': { $regex: search, $options: 'i' } }
    ];
  }

  const invoices = await Invoice.find(query)
    .populate('client', 'name email')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const total = await Invoice.countDocuments(query);

  res.json({
    success: true,
    data: {
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
export const getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('client', 'name email phone address');

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }

  // Make sure user owns invoice
  if (invoice.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this invoice'
    });
  }

  res.json({
    success: true,
    data: invoice
  });
});

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
export const createInvoice = asyncHandler(async (req, res) => {
  try {
    const { clientId, items, issueDate, dueDate, tax = 0, notes, invoiceNumber } = req.body;

    // Verify client belongs to user
    const client = await Client.findOne({ _id: clientId, user: req.user.id });
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }

    // Calculate amount for each item
    const itemsWithAmount = items.map(item => ({
      ...item,
      amount: item.quantity * item.rate
    }));

    // Calculate totals
    const subtotal = itemsWithAmount.reduce((sum, item) => sum + item.amount, 0);
    const total = subtotal + tax;

    // Prepare client snapshot
    const clientSnapshot = {
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      company: client.company,
      taxId: client.taxId
    };

    const invoice = await Invoice.create({
      user: req.user.id,
      client: clientId,
      invoiceNumber,
      items: itemsWithAmount,
      issueDate,
      dueDate,
      subtotal,
      tax,
      total,
      notes,
      clientSnapshot
    });

    const populatedInvoice = await Invoice.findById(invoice._id)
      .populate('client', 'name email phone address');

    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: populatedInvoice
    });
  } catch (err) {
    console.error('Error creating invoice:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong!'
    });
  }
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
export const updateInvoice = asyncHandler(async (req, res) => {
  let invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }

  // Make sure user owns invoice
  if (invoice.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this invoice'
    });
  }

  const { items, issueDate, dueDate, tax = 0, notes, status } = req.body;

  // Calculate new totals if items changed
  let subtotal = invoice.subtotal;
  let total = invoice.total;

  if (items) {
    subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
    total = subtotal + tax;
  }

  invoice = await Invoice.findByIdAndUpdate(
    req.params.id,
    {
      items,
      issueDate,
      dueDate,
      subtotal,
      tax,
      total,
      notes,
      status
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('client', 'name email phone address');

  res.json({
    success: true,
    message: 'Invoice updated successfully',
    data: invoice
  });
});

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
export const deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }

  // Make sure user owns invoice
  if (invoice.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this invoice'
    });
  }

  await invoice.deleteOne();

  res.json({
    success: true,
    message: 'Invoice deleted successfully'
  });
});

// @desc    Update invoice status
// @route   PATCH /api/invoices/:id/status
// @access  Private
export const updateInvoiceStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const invoice = await Invoice.findById(req.params.id);

  if (!invoice) {
    return res.status(404).json({
      success: false,
      message: 'Invoice not found'
    });
  }

  // Make sure user owns invoice
  if (invoice.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this invoice'
    });
  }

  invoice.status = status;
  if (status === 'paid') {
    invoice.paidDate = new Date();
  }

  await invoice.save();

  res.json({
    success: true,
    message: 'Invoice status updated successfully',
    data: invoice
  });
});

// @desc    Get invoice statistics
// @route   GET /api/invoices/stats
// @access  Private
export const getInvoiceStats = asyncHandler(async (req, res) => {
  const stats = await Invoice.aggregate([
    { $match: { user: req.user.id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        total: { $sum: '$total' }
      }
    }
  ]);

  const totalInvoices = await Invoice.countDocuments({ user: req.user.id });
  const totalAmount = await Invoice.aggregate([
    { $match: { user: req.user.id } },
    { $group: { _id: null, total: { $sum: '$total' } } }
  ]);

  res.json({
    success: true,
    data: {
      stats,
      totalInvoices,
      totalAmount: totalAmount[0]?.total || 0
    }
  });
}); 