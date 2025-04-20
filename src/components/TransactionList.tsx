
import React from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatCurrency } from '@/lib/formatCurrency';
import TransactionItem from './TransactionItem';

const TransactionList = () => {
  const { transactions, deleteTransaction, selectedDate } = useFinance();
  
  // Filter transactions for the selected month and year
  const filteredTransactions = transactions.filter(t => {
    const transactionDate = parseISO(t.date);
    return isSameMonth(transactionDate, selectedDate) && 
           isSameYear(transactionDate, selectedDate);
  });
  
  // Group transactions by date
  const transactionsByDate = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof transactions>);

  // Sort dates in descending order
  const sortedDates = Object.keys(transactionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No transactions yet</div>
        ) : (
          sortedDates.map(date => {
            const dailyTransactions = transactionsByDate[date];
            const dailyIncomeTotal = dailyTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + t.amount, 0);
            const dailyExpenseTotal = dailyTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + t.amount, 0);
            
            return (
              <div key={date}>
                <div className="px-4 py-2 bg-gray-50 font-medium">
                  {format(parseISO(date), 'eeee, dd MMMM yyyy', { locale: id })}
                </div>
                {dailyTransactions
                  .sort((a, b) => Number(b.id) - Number(a.id))
                  .map(transaction => (
                    <TransactionItem
                      key={transaction.id} 
                      transaction={transaction}
                      onDelete={deleteTransaction}
                    />
                  ))
                }
                <div className="p-3 bg-gray-50/50 flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-2">
                  <span>Daily Totals:</span>
                  <div className="space-x-4">
                    <span className="text-income">
                      In: {formatCurrency(dailyIncomeTotal)}
                    </span>
                    <span className="text-expense">
                      Out: {formatCurrency(dailyExpenseTotal)}
                    </span>
                    <span className={dailyIncomeTotal - dailyExpenseTotal >= 0 ? 'text-income' : 'text-expense'}>
                      Net: {formatCurrency(dailyIncomeTotal - dailyExpenseTotal)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
