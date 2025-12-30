import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Heart } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const LDR_QUOTES = [
  "Distance means so little when someone means so much.",
  "Every day apart is one day closer to meeting again.",
  "LDR teaches patience, trust, and the value of time.",
  "This countdown is proof that waiting is worth it.",
  "The best things in life are worth waiting for.",
  "Miles apart but close at heart.",
  "True love doesn't mean being inseparable; it means being separated and nothing changes.",
  "Distance is just a test to see how far love can travel."
];

const HolidayCountdownPage = () => {
  const navigate = useNavigate();
  const [quote] = useState(() => LDR_QUOTES[Math.floor(Math.random() * LDR_QUOTES.length)]);
  const [today, setToday] = useState(new Date());

  const startDate = new Date('2025-12-28T00:00:00+07:00');
  const gridEndDate = new Date('2026-03-11T00:00:00+07:00'); // Last day before holiday
  const holidayDate = new Date('2026-03-12T00:00:00+07:00'); // For display only

  useEffect(() => {
    const interval = setInterval(() => setToday(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getDaysBetween = (start: Date, end: Date) => {
    const oneDay = 24 * 60 * 60 * 1000;
    return Math.round((end.getTime() - start.getTime()) / oneDay);
  };

  // Total grid days: Dec 28, 2025 to March 11, 2026 (inclusive) = 74 days
  const totalDays = getDaysBetween(startDate, gridEndDate) + 1;
  
  // Get today at midnight for comparison
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startMidnight = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  
  // Days passed: days fully completed before today (not including today)
  const daysPassed = Math.max(0, Math.min(totalDays - 1, getDaysBetween(startMidnight, todayMidnight)));
  
  // Days remaining: days after today (not including today)
  const daysRemaining = Math.max(0, totalDays - daysPassed - 1);
  
  // Progress based on days passed
  const progressPercentage = Math.round((daysPassed / totalDays) * 100);

  const generateDaysArray = () => {
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < totalDays; i++) {
      const dayDate = new Date(currentDate);
      const dayMidnight = new Date(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate());
      
      days.push({
        date: dayDate,
        dayNumber: i + 1,
        isPassed: dayMidnight < todayMidnight,
        isToday: dayMidnight.getTime() === todayMidnight.getTime(),
        isRemaining: dayMidnight > todayMidnight
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return days;
  };

  const days = generateDaysArray();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50 dark:from-rose-950 dark:via-pink-950 dark:to-fuchsia-950">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <h1 className="font-bold text-lg">Our Holiday Countdown</h1>
          </div>
        </div>
      </div>

      <div className="p-4 pb-8 space-y-4 max-w-lg mx-auto">
        {/* Title Section */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold text-rose-600 dark:text-rose-400 mb-2">
            Our Holiday Countdown
          </h2>
          <p className="text-muted-foreground text-sm">
            Counting every single day until we meet again
          </p>
        </div>

        {/* Progress Summary */}
        <Card className="border-rose-200 dark:border-rose-800 shadow-md">
          <CardContent className="pt-4 space-y-4">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-rose-100 dark:bg-rose-900/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {daysPassed}
                </div>
                <div className="text-xs text-muted-foreground">Days Passed</div>
              </div>
              <div className="bg-fuchsia-100 dark:bg-fuchsia-900/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-fuchsia-600 dark:text-fuchsia-400">
                  {daysRemaining}
                </div>
                <div className="text-xs text-muted-foreground">Days Left</div>
              </div>
              <div className="bg-pink-100 dark:bg-pink-900/30 rounded-lg p-3">
                <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {progressPercentage}%
                </div>
                <div className="text-xs text-muted-foreground">Progress</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-3 bg-rose-100 dark:bg-rose-900/30" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{formatDate(startDate)}</span>
                <span>{formatDate(holidayDate)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Daily Grid Tracker */}
        <Card className="border-rose-200 dark:border-rose-800 shadow-md">
          <CardContent className="pt-4">
            <h3 className="font-semibold text-center mb-3 text-foreground">
              Our Holiday Countdown in Days
            </h3>
            
            {/* Week Header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => (
                <div key={idx} className="text-center text-xs text-muted-foreground font-medium">
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Add empty cells for alignment to first day of week */}
              {Array.from({ length: startDate.getDay() }).map((_, idx) => (
                <div key={`empty-${idx}`} className="aspect-square" />
              ))}
              
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className={`
                    aspect-square rounded-md flex items-center justify-center text-xs font-medium
                    transition-all duration-200
                    ${day.isPassed 
                      ? 'bg-rose-500 dark:bg-rose-600 text-white' 
                      : day.isToday 
                        ? 'bg-fuchsia-500 text-white ring-2 ring-fuchsia-300 dark:ring-fuchsia-400 scale-110 shadow-lg' 
                        : 'bg-rose-100 dark:bg-rose-900/30 text-rose-400 dark:text-rose-300'
                    }
                  `}
                  title={formatDate(day.date)}
                >
                  {day.dayNumber}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-rose-500 dark:bg-rose-600" />
                <span className="text-muted-foreground">Passed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-fuchsia-500 ring-1 ring-fuchsia-300" />
                <span className="text-muted-foreground">Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-rose-100 dark:bg-rose-900/30" />
                <span className="text-muted-foreground">Remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* LDR Quote */}
        <Card className="border-rose-200 dark:border-rose-800 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 shadow-md">
          <CardContent className="pt-4">
            <div className="flex flex-col items-center text-center gap-3">
              <Heart className="text-rose-500 fill-rose-500" size={24} />
              <p className="text-sm italic text-rose-700 dark:text-rose-300 leading-relaxed">
                "{quote}"
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground pt-2">
          <Clock size={12} />
          <span>Target: Thursday, March 12, 2026 • GMT+7</span>
        </div>
      </div>
    </div>
  );
};

export default HolidayCountdownPage;
