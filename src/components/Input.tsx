import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helperText?: string;
}

export function Input({ 
  label, 
  error, 
  icon, 
  helperText,
  className = "",
  ...props 
}: InputProps) {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3.5 
            rounded-xl border-2 
            ${hasError 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' 
              : 'border-gray-200 focus:border-green-500 focus:ring-green-500/20'
            }
            bg-white
            text-gray-900 placeholder-gray-400
            text-base
            outline-none focus:ring-4 
            transition-all duration-200
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
