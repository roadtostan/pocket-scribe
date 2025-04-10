
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { formatCurrency } from '@/lib/formatCurrency';

const MonthlySummary = () => {
  const { transactions, currentBook } = useFinance();
  
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const monthlyTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate.getMonth() === currentMonth && 
           transactionDate.getFullYear() === currentYear;
  });
  
  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpense = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const balance = totalIncome - totalExpense;
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Monthly Summary</span>
          <span className="text-sm font-normal text-muted-foreground">
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col items-center p-3 bg-income/10 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Income</div>
            <div className="flex items-center text-income font-medium">
              <ArrowUpIcon size={16} className="mr-1" />
              <span>{formatCurrency(totalIncome)}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-expense/10 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Expense</div>
            <div className="flex items-center text-expense font-medium">
              <ArrowDownIcon size={16} className="mr-1" />
              <span>{formatCurrency(totalExpense)}</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center p-3 bg-gray-100 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Balance</div>
            <div className={`flex items-center font-medium ${balance >= 0 ? 'text-income' : 'text-expense'}`}>
              <span>{formatCurrency(balance)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlySummary;
