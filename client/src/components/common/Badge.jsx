import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md' }) => {
  const variantStyles = {
    default: 'bg-[#1E1E28] text-slate-300 border-slate-700/60',
    purple: 'bg-purple-950/40 text-purple-300 border-purple-800/40 shadow-sm shadow-purple-900/20',
    pink: 'bg-pink-950/40 text-pink-300 border-pink-800/40 shadow-sm shadow-pink-900/20',
    teal: 'bg-teal-950/40 text-teal-300 border-teal-800/40 shadow-sm shadow-teal-900/20',
    success: 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40',
    warning: 'bg-amber-950/40 text-amber-300 border-amber-800/40',
    danger: 'bg-rose-950/40 text-rose-300 border-rose-800/40'
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variantStyles[variant] || variantStyles.default} ${sizeStyles[size]}`}
    >
      {children}
    </span>
  );
};

export default Badge;
