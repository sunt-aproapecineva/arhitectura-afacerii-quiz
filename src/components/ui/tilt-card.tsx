import { useRef, useState, useCallback } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Adaptat din spell-ui (xxtomm/spell-ui, MIT). Tilt 3D blând + spotlight viridian
// care urmărește cursorul. Folosit la momentele-recompensă (reveal, scor).
// Calm: unghi mic, spotlight subtil. Reduced-motion / touch → fără tilt, doar conținut.

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  tiltLimit?: number;   // grade max
  scale?: number;
  perspective?: number;
  spotlight?: boolean;
  spotlightColor?: string;
}

export function TiltCard({
  children,
  className,
  style,
  tiltLimit = 6,
  scale = 1.012,
  perspective = 1400,
  spotlight = true,
  spotlightColor = 'rgba(115,212,190,0.16)',
}: TiltCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rest = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)`;
  const [transform, setTransform] = useState(rest);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (reduced || e.pointerType === 'touch') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    const xRot = (py - 0.5) * (tiltLimit * 2) * -1;
    const yRot = (px - 0.5) * (tiltLimit * 2);
    setTransform(`perspective(${perspective}px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale3d(${scale},${scale},${scale})`);
    if (spotlight) setPos({ x: px * 100, y: py * 100 });
  }, [reduced, tiltLimit, perspective, scale, spotlight]);

  const onLeave = useCallback(() => {
    setTransform(rest);
    setHovered(false);
  }, [rest]);

  if (reduced) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onPointerEnter={() => setHovered(true)}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={cn('relative overflow-hidden will-change-transform', className)}
      style={{ transform, transition: 'transform 0.25s var(--ease-move, cubic-bezier(.2,.7,.3,1))', transformStyle: 'preserve-3d', ...style }}
    >
      {children}
      {spotlight && (
        <div
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease' }}
        >
          <div
            className="absolute w-[180%] h-[180%] rounded-full"
            style={{
              left: `${pos.x}%`,
              top: `${pos.y}%`,
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 45%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default TiltCard;
