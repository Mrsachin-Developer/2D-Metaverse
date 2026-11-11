import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  type = 'text',
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5 font-mono">
      {label && (
        <label htmlFor={inputId} className="text-[11px] font-bold text-gray-300 uppercase tracking-wider" style={{ textShadow: '1px 1px 0px #000' }}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3 text-meta-muted pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          type={inputType}
          className={`mc-slot w-full text-white px-3.5 py-2.5 text-xs font-mono transition-colors placeholder:text-meta-muted/60 focus:outline-none focus:ring-1 focus:ring-[#4DEDF3] ${
            icon ? 'pl-10' : ''
          } ${isPassword ? 'pr-10' : ''} ${
            error
              ? 'border-red-500/80 ring-1 ring-red-500'
              : ''
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 text-meta-muted hover:text-white transition-colors p-0.5 focus:outline-none"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-[11px] text-red-400 mc-text">{error}</span>}
      {helperText && !error && <span className="text-[11px] text-meta-muted">{helperText}</span>}
    </div>
  );
};
