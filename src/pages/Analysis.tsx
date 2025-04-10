
import React from 'react';
import Layout from '@/components/Layout';
import ChartAnalysis from '@/components/ChartAnalysis';

const Analysis = () => {
  return (
    <Layout>
      <div className="pt-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">Analysis</h1>
        <ChartAnalysis />
      </div>
    </Layout>
  );
};

export default Analysis;
