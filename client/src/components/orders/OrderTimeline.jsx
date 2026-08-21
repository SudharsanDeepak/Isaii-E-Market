import React from 'react';
import { CheckCircle2, Clock, PackageCheck, Truck, Home, AlertCircle } from 'lucide-react';

const steps = [
  { key: 'Pending', label: 'Order Placed', icon: Clock },
  { key: 'Confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'Processing', label: 'Processing', icon: PackageCheck },
  { key: 'Shipped', label: 'Shipped', icon: Truck },
  { key: 'Delivered', label: 'Delivered', icon: Home }
];

const OrderTimeline = ({ currentStatus }) => {
  if (currentStatus === 'Cancelled') {
    return (
      <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-950/40 border border-rose-800/50 text-rose-300">
        <AlertCircle size={20} className="text-rose-400 shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-white">Order Cancelled</h4>
          <p className="text-xs text-rose-200">This order was cancelled and is no longer being processed.</p>
        </div>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === currentStatus);
  const activeIdx = currentIndex === -1 ? 0 : currentIndex;

  return (
    <div className="w-full py-4">
      <div className="relative flex items-center justify-between">
        <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-white/10 -z-0" />
        <div
          className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-gradient-to-r from-[#8B5CF6] via-[#B8C4FF] to-[#14B8A6] -z-0 transition-all duration-500"
          style={{ width: `${(activeIdx / (steps.length - 1)) * 90}%` }}
        />

        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCompleted = idx <= activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div key={step.key} className="relative z-10 flex flex-col items-center group">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
                  isCurrent
                    ? 'bg-gradient-to-tr from-[#8B5CF6] to-[#E83E8C] text-white shadow-lg shadow-purple-900/50 ring-4 ring-purple-500/20 scale-110'
                    : isCompleted
                    ? 'bg-[#0F766E] text-teal-100 border border-teal-400/40 shadow-sm'
                    : 'bg-[#16161c] text-slate-500 border border-white/10'
                }`}
              >
                <Icon size={16} />
              </div>
              <span
                className={`text-[11px] font-semibold mt-2 text-center whitespace-nowrap ${
                  isCurrent
                    ? 'text-white font-bold'
                    : isCompleted
                    ? 'text-teal-300'
                    : 'text-slate-500'
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
