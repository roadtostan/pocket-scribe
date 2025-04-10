
import React, { useState } from 'react';
import { useFinance } from '@/context/FinanceContext';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/formatCurrency';
import CategoryIcon from './CategoryIcon';

type GroupBy = 'category' | 'account' | 'member';

const ChartAnalysis = () => {
  const { transactions, categories, accounts, members } = useFinance();
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('expense');
  const [groupBy, setGroupBy] = useState<GroupBy>('category');
  
  // Filter transactions by type
  const filteredTransactions = transactions.filter(t => t.type === transactionType);
  
  // Group and sum transactions
  const groupedData = filteredTransactions.reduce((result, transaction) => {
    let key;
    let name;
    
    if (groupBy === 'category') {
      key = transaction.categoryId;
      const category = categories.find(c => c.id === transaction.categoryId);
      name = category?.name || 'Unknown';
    } else if (groupBy === 'account') {
      key = transaction.accountId;
      const account = accounts.find(a => a.id === transaction.accountId);
      name = account?.name || 'Unknown';
    } else {
      key = transaction.memberId;
      const member = members.find(m => m.id === transaction.memberId);
      name = member?.name || 'Unknown';
    }
    
    if (!result[key]) {
      result[key] = {
        name,
        value: 0,
        id: key,
      };
    }
    
    result[key].value += transaction.amount;
    return result;
  }, {} as Record<string, { name: string; value: number; id: string }>);
  
  const chartData = Object.values(groupedData).sort((a, b) => b.value - a.value);
  
  // Calculate total
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  
  // Colors for pie chart
  const COLORS = [
    '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#F97316', 
    '#FBBF24', '#84CC16', '#10B981', '#06B6D4', '#3B82F6',
    '#F472B6', '#34D399', '#14B8A6', '#22D3EE', '#0EA5E9',
  ];
  
  const renderLabel = (entry: { name: string; value: number }) => {
    const percent = Math.round((entry.value / total) * 100);
    if (percent < 5) return null;
    return `${percent}%`;
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percent = Math.round((data.value / total) * 100);
      
      return (
        <div className="bg-white p-3 shadow-lg rounded-md border">
          <div className="font-medium">{data.name}</div>
          <div>{formatCurrency(data.value)}</div>
          <div className="text-sm text-gray-500">{percent}% of total</div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Transaction Analysis</span>
          <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Group by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="category">By Category</SelectItem>
              <SelectItem value="account">By Account</SelectItem>
              <SelectItem value="member">By Member</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
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

        {chartData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No {transactionType} data available
          </div>
        ) : (
          <>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Breakdown</h3>
              <div className="space-y-2">
                {chartData.map((item, index) => {
                  const percent = Math.round((item.value / total) * 100);
                  const category = categories.find(c => c.id === item.id);
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="flex items-center gap-1">
                          {groupBy === 'category' && category && (
                            <CategoryIcon iconName={category.icon} size={16} />
                          )}
                          <span>{item.name}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>{formatCurrency(item.value)}</span>
                        <span className="text-sm text-gray-500">{percent}%</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ChartAnalysis;
