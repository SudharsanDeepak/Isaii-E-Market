import React from 'react';

const StatCard = ({ title, value, icon: Icon, description, variant = 'purple' }) => {
  const variantMap = {
    purple: {
      bg: 'bg-[#121217] border-purple-500/20',
      iconBg: 'bg-purple-950/60 text-[#B8C4FF] border-purple-800/40',
      textGlow: 'from-[#B8C4FF] to-[#8B5CF6]'
    },
    pink: {
      bg: 'bg-[#121217] border-pink-500/20',
      iconBg: 'bg-pink-950/60 text-[#E83E8C] border-pink-800/40',
      textGlow: 'from-pink-300 to-[#E83E8C]'
    },
    teal: {
      bg: 'bg-[#121217] border-teal-500/20',
      iconBg: 'bg-teal-950/60 text-[#14B8A6] border-teal-800/40',
      textGlow: 'from-teal-200 to-[#0F766E]'
    },
    amber: {
      bg: 'bg-[#121217] border-amber-500/20',
      iconBg: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
      textGlow: 'from-amber-200 to-amber-500'
    }
  };

  const style = variantMap[variant] || variantMap.purple;

  return (
    <div className={`p-5 rounded-2xl border ${style.bg} relative overflow-hidden transition-all hover:scale-[1.01] shadow-lg`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-extrabold text-white mt-1.5">{value}</h3>
          {description && (
            <p className="text-[11px] text-slate-400 mt-1 font-medium">{description}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-3.5 rounded-2xl border ${style.iconBg}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
