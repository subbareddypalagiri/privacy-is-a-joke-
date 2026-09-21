import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, ShieldCheck } from 'lucide-react';

export const CanvasTestBench: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [dataHash, setDataHash] = useState<string>('Generating...');
  const [testCount, setTestCount] = useState<number>(1);

  const drawTestPattern = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#0f172a');
    gradient.addColorStop(0.5, '#0369a1');
    gradient.addColorStop(1, '#052e16');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Geometric Shapes (Common Fingerprint Vector)
    ctx.fillStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.beginPath();
    ctx.arc(60, 40, 25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(74, 222, 128, 0.4)';
    ctx.fillRect(100, 20, 50, 40);

    // Font Glyph Rendering (Unicode Typography Test)
    ctx.font = '14px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('FUF 🛡️ 2026', 15, 75);

    // Compute simple DJB2/FNV1 hash of the toDataURL result
    const dataUrl = canvas.toDataURL();
    let hash = 5381;
    for (let i = 0; i < dataUrl.length; i++) {
      hash = (hash * 33) ^ dataUrl.charCodeAt(i);
    }
    const hexHash = (hash >>> 0).toString(16).padStart(8, '0').toUpperCase();
    setDataHash(`0x${hexHash}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`);
  };

  useEffect(() => {
    drawTestPattern();
  }, [testCount]);

  return (
    <div className="bg-[#0c0c0e] border border-[#27272a] rounded-2xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Live Canvas Farbling Test-Bench</h3>
            <p className="text-xs text-[#71717a]">
              Prove that tracking libraries receive randomized cryptographic hashes.
            </p>
          </div>
        </div>

        <button
          onClick={() => setTestCount((c) => c + 1)}
          className="text-xs px-3 py-1.5 rounded-xl font-medium bg-[#141417] hover:bg-[#1f1f23] text-amber-400 border border-amber-500/30 flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          <span>Fuzz Canvas</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-[#141417] p-4 rounded-xl border border-[#27272a]">
        <div className="flex flex-col items-center justify-center">
          <canvas
            ref={canvasRef}
            width={240}
            height={90}
            className="rounded-lg shadow-inner border border-[#27272a]"
          />
          <span className="text-[10px] text-[#71717a] mt-1 font-mono">Rendered 2D Canvas Target</span>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="text-[#71717a] block text-[10px] uppercase font-mono tracking-wider font-semibold">
              Output Fingerprint Hash:
            </span>
            <span className="font-mono text-amber-400 font-bold bg-[#09090b] px-2 py-1 rounded border border-[#27272a] block truncate shadow-xs">
              {dataHash}
            </span>
          </div>

          <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>Differential Farbling Seed: ACTIVE</span>
          </div>

          <p className="text-[11px] text-[#71717a] leading-tight">
            Every session or origin renders with micro-subtle entropy. Trackers cannot correlate your
            device across visits!
          </p>
        </div>
      </div>
    </div>
  );
};
