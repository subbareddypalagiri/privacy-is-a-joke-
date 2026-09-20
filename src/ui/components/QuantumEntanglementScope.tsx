import React, { useEffect, useRef, useState } from 'react';
import { Lock, ShieldAlert, Zap, Radio, RefreshCw, Cpu, CheckCircle2 } from 'lucide-react';

export const QuantumEntanglementScope: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [qber, setQber] = useState<number>(1.84);
  const [fidelity, setFidelity] = useState<number>(0.988);
  const [keyRate, setKeyRate] = useState<string>('2.48 Mbps');
  const [underAttack, setUnderAttack] = useState<boolean>(false);
  const [sessionHash, setSessionHash] = useState<string>('0x7f4e...9a21');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      angle += underAttack ? 0.12 : 0.035;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 20;

      // Deep dark quantum vacuum background
      ctx.fillStyle = 'rgba(8, 8, 12, 0.3)';
      ctx.fillRect(0, 0, width, height);

      // Polar Phase Coordinate Circles
      ctx.strokeStyle = underAttack ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.12)';
      ctx.lineWidth = 1;
      [radius * 0.35, radius * 0.7, radius].forEach((r) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Axis crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.stroke();

      // Alice Photon Vector (Amber / Gold)
      const aliceAngle = angle;
      const aliceX = centerX + Math.cos(aliceAngle) * (radius * 0.85);
      const aliceY = centerY + Math.sin(aliceAngle) * (radius * 0.85);

      ctx.beginPath();
      ctx.strokeStyle = underAttack ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = underAttack ? 'rgba(239, 68, 68, 0.9)' : 'rgba(245, 158, 11, 0.8)';
      ctx.shadowBlur = 10;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(aliceX, aliceY);
      ctx.stroke();

      // Bob Photon Vector (Cyan / Purple - Entangled Bell Pair |Φ+>)
      // Under normal state: entangled phase delta is π or 0. Under attack: random desynchronization!
      const bobAngle = underAttack ? angle + Math.sin(angle * 3) * 1.5 : angle + Math.PI;
      const bobX = centerX + Math.cos(bobAngle) * (radius * 0.85);
      const bobY = centerY + Math.sin(bobAngle) * (radius * 0.85);

      ctx.beginPath();
      ctx.strokeStyle = underAttack ? '#f87171' : '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = underAttack ? 'rgba(248, 113, 113, 0.9)' : 'rgba(6, 182, 212, 0.8)';
      ctx.shadowBlur = 10;
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(bobX, bobY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Photon nodal points
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(aliceX, aliceY, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(bobX, bobY, 4, 0, Math.PI * 2);
      ctx.fill();

      // Center Singlet Source Origin
      ctx.fillStyle = underAttack ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [underAttack]);

  // Simulate Eve eavesdropper injection and recovery
  const handleEavesdropSimulation = () => {
    if (underAttack) return;
    setUnderAttack(true);
    setQber(26.4);
    setFidelity(0.612);
    setKeyRate('0.00 kbps (ABORTED)');

    // After 2.2 seconds: Quantum state collapse triggered, auto-renegotiate Kyber-768 lattice
    setTimeout(() => {
      setUnderAttack(false);
      setQber(1.78);
      setFidelity(0.991);
      setKeyRate('2.62 Mbps');
      setSessionHash('0x' + Math.random().toString(16).substring(2, 10) + '...lattice');
    }, 2400);
  };

  return (
    <div className="rounded-3xl p-5 sm:p-6 bg-[#0c0c0e]/95 border border-[#27272a] shadow-2xl relative overflow-hidden flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#27272a] gap-2">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shadow-md transition-colors ${
            underAttack 
              ? 'bg-red-500/20 border-red-500/40 text-red-400' 
              : 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400'
          }`}>
            <Lock className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white font-display">
                Quantum Entanglement Scope (QKD)
              </h3>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                underAttack
                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                  : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              }`}>
                {underAttack ? 'STATE COLLAPSE' : 'BELL PAIR |Φ⁺⟩'}
              </span>
            </div>
            <p className="text-[11px] text-[#71717a] font-mono mt-0.5">
              NIST FIPS 203 Kyber-768 Lattice + E91 Quantum Cryptographic Link
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleEavesdropSimulation}
            disabled={underAttack}
            className={`px-3 py-1.5 rounded-xl border text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-sm ${
              underAttack
                ? 'bg-red-500/20 border-red-500/50 text-red-300 animate-pulse'
                : 'bg-[#18181b] hover:bg-[#27272a] border-[#3f3f46] text-amber-400 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{underAttack ? 'Eve Intercept Active!' : 'Inject Eve Tap'}</span>
          </button>
        </div>
      </div>

      {/* Scope Main Body with Canvas & Attack Banner */}
      <div className="my-3 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Polar Scope Canvas */}
        <div className="md:col-span-6 relative flex items-center justify-center rounded-2xl overflow-hidden border border-[#27272a] bg-[#070709] p-2">
          <canvas
            ref={canvasRef}
            width={240}
            height={200}
            className="block w-[240px] h-[200px]"
          />

          <div className="absolute bottom-2 left-3 text-[9px] font-mono text-[#71717a] pointer-events-none">
            Polar Bell Basis |Φ⁺⟩ = (|00⟩ + |11⟩)/√2
          </div>
        </div>

        {/* Live Attack / Security Diagnostic Panel */}
        <div className="md:col-span-6 space-y-3 font-mono">
          {underAttack ? (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 space-y-1 text-xs animate-pulse">
              <div className="flex items-center gap-2 font-bold text-red-400">
                <ShieldAlert className="w-4 h-4" />
                <span>EAVESDROPPER INTERCEPT DETECTED</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-200">
                QBER exceeded 11% Shor-Preskill threshold! Photon polarization decoherence triggered instant Key Abort.
              </p>
              <span className="text-[10px] text-amber-300 font-bold block pt-1">
                Auto-renegotiating Kyber-768 lattice seed...
              </span>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-[#141417] border border-[#27272a] text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Fiber Optical Link Verified Uncompromised</span>
              </div>
              <p className="text-[11px] text-[#a1a1aa] leading-relaxed">
                Zero eavesdropper interception. Quantum no-cloning theorem guarantees forward secrecy against quantum computers.
              </p>
              <div className="text-[10px] text-[#71717a] pt-1">
                Lattice Seed: <span className="text-cyan-400">{sessionHash}</span>
              </div>
            </div>
          )}

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded-xl bg-[#141417] border border-[#27272a]">
              <span className="text-[10px] text-[#71717a] block uppercase">QBER Ratio</span>
              <span className={`font-bold text-sm ${underAttack ? 'text-red-400' : 'text-emerald-400'}`}>
                {qber}%
              </span>
              <span className="text-[9px] text-[#52525b] block">&lt; 11% Threshold</span>
            </div>

            <div className="p-2 rounded-xl bg-[#141417] border border-[#27272a]">
              <span className="text-[10px] text-[#71717a] block uppercase">Bell Fidelity F</span>
              <span className={`font-bold text-sm ${underAttack ? 'text-red-400' : 'text-amber-400'}`}>
                {fidelity}
              </span>
              <span className="text-[9px] text-[#52525b] block">&gt; 0.95 Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
        <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase block">Key Sifting</span>
          <span className="text-cyan-400 font-bold text-sm">{keyRate}</span>
          <span className="text-[9px] text-[#52525b] block mt-0.5">Shannon Secure</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase block">Lattice Dim</span>
          <span className="text-purple-400 font-bold text-sm">768 Poly</span>
          <span className="text-[9px] text-[#52525b] block mt-0.5">NIST FIPS 203</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase block">Decapsulation</span>
          <span className="text-emerald-400 font-bold text-sm">&lt; 0.04 ms</span>
          <span className="text-[9px] text-[#52525b] block mt-0.5">Hardware ASM</span>
        </div>

        <div className="p-2.5 rounded-xl bg-[#141417] border border-[#27272a]">
          <span className="text-[10px] text-[#71717a] uppercase block">Post-Quantum</span>
          <span className="text-amber-400 font-bold text-sm">ACTIVE</span>
          <span className="text-[9px] text-[#52525b] block mt-0.5">Harvest-Proof</span>
        </div>
      </div>
    </div>
  );
};
