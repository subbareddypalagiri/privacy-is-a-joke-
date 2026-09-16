import React, { useEffect, useRef, useState } from 'react';

interface GridNode {
  origX: number;
  origY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Ripple {
  x: number;
  y: number;
  startTime: number;
  maxRadius: number;
  speed: number;
  amplitude: number;
}

export const KineticMeshGrid: React.FC<{
  className?: string;
  theme?: 'cyan' | 'amber' | 'electric';
  interactive?: boolean;
}> = ({ className = '', theme = 'cyan', interactive = true }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [, setClickCount] = useState(0);

  const mouseRef = useRef<{ x: number; y: number; isHovering: boolean; targetX: number; targetY: number }>({
    x: -1000,
    y: -1000,
    targetX: -1000,
    targetY: -1000,
    isHovering: false,
  });

  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let nodes: GridNode[][] = [];
    const spacing = 38; // 38px grid spacing for dense, silky grid

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Rebuild grid nodes
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const offsetX = (width - (cols - 1) * spacing) / 2;
      const offsetY = (height - (rows - 1) * spacing) / 2;

      nodes = [];
      for (let r = 0; r < rows; r++) {
        nodes[r] = [];
        for (let c = 0; c < cols; c++) {
          const origX = offsetX + c * spacing;
          const origY = offsetY + r * spacing;
          nodes[r][c] = {
            origX,
            origY,
            x: origX,
            y: origY,
            vx: 0,
            vy: 0,
          };
        }
      }
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.isHovering = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.isHovering = false;
      mouseRef.current.targetX = -1000;
      mouseRef.current.targetY = -1000;
    };

