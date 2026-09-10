import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../utils/audioPlayer';

interface FloatingBalloon {
  id: number;
  x: number;
  y: number;
  speed: number;
  size: number;
  swayAmp: number;
  swayFreq: number;
  phase: number;
  color: string;
  stringLength: number;
  popped: boolean;
}

interface CelebrationCanvasProps {
  isCelebrationActive: boolean;
}

export const triggerFullCelebration = () => {
  // Cannon from left
  confetti({
    particleCount: 80,
    angle: 60,
    spread: 70,
    origin: { x: 0.1, y: 0.8 },
    colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166', '#a370f7', '#ff85a1'],
    ticks: 350,
  });

  // Cannon from right
  confetti({
    particleCount: 80,
    angle: 120,
    spread: 70,
    origin: { x: 0.9, y: 0.8 },
    colors: ['#ff4d6d', '#ff758f', '#ffb3c1', '#ffd166', '#a370f7', '#ff85a1'],
    ticks: 350,
  });

  // Center golden star burst
  setTimeout(() => {
    confetti({
      particleCount: 50,
      spread: 100,
      origin: { x: 0.5, y: 0.4 },
      shapes: ['star'],
      colors: ['#f59e0b', '#fbbf24', '#fde047', '#ff007f'],
      scalar: 1.3,
    });
  }, 400);
};

export const triggerWishSparkles = (x = 0.5, y = 0.5) => {
  confetti({
    particleCount: 60,
    spread: 80,
    origin: { x, y },
    colors: ['#ffd166', '#ffe8d6', '#f43f5e', '#ec4899', '#a855f7'],
    shapes: ['star', 'circle'],
    ticks: 250,
    scalar: 1.2,
  });
};

export const triggerHeartShower = () => {
  const count = 35;
  const defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#ff0055', '#ff5470', '#ff70a6'],
  });
  fire(0.2, {
    spread: 60,
    colors: ['#ff4d6d', '#ffb3c6', '#ffccd5'],
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#f72585', '#b5179e', '#7209b7'],
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
    colors: ['#ffe4e6', '#fecdd3'],
  });
};

const BALLOON_COLORS = [
  '#f43f5e', // rose
  '#ec4899', // pink
  '#fb7185', // soft red
  '#f59e0b', // amber
  '#c084fc', // purple
  '#fb923c', // orange
  '#e879f9', // fuchsia
];

