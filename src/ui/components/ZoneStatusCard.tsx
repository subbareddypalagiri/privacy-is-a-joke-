import React from 'react';
import { ShieldCheck, ShieldAlert, Globe, Landmark, Plus, Check } from 'lucide-react';

interface ZoneStatusCardProps {
  currentDomain: string;
  activeZone: 'TRUSTED' | 'WILD_WEB';
  onToggleTrust: (domain: string, makeTrusted: boolean) => void;
}

export const ZoneStatusCard: React.FC<ZoneStatusCardProps> = ({
  currentDomain,
  activeZone,
  onToggleTrust,
}) => {
  const isTrusted = activeZone === 'TRUSTED';
  const displayHost = currentDomain || 'Active Webpage';

  return (
    <div
      className={`rounded-2xl p-4 transition-all duration-500 border shadow-lg ${
        isTrusted
          ? 'bg-emerald-950/30 border-emerald-500/30'
          : 'bg-[#121215] border-[#27272a]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isTrusted
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}
          >
            {isTrusted ? <Landmark className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono uppercase tracking-wider font-semibold text-[#71717a]">
                Current Domain
              </span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isTrusted
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}
              >
                {isTrusted ? 'Zone A: High Trust' : 'Zone B: Wild Web'}
              </span>
            </div>
            <p className="text-sm font-bold text-white truncate max-w-[200px]" title={displayHost}>
              {displayHost}
            </p>
          </div>
        </div>

        {currentDomain && (
          <button
            onClick={() => onToggleTrust(currentDomain, !isTrusted)}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all flex items-center space-x-1 border shadow-sm cursor-pointer ${
              isTrusted
                ? 'bg-[#1f1f23] text-white hover:bg-[#27272a] border-[#3f3f46]'
                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/30'
            }`}
          >
            {isTrusted ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Arm Page</span>
              </>
            ) : (
              <>
                <Landmark className="w-3.5 h-3.5" />
                <span>Trust Bank</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="mt-3 text-xs text-[#a1a1aa] leading-relaxed">
        {isTrusted
          ? '🏦 Pure Pass-through Active: Synthetic noise disabled to guarantee zero authentication or banking transaction failure.'
          : '🛡️ Synthetic Shield Active: Canvas farbling, audio micro-jitter, and hardware masking active on this page.'}
      </p>
    </div>
  );
};