    const handleClick = (e: MouseEvent) => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        startTime: performance.now(),
        maxRadius: Math.max(width, height) * 1.5,
        speed: 0.52,
        amplitude: 34,
      });
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
      window.addEventListener('click', handleClick);
    }

    const themeColors = {
      cyan: {
        lineBase: 'rgba(255, 255, 255, 0.08)',
        lineActive: 'rgba(56, 189, 248, ',
        nodeBase: 'rgba(255, 255, 255, 0.22)',
        nodeActive: 'rgba(125, 211, 252, ',
        glow: 'rgba(56, 189, 248, 0.6)',
      },
      amber: {
        lineBase: 'rgba(255, 255, 255, 0.08)',
        lineActive: 'rgba(245, 158, 11, ',
        nodeBase: 'rgba(255, 255, 255, 0.22)',
        nodeActive: 'rgba(251, 191, 36, ',
        glow: 'rgba(245, 158, 11, 0.6)',
      },
      electric: {
        lineBase: 'rgba(255, 255, 255, 0.08)',
        lineActive: 'rgba(99, 102, 241, ',
        nodeBase: 'rgba(255, 255, 255, 0.22)',
        nodeActive: 'rgba(165, 180, 252, ',
        glow: 'rgba(99, 102, 241, 0.6)',
      },
    }[theme];

    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      ctx.clearRect(0, 0, width, height);

      // Smooth mouse position
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.15;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.15;

      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;
      const isHovering = mouseRef.current.isHovering;
      const warpRadius = 160;
      const warpForce = 0.48;

      // Update ripples
      const activeRipples = ripplesRef.current.filter((ripple) => {
        const elapsed = currentTime - ripple.startTime;
        const currentRadius = elapsed * ripple.speed;
        return currentRadius < ripple.maxRadius && elapsed < 2500;
      });
      ripplesRef.current = activeRipples;

      // Physics update on each node
      const rows = nodes.length;
      const cols = rows > 0 ? nodes[0].length : 0;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];
          let targetX = node.origX;
          let targetY = node.origY;

          // 1. Mouse Gravitational Warp
          if (isHovering) {
            const dx = mouseX - node.origX;
            const dy = mouseY - node.origY;
            const dist = Math.hypot(dx, dy);

            if (dist < warpRadius) {
              const falloff = Math.pow(1 - dist / warpRadius, 2);
              targetX += dx * falloff * warpForce;
              targetY += dy * falloff * warpForce;
            }
          }

          // 2. Ripple Shockwave Displacement
          for (let i = 0; i < activeRipples.length; i++) {
            const rip = activeRipples[i];
            const elapsed = currentTime - rip.startTime;
            const ripRadius = elapsed * rip.speed;
            const dx = node.origX - rip.x;
            const dy = node.origY - rip.y;
            const dist = Math.hypot(dx, dy);

            const waveWidth = 70;
            const distFromWave = Math.abs(dist - ripRadius);

            if (distFromWave < waveWidth && dist > 0) {
              const decay = Math.exp(-elapsed * 0.0018);
              const phase = ((dist - ripRadius) / waveWidth) * Math.PI;
              const impulse = Math.sin(phase) * rip.amplitude * decay;

              targetX += (dx / dist) * impulse;
              targetY += (dy / dist) * impulse;
            }
          }

          // Spring-Damper Physics
          const k = 0.12;
          const damping = 0.82;

          const ax = (targetX - node.x) * k;
          const ay = (targetY - node.y) * k;

          node.vx = (node.vx + ax) * damping;
          node.vy = (node.vy + ay) * damping;

          node.x += node.vx;
          node.y += node.vy;
        }
      }

      // Render Grid Lines (Horizontal & Vertical)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];

          const distToMouse = isHovering ? Math.hypot(mouseX - node.x, mouseY - node.y) : 9999;
          const mouseIntensity = Math.max(0, 1 - distToMouse / (warpRadius * 1.2));

          let rippleIntensity = 0;
          for (let i = 0; i < activeRipples.length; i++) {
            const rip = activeRipples[i];
            const elapsed = currentTime - rip.startTime;
            const ripRadius = elapsed * rip.speed;
            const dist = Math.hypot(node.x - rip.x, node.y - rip.y);
            const distFromWave = Math.abs(dist - ripRadius);
            if (distFromWave < 50) {
              rippleIntensity = Math.max(rippleIntensity, (1 - distFromWave / 50) * Math.exp(-elapsed * 0.002));
            }
          }

          const activeFactor = Math.max(mouseIntensity, rippleIntensity);

          // Horizontal segment
          if (c < cols - 1) {
            const nextNode = nodes[r][c + 1];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nextNode.x, nextNode.y);

            if (activeFactor > 0.05) {
              ctx.strokeStyle = themeColors.lineActive + Math.min(0.85, 0.15 + activeFactor * 0.7) + ')';
              ctx.lineWidth = 1 + activeFactor * 1.2;
            } else {
              ctx.strokeStyle = themeColors.lineBase;
              ctx.lineWidth = 1;
            }
            ctx.stroke();
          }

          // Vertical segment
          if (r < rows - 1) {
            const nextNode = nodes[r + 1][c];
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nextNode.x, nextNode.y);

            if (activeFactor > 0.05) {
              ctx.strokeStyle = themeColors.lineActive + Math.min(0.85, 0.15 + activeFactor * 0.7) + ')';
              ctx.lineWidth = 1 + activeFactor * 1.2;
            } else {
              ctx.strokeStyle = themeColors.lineBase;
              ctx.lineWidth = 1;
            }
            ctx.stroke();
          }
        }
      }

      // Render Nodes
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[r][c];
          const distToMouse = isHovering ? Math.hypot(mouseX - node.x, mouseY - node.y) : 9999;
          const mouseIntensity = Math.max(0, 1 - distToMouse / (warpRadius * 1.1));

          let rippleIntensity = 0;
          for (let i = 0; i < activeRipples.length; i++) {
            const rip = activeRipples[i];
            const elapsed = currentTime - rip.startTime;
            const ripRadius = elapsed * rip.speed;
            const dist = Math.hypot(node.x - rip.x, node.y - rip.y);
            const distFromWave = Math.abs(dist - ripRadius);
            if (distFromWave < 50) {
              rippleIntensity = Math.max(rippleIntensity, (1 - distFromWave / 50) * Math.exp(-elapsed * 0.002));
            }
          }

          const activeFactor = Math.max(mouseIntensity, rippleIntensity);
          const radius = activeFactor > 0.1 ? 2.5 + activeFactor * 2.2 : 1.5;

          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);

          if (activeFactor > 0.1) {
            ctx.fillStyle = themeColors.nodeActive + Math.min(1, 0.4 + activeFactor * 0.6) + ')';
            ctx.shadowColor = themeColors.glow;
            ctx.shadowBlur = 8 * activeFactor;
          } else {
            ctx.fillStyle = themeColors.nodeBase;
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
          }
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('click', handleClick);
      }
    };
  }, [theme, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-auto" />
    </div>
  );
};
