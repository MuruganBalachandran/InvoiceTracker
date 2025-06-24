import React from 'react';
import { 
  FileText, 
  DollarSign, 
  BarChart3, 
  Users, 
  Download, 
  Shield,
  Smartphone,
  Clock
} from 'lucide-react';

const Features: React.FC = () => {
  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: 'Invoice Generation',
      description: 'Create professional invoices with customizable templates and automatic calculations.',
      color: 'bg-blue-500',
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: 'Expense Tracking',
      description: 'Monitor your spending with detailed categorization and real-time analytics.',
      color: 'bg-green-500',
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: 'Financial Dashboard',
      description: 'Visualize your financial data with interactive charts and comprehensive reports.',
      color: 'bg-purple-500',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Client Management',
      description: 'Organize client information and track payment history effortlessly.',
      color: 'bg-orange-500',
    },
    {
      icon: <Download className="h-8 w-8" />,
      title: 'PDF Export',
      description: 'Export invoices and reports as professional PDF documents instantly.',
      color: 'bg-red-500',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Secure & Private',
      description: 'Your financial data is protected with enterprise-grade security measures.',
      color: 'bg-indigo-500',
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: 'Mobile Responsive',
      description: 'Access your financial tools on any device with our responsive design.',
      color: 'bg-pink-500',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: 'Real-time Updates',
      description: 'Stay updated with real-time notifications and automatic data synchronization.',
      color: 'bg-teal-500',
    },
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Our comprehensive suite of tools helps you streamline your financial processes, 
            from invoicing to expense tracking and client management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} text-white rounded-lg mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;