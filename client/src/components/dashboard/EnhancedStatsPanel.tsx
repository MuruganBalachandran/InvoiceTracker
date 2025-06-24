import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../redux/store';
import { DollarSign, FileText, TrendingUp, TrendingDown, Target, PiggyBank, AlertTriangle, CheckCircle } from 'lucide-react';

const EnhancedStatsPanel: React.FC = () => {
  const { invoices, clients } = useAppSelector((state) => state.invoices);
  const { expenses, monthlySalary } = useAppSelector((state) => state.expenses);

  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netIncome = totalInvoiceAmount - totalExpenses;
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;
  const remainingBudget = monthlySalary - totalExpenses;
  const savingsRate = monthlySalary > 0 ? ((remainingBudget / monthlySalary) * 100) : 0;

  // Calculate month-over-month changes (mock data for demo)
  const monthlyGrowth = {
    revenue: 12.5,
    expenses: 3.2,
    savings: 8.1,
    invoices: 15.3,
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalInvoiceAmount.toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'from-green-500 to-emerald-500',
      change: `+${monthlyGrowth.revenue}%`,
      changeType: 'positive',
      description: 'From all invoices',
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: <TrendingDown className="h-8 w-8" />,
      color: 'from-red-500 to-pink-500',
      change: `+${monthlyGrowth.expenses}%`,
      changeType: 'negative',
      description: 'This month',
    },
    {
      title: 'Net Income',
      value: `$${netIncome.toLocaleString()}`,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'from-blue-500 to-cyan-500',
      change: `+${monthlyGrowth.savings}%`,
      changeType: 'positive',
      description: 'Profit margin',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      icon: <PiggyBank className="h-8 w-8" />,
      color: 'from-purple-500 to-indigo-500',
      change: savingsRate >= 20 ? 'Excellent' : savingsRate >= 10 ? 'Good' : 'Improve',
      changeType: savingsRate >= 20 ? 'positive' : savingsRate >= 10 ? 'neutral' : 'negative',
      description: 'Of monthly income',
    },
    {
      title: 'Active Invoices',
      value: `${paidInvoices}/${invoices.length}`,
      icon: <FileText className="h-8 w-8" />,
      color: 'from-orange-500 to-yellow-500',
      change: `+${monthlyGrowth.invoices}%`,
      changeType: 'positive',
      description: 'Payment rate',
    },
    {
      title: 'Budget Status',
      value: remainingBudget >= 0 ? `$${remainingBudget.toLocaleString()}` : `-$${Math.abs(remainingBudget).toLocaleString()}`,
      icon: remainingBudget >= 0 ? <CheckCircle className="h-8 w-8" /> : <AlertTriangle className="h-8 w-8" />,
      color: remainingBudget >= 0 ? 'from-teal-500 to-green-500' : 'from-red-500 to-orange-500',
      change: remainingBudget >= 0 ? 'On Track' : 'Over Budget',
      changeType: remainingBudget >= 0 ? 'positive' : 'negative',
      description: remainingBudget >= 0 ? 'Remaining' : 'Overspent',
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
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
    >
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ scale: 1.02, y: -5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden relative"
        >
          {/* Background Gradient */}
          <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -mr-16 -mt-16`} />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    stat.changeType === 'positive'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                      : stat.changeType === 'negative'
                      ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                {stat.title}
              </p>
              <motion.p
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                className="text-3xl font-bold text-gray-900 dark:text-white"
              >
                {stat.value}
              </motion.p>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {stat.description}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default EnhancedStatsPanel;