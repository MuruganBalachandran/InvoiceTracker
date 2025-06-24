import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { fetchExpenses } from '../redux/expenseSlice';
import AddExpenseForm from '../components/expenses/AddExpenseForm';
import ExpenseList from '../components/expenses/ExpenseList';
import { Plus, DollarSign, TrendingDown, Calendar, PieChart } from 'lucide-react';

const Expenses: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses } = useAppSelector((state) => state.expenses);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

  React.useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonthExpenses = expenses.filter(exp => {
    const expenseDate = new Date(exp.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  }).reduce((sum, exp) => sum + exp.amount, 0);

  const categories = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const topCategory = Object.entries(categories).sort(([,a], [,b]) => b - a)[0];

  const stats = [
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-red-500',
    },
    {
      title: 'This Month',
      value: `$${thisMonthExpenses.toLocaleString()}`,
      icon: <Calendar className="h-6 w-6" />,
      color: 'bg-orange-500',
    },
    {
      title: 'Categories',
      value: Object.keys(categories).length,
      icon: <PieChart className="h-6 w-6" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Top Category',
      value: topCategory ? topCategory[0] : 'None',
      icon: <TrendingDown className="h-6 w-6" />,
      color: 'bg-indigo-500',
    },
  ];

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Expenses
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and categorize your business expenses
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowExpenseForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Expense
        </motion.button>
      </motion.div>

      {/* Stats */}
      <motion.div
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Expense List */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <ExpenseList />
      </motion.div>

      {/* Add Expense Form Modal */}
      <AnimatePresence>
        {showExpenseForm && (
          <AddExpenseForm onClose={() => setShowExpenseForm(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Expenses;