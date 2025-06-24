import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppSelector } from '../../redux/store';

const SalaryVsSpentChart: React.FC = () => {
  const { expenses, monthlySalary } = useAppSelector((state) => state.expenses);
  const { invoices } = useAppSelector((state) => state.invoices);

  const totalIncome = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const barData = [
    {
      name: 'Income',
      amount: totalIncome,
      color: '#10b981',
    },
    {
      name: 'Expenses',
      amount: totalExpenses,
      color: '#ef4444',
    },
    {
      name: 'Net',
      amount: totalIncome - totalExpenses,
      color: '#3b82f6',
    },
  ];

  // Category breakdown for pie chart
  const categoryExpenses = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryExpenses).map(([category, amount]) => ({
    name: category,
    value: amount,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Income vs Expenses
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '8px',
                color: '#f9fafb',
              }}
            />
            <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Expense Categories
        </h3>
        {pieData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-300 text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <p className="text-lg font-medium">No expenses recorded</p>
              <p className="text-sm">Start tracking your expenses to see the breakdown</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryVsSpentChart;