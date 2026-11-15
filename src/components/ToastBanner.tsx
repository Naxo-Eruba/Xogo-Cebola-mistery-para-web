import React from 'react';
import { Check } from 'lucide-react';

interface ToastBannerProps {
  message: string | null;
}

export const ToastBanner: React.FC<ToastBannerProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 max-w-[90vw] px-4 py-2.5 rounded-xl bg-[#1B1E23] border border-[#C59B48]/50 text-[#F2E9D8] shadow-xl flex items-center gap-2 text-sm"
    >
      <Check className="w-4 h-4 text-[#C59B48] shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
};
