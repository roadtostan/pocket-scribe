import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const HolidayCountdown = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target: March 12, 2026 00:00:00 WIB (GMT+7)
    const targetDate = new Date('2026-03-12T00:00:00+07:00');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px] flex items-center justify-center">
        <span className="text-2xl font-bold tabular-nums text-center">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs mt-1 opacity-80">{label}</span>
    </div>
  );

  return (
    <Card 
      className="bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white mb-4 overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate('/holiday-countdown')}
    >
      <CardContent className="pt-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Calendar size={20} />
            <h2 className="font-bold text-lg">Our Holiday Countdown</h2>
          </div>
          <ChevronRight size={20} className="opacity-80" />
        </div>
        
        <div className="flex justify-center gap-3 mb-3">
          <TimeBlock value={timeLeft.days} label="Days" />
          <TimeBlock value={timeLeft.hours} label="Hours" />
          <TimeBlock value={timeLeft.minutes} label="Minutes" />
          <TimeBlock value={timeLeft.seconds} label="Seconds" />
        </div>
        
        <div className="flex items-center justify-center gap-1 text-xs opacity-90">
          <Clock size={12} />
          <span>Time until Thursday, March 12 2026, GMT+7</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default HolidayCountdown;
