
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
  const offset = (monthStart.getDay() + 6) % 7;

  const getDayTransactions = (date: Date) => {
    return transactions.filter(t => isSameDay(parseISO(t.date), date));
  };

  const formatMiniRupiah = (value: number): string => {
    const formatNumber = (num: number): string => {
      const str = num.toFixed(2);
      return str.endsWith('.00')
        ? parseInt(str).toString()
        : str.endsWith('0')
          ? num.toFixed(1)
          : str;
    };
    if (value >= 1_000_000) {
      const num = value / 1_000_000;
      if (num >= 100) return `${Math.round(num)}jt`;
      return `${formatNumber(num)}jt`;
    }
    if (value >= 1_000) {
      const num = value / 1_000;
      if (num >= 100) return `${Math.round(num)}rb`;
      return `${formatNumber(num)}rb`;
    }
    return value.toString();
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
          {['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].map((day) => (
            <div key={day} className="text-center font-medium text-sm p-2">
              {day}
            </div>
          ))}

          {Array.from({ length: offset }).map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}
          
          {days.map((day) => {
            const total = calculateDayTotal(day);
            const hasTransactions = getDayTransactions(day).length > 0;
            
            return (
              <div key={day.toISOString()} className="flex flex-col items-center">
                <button
                  onClick={() => hasTransactions && navigate(`/transactions/${format(day, 'yyyy-MM-dd')}`)}
                  className={cn(
                    "aspect-square w-full rounded-lg transition-colors",
                    getBackgroundColor(total),
                    hasTransactions ? 'hover:opacity-75 cursor-pointer' : 'cursor-default'
                  )}
                >
                  <div className="text-sm font-medium p-2">
                    {format(day, 'd')}
                  </div>
                </button>

                {/* Total di luar button, tanpa padding */}
                {hasTransactions && (
                  <div className="text-xs font-medium mt-1 text-center leading-none">
                    <span className="block sm:hidden">{formatMiniRupiah(Math.abs(total))}</span>
                    <span className="hidden sm:block">{formatCurrency(Math.abs(total))}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
