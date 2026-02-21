import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'primary-dark' | 'ghost' | 'danger' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const RagButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-semibold rounded-md transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

    const variants: Record<string, string> = {
      primary: 'bg-brand-black text-brand-white hover:bg-gray-800',
      'primary-dark': 'bg-brand-blue text-brand-white hover:bg-brand-blue-dark',
      ghost: 'bg-transparent border border-gray-300 text-gray-600 hover:border-gray-800 hover:text-brand-black hover:bg-gray-50',
      danger: 'bg-transparent border border-gray-200 text-gray-500 hover:border-brand-red hover:text-brand-red hover:bg-red-50',
      icon: 'bg-transparent text-gray-500 hover:text-brand-black hover:bg-gray-100 rounded-md',
    };

    const sizes: Record<string, string> = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-sm px-6 py-3 font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
RagButton.displayName = 'RagButton';

export { RagButton };
