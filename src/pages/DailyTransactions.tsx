
import React from 'react';
import { useParams } from 'react-router-dom';
import DailyTransactions from '@/components/DailyTransactions';

const DailyTransactionsPage = () => {
  const { date } = useParams();
  
  if (!date) {
    return <div>Invalid date parameter</div>;
  }
  
  return <DailyTransactions />;
};

export default DailyTransactionsPage;
