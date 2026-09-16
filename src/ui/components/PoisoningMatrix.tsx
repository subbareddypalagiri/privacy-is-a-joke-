import React from 'react';
import { SYNTHETIC_INTEREST_CORPUS } from '../../kernel/ai_poisoning';
import { Radio, Zap, ShieldAlert, Cpu } from 'lucide-react';

interface PoisoningMatrixProps {
  queriesDispatched: number;
  onDispatchManual: () => void;
}

export const PoisoningMatrix: React.FC<PoisoningMatrixProps> = ({
  queriesDispatched,
  onDispatchManual,
}) => {
  return (
    <div className="bg-[#0c0c0e] border border-[#27272a] rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Radio className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">AI Behavioral Poisoning Matrix</h3>
            <p className="text-xs text-[#71717a]">
              Shannon-entropy noise dispersion to neutralize Big Tech prediction models.
            </p>
          </div>
        </div>

        <button
          onClick={onDispatchManual}
          className="text-xs px-3 py-1.5 rounded-xl font-medium bg-[#141417] hover:bg-[#1f1f23] text-amber-400 border border-amber-500/30 flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Fire Entropy Pulse</span>
        </button>
      </div>

      <div className="bg-[#141417] p-3.5 rounded-xl border border-[#27272a] mb-3 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center space-x-2 text-white">
          <Cpu className="w-4 h-4 text-amber-400" />
          <span>Total Entropy Packets Dispatched:</span>
        </div>
        <span className="text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          {queriesDispatched} Packets
        </span>
      </div>

      <div className="space-y-1.5">
        <span className="text-[10px] text-[#71717a] uppercase font-mono tracking-wider font-semibold">
          Active Synthetic Interest Pool:
        </span>
        <div className="flex flex-wrap gap-1.5 max-h-[100px] overflow-y-auto p-1">
          {SYNTHETIC_INTEREST_CORPUS.map((item, idx) => (
            <span
              key={idx}
              className="text-[10px] font-mono px-2 py-1 rounded-md bg-[#141417] text-[#a1a1aa] border border-[#27272a] hover:border-amber-500/40 hover:text-white transition-colors"
            >
              #{item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
