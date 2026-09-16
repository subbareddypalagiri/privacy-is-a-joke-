import React, { useEffect, useRef } from 'react';
import { Cpu, Sparkles } from 'lucide-react';

interface LiveEntropyWaveformProps {
  entropyBits?: number;
  persona?: string;
}

export const LiveEntropyWaveform: React.FC<LiveEntropyWaveformProps> = ({
  entropyBits = 2.58,
  persona = 'Quantum Computing & Topological Matter',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let phase = 0;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    const height = (canvas.height = 70);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Gradient stroke in vivid amber / orange
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(245, 158, 11, 0.2)');
      gradient.addColorStop(0.5, 'rgba(251, 191, 36, 1)');
      gradient.addColorStop(1, 'rgba(249, 115, 22, 0.3)');

      // Draw primary entropy wave
      ctx.beginPath();
      ctx.moveTo(0, height / 2);

      for (let x = 0; x < width; x++) {
        const freq1 = 0.025;
        const freq2 = 0.055;
        const y =
          height / 2 +
          Math.sin(x * freq1 + phase) * 16 * Math.sin(x * 0.005 + phase * 0.5) +
          Math.cos(x * freq2 - phase * 1.5) * 8;
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2.4;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10;
      ctx.stroke();

      // Draw secondary faint harmonic wave in emerald
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      for (let x = 0; x < width; x++) {
        const y = height / 2 + Math.sin(x * 0.035 - phase * 0.8) * 10;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.shadowBlur = 0;
      ctx.stroke();

      phase += 0.045;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full flex flex-col justify-between relative overflow-hidden">
      {/* Waveform Canvas */}
      <div className="w-full h-[70px] relative">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      <div className="flex items-center justify-between text-[10px] text-[#71717a] font-mono mt-1 pt-1.5 border-t border-[#27272a]">
        <span className="truncate max-w-[200px]">Persona: <strong className="text-white">{persona}</strong></span>
        <span className="text-emerald-400 font-semibold">100% Unpredictable</span>
      </div>
    </div>
  );
};
