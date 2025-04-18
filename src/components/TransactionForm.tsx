
import React, { useState } from 'react';
import { useFinance, TransactionType } from '@/context/FinanceContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryIcon from './CategoryIcon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import AddCategoryDialog from './AddCategoryDialog';
import AddMemberDialog from './AddMemberDialog';

const TransactionForm = () => {
  const { categories, members, accounts, addTransaction } = useFinance();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState<Date>(new Date());
  const [amount, setAmount] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [accountId, setAccountId] = useState<string>('');
  const [memberId, setMemberId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [calculatorExpression, setCalculatorExpression] = useState<string>('');
  const [showCalculator, setShowCalculator] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !categoryId || !accountId || !memberId) {
      toast.error('Please fill all required fields');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const newTransaction: Omit<TransactionType, 'id' | 'bookId'> = {
      amount: parsedAmount,
      type: transactionType,
      categoryId,
      accountId,
      memberId,
      date: format(date, 'yyyy-MM-dd'),
      description
    };

    addTransaction(newTransaction);
    
    // Reset form
    setAmount('');
    setDescription('');
    setShowCalculator(false);
    setCalculatorExpression('');
    
    toast.success(`${transactionType === 'income' ? 'Income' : 'Expense'} added successfully`);
  };

  const handleCalcInput = (value: string) => {
    setCalculatorExpression(prev => prev + value);
  };

  const handleCalcClear = () => {
    setCalculatorExpression('');
  };

  const handleCalcDelete = () => {
    setCalculatorExpression(prev => prev.slice(0, -1));
  };

  const handleCalcCalculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(calculatorExpression);
      setAmount(result.toString());
      setCalculatorExpression('');
      setShowCalculator(false);
    } catch (error) {
      toast.error('Invalid expression');
    }
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle>Add Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expense" className="mb-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger 
              value="expense" 
              onClick={() => setTransactionType('expense')}
              className={transactionType === 'expense' ? 'bg-expense text-white' : ''}
            >
              Expense
            </TabsTrigger>
            <TabsTrigger 
              value="income" 
              onClick={() => setTransactionType('income')}
              className={transactionType === 'income' ? 'bg-income text-white' : ''}
            >
              Income
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                name="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setShowCalculator(!showCalculator)}
              >
                Calc
              </Button>
            </div>
            {showCalculator && (
              <div className="p-4 border rounded-md bg-white mt-2">
                <div className="p-2 border rounded-md bg-gray-50 mb-3">
                  {calculatorExpression || '0'}
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {['7', '8', '9', '/'].map((key) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCalcInput(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  {['4', '5', '6', '*'].map((key) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCalcInput(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  {['1', '2', '3', '-'].map((key) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleCalcInput(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  {['0', '.', '+', '='].map((key) => (
                    <Button
                      key={key}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => key === '=' ? handleCalcCalculate() : handleCalcInput(key)}
                    >
                      {key}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCalcClear}
                    className="col-span-2"
                  >
                    Clear
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCalcDelete}
                    className="col-span-2"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter(cat => {
                        if (transactionType === 'income') {
                          return ['Salary', 'Investment', 'Bonus'].includes(cat.name);
                        }
                        return !['Salary', 'Investment', 'Bonus'].includes(cat.name);
                      })
                      .map((category) => (
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
              <AddCategoryDialog />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="account">Account</Label>
            <Select value={accountId} onValueChange={setAccountId}>
              <SelectTrigger id="account">
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

          <div className="space-y-2">
            <Label htmlFor="member">Member</Label>
            <div className="flex gap-2 items-center">
              <div className="flex-1">
                <Select value={memberId} onValueChange={setMemberId}>
                  <SelectTrigger id="member">
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
              <AddMemberDialog />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
          </div>

          <Button 
            type="submit" 
            className={transactionType === 'income' ? 'bg-income hover:bg-income/90' : 'bg-expense hover:bg-expense/90'}
          >
            Add {transactionType === 'income' ? 'Income' : 'Expense'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TransactionForm;
