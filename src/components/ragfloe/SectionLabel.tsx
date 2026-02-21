import React from 'react';
import { cn } from '@/lib/utils';

interface SectionLabelProps {
  variant?: 'light' | 'dark';
  children: React.ReactNode;
  className?: string;
}

const SectionLabel: React.FC<SectionLabelProps> = ({ variant = 'light', children, className }) => (
  <span
    className={cn(
      'font-mono text-[11px] uppercase tracking-widest',
      variant === 'light' ? 'text-gray-400' : 'text-[#475569]',
      className
    )}
  >
    {children}
  </span>
);

export { SectionLabel };
