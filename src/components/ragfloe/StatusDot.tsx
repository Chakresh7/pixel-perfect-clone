import React from 'react';
import { cn } from '@/lib/utils';

interface StatusDotProps {
  status: 'active' | 'indexing' | 'failed' | 'queued';
  className?: string;
}

const dotColors: Record<string, string> = {
  active: 'bg-green-500',
  indexing: 'bg-amber-500',
  failed: 'bg-red-500',
  queued: 'bg-gray-400',
};

const StatusDot: React.FC<StatusDotProps> = ({ status, className }) => (
  <span
    className={cn(
      'inline-block w-1.5 h-1.5 rounded-full',
      dotColors[status],
      status !== 'queued' && 'animate-pulse-dot',
      className
    )}
  />
);

export { StatusDot };
