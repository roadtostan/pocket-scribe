
import React from 'react';
import Layout from '@/components/Layout';
import TransactionForm from '@/components/TransactionForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AddTransaction = () => {
  const navigate = useNavigate();
  
  return (
    <Layout>
      <div className="pt-6 pb-20">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold">Add Transaction</h1>
        </div>
        <TransactionForm />
      </div>
    </Layout>
  );
};

export default AddTransaction;
