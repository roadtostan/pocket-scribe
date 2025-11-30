import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export function LoadingSpinner({
  className,
  size = 28,
  label = "Loading"
}: LoadingSpinnerProps) {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <motion.div
        initial={{ opacity: 0.4, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 0.8,
          ease: "easeInOut",
        }}
      >
        <Loader
          className={cn("animate-spin text-primary drop-shadow-md", className)}
          size={size}
        />
      </motion.div>

      <motion.p
        className="text-sm text-muted-foreground mt-3 tracking-wide"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.2,
          ease: "easeInOut",
        }}
      >
        {label}
        <span className="inline-block w-3 text-center">{dots}</span>
      </motion.p>
    </div>
  );
}
