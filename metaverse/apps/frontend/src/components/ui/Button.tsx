import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'mc-btn inline-flex items-center justify-center font-mono font-bold tracking-tight uppercase transition-all select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none';

  const sizeStyles = {
    sm: 'text-[11px] px-3 py-1 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2',
    lg: 'text-sm px-6 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'mc-btn-emerald',
    cyan: 'mc-btn-diamond',
    secondary: 'mc-btn-stone',
    outline: 'mc-btn-stone bg-transparent hover:bg-white/5',
    ghost: 'bg-transparent text-meta-muted hover:text-white hover:bg-white/10 border-0',
    danger: 'mc-btn-redstone',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
