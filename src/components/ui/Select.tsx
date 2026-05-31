import { forwardRef, type SelectHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, className, id, children, ...props }, ref) => {
    const sid = id ?? props.name;
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={sid} className="label">
            {label}
          </label>
        )}
        <select
          id={sid}
          ref={ref}
          className={cn('input appearance-none pr-8', error && 'border-red-500/60 focus:border-red-500', className)}
          {...props}
        >
          {children}
        </select>
        {error ? (
          <p className="mt-1.5 text-xs text-red-400">{error}</p>
        ) : hint ? (
          <p className="mt-1.5 text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  },
);
Select.displayName = 'Select';
