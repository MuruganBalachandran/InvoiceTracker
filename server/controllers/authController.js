import User from '../models/User.js';
import { asyncHandler } from '../middlewares/error.js';

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password
  });

  // Generate token
  const token = user.getSignedJwtToken();

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        monthlySalary: user.monthlySalary
      },
      token
    }
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide an email and password'
    });
  }

  // Check for user
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Generate token
  const token = user.getSignedJwtToken();

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        monthlySalary: user.monthlySalary
      },
      token
    }
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        monthlySalary: user.monthlySalary
      }
    }
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        monthlySalary: user.monthlySalary
      }
    }
  });
});

// @desc    Change password
// @route   PUT /api/auth/changepassword
// @access  Private
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(currentPassword))) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }

  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

// @desc    Update user salary
// @route   PUT /api/auth/updatesalary
// @access  Private
export const updateSalary = asyncHandler(async (req, res) => {
  const { salary } = req.body;

  if (typeof salary !== 'number' || salary < 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid salary amount'
    });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { monthlySalary: salary },
    { new: true, runValidators: true }
  );

  res.json({
    success: true,
    message: 'Salary updated successfully',
    data: {
      monthlySalary: user.monthlySalary
    }
  });
});

// @desc    Get user settings
// @route   GET /api/auth/settings
// @access  Private
export const getSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    success: true,
    data: user.settings
  });
});

// @desc    Update user settings
// @route   PUT /api/auth/settings
// @access  Private
export const updateSettings = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { settings: req.body },
    { new: true, runValidators: true }
  );
  res.json({
    success: true,
    message: 'Settings updated successfully',
    data: user.settings
  });
});

// @desc    Get user dashboard
// @route   GET /api/auth/dashboard
// @access  Private
export const getDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({
    success: true,
    data: user.dashboard
  });
});

// @desc    Update user dashboard
// @route   PUT /api/auth/dashboard
// @access  Private
export const updateDashboard = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { dashboard: req.body },
    { new: true, runValidators: true }
  );
  res.json({
    success: true,
    message: 'Dashboard updated successfully',
    data: user.dashboard
  });
}); 