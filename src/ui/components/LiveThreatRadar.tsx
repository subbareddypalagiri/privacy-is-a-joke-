import React, { useEffect, useState } from 'react';
import { Radio, ShieldCheck, Zap } from 'lucide-react';

interface RadarBlip {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'criteo' | 'meta' | 'google' | 'cname' | 'webrtc' | 'webgpu';
  timestamp: number;
}

export const LiveThreatRadar: React.FC<{ blockedCount?: number }> = ({ blockedCount = 0 }) => {
  const [blips, setBlips] = useState<RadarBlip[]>([
    { id: '1', x: 35, y: 40, label: 'criteo.net', type: 'criteo', timestamp: Date.now() },
    { id: '2', x: 65, y: 30, label: 'facebook.pixel', type: 'meta', timestamp: Date.now() },
    { id: '3', x: 75, y: 70, label: 'doubleclick.net', type: 'google', timestamp: Date.now() },
    { id: '4', x: 25, y: 75, label: 'omnitures.2o7', type: 'cname', timestamp: Date.now() },
  ]);

  useEffect(() => {
    const labels = [
      { label: 'static.criteo.net', type: 'criteo' as const },
      { label: 'graph.instagram.com', type: 'meta' as const },
      { label: 'google-analytics.com', type: 'google' as const },
      { label: 'disguised.cname.trk', type: 'cname' as const },
      { label: 'stun.webrtc.probe', type: 'webrtc' as const },
      { label: 'webgpu.shader.fuzz', type: 'webgpu' as const },
    ];

    const interval = setInterval(() => {
      const randomThreat = labels[Math.floor(Math.random() * labels.length)];
      const angle = Math.random() * Math.PI * 2;
      const radius = 18 + Math.random() * 32;
      const x = 50 + radius * Math.cos(angle);
      const y = 50 + radius * Math.sin(angle);

      const newBlip: RadarBlip = {
        id: Math.random().toString(36).substring(2, 7),
        x,
        y,
        label: randomThreat.label,
        type: randomThreat.type,
        timestamp: Date.now(),
      };

      setBlips((prev) => [newBlip, ...prev.slice(0, 4)]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center relative">
      {/* Radar Scope Circle */}
      <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-full border border-[#27272a] bg-[#070709] flex items-center justify-center overflow-hidden shadow-[inset_0_0_30px_rgba(0,0,0,0.9)] my-2">
        {/* Concentric Rings */}
        <div className="absolute w-36 h-36 rounded-full border border-[#27272a]/60 border-dashed" />
        <div className="absolute w-24 h-24 rounded-full border border-[#27272a]" />
        <div className="absolute w-12 h-12 rounded-full border border-[#27272a]/80" />
        <div className="absolute w-2 h-2 rounded-full bg-amber-400 z-20 shadow-[0_0_10px_#f59e0b]" />

        {/* Crosshair Grids */}
        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[#27272a]/70" />
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-[#27272a]/70" />

        {/* Rotating Radar Sweep Beam in Vivid Amber / Emerald Glow */}
        <div className="absolute inset-0 animate-radar-sweep pointer-events-none origin-center">
          <div
            className="w-1/2 h-1/2 absolute top-0 right-0 origin-bottom-left"
            style={{
              background:
                'conic-gradient(from 0deg at 0% 100%, rgba(245, 158, 11, 0.5) 0deg, rgba(245, 158, 11, 0.15) 45deg, transparent 90deg)',
            }}
          />
        </div>

        {/* Intercepted Threat Blips */}
        {blips.map((blip) => (
          <div
            key={blip.id}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            style={{ left: `${blip.x}%`, top: `${blip.y}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping absolute opacity-80" />
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 border border-white shadow-[0_0_10px_#ef4444]" />
            
            {/* Tooltip on hover */}
            <div className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-0.5 rounded bg-black/95 text-white text-[9px] font-mono whitespace-nowrap shadow-xl border border-gray-700 z-30">
              Sinkholed: {blip.label}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full text-center mt-1">
        <span className="text-[10px] text-[#71717a] font-mono">
          Passive Port 53 Zero-Leak Interception
        </span>
      </div>
    </div>
  );
};
