import React from "react";

interface LoadingSpinnerProps {
  label?: string;
  size?: number;
}

export function LoadingSpinner({
  label = "Loading...",
  size = 40
}: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <svg
        className="animate-spin text-primary"
        width={size}
        height={size}
        viewBox="0 0 50 50"
      >
        <circle
          className="opacity-25"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          fill="none"
        />
        <circle
          className="opacity-75"
          cx="25"
          cy="25"
          r="20"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="90"
          strokeDashoffset="60"
        />
      </svg>

      <p className="text-sm text-muted-foreground mt-3 tracking-wide">
        {label}
      </p>
    </div>
  );
}
