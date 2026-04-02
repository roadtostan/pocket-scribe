
import React, { useState, useMemo } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatCurrency } from '@/lib/formatCurrency';
import TransactionItem from './TransactionItem';
import { Input } from './ui/input';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

const ITEMS_PER_PAGE = 20;

const TransactionList = () => {
  const { transactions, deleteTransaction, selectedDate } = useFinance();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
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

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedDate, searchQuery]);
  
  // Sort all filtered transactions by date desc, then id desc
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
      if (dateDiff !== 0) return dateDiff;
      return Number(b.id) - Number(a.id);
    });
  }, [filteredTransactions]);

  const totalPages = Math.max(1, Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE));
  
  // Paginate
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTransactions.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTransactions, currentPage]);

  // Group paginated transactions by date
  const transactionsByDate = paginatedTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof paginatedTransactions>);

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
          <>
            {sortedDates.map(date => {
              const dailyTransactions = transactionsByDate[date];
              const dailyIncomeTotal = dailyTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
              const dailyExpenseTotal = dailyTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
              
              return (
                <div key={date}>
                  <div className="px-4 py-2 bg-muted font-medium">
                    {format(parseISO(date), 'eeee, dd MMMM yyyy', { locale: id })}
                  </div>
                  {dailyTransactions.map(transaction => (
                    <TransactionItem
                      key={transaction.id} 
                      transaction={transaction}
                      onDelete={deleteTransaction}
                    />
                  ))}
                  <div className="p-3 bg-muted/50 flex flex-col md:flex-row justify-between items-start md:items-center text-sm gap-2">
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
            })}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} ({sortedTransactions.length} items)
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
