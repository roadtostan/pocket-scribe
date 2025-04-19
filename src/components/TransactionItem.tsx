
import React from 'react';
import { useFinance, TransactionType, TransferTransactionType } from '@/context/FinanceContext';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatCurrency';
import CategoryIcon from './CategoryIcon';
import { Trash2 } from 'lucide-react';
import { Button } from './ui/button';

interface TransactionItemProps {
  transaction: TransactionType | TransferTransactionType;
  onDelete?: (id: string) => void;
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { categories, accounts, members } = useFinance();
  
  // Handle both regular and transfer transaction types
  if (transaction.type === 'transfer') {
    const fromAccount = accounts.find(a => a.id === transaction.fromAccountId);
    const toAccount = accounts.find(a => a.id === transaction.toAccountId);
    const member = members.find(m => m.id === transaction.memberId);
    
    return (
      <div className="flex items-center justify-between p-3 border-b last:border-b-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700">
            <span>↔️</span>
          </div>
          <div>
            <div className="font-medium">Transfer</div>
            <div className="text-sm text-gray-500">
              {transaction.description || 'Transfer'} • {fromAccount?.name} → {toAccount?.name} • {member?.name}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-medium text-gray-700">
            {formatCurrency(transaction.amount)}
          </div>
          {onDelete && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(transaction.id)}
              className="text-gray-400 hover:text-expense"
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Regular transaction (income/expense)
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
        {onDelete && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onDelete(transaction.id)}
            className="text-gray-400 hover:text-expense"
          >
            <Trash2 size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TransactionItem;
