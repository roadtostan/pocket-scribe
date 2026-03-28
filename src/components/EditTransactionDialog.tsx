
import React, { useState, useEffect } from 'react';
import { useFinance, TransactionType, TransferTransactionType } from '@/context/FinanceContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import CategoryIcon from './CategoryIcon';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

interface EditTransactionDialogProps {
  transaction: TransactionType | TransferTransactionType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EditTransactionDialog = ({ transaction, open, onOpenChange }: EditTransactionDialogProps) => {
  const { categories, members, accounts, updateTransaction, updateTransferTransaction } = useFinance();

  const isTransfer = transaction.type === 'transfer';
  const [transactionType, setTransactionType] = useState<'income' | 'expense' | 'transfer'>(transaction.type);
  const [date, setDate] = useState<Date>(parseISO(transaction.date));
  const [amount, setAmount] = useState<string>(transaction.amount.toString());
  const [categoryId, setCategoryId] = useState<string>(!isTransfer ? (transaction as TransactionType).categoryId : '');
  const [accountId, setAccountId] = useState<string>(
    isTransfer ? (transaction as TransferTransactionType).fromAccountId : (transaction as TransactionType).accountId
  );
  const [toAccountId, setToAccountId] = useState<string>(
    isTransfer ? (transaction as TransferTransactionType).toAccountId : ''
  );
  const [memberId, setMemberId] = useState<string>(transaction.memberId);
  const [description, setDescription] = useState<string>(transaction.description || '');

  useEffect(() => {
    setTransactionType(transaction.type);
    setDate(parseISO(transaction.date));
    setAmount(transaction.amount.toString());
    setCategoryId(!isTransfer ? (transaction as TransactionType).categoryId : '');
    setAccountId(isTransfer ? (transaction as TransferTransactionType).fromAccountId : (transaction as TransactionType).accountId);
    setToAccountId(isTransfer ? (transaction as TransferTransactionType).toAccountId : '');
    setMemberId(transaction.memberId);
    setDescription(transaction.description || '');
  }, [transaction, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (isTransfer) {
      if (!accountId || !toAccountId || !memberId || accountId === toAccountId) {
        toast.error('Please fill all required fields and select different accounts');
        return;
      }
      updateTransferTransaction(transaction.id, {
        fromAccountId: accountId,
        toAccountId,
        amount: parsedAmount,
        memberId,
        date: format(date, 'yyyy-MM-dd'),
        description,
        type: 'transfer'
      });
    } else {
      if (!categoryId || !accountId || !memberId) {
        toast.error('Please fill all required fields');
        return;
      }
      updateTransaction(transaction.id, {
        amount: parsedAmount,
        type: transactionType as 'income' | 'expense',
        categoryId,
        accountId,
        memberId,
        date: format(date, 'yyyy-MM-dd'),
        description
      });
    }

    toast.success('Transaction updated successfully');
    onOpenChange(false);
  };

  const filteredCategories = categories.filter(cat => {
    if (transactionType === 'income') return cat.type === 'income' || cat.type === 'both';
    return cat.type === 'expense' || cat.type === 'both';
  }).sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Transaction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isTransfer && (
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={transactionType} onValueChange={(v) => setTransactionType(v as 'income' | 'expense')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="expense">Expense</SelectItem>
                  <SelectItem value="income">Income</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Amount</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
          </div>

          {!isTransfer && (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <CategoryIcon iconName={category.icon} />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>{isTransfer ? 'From Account' : 'Account'}</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.name} ({account.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isTransfer && (
            <div className="space-y-2">
              <Label>To Account</Label>
              <Select value={toAccountId} onValueChange={setToAccountId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.filter(a => a.id !== accountId).map((account) => (
                    <SelectItem key={account.id} value={account.id}>
                      {account.name} ({account.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>Member</Label>
            <Select value={memberId} onValueChange={setMemberId}>
              <SelectTrigger>
                <SelectValue placeholder="Select member" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "eeee, dd MMMM yyyy", { locale: idLocale })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                  locale={idLocale}
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
          </div>

          <Button
            type="submit"
            className={cn(
              "w-full",
              transactionType === 'income' ? 'bg-income hover:bg-income/90' :
              transactionType === 'expense' ? 'bg-expense hover:bg-expense/90' :
              'bg-gray-800 hover:bg-gray-700'
            )}
          >
            Update Transaction
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTransactionDialog;
