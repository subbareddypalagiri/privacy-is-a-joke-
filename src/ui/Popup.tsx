import React, { useEffect, useState } from 'react';
import { ShieldState } from '../types/shield';
import { ToggleSwitch } from './components/ToggleSwitch';
import { ZoneStatusCard } from './components/ZoneStatusCard';
import { LiveTrackerFeed } from './components/LiveTrackerFeed';
import { FluidParticleCanvas } from './components/FluidParticleCanvas';
import {
  Shield,
  ShieldAlert,
  Sparkles,
  Volume2,
  Cpu,
  Radio,
  ExternalLink,
  Settings2,
  RefreshCw,
  Power,
  Zap,
} from 'lucide-react';

export const Popup: React.FC = () => {
  const [state, setState] = useState<ShieldState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchState = () => {
    try {
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({ type: 'GET_STATE' }, (res: ShieldState) => {
          if (res) setState(res);
          setLoading(false);
        });

        // Also query active tab to get current domain
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs && tabs[0] && tabs[0].url) {
            try {
              const url = new URL(tabs[0].url);
              setState((prev) => (prev ? { ...prev, currentDomain: url.hostname } : null));
            } catch (e) {}
          }
        });
      } else {
        // Fallback for dev mode / preview
        setState({
          enabled: true,
          activeZone: 'WILD_WEB',
          currentDomain: 'instagram.com',
          counters: {
            trackersBlocked: 142,
            canvasScrambles: 48,
            audioScrambles: 12,
            hardwareMasks: 64,
            poisonQueriesDispatched: 19,
          },
          features: {
            canvasFarbling: true,
            audioFarbling: true,
            hardwareSpoofing: true,
            webRTCProtection: true,
            aiPoisoning: true,
            smartBankingWhitelist: true,
          },
          trustedDomains: ['hdfcbank.com', 'sbi.co.in'],
          recentEvents: [
            {
              id: '1',
              timestamp: Date.now() - 10000,
              type: 'CANVAS_SCRAMBLE',
              domain: 'instagram.com',
              details: 'Canvas 2D getImageData fuzzed (300x150px)',
            },
            {
              id: '2',
              timestamp: Date.now() - 45000,
              type: 'AI_POISON',
              domain: 'global-ai-graph',
              details: 'Dispatched synthetic entropy: "quantum key distribution protocols"',
            },
          ],
        });
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const handleToggleMaster = (enabled: boolean) => {
    if (!state) return;
    setState({ ...state, enabled });
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({ type: 'TOGGLE_SHIELD', payload: enabled });
    }
  };

  const handleToggleFeature = (feature: keyof ShieldState['features'], value: boolean) => {
    if (!state) return;
    setState({
      ...state,
      features: { ...state.features, [feature]: value },
    });
    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: 'TOGGLE_FEATURE',
        payload: { feature, value },
      });
    }
  };

  const handleToggleTrust = (domain: string, makeTrusted: boolean) => {
    if (!state) return;
    const newZone = makeTrusted ? 'TRUSTED' : 'WILD_WEB';
    setState({ ...state, activeZone: newZone });

    if (typeof chrome !== 'undefined' && chrome.runtime) {
      chrome.runtime.sendMessage({
        type: makeTrusted ? 'ADD_TRUSTED_DOMAIN' : 'REMOVE_TRUSTED_DOMAIN',
        payload: domain,
      });
    }
  };

  const openDashboard = () => {
    if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open('dashboard.html', '_blank');
    }
  };

  if (loading || !state) {
    return (
      <div className="w-[380px] h-[520px] flex items-center justify-center bg-[#000000] text-[#71717a]">
        <RefreshCw className="w-6 h-6 animate-spin text-amber-400" />
      </div>
    );
  }

  return (
    <div className="w-[380px] max-h-[580px] overflow-y-auto bg-[#000000] text-white p-4 space-y-3.5 relative selection:bg-amber-500/30 font-sans">
      
      {/* Dynamic Ambient Fluid Particle Background */}
      <FluidParticleCanvas active={state.enabled} />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-[1px] shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <div className="w-full h-full bg-[#09090b] rounded-[7px] flex items-center justify-center">
              <Shield className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              FUF <span className="text-[9px] text-amber-400 font-mono font-bold px-1.5 py-0.2 rounded border border-amber-500/30 bg-amber-500/10">16-VECT</span>
            </h1>
            <p className="text-[10px] text-[#71717a] font-mono">Cognitive Privacy Extension</p>
          </div>
        </div>

        <button
          onClick={openDashboard}
          title="Open Full Dashboard"
          className="p-2 rounded-xl bg-[#141417] hover:bg-[#1f1f23] text-[#a1a1aa] hover:text-white transition-all border border-[#27272a] shadow-sm cursor-pointer"
        >
          <ExternalLink className="w-4 h-4" />
        </button>
      </div>

      {/* Master Toggle Bar with tactile glow */}
      <div
        className={`rounded-2xl p-3.5 transition-all duration-300 relative z-10 bg-[#0c0c0e] border ${
          state.enabled
            ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]'
            : 'border-[#27272a] opacity-80'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-3 h-3 rounded-full transition-all ${
                state.enabled
                  ? 'bg-emerald-400 shadow-[0_0_10px_#34d399] animate-ping'
                  : 'bg-[#3f3f46]'
              }`}
            />
            <div>
              <span className="text-xs font-black tracking-wide font-mono text-white block">
                {state.enabled ? 'FORTRESS ARMED' : 'ARMOR PAUSED'}
              </span>
              <span className="text-[10px] text-[#71717a]">
                {state.enabled
                  ? 'All 16 defense vectors online'
                  : 'Surveillance protection suspended'}
              </span>
            </div>
          </div>

          <ToggleSwitch checked={state.enabled} onChange={handleToggleMaster} size="md" />
        </div>
      </div>

      {/* Zone Status */}
      <div className="relative z-10">
        <ZoneStatusCard
          currentDomain={state.currentDomain}
          activeZone={state.activeZone}
          onToggleTrust={handleToggleTrust}
        />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2 relative z-10">
        <div className="p-3 rounded-xl bg-[#0c0c0e] border border-[#27272a]">
          <div className="flex items-center space-x-1.5 text-amber-400 text-xs mb-1">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#71717a] font-bold">
              Canvas / WebGPU
            </span>
          </div>
          <span className="text-base font-black text-white font-mono">
            {state.counters.canvasScrambles.toLocaleString()}
          </span>
        </div>

        <div className="p-3 rounded-xl bg-[#0c0c0e] border border-[#27272a]">
          <div className="flex items-center space-x-1.5 text-purple-400 text-xs mb-1">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#71717a] font-bold">
              AI Noise Pulses
            </span>
          </div>
          <span className="text-base font-black text-white font-mono">
            {state.counters.poisonQueriesDispatched.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Feature Toggles Accordion */}
      <div className="bg-[#0c0c0e] border border-[#27272a] rounded-2xl p-3.5 space-y-2.5 relative z-10 text-xs shadow-xl">
        <div className="flex items-center justify-between pb-1 border-b border-[#27272a]">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717a] font-bold">
            Active Defenses
          </span>
          <span className="text-[9px] text-amber-400 font-mono font-bold bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">Manifest V3</span>
        </div>

        <ToggleSwitch
          checked={state.features.canvasFarbling}
          onChange={(v) => handleToggleFeature('canvasFarbling', v)}
          label="Canvas & WebGPU Farbling"
          description="Fuzz 2D/3D visual fingerprint hashes"
          size="sm"
        />

        <ToggleSwitch
          checked={state.features.audioFarbling}
          onChange={(v) => handleToggleFeature('audioFarbling', v)}
          label="AudioContext Scrambler"
          description="Randomize oscillator dynamics"
          size="sm"
        />

        <ToggleSwitch
          checked={state.features.hardwareSpoofing}
          onChange={(v) => handleToggleFeature('hardwareSpoofing', v)}
          label="Hardware Normalization"
          description="Mask CPU cores, RAM & battery status"
          size="sm"
        />

        <ToggleSwitch
          checked={state.features.webRTCProtection}
          onChange={(v) => handleToggleFeature('webRTCProtection', v)}
          label="WebRTC Local IP Seal"
          description="Prevent internal IP STUN leakage"
          size="sm"
        />

        <ToggleSwitch
          checked={state.features.aiPoisoning}
          onChange={(v) => handleToggleFeature('aiPoisoning', v)}
          label="AI Behavioral Poisoning"
          description="Disperse synthetic entropy to destroy tracking AI"
          size="sm"
        />
      </div>

      {/* Live Activity Stream */}
      <div className="space-y-1.5 relative z-10">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#71717a] font-bold block px-1">
          Real-Time Defense Activity
        </span>
        <LiveTrackerFeed events={state.recentEvents} />
      </div>

      {/* Footer */}
      <div className="text-center pt-1 text-[10px] text-[#71717a] font-mono relative z-10">
        Zero-Cost Open Source Defense for Society
      </div>
    </div>
  );
};
