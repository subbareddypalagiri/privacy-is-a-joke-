import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, Landmark, Zap, Globe } from 'lucide-react';
import { SecurityEvent } from '../../core/types';

interface LiveInterceptStreamProps {
  events: SecurityEvent[];
}

export const LiveInterceptStream: React.FC<LiveInterceptStreamProps> = ({ events }) => {
  const getActionBadge = (action: SecurityEvent['action'], zone: SecurityEvent['zone']) => {
    switch (action) {
      case 'BLOCKED_ADTECH':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
            <ShieldAlert className="w-3 h-3" />
            <span>SINKHOLED</span>
          </span>
        );
      case 'BLOCKED_CNAME_CLOAK':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1">
            <Zap className="w-3 h-3" />
            <span>UNCLOAKED</span>
          </span>
        );
      case 'BANKING_SAFE_ROUTE':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
            <Landmark className="w-3 h-3" />
            <span>ZONE A SAFE</span>
          </span>
        );
      case 'FORWARDED_DOH':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/[0.05] text-neutral-300 border border-white/[0.1] flex items-center gap-1">
            <Lock className="w-3 h-3 text-amber-400" />
            <span>ENCRYPTED DoH</span>
          </span>
        );
    }
  };

  return (
    <div className="rounded-2xl p-5 flex flex-col h-full bg-[#0c0c0e] border border-[#27272a] shadow-xl overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-[#27272a] mb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold font-mono text-white">
            Real-Time Defense Telemetry
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-mono text-[#a1a1aa]">Live Intercept Stream</span>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto max-h-[220px] pr-1">
        {events && events.length > 0 ? (
          events.slice(0, 8).map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a] hover:border-amber-500/30 transition-all flex items-center justify-between text-xs animate-fadeIn"
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                {getActionBadge(evt.action, evt.zone)}
                <span className="font-mono text-[11px] font-medium text-white truncate max-w-[220px]">
                  {evt.domain}
                </span>
              </div>

              <div className="flex items-center gap-3 font-mono text-[10px] text-[#71717a] shrink-0">
                <span>{evt.latencyMs || 1}ms</span>
                <span>{new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-[11px] font-mono text-[#71717a]">
            Waiting for real-time DNS queries...
          </div>
        )}
      </div>
    </div>
  );
};
