import Client from '../models/Client.js';
import { asyncHandler } from '../middlewares/error.js';

// @desc    Get all clients for user
// @route   GET /api/clients
// @access  Private
export const getClients = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search } = req.query;

  const query = { user: req.user.id };

  // Search by name or email
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  const clients = await Client.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .exec();

  const total = await Client.countDocuments(query);

  res.json({
    success: true,
    data: {
      clients,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    }
  });
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private
export const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Make sure user owns client
  if (client.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this client'
    });
  }

  res.json({
    success: true,
    data: client
  });
});

// @desc    Create new client
// @route   POST /api/clients
// @access  Private
export const createClient = asyncHandler(async (req, res) => {
  const { name, email, phone, address, company, taxId } = req.body;

  // Check if client with same email already exists for this user
  const existingClient = await Client.findOne({ 
    user: req.user.id, 
    email: email.toLowerCase() 
  });

  if (existingClient) {
    return res.status(400).json({
      success: false,
      message: 'Client with this email already exists'
    });
  }

  const client = await Client.create({
    user: req.user.id,
    name,
    email,
    phone,
    address,
    company,
    taxId
  });

  res.status(201).json({
    success: true,
    message: 'Client created successfully',
    data: client
  });
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private
export const updateClient = asyncHandler(async (req, res) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Make sure user owns client
  if (client.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to update this client'
    });
  }

  const { name, email, phone, address, company, taxId } = req.body;

  // Check if email is being changed and if it conflicts with another client
  if (email && email !== client.email) {
    const existingClient = await Client.findOne({ 
      user: req.user.id, 
      email: email.toLowerCase(),
      _id: { $ne: req.params.id }
    });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: 'Client with this email already exists'
      });
    }
  }

  client = await Client.findByIdAndUpdate(
    req.params.id,
    {
      name,
      email,
      phone,
      address,
      company,
      taxId
    },
    {
      new: true,
      runValidators: true
    }
  );

  res.json({
    success: true,
    message: 'Client updated successfully',
    data: client
  });
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private
export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Make sure user owns client
  if (client.user.toString() !== req.user.id) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to delete this client'
    });
  }

  await client.deleteOne();

  res.json({
    success: true,
    message: 'Client deleted successfully'
  });
});

// @desc    Get client statistics
// @route   GET /api/clients/stats
// @access  Private
export const getClientStats = asyncHandler(async (req, res) => {
  const totalClients = await Client.countDocuments({ user: req.user.id });

  // Get clients with most invoices (if you want to add this later)
  const recentClients = await Client.find({ user: req.user.id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    data: {
      totalClients,
      recentClients
    }
  });
}); 