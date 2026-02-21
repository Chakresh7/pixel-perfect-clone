import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
  rightElement?: React.ReactNode;
  variant?: 'light' | 'dark';
}

const RagInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helpText, rightElement, variant = 'light', className, ...props }, ref) => {
    const inputLight = 'w-full h-10 px-3 border border-gray-300 rounded-md text-sm bg-white text-brand-black placeholder-gray-400 focus:border-brand-black focus:outline-none focus:ring-2 focus:ring-brand-black/10';
    const inputDark = 'w-full h-10 px-3 border border-dark-border rounded-md text-sm bg-dark-surface text-gray-100 placeholder-gray-500 focus:border-brand-blue focus:outline-none focus:ring-2 focus:ring-brand-blue/10';

    return (
      <div className={cn('flex flex-col', className)}>
        {label && (
          <label className={cn(
            'text-sm font-medium mb-1.5',
            variant === 'light' ? 'text-gray-700' : 'text-gray-400'
          )}>
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              variant === 'light' ? inputLight : inputDark,
              error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10'
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        {helpText && !error && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
      </div>
    );
  }
);
RagInput.displayName = 'RagInput';

export { RagInput };
