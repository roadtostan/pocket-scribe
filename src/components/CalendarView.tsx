
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import { useFinance } from '@/context/FinanceContext';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/formatCurrency';
import { useNavigate } from 'react-router-dom';

const CalendarView = () => {
  const { transactions, selectedDate } = useFinance();
  const navigate = useNavigate();
  
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayTransactions = (date: Date) => {
    return transactions.filter(t => isSameDay(parseISO(t.date), date));
  };

  const calculateDayTotal = (date: Date) => {
    const dayTransactions = getDayTransactions(date);
    return dayTransactions.reduce((total, t) => {
      if (t.type === 'income') return total + t.amount;
      if (t.type === 'expense') return total - t.amount;
      // For transfers, don't add to the daily total as they're just movements between accounts
      return total;
    }, 0);
  };

  const getBackgroundColor = (total: number) => {
    if (total === 0) return 'bg-gray-100';
    return total > 0 ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-medium text-sm p-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {days.map((day) => {
            const total = calculateDayTotal(day);
            const hasTransactions = getDayTransactions(day).length > 0;
            
            return (
              <button
                key={day.toISOString()}
                onClick={() => hasTransactions && navigate(`/transactions/${format(day, 'yyyy-MM-dd')}`)}
                className={cn(
                  "aspect-square p-2 rounded-lg transition-colors",
                  getBackgroundColor(total),
                  hasTransactions ? 'hover:opacity-75 cursor-pointer' : 'cursor-default'
                )}
              >
                <div className="text-sm font-medium">{format(day, 'd')}</div>
                {hasTransactions && (
                  <div className="text-xs mt-1 font-medium">
                    {formatCurrency(Math.abs(total))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
