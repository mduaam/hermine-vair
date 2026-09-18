import React, { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, id, error, hint, required, ...props }, ref) => {
    const errorId = error ? `${id}-error` : undefined;
    const hintId = hint ? `${id}-hint` : undefined;
    const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined;

    return (
      <div className="w-full space-y-1.5">
        <label
          htmlFor={id}
          className="block text-xs uppercase tracking-[0.14em] font-medium text-black"
        >
          {label}
          {required && <span className="text-taupe ml-1" aria-hidden="true">*</span>}
        </label>

        <input
          ref={ref}
          id={id}
          required={required}
          aria-required={required ? 'true' : undefined}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          className={cn(
            'w-full bg-ivory/50 border border-charcoal/30 px-4 py-3 text-sm text-black placeholder:text-charcoal/40',
            'focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-taupe focus:border-taupe focus:ring-taupe',
            className
          )}
          {...props}
        />

        {hint && !error && (
          <p id={hintId} className="text-xs text-charcoal/70">
            {hint}
          </p>
        )}

        {error && (
          <p id={errorId} className="text-xs text-taupe font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
