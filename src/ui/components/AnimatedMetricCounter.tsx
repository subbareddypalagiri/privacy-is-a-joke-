import React, { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedMetricCounterProps {
  value: number | string;
  icon?: LucideIcon;
  label?: string;
  unit?: string;
  colorClass?: string;
  statusBadge?: string;
}

export const AnimatedMetricCounter: React.FC<AnimatedMetricCounterProps> = ({
  value,
  icon: Icon,
  label,
  unit = '',
  colorClass = 'text-amber-400',
  statusBadge,
}) => {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setHighlight(true);
    const timeout = setTimeout(() => setHighlight(false), 800);
    return () => clearTimeout(timeout);
  }, [value]);

  // If used as a simple inline counter without card wrapper
  if (!label && !Icon) {
    return (
      <span
        className={`transition-colors duration-300 font-mono ${
          highlight ? 'text-amber-400 scale-105' : 'text-white'
        }`}
      >
        {typeof value === 'number' ? value.toLocaleString() : value}
      </span>
    );
  }

  return (
    <div className="bg-[#0c0c0e] border border-[#27272a] rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-amber-500/40 transition-all shadow-lg">
      {/* Top row */}
      <div className="flex items-center justify-between">
        {Icon && (
          <div className={`p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 ${colorClass}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
        {statusBadge && (
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-[#18181b] text-amber-400 border border-amber-500/20">
            {statusBadge}
          </span>
        )}
      </div>

      {/* Metric value */}
      <div className="mt-3">
        <div className="flex items-baseline gap-1">
          <span
            className={`text-xl sm:text-2xl font-bold font-mono tracking-tight transition-colors duration-300 ${
              highlight ? 'text-amber-400' : 'text-white'
            }`}
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </span>
          {unit && <span className="text-[10px] font-mono font-semibold text-[#71717a]">{unit}</span>}
        </div>
        {label && <p className="text-[11px] font-medium text-[#a1a1aa] mt-0.5">{label}</p>}
      </div>

      {/* Subtle bottom hover line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
