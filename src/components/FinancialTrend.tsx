
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useFinance, AccountType } from '@/context/FinanceContext';
import { format, subDays, isWithinInterval, parseISO } from 'date-fns';
import { formatCurrency } from '@/lib/formatCurrency';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimeRange = '7days' | '30days' | '90days';

const FinancialTrend = () => {
  const { transactions, accounts } = useFinance();
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('30days');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>(accounts.map(a => a.id));

  const timeRanges = {
    '7days': 7,
    '30days': 30,
    '90days': 90
  };

  const balanceData = useMemo(() => {
    const days = timeRanges[selectedTimeRange];
    const dates = Array.from({ length: days }, (_, i) => subDays(new Date(), days - 1 - i));
    
    return dates.map(date => {
      let assets = 0;
      let debts = 0;
      
      selectedAccounts.forEach(accountId => {
        const account = accounts.find(a => a.id === accountId);
        if (!account) return;
        
        const balance = account.balance;
        if (['Credit Card', 'Debt'].includes(account.type)) {
          debts += Math.abs(balance);
        } else {
          assets += balance;
        }
      });

      return {
        date: format(date, 'MMM dd'),
        assets,
        debts
      };
    });
  }, [selectedTimeRange, selectedAccounts, accounts]);

  const cashflowData = useMemo(() => {
    const days = timeRanges[selectedTimeRange];
    const dates = Array.from({ length: days }, (_, i) => subDays(new Date(), days - 1 - i));
    
    return dates.map(date => {
      const dayTransactions = transactions.filter(t => {
        // First check if it's a transfer transaction
        if ('type' in t && t.type === 'transfer') {
          return (
            isWithinInterval(parseISO(t.date), {
              start: date,
              end: date
            }) &&
            (selectedAccounts.includes(t.fromAccountId) || selectedAccounts.includes(t.toAccountId))
          );
        }
        
        // Then handle regular transactions
        return (
          isWithinInterval(parseISO(t.date), {
            start: date,
            end: date
          }) &&
          selectedAccounts.includes(t.accountId)
        );
      });

      const income = dayTransactions.reduce((sum, t) => {
        if ('type' in t && t.type === 'income') return sum + t.amount;
        return sum;
      }, 0);

      const expense = dayTransactions.reduce((sum, t) => {
        if ('type' in t && t.type === 'expense') return sum + t.amount;
        return sum;
      }, 0);

      return {
        date: format(date, 'MMM dd'),
        income,
        expense
      };
    });
  }, [selectedTimeRange, selectedAccounts, transactions]);

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts(prev => 
      prev.includes(accountId) 
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border">
          <p className="font-medium">{label}</p>
          {payload.map((entry: any) => (
            <p key={entry.dataKey} className="text-sm">
              <span className="font-medium" style={{ color: entry.color }}>
                {entry.dataKey.charAt(0).toUpperCase() + entry.dataKey.slice(1)}:
              </span>{' '}
              {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Financial Trend</CardTitle>
          <Select value={selectedTimeRange} onValueChange={(value: TimeRange) => setSelectedTimeRange(value)}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 Days</SelectItem>
              <SelectItem value="30days">30 Days</SelectItem>
              <SelectItem value="90days">90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-medium mb-2">Selected Accounts:</h3>
          <div className="flex flex-wrap gap-4">
            {accounts.map(account => (
              <div key={account.id} className="flex items-center space-x-2">
                <Checkbox
                  id={account.id}
                  checked={selectedAccounts.includes(account.id)}
                  onCheckedChange={() => handleAccountToggle(account.id)}
                />
                <label htmlFor={account.id} className="text-sm">
                  {account.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Total Balance Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="assets"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="debts"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Income and Expense Trend</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cashflowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#10B981"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#EF4444"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialTrend;
