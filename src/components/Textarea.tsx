import React from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  charCount?: string;
  charCountColor?: string;
}

export function Textarea({ 
  label, 
  error, 
  helperText,
  charCount,
  charCountColor = "text-gray-500",
  className = "",
  ...props 
}: TextareaProps) {
  const hasError = !!error;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <textarea
          className={`
            w-full px-4 py-3.5 
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
            resize-none
            ${className}
          `}
          {...props}
        />
        {charCount && (
          <div className={`absolute bottom-3 right-3 text-xs font-semibold ${charCountColor} pointer-events-none`}>
            {charCount}
          </div>
        )}
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
