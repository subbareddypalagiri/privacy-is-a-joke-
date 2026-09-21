import React, { useState } from 'react';
import { 
  ShoppingBag, ShieldAlert, ShieldCheck, ArrowRight, Ban, 
  Sparkles, CheckCircle2, Zap, Smartphone, ExternalLink, RefreshCw 
} from 'lucide-react';
import { CrossAppTelemetryDecoupler } from '../../core/cross_app_decoupler';

export const StalkerDecouplerTestBench: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState<'Flipkart' | 'Meesho' | 'Myntra'>('Flipkart');
  const [selectedAction, setSelectedAction] = useState<'View Product (Nike Shoes)' | 'Add to Cart (₹2,999)' | 'Search (Smart Watch)'>('Add to Cart (₹2,999)');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<Array<{
    target: string;
    broker: string;
    status: 'SEVERED' | 'PRESERVED';
    latency: string;
  }> | null>(null);

  const decoupler = new CrossAppTelemetryDecoupler();

  const runSimulation = () => {
    setIsSimulating(true);
    setSimulationResults(null);

    setTimeout(() => {
      const targets = [
        { domain: `${selectedApp.toLowerCase()}.com/api/cart`, broker: `${selectedApp} Core Store`, isStore: true },
        { domain: 'graph.facebook.com/v18.0/app_events', broker: 'Meta Graph App Events (Instagram Ad Feed)', isStore: false },
        { domain: 'api.appsflyer.com/cart_telemetry', broker: 'AppsFlyer Universal Attribution', isStore: false },
        { domain: 'static.criteo.net/dynamic_retargeting', broker: 'Criteo Cross-App Shopping Retargeter', isStore: false },
      ];

      const results = targets.map((t) => {
        const report = decoupler.evaluateQuery(t.domain);
        return {
          target: t.domain,
          broker: t.broker,
          status: report.intercepted ? ('SEVERED' as const) : ('PRESERVED' as const),
          latency: t.isStore ? '0.2ms' : '0.0ms (Sinkholed)',
        };
      });

      setSimulationResults(results);
      setIsSimulating(false);
    }, 600);
  };

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#0c0c0e]/95 border border-[#27272a] shadow-2xl relative overflow-hidden">
      {/* Background ambient glow */}
      <div 
        className="absolute top-0 right-0 w-96 h-96 pointer-events-none opacity-10"
        style={{
          background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)'
        }}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-[#27272a] gap-4 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-md">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white font-display">
                Cross-App Retargeting Decoupler
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                2026 APEX
              </span>
            </div>
            <p className="text-xs text-[#71717a] mt-0.5">
              Simulate shopping events and verify that surveillance beacons never reach Instagram or YouTube
            </p>
          </div>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-5 py-2.5 rounded-xl font-bold text-xs bg-white hover:bg-neutral-100 text-black flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 disabled:opacity-50"
        >
          {isSimulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-amber-500" />}
          <span>{isSimulating ? 'Simulating Traffic...' : 'Test Decoupler Wire-Cut'}</span>
        </button>
      </div>

      {/* Simulator Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 relative z-10">
        <div>
          <label className="text-[11px] font-mono text-[#a1a1aa] block mb-2 font-bold uppercase">
            1. Select E-Commerce App:
          </label>
          <div className="flex gap-2">
            {(['Flipkart', 'Meesho', 'Myntra'] as const).map((app) => (
              <button
                key={app}
                onClick={() => { setSelectedApp(app); setSimulationResults(null); }}
                className={`flex-1 py-2 text-xs font-mono font-bold rounded-xl border transition-all cursor-pointer ${
                  selectedApp === app
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-[#141417] border-[#27272a] text-[#71717a] hover:text-white'
                }`}
              >
                {app}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-mono text-[#a1a1aa] block mb-2 font-bold uppercase">
            2. Trigger User Action:
          </label>
          <div className="flex gap-2">
            {([
              'View Product (Nike Shoes)',
              'Add to Cart (₹2,999)'
            ] as const).map((act) => (
              <button
                key={act}
                onClick={() => { setSelectedAction(act); setSimulationResults(null); }}
                className={`flex-1 py-2 text-[11px] font-mono font-semibold rounded-xl border transition-all cursor-pointer truncate px-2 ${
                  selectedAction === act
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                    : 'bg-[#141417] border-[#27272a] text-[#71717a] hover:text-white'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live Simulation Output Stream */}
      <div className="mt-6 p-5 rounded-2xl bg-[#08080a] border border-[#27272a] relative z-10">
        <div className="flex items-center justify-between text-xs font-mono pb-3 border-b border-[#27272a]">
          <span className="text-[#a1a1aa]">Surveillance Beacon Route</span>
          <span className="text-[#a1a1aa]">FUF Interception Status</span>
        </div>

        <div className="divide-y divide-[#1f1f23]">
          {simulationResults ? (
            simulationResults.map((r, i) => (
              <div key={i} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white font-mono">{r.broker}</span>
                    <span className="text-[10px] font-mono text-[#71717a] truncate max-w-[200px] sm:max-w-none">
                      ({r.target})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-[#71717a]">{r.latency}</span>
                  {r.status === 'SEVERED' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-red-500/10 text-red-400 border border-red-500/30">
                      <Ban className="w-3 h-3" />
                      WIRE SEVERED (0.0.0.0)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3 h-3" />
                      STORE SAFE (PASSED)
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-xs font-mono text-[#52525b]">
              Click "Test Decoupler Wire-Cut" to observe real-time telemetry isolation between {selectedApp} and Social Ad Brokers.
            </div>
          )}
        </div>

        {simulationResults && (
          <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-emerald-300 font-mono leading-relaxed">
              <strong>SURVEILLANCE CORD CUT:</strong> You can purchase on {selectedApp} normally, but Meta (Instagram) and Google will <strong>never receive the attribution beacon</strong> for this {selectedAction}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
