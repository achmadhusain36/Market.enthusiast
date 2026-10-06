import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'surface' | 'glass';
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-[#111111] border border-[#262626]',
    surface: 'bg-[#1a1a1a] border border-[#2e2e2e]',
    glass: 'bg-[#111111]/80 backdrop-blur-xl border border-white/10 shadow-2xl',
  }[variant];

  return (
    <div
      className={`rounded-2xl p-5 ${variantStyles} ${
        hoverEffect ? 'hover:border-neutral-500/40 transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
