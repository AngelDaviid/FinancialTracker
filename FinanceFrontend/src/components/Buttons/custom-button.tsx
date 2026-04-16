import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface CustomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary';
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-[#004f39] text-[#fffaca]',
  secondary: 'border-2 border-[#004f39] text-[#004f39]',
  tertiary: 'text-[#004f39]',
};

const CustomButton = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...props
}: CustomButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`px-6 py-2 mt-4 rounded-md text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};

export { CustomButton };
