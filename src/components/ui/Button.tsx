import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-brand-600 text-white hover:bg-brand-500 focus-visible:ring-brand-500/40 disabled:bg-brand-600/40 shadow-sm',
  secondary:
    'bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-500/40 disabled:opacity-50',
  ghost:
    'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-slate-100 disabled:opacity-50',
  danger:
    'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500/40 disabled:bg-red-600/40 shadow-sm',
  outline:
    'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800 hover:border-slate-600 disabled:opacity-50',
};

const sizes: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-9 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition',
          'focus:outline-none focus-visible:ring-2',
          'disabled:cursor-not-allowed',
          variants[variant],
          sizes[size],
          className,
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon && <span className="-ml-0.5">{leftIcon}</span>
        )}
        {children}
        {rightIcon && !loading && <span className="-mr-0.5">{rightIcon}</span>}
      </button>
    );
  },
);
Button.displayName = 'Button';
