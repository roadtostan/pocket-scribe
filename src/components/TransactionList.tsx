
import React from 'react';
import { useFinance, TransactionType } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, parseISO } from 'date-fns';
import CategoryIcon from './CategoryIcon';
import { cn } from '@/lib/utils';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { formatCurrency } from '@/lib/formatCurrency';

interface TransactionItemProps {
  transaction: TransactionType;
  onDelete: (id: string) => void;
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { categories, accounts, members } = useFinance();
  
  const category = categories.find(c => c.id === transaction.categoryId);
  const account = accounts.find(a => a.id === transaction.accountId);
  const member = members.find(m => m.id === transaction.memberId);

  return (
    <div className="flex items-center justify-between p-3 border-b last:border-b-0">
      <div className="flex items-center gap-3">
        <div 
          className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full",
            transaction.type === 'income' ? 'bg-income/20 text-income' : 'bg-expense/20 text-expense'
          )}
        >
          {category && <CategoryIcon iconName={category.icon} />}
        </div>
        <div>
          <div className="font-medium">{category?.name}</div>
          <div className="text-sm text-gray-500">
            {transaction.description} • {account?.name} • {member?.name}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className={cn(
          "font-medium",
          transaction.type === 'income' ? 'text-income' : 'text-expense'
        )}>
          {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(transaction.id)}
          className="text-gray-400 hover:text-expense"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
};

const TransactionList = () => {
  const { transactions, deleteTransaction } = useFinance();
  
  // Group transactions by date
  const transactionsByDate = transactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, TransactionType[]>);

  // Sort dates in descending order
  const sortedDates = Object.keys(transactionsByDate).sort((a, b) => {
    return new Date(b).getTime() - new Date(a).getTime();
  });

  const handleDelete = (id: string) => {
    deleteTransaction(id);
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {sortedDates.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No transactions yet</div>
        ) : (
          sortedDates.map(date => (
            <div key={date}>
              <div className="px-4 py-2 bg-gray-50 font-medium">
                {format(parseISO(date), 'EEEE, MMMM d, yyyy')}
              </div>
              {transactionsByDate[date]
                .sort((a, b) => Number(b.id) - Number(a.id))
                .map(transaction => (
                  <TransactionItem 
                    key={transaction.id} 
                    transaction={transaction} 
                    onDelete={handleDelete}
                  />
                ))
              }
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionList;
