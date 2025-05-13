
import React from "react";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
}

export function LoadingSpinner({ className, size = 24 }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <Loader 
        className={cn("animate-spin text-primary", className)} 
        size={size}
      />
      <p className="text-sm text-muted-foreground mt-2">Loading...</p>
    </div>
  );
}
