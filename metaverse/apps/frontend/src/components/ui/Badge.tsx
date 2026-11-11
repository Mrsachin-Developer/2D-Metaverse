import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'cyan' | 'success' | 'warning' | 'danger';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  dot = false,
  className = '',
}) => {
  const variantStyles = {
    default: 'bg-[#35353E] text-white border-t-[#6A6A74] border-l-[#6A6A74] border-b-[#141416] border-r-[#141416]',
    accent: 'bg-[#2E5E1C] text-[#55FF55] border-t-[#509C32] border-l-[#509C32] border-b-[#122B0A] border-r-[#122B0A]',
    cyan: 'bg-[#155358] text-[#4DEDF3] border-t-[#27A3AC] border-l-[#27A3AC] border-b-[#0B2E31] border-r-[#0B2E31]',
    success: 'bg-[#2E5E1C] text-[#55FF55] border-t-[#509C32] border-l-[#509C32] border-b-[#122B0A] border-r-[#122B0A]',
    warning: 'bg-[#7E570E] text-[#FFAA00] border-t-[#C0871C] border-l-[#C0871C] border-b-[#422D07] border-r-[#422D07]',
    danger: 'bg-[#6B1414] text-[#FF5555] border-t-[#A82525] border-l-[#A82525] border-b-[#380A0A] border-r-[#380A0A]',
  };

  const dotColors = {
    default: 'bg-meta-muted',
    accent: 'bg-[#55FF55]',
    cyan: 'bg-[#4DEDF3]',
    success: 'bg-[#55FF55]',
    warning: 'bg-[#FFAA00]',
    danger: 'bg-[#FF5555]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider border-2 ${variantStyles[variant]} ${className}`}
      style={{ textShadow: '1px 1px 0px rgba(0,0,0,0.85)' }}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-none ${dotColors[variant]} shadow`} />}
      {children}
    </span>
  );
};
