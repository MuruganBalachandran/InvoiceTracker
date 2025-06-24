import React from 'react';
import Layout from '../components/common/Layout';
import Hero from '../components/home/Hero';
import Features from '../components/home/Features';
import CTA from '../components/home/CTA';

const Home: React.FC = () => {
  return (
    <Layout fullWidth>
      <Hero />
      <Features />
      <CTA />
    </Layout>
  );
};

export default Home;