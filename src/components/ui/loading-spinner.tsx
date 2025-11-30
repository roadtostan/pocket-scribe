import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  showDelay?: number; // delay before showing "Loading..."
}

export function LoadingSpinner({
  className,
  size = 48,
  showDelay = 300,
}: LoadingSpinnerProps) {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowText(true), showDelay);
    return () => clearTimeout(timer);
  }, [showDelay]);

  return (
    <div className="flex flex-col items-center justify-center gap-3 h-full w-full">
      {/* Google-ish animated SVG loader */}
      <svg
        className={cn("animate-spin", className)}
        width={size}
        height={size}
        viewBox="0 0 50 50"
      >
        <circle
          className="opacity-25 stroke-muted-foreground"
          cx="25"
          cy="25"
          r="20"
          strokeWidth="5"
          fill="none"
        />
        <circle
          className="stroke-primary"
          cx="25"
          cy="25"
          r="20"
          strokeWidth="5"
          fill="none"
          strokeDasharray="31.4 31.4"
          strokeLinecap="round"
        />
      </svg>

      {showText && (
        <div className="text-sm text-muted-foreground font-medium flex items-center">
          Loading<span className="ml-1 inline-block animate-bounce">
            <span className="inline-block mx-[1px]">.</span>
            <span className="inline-block mx-[1px] animation-delay-200">.</span>
            <span className="inline-block mx-[1px] animation-delay-400">.</span>
          </span>
        </div>
      )}
    </div>
  );
}
