import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';
import { clsx } from 'clsx';

type BadgeVariant = 'blue' | 'green' | 'yellow' | 'red' | 'gray' | 'purple';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  blue: 'bg-[#EBF3FC] text-[#0A66C2] border-[#D1E6F8]',
  green: 'bg-green-50 text-[#057642] border-green-200',
  yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  gray: 'bg-gray-100 text-gray-600 border-gray-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function Badge({
  variant = 'blue',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full border',
          variantClasses[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
