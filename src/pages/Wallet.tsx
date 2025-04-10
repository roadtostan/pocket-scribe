
import React from 'react';
import Layout from '@/components/Layout';
import AccountsList from '@/components/AccountsList';

const Wallet = () => {
  return (
    <Layout>
      <div className="pt-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>
        <AccountsList />
      </div>
    </Layout>
  );
};

export default Wallet;
