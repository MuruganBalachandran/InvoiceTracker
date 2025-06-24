import React from 'react';
import { useAppSelector } from '../../redux/store';
import { DollarSign, FileText, Users, TrendingUp, TrendingDown } from 'lucide-react';

const StatsPanel: React.FC = () => {
  const { invoices, clients } = useAppSelector((state) => state.invoices);
  const { expenses, monthlySalary } = useAppSelector((state) => state.expenses);

  const totalInvoiceAmount = invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netIncome = totalInvoiceAmount - totalExpenses;
  const paidInvoices = invoices.filter(invoice => invoice.status === 'paid').length;

  const stats = [
    {
      title: 'Total Revenue',
      value: `$${totalInvoiceAmount.toLocaleString()}`,
      icon: <DollarSign className="h-8 w-8" />,
      color: 'bg-green-500',
      change: '+12.5%',
      changeType: 'positive',
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: <TrendingDown className="h-8 w-8" />,
      color: 'bg-red-500',
      change: '+3.2%',
      changeType: 'negative',
    },
    {
      title: 'Net Income',
      value: `$${netIncome.toLocaleString()}`,
      icon: <TrendingUp className="h-8 w-8" />,
      color: 'bg-blue-500',
      change: '+8.1%',
      changeType: 'positive',
    },
    {
      title: 'Paid Invoices',
      value: `${paidInvoices}/${invoices.length}`,
      icon: <FileText className="h-8 w-8" />,
      color: 'bg-purple-500',
      change: `${invoices.length > 0 ? Math.round((paidInvoices / invoices.length) * 100) : 0}%`,
      changeType: 'neutral',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
            </div>
            <div className={`${stat.color} text-white p-3 rounded-lg`}>
              {stat.icon}
            </div>
          </div>
          <div className="mt-4 flex items-center">
            <span
              className={`text-sm font-medium ${
                stat.changeType === 'positive'
                  ? 'text-green-600 dark:text-green-400'
                  : stat.changeType === 'negative'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {stat.change}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsPanel;