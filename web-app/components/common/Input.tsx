
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  helperText?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  icon,
  error,
  helperText,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-label-caps ml-1">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 placeholder:text-slate-300 font-medium ${
            icon ? 'pl-12 pr-4' : 'px-4'
          } ${error ? 'border-red-400 focus:ring-red-500/10 focus:border-red-500' : ''} ${className}`}
          {...props}
        />
      </div>
      {(error || helperText) && (
        <p className={`text-[10px] uppercase font-bold tracking-widest ml-1 ${error ? 'text-red-500' : 'text-slate-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export default Input;
