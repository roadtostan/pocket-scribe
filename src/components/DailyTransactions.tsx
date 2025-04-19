
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from '@/context/FinanceContext';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { format, parseISO, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import TransactionItem from './TransactionItem';

const DailyTransactions = () => {
  const { date } = useParams();
  const navigate = useNavigate();
  const { transactions, deleteTransaction } = useFinance();
  
  const dailyTransactions = transactions.filter(t => 
    date && isSameDay(parseISO(t.date), parseISO(date))
  );
  
  const dailyIncomeTotal = dailyTransactions.reduce((sum, t) => {
    if ('type' in t && t.type === 'income') return sum + t.amount;
    return sum;
  }, 0);
  
  const dailyExpenseTotal = dailyTransactions.reduce((sum, t) => {
    if ('type' in t && t.type === 'expense') return sum + t.amount;
    return sum;
  }, 0);

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate('/')}
      >
        <ChevronLeft className="mr-2" size={16} />
        Back to Calendar
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>
            Transactions for {date && format(parseISO(date), 'EEEE, dd MMMM yyyy', { locale: id })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {dailyTransactions.map(transaction => (
            <TransactionItem 
              key={transaction.id} 
              transaction={transaction}
              onDelete={deleteTransaction}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default DailyTransactions;
