import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { updateUserSalary, updateSalaryAllocation } from '../../redux/userSlice';
import { Edit3, Save, X, DollarSign, TrendingUp, TrendingDown, AlertCircle, CheckCircle, Target } from 'lucide-react';

const SalaryManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const { monthlySalary, salaryAllocation } = useAppSelector((state) => state.user);
  const { expenses } = useAppSelector((state) => state.expenses);
  const [isEditing, setIsEditing] = useState(false);
  const [tempSalary, setTempSalary] = useState(monthlySalary?.toString() ?? '0');

  // Allocation state for editing
  const [alloc, setAlloc] = useState({
    needs: salaryAllocation?.needs ?? 50,
    wants: salaryAllocation?.wants ?? 30,
    savings: salaryAllocation?.savings ?? 20,
  });
  const [isEditingAlloc, setIsEditingAlloc] = useState(false);

  useEffect(() => {
    setTempSalary(monthlySalary?.toString() ?? '0');
  }, [monthlySalary]);

  useEffect(() => {
    setAlloc({
      needs: salaryAllocation?.needs ?? 50,
      wants: salaryAllocation?.wants ?? 30,
      savings: salaryAllocation?.savings ?? 20,
    });
  }, [salaryAllocation]);

  const salary = monthlySalary || 0;
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingAmount = salary - totalExpenses;
  const spendingPercentage = salary > 0 ? (totalExpenses / salary) * 100 : 0;

  // Use allocation for calculations
  const suggestedSavings = salary * (alloc.savings / 100);
  const suggestedHome = salary * (alloc.wants / 100);
  const suggestedOther = salary * (alloc.needs / 100);

  const actualSavings = Math.max(0, remainingAmount);
  const savingsPercentage = salary > 0 ? (actualSavings / salary) * 100 : 0;

  const handleSave = () => {
    const newSalary = parseFloat(tempSalary) || 0;
    dispatch(updateUserSalary(newSalary));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempSalary(salary.toString());
    setIsEditing(false);
  };

  // Allocation edit handlers
  const handleAllocChange = (field: 'needs' | 'wants' | 'savings', value: number) => {
    setAlloc((prev) => ({ ...prev, [field]: value }));
  };
  const handleSaveAlloc = () => {
    const total = alloc.needs + alloc.wants + alloc.savings;
    if (total === 100) {
      dispatch(updateSalaryAllocation(alloc));
      setIsEditingAlloc(false);
    } else {
      alert('Allocation must total 100%.');
    }
  };
  const handleCancelAlloc = () => {
    setAlloc({
      needs: salaryAllocation?.needs ?? 50,
      wants: salaryAllocation?.wants ?? 30,
      savings: salaryAllocation?.savings ?? 20,
    });
    setIsEditingAlloc(false);
  };

  const getSpendingStatus = () => {
    if (spendingPercentage <= 50) return { status: 'excellent', color: 'text-green-500', icon: CheckCircle };
    if (spendingPercentage <= 70) return { status: 'good', color: 'text-blue-500', icon: TrendingUp };
    if (spendingPercentage <= 90) return { status: 'warning', color: 'text-yellow-500', icon: AlertCircle };
    return { status: 'danger', color: 'text-red-500', icon: TrendingDown };
  };

  const spendingStatus = getSpendingStatus();
  const StatusIcon = spendingStatus.icon;

  const getAnalyticsMessage = () => {
    if (salary === 0) return "Set your monthly salary to get personalized insights!";
    
    if (spendingPercentage <= 50) {
      return `Excellent! You're only spending ${spendingPercentage.toFixed(1)}% of your income. You've saved $${actualSavings.toLocaleString()} this month - consider investing!`;
    } else if (spendingPercentage <= 70) {
      return `Good job! You're spending ${spendingPercentage.toFixed(1)}% of your income. You have $${actualSavings.toLocaleString()} left for savings.`;
    } else if (spendingPercentage <= 90) {
      return `Be careful! You're spending ${spendingPercentage.toFixed(1)}% of your income. Only $${actualSavings.toLocaleString()} left for emergencies.`;
    } else if (remainingAmount >= 0) {
      return `Warning! You're spending ${spendingPercentage.toFixed(1)}% of your income. Only $${actualSavings.toLocaleString()} remaining.`;
    } else {
      return `Alert! You're overspending by $${Math.abs(remainingAmount).toLocaleString()}. Time to review your expenses!`;
    }
  };

  const getInvestmentSuggestion = () => {
    if (actualSavings >= 20000) {
      return "🎉 Amazing! With $" + actualSavings.toLocaleString() + " saved, you could start a diversified investment portfolio!";
    } else if (actualSavings >= 10000) {
      return "💡 Great progress! Consider starting with index funds or ETFs with your $" + actualSavings.toLocaleString() + " savings.";
    } else if (actualSavings >= 5000) {
      return "🌱 You're building wealth! Your $" + actualSavings.toLocaleString() + " could be a great emergency fund start.";
    } else if (actualSavings > 0) {
      return "🎯 Keep saving! Every dollar counts towards your financial goals.";
    } else {
      return "📊 Focus on reducing expenses to start building your savings.";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
    >
      {/* Salary Input Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Salary</h2>
            <p className="text-gray-600 dark:text-gray-400">Manage your income and track spending</p>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-2"
            >
              <input
                type="number"
                value={tempSalary}
                onChange={(e) => setTempSalary(e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0"
                autoFocus
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleSave}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleCancel}
                className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center space-x-4"
            >
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                ${salary.toLocaleString()}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsEditing(true)}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="h-4 w-4" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Analytics Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`p-6 rounded-xl mb-6 ${
          spendingStatus.status === 'excellent' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' :
          spendingStatus.status === 'good' ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800' :
          spendingStatus.status === 'warning' ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800' :
          'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}
      >
        <div className="flex items-start space-x-3">
          <StatusIcon className={`h-6 w-6 ${spendingStatus.color} mt-1`} />
          <div>
            <p className={`font-semibold ${spendingStatus.color} mb-2`}>Financial Analysis</p>
            <p className="text-gray-700 dark:text-gray-300 mb-3">{getAnalyticsMessage()}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">{getInvestmentSuggestion()}</p>
          </div>
        </div>
      </motion.div>

      {/* Spending Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-700 dark:text-green-300 font-medium">Income</span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-800 dark:text-green-200">
            ${salary.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-700 dark:text-red-300 font-medium">Expenses</span>
            <TrendingDown className="h-5 w-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-800 dark:text-red-200">
            ${totalExpenses.toLocaleString()}
          </p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className={`bg-gradient-to-r p-6 rounded-xl border ${
            remainingAmount >= 0 
              ? 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800'
              : 'from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className={`font-medium ${remainingAmount >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
              {remainingAmount >= 0 ? 'Remaining' : 'Overspent'}
            </span>
            <Target className={`h-5 w-5 ${remainingAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
          </div>
          <p className={`text-2xl font-bold ${remainingAmount >= 0 ? 'text-blue-800 dark:text-blue-200' : 'text-red-800 dark:text-red-200'}`}>
            ${Math.abs(remainingAmount).toLocaleString()}
          </p>
        </motion.div>
      </div>

      {/* Salary Allocation Suggestions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800"
      >
        <h3 className="text-lg font-bold text-purple-800 dark:text-purple-200 mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Smart Salary Allocation
        </h3>
        {isEditingAlloc ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {(['needs', 'wants', 'savings'] as const).map((field) => (
              <div className="text-center" key={field}>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={alloc[field]}
                  onChange={e => handleAllocChange(field, Number(e.target.value))}
                  className="w-16 text-center px-2 py-1 border rounded-lg mb-2"
                />
                <span className="ml-2 font-bold">%</span>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1 capitalize">{field}</h4>
              </div>
            ))}
          </div>
        ) : null}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">{alloc.needs}%</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Needs & Bills</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${suggestedOther.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rent, groceries, utilities</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">{alloc.wants}%</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Wants & Fun</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              ${suggestedHome.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Entertainment, dining out</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white font-bold text-lg">{alloc.savings}%</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Savings & Investing</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              ${suggestedSavings.toLocaleString()}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Emergency fund, investments</p>
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          {isEditingAlloc ? (
            <>
              <button onClick={handleSaveAlloc} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Save</button>
              <button onClick={handleCancelAlloc} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">Cancel</button>
            </>
          ) : (
            <button onClick={() => setIsEditingAlloc(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit Allocation</button>
          )}
        </div>
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Current Savings Rate</span>
            <span>{savingsPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(savingsPercentage, 100)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-3 rounded-full ${
                savingsPercentage >= 20 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                savingsPercentage >= 10 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                'bg-gradient-to-r from-red-500 to-pink-500'
              }`}
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Target: {alloc.savings}% savings rate
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SalaryManager;