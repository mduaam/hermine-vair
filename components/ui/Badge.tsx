import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'delivery' | 'bestseller' | 'new' | 'stock-low' | 'restricted';

export interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  className?: string;
}

export function Badge({ variant, label, className }: BadgeProps) {
  if (variant === 'restricted') {
    return null;
  }

  const variantStyles: Record<Exclude<BadgeVariant, 'restricted'>, string> = {
    delivery: 'border border-gold/60 bg-ivory text-black font-medium',
    bestseller: 'bg-charcoal text-ivory font-medium',
    new: 'bg-black text-ivory font-semibold',
    'stock-low': 'border border-taupe text-taupe font-medium bg-ivory',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-[10px] tracking-[0.16em] uppercase rounded-none select-none',
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
