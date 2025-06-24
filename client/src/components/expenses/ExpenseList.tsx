import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { deleteExpense, deleteExpenseAsync, updateExpenseAsync } from '../../redux/expenseSlice';
import { formatDate } from '../../utils/dateFormatter';
import { DollarSign, Trash2, Edit, MoreVertical, Calendar, Tag } from 'lucide-react';
import AddExpenseForm from './AddExpenseForm';

const ExpenseList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { expenses } = useAppSelector((state) => state.expenses);
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [editingExpense, setEditingExpense] = useState<any>(null);

  const categories = [...new Set(expenses.map(expense => expense.category))];
  
  const filteredExpenses = expenses.filter(expense => {
    if (filter === 'all') return true;
    return expense.category === filter;
  });

  const handleDelete = (expenseId: string) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      dispatch(deleteExpense(expenseId));
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    ];
    const index = category.length % colors.length;
    return colors[index];
  };

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
        duration: 0.5,
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
            filter === 'all'
              ? 'bg-primary-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          All
          <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
            {expenses.length}
          </span>
        </motion.button>
        {categories.map((category) => (
          <motion.button
            key={category}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === category
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {category}
            <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
              {expenses.filter(exp => exp.category === category).length}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Expense List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredExpenses.length > 0 ? (
            filteredExpenses
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((expense) => (
                <motion.div
                  key={expense.id}
                  variants={itemVariants}
                  layout
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {expense.description}
                        </h3>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(expense.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="h-4 w-4 text-gray-400" />
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(expense.category)}`}>
                              {expense.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                          -${expense.amount.toFixed(2)}
                        </p>
                      </div>

                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedExpense(selectedExpense === expense.id ? null : expense.id)}
                          className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </motion.button>

                        <AnimatePresence>
                          {selectedExpense === expense.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-10"
                            >
                              <div className="py-2">
                                <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setEditingExpense(expense)}>
                                  <Edit className="h-4 w-4" />
                                  <span>Edit</span>
                                </button>
                                <button
                                  onClick={() => dispatch(deleteExpenseAsync(expense.id))}
                                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span>Delete</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <DollarSign className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No expenses found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' 
                  ? "You haven't recorded any expenses yet."
                  : `No expenses found in the ${filter} category.`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit Expense Modal */}
      {editingExpense && (
        <AddExpenseForm
          onClose={() => setEditingExpense(null)}
          initialData={editingExpense}
          onSubmit={async (data) => {
            await dispatch(updateExpenseAsync({ id: editingExpense.id, expenseData: data }));
            setEditingExpense(null);
          }}
          isEdit
        />
      )}
    </div>
  );
};

export default ExpenseList;