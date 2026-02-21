import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { RagButton } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'primary-dark' | 'ghost';
  };
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action, className }) => (
  <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-4">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <h3 className="text-[15px] font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-[13px] text-gray-500 max-w-sm mb-4">{description}</p>
    {action && (
      <RagButton variant={action.variant || 'primary'} size="sm" onClick={action.onClick}>
        {action.label}
      </RagButton>
    )}
  </div>
);

export { EmptyState };
