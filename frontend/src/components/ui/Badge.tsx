import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium tracking-wide border',
  {
    variants: {
      variant: {
        active: 'bg-green-50 text-green-900 border-green-300',
        inactive: 'bg-slate-100 text-slate-700 border-slate-300',
        draft: 'bg-slate-50 text-slate-600 border-slate-300 border-dashed',
        warning: 'bg-amber-50 text-amber-700 border-amber-300',
        info: 'bg-blue-50 text-blue-700 border-blue-300',
      },
    },
    defaultVariants: {
      variant: 'active',
    },
  }
);

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={badgeVariants({ variant, className })} {...props} />;
}

export function StatusBadge({ status }: { status: string }) {
  const variant = status === 'ACTIVE' ? 'active' : 'inactive';
  return <Badge variant={variant}>{status}</Badge>;
}
