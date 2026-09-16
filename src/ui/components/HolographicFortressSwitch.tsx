import React from 'react';
import { Power, Shield, ShieldCheck, Zap } from 'lucide-react';

interface HolographicFortressSwitchProps {
  active: boolean;
  onToggle: () => void;
  pulsing?: boolean;
}

export const HolographicFortressSwitch: React.FC<HolographicFortressSwitchProps> = ({
  active,
  onToggle,
  pulsing = false,
}) => {
  return (
    <div className="relative flex flex-col items-center justify-center my-6 select-none">
      {/* Expanding Ripple Halo Waves when active */}
      {active && (
        <>
          <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-amber-500/25 animate-ripple-1 pointer-events-none" />
          <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-orange-500/20 animate-ripple-2 pointer-events-none" />
          <div className="absolute w-48 h-48 sm:w-60 sm:h-60 rounded-full border border-yellow-500/15 animate-ripple-3 pointer-events-none" />
        </>
      )}

      {/* Rotating Conic Gradient Outer Orbit Ring */}
      <div
        className={`relative p-1.5 rounded-full transition-all duration-700 ${
          active
            ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 animate-spin-slow shadow-[0_0_50px_rgba(245,158,11,0.35)]'
            : 'bg-[#27272a] shadow-none'
        }`}
      >
        {/* Inner Counter-Rotating Shimmer Ring */}
        <div
          className={`p-1 rounded-full transition-all duration-500 ${
            active ? 'bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-600 animate-spin-reverse' : 'bg-[#18181b]'
          }`}
        >
          {/* Giant Master Button Surface */}
          <button
            onClick={onToggle}
            className={`w-36 h-36 sm:w-44 sm:h-44 rounded-full flex flex-col items-center justify-center transition-all duration-500 cursor-pointer active:scale-95 ${
              active
                ? 'bg-gradient-to-b from-[#1c1917] via-[#0c0a09] to-[#000000] border-2 border-amber-500/40 shadow-[inset_0_4px_20px_rgba(245,158,11,0.3),0_10px_35px_rgba(0,0,0,0.8)] hover:border-amber-400'
                : 'bg-[#121215] border-2 border-[#27272a] hover:border-[#3f3f46] shadow-inner opacity-80'
            }`}
          >
            {/* Holographic Power Icon */}
            <div className="relative">
              {active && (
                <div className="absolute inset-0 bg-amber-500 blur-xl opacity-60 animate-pulse-glow" />
              )}
              <Power
                className={`w-12 h-12 sm:w-14 sm:h-14 transition-all duration-500 relative z-10 ${
                  active
                    ? 'text-amber-400 drop-shadow-[0_0_16px_rgba(245,158,11,0.8)] scale-110'
                    : 'text-[#71717a] scale-95'
                }`}
              />
            </div>

            {/* Typography Status */}
            <span
              className={`mt-2 text-[11px] sm:text-xs font-black tracking-widest font-mono uppercase transition-colors ${
                active ? 'text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]' : 'text-[#71717a]'
              }`}
            >
              {active ? 'FORTRESS ARMED' : 'ARMOR PAUSED'}
            </span>

            {/* Micro Live State Indicator */}
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  active
                    ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-ping'
                    : 'bg-[#52525b]'
                }`}
              />
              <span className="text-[9px] font-mono font-bold tracking-tight text-[#a1a1aa]">
                {active ? '61-VECTOR SEAL' : 'STANDBY'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
