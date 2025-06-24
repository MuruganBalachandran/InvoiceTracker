import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import { registerUser, clearError } from '../../redux/userSlice';
import { validateEmail, validatePassword } from '../../utils/auth';
import { Eye, EyeOff, UserPlus, Sparkles, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useAppSelector((state) => state.user);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error for this field
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
    // Clear Redux error
    if (error) dispatch(clearError());
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters, include a letter, a number, and a symbol.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const { confirmPassword, ...signupData } = formData;
    dispatch(registerUser(signupData));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 overflow-hidden">
      {/* Animated, glowing, floating orbs for a magical effect */}
      <motion.div animate={{ y: [0, 30, 0] }} transition={{ repeat: Infinity, duration: 8 }} className="absolute top-10 left-10 w-40 h-40 bg-pink-400/20 rounded-full blur-2xl z-0" />
      <motion.div animate={{ y: [0, -30, 0] }} transition={{ repeat: Infinity, duration: 10 }} className="absolute bottom-20 right-20 w-56 h-56 bg-indigo-400/20 rounded-full blur-3xl z-0" />
      <motion.div animate={{ x: [0, 40, 0] }} transition={{ repeat: Infinity, duration: 12 }} className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-400/30 rounded-full blur-xl z-0" />
      {/* Glassmorphism Card with animated border and glow */}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }} className="relative z-10 max-w-md w-full mx-auto glass-card px-10 py-12 rounded-3xl shadow-2xl border border-white/20 backdrop-blur-2xl bg-white/10">
        <div className="flex flex-col items-center mb-8">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }} className="bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 p-4 rounded-full shadow-lg mb-4">
            <UserPlus className="h-8 w-8 text-white drop-shadow-lg" />
          </motion.div>
          <h2 className="text-3xl font-extrabold text-white text-center tracking-tight drop-shadow-lg">Create your account</h2>
          <p className="mt-2 text-center text-base text-white/80">Join InvoiceTracker and experience next-level financial management.</p>
        </div>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {(error || errors.general) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="text-red-700 dark:text-red-400 text-sm">{error || errors.general}</div>
            </motion.div>
          )}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-white/80 mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-400 focus:bg-white/30 transition-all duration-300 outline-none shadow-inner"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-1">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-pink-400 focus:bg-white/30 transition-all duration-300 outline-none shadow-inner"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-1">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition-all duration-300 outline-none shadow-inner pr-12"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-white/60" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/60" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white/80 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-white/20 bg-white/20 text-white placeholder-white/60 focus:ring-2 focus:ring-indigo-400 focus:bg-white/30 transition-all duration-300 outline-none shadow-inner pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-white/60" />
                  ) : (
                    <Eye className="h-5 w-5 text-white/60" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3 px-6 rounded-xl font-bold text-lg bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white shadow-lg hover:from-pink-400 hover:to-indigo-400 focus:outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Sparkles className="h-5 w-5 animate-pulse" />
            {loading ? 'Creating account...' : 'Create account'}
          </motion.button>
        </form>
        <div className="mt-8 flex flex-col items-center">
          <p className="text-white/70 text-sm mb-2">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-pink-300 hover:underline">Sign in here</Link>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="h-4 w-4 text-indigo-300 animate-bounce" />
            <span className="text-xs text-white/50">Your data is encrypted and secure</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SignupForm;