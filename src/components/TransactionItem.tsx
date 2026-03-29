
import React, { useState } from 'react';
import { useFinance, TransactionType, TransferTransactionType } from '@/context/FinanceContext';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatCurrency';
import CategoryIcon from './CategoryIcon';
import { Trash2, Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { useLocation } from 'react-router-dom';
import EditTransactionDialog from './EditTransactionDialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface TransactionItemProps {
  transaction: TransactionType | TransferTransactionType;
  onDelete?: (id: string) => void;
}

const TransactionItem = ({ transaction, onDelete }: TransactionItemProps) => {
  const { categories, accounts, members } = useFinance();
  const location = useLocation();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  
  const isFilteredView = location.pathname.includes('/filtered-transactions');
  const filterType = isFilteredView 
    ? location.pathname.split('/')[2]
    : null;
  
  if (transaction.type === "transfer") {
    const fromAccount = accounts.find((a) => a.id === transaction.fromAccountId);
    const toAccount = accounts.find((a) => a.id === transaction.toAccountId);
    const member = members.find((m) => m.id === transaction.memberId);

    return (
      <>
        <div className="p-3 border-b last:border-b-0">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 text-gray-700 shrink-0">
                <span>↔️</span>
              </div>
              <div>
                <div className="text-base font-semibold">Transfer</div>
                <div className="text-lg font-bold text-gray-800">
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditOpen(true)}
                className="text-gray-400 hover:text-primary"
              >
                <Pencil size={16} />
              </Button>
              {onDelete && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDeleteOpen(true)}
                  className="text-gray-400 hover:text-expense"
                >
                  <Trash2 size={16} />
                </Button>
              )}
            </div>
          </div>
          <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-x-1">
            {transaction.description && filterType !== 'category' && (
              <>
                <span>{transaction.description}</span>
                <span>•</span>
              </>
            )}
            {fromAccount?.name && toAccount?.name && filterType !== 'account' && (
              <>
                <span>{fromAccount.name} → {toAccount.name}</span>
                <span>•</span>
              </>
            )}
            {member?.name && filterType !== 'member' && <span>{member?.name}</span>}
          </div>
        </div>
        <EditTransactionDialog transaction={transaction} open={editOpen} onOpenChange={setEditOpen} />
        <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this transaction? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete!(transaction.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  const category = categories.find(c => c.id === transaction.categoryId);
  const account = accounts.find(a => a.id === transaction.accountId);
  const member = members.find(m => m.id === transaction.memberId);

  const titleDisplay = (filterType === 'category' && transaction.description) 
    ? transaction.description 
    : category?.name;

  return (
    <>
      <div className="p-3 border-b last:border-b-0">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full shrink-0",
                transaction.type === "income"
                  ? "bg-income/20 text-income"
                  : "bg-expense/20 text-expense"
              )}
            >
              {category && <CategoryIcon iconName={category.icon} />}
            </div>
            <div>
              <div className="text-base font-semibold">{titleDisplay}</div>
              <div className={cn(
                "text-lg font-bold",
                transaction.type === 'income' ? 'text-income' : 'text-expense'
              )}>
                {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setEditOpen(true)}
              className="text-gray-400 hover:text-primary"
            >
              <Pencil size={16} />
            </Button>
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDeleteOpen(true)}
                className="text-gray-400 hover:text-expense"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>
        <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-x-1">
          {transaction.description && filterType !== 'category' && (
            <>
              <span>{transaction.description}</span>
              <span>•</span>
            </>
          )}
          {account?.name && filterType !== 'account' && (
            <>
              <span>{account.name}</span>
              <span>•</span>
            </>
          )}
          {member?.name && filterType !== 'member' && <span>{member?.name}</span>}
        </div>
      </div>
      <EditTransactionDialog transaction={transaction} open={editOpen} onOpenChange={setEditOpen} />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete!(transaction.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TransactionItem;

