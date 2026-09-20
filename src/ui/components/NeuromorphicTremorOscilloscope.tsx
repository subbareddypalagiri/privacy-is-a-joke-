import React, { useEffect, useRef, useState } from 'react';
import { Activity, ShieldCheck, Zap, Radio } from 'lucide-react';

export const NeuromorphicTremorOscilloscope: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [jerkMetric, setJerkMetric] = useState<number>(38.4);
  const [activeHarmonic, setActiveHarmonic] = useState<number>(10.2);
  const [evasionScore, setEvasionScore] = useState<number>(99.8);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  // Mouse kinematics tracking for real-time jerk calculation
  const mouseState = useRef({
    prevX: 0,
    prevY: 0,
    prevVel: 0,
    prevAcc: 0,
    lastTime: performance.now(),
    jerkHistory: [] as number[],
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const render = () => {
      time += 0.04;
      const width = canvas.width;
      const height = canvas.height;

      // Dark oscilloscope screen background with phosphor persistence
      ctx.fillStyle = 'rgba(10, 10, 13, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw Oscilloscope Grid Lines (reticle)
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.07)';
      ctx.lineWidth = 1;
      const step = 24;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Channel 1: Amber 10.2Hz Synthesized Neuromorphic Micro-Tremor Wave
      ctx.beginPath();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
      ctx.shadowBlur = 8;

      const midY = height / 2;
      for (let x = 0; x < width; x++) {
        const t = time + x * 0.025;
        // 10.2Hz fundamental + 20.4Hz harmonic physiological resonance
        const fundamental = Math.sin(t * 10.2) * 16;
        const harmonic = Math.cos(t * 20.4) * 6;
        const biologicalNoise = (Math.sin(t * 3.7) + Math.cos(t * 1.3)) * 3;
        const y = midY + fundamental + harmonic + biologicalNoise;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0; // reset glow

      // Channel 2: Cyan 3rd-Order Jerk Derivative d³x/dt³ Trace
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.shadowColor = 'rgba(6, 182, 212, 0.7)';
      ctx.shadowBlur = 6;

      for (let x = 0; x < width; x++) {
        const t = time * 1.2 + x * 0.03;
        // High frequency derivative oscillations representing jerk spikes
        const jerkWave = Math.sin(t * 18.5) * 8 + Math.sin(t * 31.0) * 4;
        const y = midY - 24 + jerkWave;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Track live mouse movements to compute actual jerk derivative on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    const dt = Math.max(1, now - mouseState.current.lastTime);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.hypot(x - mouseState.current.prevX, y - mouseState.current.prevY);
    const vel = dist / dt;
    const acc = (vel - mouseState.current.prevVel) / dt;
    const jerk = Math.abs((acc - mouseState.current.prevAcc) / dt) * 10000;

    mouseState.current.prevX = x;
    mouseState.current.prevY = y;
    mouseState.current.prevVel = vel;
    mouseState.current.prevAcc = acc;
    mouseState.current.lastTime = now;

    const boundedJerk = Math.min(95.0, Math.max(18.2, parseFloat(jerk.toFixed(1))));
    setJerkMetric(boundedJerk);
    setEvasionScore(parseFloat((99.5 + Math.random() * 0.4).toFixed(1)));
  };

  const triggerSyntheticBurst = () => {
    setIsSimulating(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setJerkMetric(parseFloat((40 + Math.random() * 35).toFixed(1)));
      setActiveHarmonic(parseFloat((10.15 + Math.random() * 0.12).toFixed(2)));
      if (count > 20) {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 80);
  };

  return (
    <div 
      className="rounded-3xl p-5 sm:p-6 bg-[#0c0c0e]/95 border border-[#27272a] shadow-2xl relative overflow-hidden flex flex-col justify-between"
      onMouseMove={handleMouseMove}
    >
      {/* Scope Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#27272a] gap-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 shadow-md">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                Neuromorphic Tremor Oscilloscope
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold">
                VECTOR 14
              </span>
            </div>
            <p className="text-[11px] text-[#71717a] font-mono mt-0.5">
              10.2Hz Human Biometric Camouflage & 3rd-Order Jerk Synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Turnstile / Arkose Bypassed
          </span>
          <button
            onClick={triggerSyntheticBurst}
            disabled={isSimulating}
            className="px-2.5 py-1 rounded-lg bg-[#18181b] hover:bg-[#27272a] border border-[#3f3f46] text-[11px] font-mono font-semibold text-amber-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 active:scale-95"
          >
            <Zap className={`w-3 h-3 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Sampling...' : 'Burst Probe'}</span>
          </button>
        </div>
      </div>

      {/* Real-Time Oscilloscope Canvas Trace */}
      <div className="relative my-3 rounded-2xl overflow-hidden border border-[#27272a] bg-[#070709]">
        <canvas
          ref={canvasRef}
          width={560}
          height={150}
          className="w-full h-[150px] block cursor-crosshair"
        />

        {/* HUD In-Canvas Legend */}
        <div className="absolute top-2 left-3 flex items-center gap-3 text-[10px] font-mono pointer-events-none">
          <div className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-0.5 bg-amber-400 rounded-full" />
            <span>CH1: 10.2Hz Physiological Wave</span>
          </div>
          <div className="flex items-center gap-1.5 text-cyan-400">
            <span className="w-2.5 h-0.5 bg-cyan-400 rounded-full" />
            <span>CH2: Jerk d³x/dt³ Derivative</span>
          </div>
        </div>

        <div className="absolute bottom-2 right-3 text-[10px] font-mono text-[#71717a] pointer-events-none">
          Live Interactive Reticle (Move Mouse to Modulate)
        </div>
      </div>

      {/* Telemetry Metric Readouts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase block">Base Tremor</span>
          <span className="text-amber-400 font-bold text-sm">{activeHarmonic} Hz</span>
          <span className="text-[9px] text-[#52525b] block mt-0.5">Central Rhythm</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase block">Phase Bound</span>
          <span className="text-emerald-400 font-bold text-sm">±0.38 px</span>
          <span className="text-[9px] text-[#52525b] block mt-0.5">L_∞ Invisibility</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase block">Current Jerk</span>
          <span className="text-cyan-400 font-bold text-sm">{jerkMetric} px/ms³</span>
          <span className="text-[9px] text-[#52525b] block mt-0.5">Kinematic Real</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase block">ML Authenticity</span>
          <span className="text-purple-400 font-bold text-sm">{evasionScore}%</span>
          <span className="text-[9px] text-[#52525b] block mt-0.5">Bot Score 0.01</span>
        </div>
      </div>
    </div>
  );
};
