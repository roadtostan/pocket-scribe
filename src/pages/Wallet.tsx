
import React from 'react';
import Layout from '@/components/Layout';
import AccountsList from '@/components/AccountsList';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from '@/context/FinanceContext';
import { formatCurrency } from '@/lib/formatCurrency';

const Wallet = () => {
  const { accounts } = useFinance();
  
  const totalAssets = accounts
    .filter(account => account.type !== 'Debt')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const totalDebt = accounts
    .filter(account => account.type === 'Debt')
    .reduce((sum, account) => sum + account.balance, 0);
    
  const netWorth = totalAssets - totalDebt;
  
  return (
    <Layout>
      <div className="pt-6 pb-20">
        <h1 className="text-2xl font-bold mb-6">Wallet</h1>
        
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="bg-income/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-income text-lg font-semibold ${totalAssets >= 1000000 ? 'text-base' : 'text-lg'}`}>
                {formatCurrency(totalAssets)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-expense/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-expense text-lg font-semibold ${totalDebt >= 1000000 ? 'text-base' : 'text-lg'}`}>
                {formatCurrency(totalDebt)}
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gray-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Worth</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`font-semibold ${netWorth >= 0 ? 'text-income' : 'text-expense'} ${Math.abs(netWorth) >= 1000000 ? 'text-base' : 'text-lg'}`}>
                {formatCurrency(netWorth)}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <AccountsList />
      </div>
    </Layout>
  );
};

export default Wallet;
