"use client";

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

export const Button = ({ 
  label, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseStyles = "font-bold rounded-xl transition-all transform active:scale-95 flex items-center justify-center gap-2 shadow-sm";
  
  const variants = {
    primary: "bg-yellow-400 hover:bg-yellow-500 text-black shadow-lg shadow-yellow-900/10",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white",
    outline: "border-2 border-zinc-800 hover:bg-zinc-900 text-white",
    ghost: "hover:bg-zinc-900 text-zinc-400 hover:text-white"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {label}
    </button>
  );
};