export const CelebrationCanvas: React.FC<CelebrationCanvasProps> = ({ isCelebrationActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [balloons, setBalloons] = useState<FloatingBalloon[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Initialize rising interactive balloons
  useEffect(() => {
    const balloonCount = isCelebrationActive ? 14 : 7;
    const initialBalloons: FloatingBalloon[] = Array.from({ length: balloonCount }).map((_, i) => ({
      id: i,
      x: Math.random() * (window.innerWidth - 80) + 40,
      y: window.innerHeight + Math.random() * 600 + 50,
      speed: 0.7 + Math.random() * 0.9,
      size: 26 + Math.random() * 16,
      swayAmp: 18 + Math.random() * 22,
      swayFreq: 0.012 + Math.random() * 0.015,
      phase: Math.random() * Math.PI * 2,
      color: BALLOON_COLORS[i % BALLOON_COLORS.length],
      stringLength: 45 + Math.random() * 25,
      popped: false,
    }));
    setBalloons(initialBalloons);
  }, [isCelebrationActive]);

  // Handle Canvas Drawing for hearts & twinkle stars
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Background floating elements: hearts, sparkles, stars
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      type: 'heart' | 'star' | 'sparkle';
      rotation: number;
      rotSpeed: number;
    }

    const particleCount = isCelebrationActive ? 45 : 22;
    const particles: Particle[] = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 4 + Math.random() * 12,
      speedY: -0.25 - Math.random() * 0.55,
      speedX: (Math.random() - 0.5) * 0.35,
      opacity: 0.2 + Math.random() * 0.6,
      type: Math.random() > 0.45 ? 'heart' : Math.random() > 0.5 ? 'star' : 'sparkle',
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
    }));

    const drawHeart = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      const topCurveHeight = size * 0.3;
      c.moveTo(0, topCurveHeight);
      // Top left curve
      c.bezierCurveTo(-size / 2, -size / 2, -size, topCurveHeight / 2, 0, size);
      // Top right curve
      c.bezierCurveTo(size, topCurveHeight / 2, size / 2, -size / 2, 0, topCurveHeight);
      c.fillStyle = `rgba(244, 63, 94, ${opacity})`;
      c.fill();
      c.restore();
    };

    const drawStar = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number, rot: number) => {
      c.save();
      c.translate(x, y);
      c.rotate(rot);
      c.beginPath();
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.35;
      let rotAngle = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      c.moveTo(0, -outerRadius);
      for (let i = 0; i < spikes; i++) {
        let px = Math.cos(rotAngle) * outerRadius;
        let py = Math.sin(rotAngle) * outerRadius;
        c.lineTo(px, py);
        rotAngle += step;

        px = Math.cos(rotAngle) * innerRadius;
        py = Math.sin(rotAngle) * innerRadius;
        c.lineTo(px, py);
        rotAngle += step;
      }
      c.closePath();
      c.fillStyle = `rgba(251, 191, 36, ${opacity})`;
      c.fill();
      c.restore();
    };

    const drawSparkle = (c: CanvasRenderingContext2D, x: number, y: number, size: number, opacity: number) => {
      c.save();
      c.beginPath();
      c.arc(x, y, size * 0.5, 0, Math.PI * 2);
      c.fillStyle = `rgba(254, 205, 211, ${opacity})`;
      c.shadowColor = '#fb7185';
      c.shadowBlur = 8;
      c.fill();
      c.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        if (p.type === 'heart') {
          drawHeart(ctx, p.x, p.y, p.size, p.opacity, p.rotation);
        } else if (p.type === 'star') {
          drawStar(ctx, p.x, p.y, p.size, p.opacity, p.rotation);
        } else {
          drawSparkle(ctx, p.x, p.y, p.size, p.opacity);
        }
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isCelebrationActive]);

  // Balloon rising loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) =>
        prev.map((b) => {
          if (b.popped) return b;
          let newY = b.y - b.speed;
          if (newY < -150) {
            // Reset to bottom
            newY = window.innerHeight + Math.random() * 200 + 40;
            return {
              ...b,
              y: newY,
              x: Math.random() * (window.innerWidth - 100) + 50,
            };
          }
          return { ...b, y: newY };
        })
      );
    }, 16);

    return () => clearInterval(interval);
  }, []);

  const handlePopBalloon = useCallback((id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playBalloonPop();

    // Trigger mini confetti at balloon position
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 25,
      spread: 45,
      origin: { x, y },
      colors: ['#f43f5e', '#fbbf24', '#ffffff', '#e879f9'],
    });

    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? { ...b, popped: true } : b))
    );

    // Respawn balloon after 4 seconds
    setTimeout(() => {
      setBalloons((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                popped: false,
                y: window.innerHeight + 100,
                x: Math.random() * (window.innerWidth - 100) + 50,
              }
            : b
        )
      );
    }, 4000);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background canvas for hearts and stars */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Floating clickable balloons */}
      {balloons.map((b) => {
        if (b.popped) return null;
        // Horizontal sway calculation
        const sway = Math.sin(b.y * b.swayFreq + b.phase) * b.swayAmp;
        const currentX = b.x + sway;

        return (
          <div
            key={b.id}
            id={`balloon-${b.id}`}
            onClick={(e) => handlePopBalloon(b.id, e)}
            className="absolute pointer-events-auto cursor-pointer transition-transform duration-75 hover:scale-110 active:scale-95 group"
            style={{
              transform: `translate3d(${currentX}px, ${b.y}px, 0)`,
              width: `${b.size * 2}px`,
            }}
            title="Click to pop! 🎈"
          >
            {/* Balloon Body */}
            <div
              className="relative rounded-full shadow-lg transition-shadow duration-300 group-hover:shadow-rose-300/60"
              style={{
                width: `${b.size * 2}px`,
                height: `${b.size * 2.5}px`,
                backgroundColor: b.color,
                borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
                boxShadow: `inset -6px -6px 12px rgba(0,0,0,0.18), inset 6px 6px 14px rgba(255,255,255,0.45), 0 8px 24px -4px ${b.color}55`,
              }}
            >
              {/* Highlight gleam */}
              <div
                className="absolute top-2 left-3 rounded-full bg-white/60 blur-[1px]"
                style={{
                  width: `${b.size * 0.4}px`,
                  height: `${b.size * 0.7}px`,
                  transform: 'rotate(-25deg)',
                }}
              />
              {/* Balloon knot */}
              <div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2 rounded-sm"
                style={{ backgroundColor: b.color, filter: 'brightness(0.85)' }}
              />
            </div>
            {/* Balloon String */}
            <svg
              className="w-full overflow-visible opacity-50 stroke-slate-400 dark:stroke-slate-500"
              style={{ height: `${b.stringLength}px` }}
            >
              <path
                d={`M ${b.size} 0 Q ${b.size + 12} ${b.stringLength * 0.4}, ${b.size - 8} ${b.stringLength * 0.75} T ${b.size} ${b.stringLength}`}
                fill="transparent"
                strokeWidth="1.2"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};
