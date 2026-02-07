import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const ShimmerBlock = ({ className = '' }: { className?: string }) => (
  <div className={`skeleton-shimmer ${className}`} />
);

const HomeSkeleton = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header skeleton */}
      <header className="bg-card border-b border-border py-3 px-4">
        <div className="container max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShimmerBlock className="w-6 h-6 rounded-full" />
            <ShimmerBlock className="w-24 h-5" />
          </div>
          <ShimmerBlock className="w-20 h-8 rounded-md" />
        </div>
      </header>

      <main className="container max-w-5xl mx-auto pb-20 pt-2">
        {/* Holiday Countdown skeleton */}
        <Card className="mb-4 overflow-hidden border-0">
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <ShimmerBlock className="w-5 h-5 rounded" />
                <ShimmerBlock className="w-40 h-5" />
              </div>
              <ShimmerBlock className="w-5 h-5 rounded" />
            </div>
            <div className="flex justify-center gap-3 mb-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <ShimmerBlock className="w-[60px] h-[44px] rounded-lg" />
                  <ShimmerBlock className="w-10 h-3 mt-1" />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center">
              <ShimmerBlock className="w-56 h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Book selector card skeleton */}
        <Card className="mb-4 border-0 bg-muted">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <ShimmerBlock className="w-6 h-6 rounded" />
                <ShimmerBlock className="w-36 h-7" />
                <ShimmerBlock className="w-4 h-4 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* MonthYearPicker skeleton */}
          <div className="flex items-center justify-center gap-3">
            <ShimmerBlock className="w-8 h-8 rounded-full" />
            <ShimmerBlock className="w-32 h-6" />
            <ShimmerBlock className="w-8 h-8 rounded-full" />
          </div>

          {/* MonthlySummary skeleton */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <ShimmerBlock className="w-16 h-3" />
                    <ShimmerBlock className="w-24 h-6" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Add Transaction button skeleton */}
          <ShimmerBlock className="w-full h-14 rounded-md" />

          {/* Tabs skeleton */}
          <div className="grid grid-cols-2 gap-1 bg-muted rounded-lg p-1 mb-4">
            <ShimmerBlock className="h-9 rounded-md" />
            <ShimmerBlock className="h-9 rounded-md" />
          </div>

          {/* Transaction list skeleton */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <ShimmerBlock className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <ShimmerBlock className="w-3/4 h-4" />
                      <ShimmerBlock className="w-1/2 h-3" />
                    </div>
                    <ShimmerBlock className="w-20 h-5" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom nav skeleton */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border py-2">
        <div className="container max-w-5xl mx-auto flex justify-around items-center">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center gap-1 px-4 py-2">
              <ShimmerBlock className="w-6 h-6 rounded" />
              <ShimmerBlock className="w-10 h-3" />
            </div>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default HomeSkeleton;
