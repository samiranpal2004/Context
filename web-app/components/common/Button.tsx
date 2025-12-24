
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold tracking-tight transition-all active:scale-95 disabled:opacity-70 disabled:active:scale-100';
  
  const variants = {
    primary: 'premium-gradient text-white shadow-xl shadow-blue-100 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-200',
    secondary: 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {leftIcon}
          <span className="leading-none">{children}</span>
          {rightIcon}
        </>
      )}
    </button>
  );
};

export default Button;
