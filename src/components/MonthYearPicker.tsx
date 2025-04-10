
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useFinance } from '@/context/FinanceContext';
import { format, addMonths, subMonths } from 'date-fns';

const MonthYearPicker = () => {
  const { selectedDate, setSelectedDate } = useFinance();
  
  const handlePreviousMonth = () => {
    setSelectedDate(subMonths(selectedDate, 1));
  };
  
  const handleNextMonth = () => {
    setSelectedDate(addMonths(selectedDate, 1));
  };
  
  const isCurrentMonth = format(selectedDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM');
  
  return (
    <Card className="shadow-sm">
      <CardContent className="py-3 flex justify-between items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousMonth}
        >
          <ChevronLeft size={20} />
        </Button>
        
        <div className="font-medium text-center">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          disabled={isCurrentMonth}
        >
          <ChevronRight size={20} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default MonthYearPicker;
