import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

export const Toast: React.FC<{
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}> = ({ toast, onDismiss }) => {
  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-[#55FF55] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-meta-redstone shrink-0" />,
    info: <Info className="w-4 h-4 text-[#4DEDF3] shrink-0" />,
  };

  const borders = {
    success: 'border-l-4 border-l-[#55AA33]',
    error: 'border-l-4 border-l-[#FF3333]',
    info: 'border-l-4 border-l-[#4DEDF3]',
  };

  return (
    <div
      className={`mc-panel flex items-start gap-3 p-3.5 ${borders[toast.type]} min-w-[280px] max-w-sm pointer-events-auto font-mono`}
    >
      <div className="mt-0.5">{icons[toast.type]}</div>
      <div className="flex-1 text-xs">
        {toast.title && <p className="font-bold text-white mc-text uppercase tracking-wide">{toast.title}</p>}
        <p className="text-meta-muted mt-0.5">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-meta-muted hover:text-white p-0.5 transition-colors"
        aria-label="Dismiss toast"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
