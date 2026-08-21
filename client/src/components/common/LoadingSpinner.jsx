import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3">
      <div
        className={`${sizeClasses[size]} rounded-full border-t-transparent border-[#8B5CF6] animate-spin`}
      />
      {text && <p className="text-xs text-slate-400 font-medium tracking-wide uppercase">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
