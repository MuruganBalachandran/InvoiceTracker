import React from 'react';
import { useAppSelector } from '../redux/store';
import GlobalLoader from '../components/common/GlobalLoader';
import Layout from '../components/common/Layout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import CTA from '../components/home/CTA';

const Home: React.FC = () => {
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);
  const userLoading = useAppSelector(state => state.user.loading);
  const invoiceLoading = useAppSelector(state => (state.invoices as any).loading);
  const expenseLoading = useAppSelector(state => (state.expenses as any).loading);
  const loading = userLoading || invoiceLoading || expenseLoading;
  return (
    <>
      <GlobalLoader loading={loading} />
      <Layout fullWidth>
        <Hero isAuthenticated={isAuthenticated} />
        <Features />
        {!isAuthenticated && <CTA />}
      </Layout>
    </>
  );
};

export default Home;