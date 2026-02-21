import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'neutral' | 'info' | 'active' | 'indexing';
  pulse?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: 'bg-green-500/10 text-green-500 border-green-500/20',
  warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  error: 'bg-red-500/10 text-red-500 border-red-500/20',
  neutral: 'bg-gray-100 text-gray-500 border-gray-200',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  active: 'bg-green-500/10 text-green-500 border-green-500/20',
  indexing: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
};

const dotColors: Record<string, string> = {
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
  active: 'bg-green-500',
  indexing: 'bg-amber-500',
  info: 'bg-blue-400',
  neutral: 'bg-gray-400',
};

const RagBadge: React.FC<BadgeProps> = ({ variant = 'neutral', pulse, children, className }) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 font-mono text-[10px] px-2 py-0.5 rounded border',
      variantStyles[variant],
      className
    )}
  >
    {pulse && (
      <span className={cn('w-[5px] h-[5px] rounded-full animate-pulse-dot', dotColors[variant])} />
    )}
    {children}
  </span>
);

export { RagBadge };
