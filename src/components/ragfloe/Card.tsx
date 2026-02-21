import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'light' | 'dark';
  hover?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const RagCard: React.FC<CardProps> = ({ variant = 'light', hover, className, children, onClick }) => {
  const light = 'bg-white border border-gray-200 rounded-lg shadow-card';
  const dark = 'bg-dark-surface border border-dark-border rounded-lg';
  const hoverLight = hover ? 'hover:shadow-elevated transition-shadow duration-200 cursor-pointer' : '';
  const hoverDark = hover ? 'hover:border-dark-border-subtle transition-colors duration-200 cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={cn(
        variant === 'light' ? light : dark,
        variant === 'light' ? hoverLight : hoverDark,
        className
      )}
    >
      {children}
    </div>
  );
};

export { RagCard };
