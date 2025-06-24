import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EnhancedStatsPanel from '../components/dashboard/EnhancedStatsPanel';
import SalaryManager from '../components/dashboard/SalaryManager';
import SalaryVsSpentChart from '../components/dashboard/SalaryVsSpentChart';
import { Plus, FileText, DollarSign, Sparkles } from 'lucide-react';
import { fetchInvoices } from '../redux/invoiceSlice';
import { fetchExpenses } from '../redux/expenseSlice';
import { Invoice } from '../redux/types';
import { Expense } from '../redux/types';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, name } = useAppSelector((state) => state.user);
  const invoices: Invoice[] = useAppSelector((state) => state.invoices.invoices);
  const expenses: Expense[] = useAppSelector((state) => state.expenses.expenses);

  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchExpenses());
  }, [dispatch]);

  // Debug: Log the type and value of invoices and expenses
  console.log('invoices:', invoices, 'type:', typeof invoices, Array.isArray(invoices));
  console.log('expenses:', expenses, 'type:', typeof expenses, Array.isArray(expenses));

  const recentInvoices = Array.isArray(invoices) ? invoices.slice(-5).reverse() : [];
  const recentExpenses = Array.isArray(expenses) ? expenses.slice(-5).reverse() : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <Sparkles className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to InvoiceTracker
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Please sign in to access your personalized dashboard and start managing your finances like a pro.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign In
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-secondary-600 text-white rounded-xl font-semibold hover:bg-secondary-700 transition-colors shadow-lg hover:shadow-xl"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-gray-900 dark:text-white"
          >
            Welcome back, <span className="text-primary-600 dark:text-primary-400">{name}</span>! 👋
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 mt-2 text-lg"
          >
            Here's your financial overview and insights
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 lg:mt-0 flex flex-col sm:flex-row gap-3"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/invoices"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-600 to-blue-600 text-white rounded-xl font-semibold hover:from-primary-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Invoice
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/expenses"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-secondary-600 to-green-600 text-white rounded-xl font-semibold hover:from-secondary-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Expense
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Stats Panel */}
      <motion.div variants={itemVariants}>
        <EnhancedStatsPanel />
      </motion.div>

      {/* Salary Manager */}
      <motion.div variants={itemVariants}>
        <SalaryManager />
      </motion.div>

      {/* Charts */}
      <motion.div variants={itemVariants}>
        <SalaryVsSpentChart />
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Recent Invoices */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Invoices
              </h3>
            </div>
            <Link
              to="/invoices"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          
          {recentInvoices.length > 0 ? (
            <div className="space-y-4">
              {recentInvoices.map((invoice: Invoice, index: number) => (
                <motion.div
                  key={invoice.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <FileText className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        #{invoice.invoiceNumber}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {invoice.clientName}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${invoice.total.toFixed(2)}
                    </p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No invoices yet</p>
              <Link
                to="/invoices"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium hover:underline"
              >
                Create your first invoice
              </Link>
            </motion.div>
          )}
        </motion.div>

        {/* Recent Expenses */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Expenses
              </h3>
            </div>
            <Link
              to="/expenses"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          
          {recentExpenses.length > 0 ? (
            <div className="space-y-4">
              {recentExpenses.map((expense: Expense, index: number) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {expense.description}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {expense.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      ${expense.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(expense.date).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-500 dark:text-gray-400"
            >
              <DollarSign className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No expenses yet</p>
              <Link
                to="/expenses"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium hover:underline"
              >
                Add your first expense
              </Link>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;