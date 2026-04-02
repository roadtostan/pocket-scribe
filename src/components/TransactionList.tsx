
import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatCurrency } from '@/lib/formatCurrency';
import TransactionItem from './TransactionItem';
import { Input } from './ui/input';
import { Search, X } from 'lucide-react';
import { Button } from './ui/button';

const TransactionList = () => {
  const { transactions, deleteTransaction, selectedDate } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Filter transactions for the selected month and year
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = parseISO(t.date);
      const matchesDate = isSameMonth(transactionDate, selectedDate) && 
             isSameYear(transactionDate, selectedDate);
      if (!matchesDate) return false;
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const desc = (t.description || '').toLowerCase();
        return desc.includes(query);
      }
      return true;
    });
  }, [transactions, selectedDate, searchQuery]);
  
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
        <div className="flex items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowSearch(!showSearch);
              if (showSearch) setSearchQuery('');
            }}
            className="h-8 w-8"
          >
            {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        {showSearch && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>
        )}
      </CardHeader>
      <CardContent className="px-0">
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery ? 'No transactions found' : 'No transactions yet'}
          </div>
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
