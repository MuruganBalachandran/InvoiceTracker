import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../redux/store';
import { updateInvoiceStatusAsync, deleteInvoiceAsync, updateInvoiceAsync } from '../../redux/invoiceSlice';
import { formatDate } from '../../utils/dateFormatter';
import { FileText, Eye, Edit, Trash2, Download, MoreVertical, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import InvoiceForm from './InvoiceForm';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { generateInvoicePDF } from '../../utils/pdfGenerator.tsx';
import { Invoice } from '../../redux/types';

const InvoiceList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { invoices } = useAppSelector((state) => state.invoices);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'paid' | 'overdue'>('all');
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const filteredInvoices = invoices.filter((invoice: Invoice) => {
    if (filter === 'all') return true;
    return invoice.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const handleStatusChange = (invoiceId: string, newStatus: any) => {
    dispatch(updateInvoiceStatusAsync({ id: invoiceId, status: newStatus }));
  };

  const handleDelete = (invoiceId: string) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      dispatch(deleteInvoiceAsync(invoiceId));
    }
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
        {['all', 'draft', 'sent', 'paid', 'overdue'].map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              filter === status
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">
              {status === 'all' ? invoices.length : invoices.filter(inv => inv.status === status).length}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Invoice List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <AnimatePresence>
          {filteredInvoices.length > 0 ? (
            filteredInvoices.map((invoice: Invoice) => (
              <motion.div
                key={invoice.id}
                variants={itemVariants}
                layout
                whileHover={{ scale: 1.02, y: -2 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {invoice.invoiceNumber}
                        </h3>
                        <span className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                          {getStatusIcon(invoice.status)}
                          <span>{invoice.status}</span>
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">{invoice.clientName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
                        <span>Issue: {formatDate(invoice.issueDate)}</span>
                        <span>Due: {formatDate(invoice.dueDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${invoice.total.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <div className="relative">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedInvoice(selectedInvoice === invoice.id ? null : invoice.id)}
                        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </motion.button>

                      <AnimatePresence>
                        {selectedInvoice === invoice.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                          >
                            <div className="py-2">
                              <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <Eye className="h-4 w-4" />
                                <span>View</span>
                              </button>
                              <button className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onClick={() => setEditingInvoice(invoice)}>
                                <Edit className="h-4 w-4" />
                                <span>Edit</span>
                              </button>
                              {/* @ts-expect-error PDFDownloadLink children typing issue */}
                              <PDFDownloadLink
                                document={generateInvoicePDF(invoice, invoice.clientName)}
                                fileName={`Invoice-${invoice.invoiceNumber}.pdf`}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                              >
                                {({ loading }: { loading: boolean }) => (
                                  <>
                                    <Download className="h-4 w-4" />
                                    <span>{loading ? 'Preparing PDF...' : 'Download PDF'}</span>
                                  </>
                                )}
                              </PDFDownloadLink>
                              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                              <div className="px-4 py-2">
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Change Status</p>
                                <div className="space-y-1">
                                  {['draft', 'sent', 'paid', 'overdue'].map((status) => (
                                    <button
                                      key={status}
                                      onMouseDown={e => { e.preventDefault(); handleStatusChange(invoice.id, status); }}
                                      className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                                        invoice.status === status
                                          ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200'
                                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                      }`}
                                    >
                                      {status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                              <button
                                onClick={() => handleDelete(invoice.id)}
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
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No invoices found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' 
                  ? "You haven't created any invoices yet."
                  : `No ${filter} invoices found.`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <InvoiceForm
          onClose={() => setEditingInvoice(null)}
          initialData={editingInvoice}
          onSubmit={async (data) => {
            await dispatch(updateInvoiceAsync({ id: editingInvoice.id, invoiceData: data }));
            setEditingInvoice(null);
          }}
          isEdit
        />
      )}
    </div>
  );
};

export default InvoiceList;