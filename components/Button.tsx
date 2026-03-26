"use client";

import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  loading?: boolean;
}

export const Button = ({
  label,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = "font-medium rounded-sm transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#FACC15] hover:bg-white text-black",
    secondary: "bg-zinc-900 border border-zinc-800 text-white hover:border-zinc-700",
    outline: "border border-zinc-800 hover:bg-zinc-900 text-white",
    ghost: "hover:bg-zinc-900 text-zinc-500 hover:text-zinc-200"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-[11px]",
    md: "px-5 py-2.5 text-[13px]",
    lg: "px-7 py-3 text-[15px]"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
      {label}
    </button>
  );
};
