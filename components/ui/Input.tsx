import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-9 w-full rounded-sm border border-cyber-border bg-cyber-dark px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-cyan disabled:cursor-not-allowed disabled:opacity-50 font-mono text-gray-200 ${className}`}
      {...props}
    />
  );
};