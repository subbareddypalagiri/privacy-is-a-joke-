import React from 'react';
import { ShieldLogEvent } from '../../types/shield';
import { Shield, Sparkles, Volume2, Cpu, Radio, Clock } from 'lucide-react';

interface LiveTrackerFeedProps {
  events: ShieldLogEvent[];
}

export const LiveTrackerFeed: React.FC<LiveTrackerFeedProps> = ({ events }) => {
  const getIcon = (type: ShieldLogEvent['type']) => {
    switch (type) {
      case 'CANVAS_SCRAMBLE':
        return <Sparkles className="w-3.5 h-3.5 text-amber-400" />;
      case 'AUDIO_SCRAMBLE':
        return <Volume2 className="w-3.5 h-3.5 text-orange-400" />;
      case 'HARDWARE_MASK':
        return <Cpu className="w-3.5 h-3.5 text-blue-400" />;
      case 'AI_POISON':
        return <Radio className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-emerald-400" />;
    }
  };

  const getBadgeColor = (type: ShieldLogEvent['type']) => {
    switch (type) {
      case 'CANVAS_SCRAMBLE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'AUDIO_SCRAMBLE':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'HARDWARE_MASK':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'AI_POISON':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  if (!events || events.length === 0) {
    return (
      <div className="bg-[#0c0c0e] border border-[#27272a] rounded-2xl p-6 text-center text-[#71717a]">
        <Shield className="w-8 h-8 mx-auto mb-2 text-[#3f3f46] animate-pulse" />
        <p className="text-xs text-white font-medium">Zero tracking violations detected yet.</p>
        <p className="text-[10px] text-[#71717a] mt-1">Live telemetry defense feed is active.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0c0c0e] border border-[#27272a] rounded-2xl p-3 max-h-[220px] overflow-y-auto space-y-2">
      {events.map((ev) => (
        <div
          key={ev.id}
          className="flex items-start justify-between p-2.5 rounded-xl bg-[#141417] border border-[#27272a] hover:border-[#3f3f46] transition-all text-xs"
        >
          <div className="flex items-start space-x-2.5 min-w-0 pr-2">
            <div className="mt-0.5 p-1 rounded-md bg-[#1f1f23] border border-[#27272a] shadow-xs">
              {getIcon(ev.type)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-1.5">
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded border font-mono uppercase tracking-wider font-semibold ${getBadgeColor(
                    ev.type
                  )}`}
                >
                  {ev.type.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-[#a1a1aa] font-mono truncate">{ev.domain}</span>
              </div>
              <p className="text-white text-[11px] font-mono mt-0.5 truncate">{ev.details}</p>
            </div>
          </div>

          <div className="flex items-center text-[10px] text-[#71717a] shrink-0 mt-0.5 font-mono">
            <Clock className="w-2.5 h-2.5 mr-0.5" />
            {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};
