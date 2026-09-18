import React from 'react';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio?: string;
}

export function Skeleton({ className, style, aspectRatio, ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        aspectRatio,
        ...style,
      }}
      className={cn('animate-pulse bg-charcoal/10', className)}
      {...props}
    />
  );
}
