import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const CTA: React.FC = () => {
  const benefits = [
    'Free to get started',
    'No setup fees',
    'Professional invoice templates',
    'Real-time expense tracking',
    'Comprehensive financial dashboard',
    'Client management tools',
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 dark:from-primary-800 dark:to-secondary-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-2xl mx-auto">
            Join thousands of professionals who trust InvoiceTracker to manage their 
            invoicing, expenses, and client relationships efficiently.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 text-white">
                <CheckCircle className="h-5 w-5 text-secondary-200 flex-shrink-0" />
                <span className="text-left">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-lg"
            >
              Start Your Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-transparent text-white border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="mt-12 text-primary-100">
            <p className="text-sm">
              * No credit card required • Cancel anytime • 100% secure
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;