
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import ChartAnalysis from '@/components/ChartAnalysis';
import { useFinance } from '@/context/FinanceContext';
import FinancialTrend from '@/components/FinancialTrend';

const Analysis = () => {
  const { currentBook, fetchTransactionsForBook, fetchCategoriesForBook } = useFinance();
  
  useEffect(() => {
    if (currentBook?.id) {
      fetchTransactionsForBook(currentBook.id);
      fetchCategoriesForBook(currentBook.id);
    }
  }, [currentBook?.id, fetchTransactionsForBook, fetchCategoriesForBook]);

  return (
    <Layout>
      <div className="pt-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">Analysis</h1>
        <ChartAnalysis />
        <FinancialTrend />
      </div>
    </Layout>
  );
};

export default Analysis;
