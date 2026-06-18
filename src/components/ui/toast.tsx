"use client";

import { cn } from "@/lib/utils";

type ToastProps = {
  message: string;
  visible: boolean;
  className?: string;
};

export function Toast({ message, visible, className }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={cn(
        "fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-full bg-sai-text px-5 py-3 text-[14px] font-medium text-white shadow-lg transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0",
        className
      )}
    >
      {message}
    </div>
  );
}
