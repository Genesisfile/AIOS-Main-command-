import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ className, variant = 'default', type = 'button', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center rounded-sm text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neon-cyan disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 font-mono uppercase tracking-wider";
  
  const variants = {
    default: "bg-neon-cyan text-black hover:bg-neon-cyan/80 shadow-[0_0_10px_rgba(0,243,255,0.3)] border border-transparent",
    destructive: "bg-neon-red/10 text-neon-red hover:bg-neon-red/20 border border-neon-red/50",
    outline: "border border-cyber-border bg-transparent hover:bg-cyber-border text-gray-300",
    ghost: "hover:bg-cyber-border text-gray-300 hover:text-white"
  };

  return (
    <button type={type} className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
  );
};