import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../redux/store';
import { fetchInvoices } from '../redux/invoiceSlice';
import InvoiceForm from '../components/invoice/InvoiceForm';
import InvoiceList from '../components/invoice/InvoiceList';
import { Plus, FileText, DollarSign, Clock, CheckCircle } from 'lucide-react';

const Invoices: React.FC = () => {
  const dispatch = useAppDispatch();
  const { invoices } = useAppSelector((state) => state.invoices);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  React.useEffect(() => {
    dispatch(fetchInvoices());
  }, [dispatch]);

  const stats = [
    {
      title: 'Total Invoices',
      value: invoices.length,
      icon: <FileText className="h-6 w-6" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Amount',
      value: `$${invoices.reduce((sum, inv) => sum + inv.total, 0).toLocaleString()}`,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-green-500',
    },
    {
      title: 'Pending',
      value: invoices.filter(inv => inv.status === 'sent').length,
      icon: <Clock className="h-6 w-6" />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Paid',
      value: invoices.filter(inv => inv.status === 'paid').length,
      icon: <CheckCircle className="h-6 w-6" />,
      color: 'bg-emerald-500',
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
            Invoices
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your invoices and track payments
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowInvoiceForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Invoice
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

      {/* Invoice List */}
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <InvoiceList />
      </motion.div>

      {/* Invoice Form Modal */}
      <AnimatePresence>
        {showInvoiceForm && (
          <InvoiceForm onClose={() => setShowInvoiceForm(false)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Invoices;