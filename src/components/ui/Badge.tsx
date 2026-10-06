import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'red' | 'amber' | 'blue' | 'neutral' | 'outline';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'emerald',
  size = 'sm',
  className = '',
}) => {
  const sizeStyles = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];

  const variantStyles = {
    emerald: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    red: 'bg-red-500/15 text-red-400 border border-red-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border border-blue-500/30',
    neutral: 'bg-[#222222] text-neutral-300 border border-[#333333]',
    outline: 'bg-transparent text-neutral-300 border border-neutral-700',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-md select-none font-mono ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
};
