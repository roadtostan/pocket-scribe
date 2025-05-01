
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinance } from '@/context/FinanceContext';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from 'lucide-react';
import { format, parseISO, isSameMonth, isSameYear } from 'date-fns';
import { id } from 'date-fns/locale';
import TransactionItem from '@/components/TransactionItem';
import { formatCurrency } from '@/lib/formatCurrency';

const FilteredTransactions = () => {
  const { filterType, filterId, month, year, transactionType } = useParams();
  const navigate = useNavigate();
  const { 
    transactions, 
    categories, 
    accounts, 
    members, 
    deleteTransaction,
  } = useFinance();
  
  // Get filter name
  let filterName = '';
  if (filterType === 'category') {
    const category = categories.find(c => c.id === filterId);
    filterName = category?.name || 'Unknown Category';
  } else if (filterType === 'account') {
    const account = accounts.find(a => a.id === filterId);
    filterName = account?.name || 'Unknown Account';
  } else if (filterType === 'member') {
    const member = members.find(m => m.id === filterId);
    filterName = member?.name || 'Unknown Member';
  }
  
  // Filter transactions
  const filteredTransactions = transactions.filter(t => {
    // Skip transfers for category and account filters
    if (filterType !== 'member' && 'type' in t && t.type === 'transfer') return false;
    
    // Filter by transaction type
    if (transactionType && 'type' in t && t.type !== transactionType) return false;
    
    // Filter by date
    const transactionDate = parseISO(t.date);
    if (month && year) {
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10);
      if (!isSameMonth(transactionDate, new Date(yearNum, monthNum - 1)) || 
          !isSameYear(transactionDate, new Date(yearNum, 0))) {
        return false;
      }
    }
    
    // Filter by category/account/member
    if (filterType === 'category') {
      return 'categoryId' in t && t.categoryId === filterId;
    } else if (filterType === 'account') {
      if ('accountId' in t) {
        return t.accountId === filterId;
      }
      return false;
    } else if (filterType === 'member') {
      return t.memberId === filterId;
    }
    
    return false;
  });
  
  // Group transactions by date
  const transactionsByDate = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof filteredTransactions>);

  // Sort dates in descending order
  const sortedDates = Object.keys(transactionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });
  
  // Calculate total
  const total = filteredTransactions.reduce((sum, t) => {
    if ('type' in t) {
      if (t.type === 'income') return sum + t.amount;
      if (t.type === 'expense') return sum - t.amount;
    }
    return sum;
  }, 0);

  return (
    <Layout>
      <div className="pt-6 pb-20">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/analysis')}
        >
          <ChevronLeft className="mr-2" size={16} />
          Back to Analysis
        </Button>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {transactionType ? `${transactionType === 'income' ? 'Income' : 'Expense'} for ` : 'Transactions for '}
              {filterName}
            </CardTitle>
            <div className={total >= 0 ? 'text-income' : 'text-expense'}>
              {formatCurrency(total)}
            </div>
          </CardHeader>
          <CardContent className="px-0">
            {sortedDates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No transactions found</div>
            ) : (
              sortedDates.map(date => {
                const dailyTransactions = transactionsByDate[date];
                
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
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default FilteredTransactions;
