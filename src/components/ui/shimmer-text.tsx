import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Adaptat din spell-ui (xxtomm/spell-ui, MIT) → framer-motion v11, paletă viridian.
// Un glint care traversează lent un text (de obicei eyebrow/label uppercase).
// Calm by design: sweep rar, contrast mic. Reduced-motion → text static.

interface ShimmerTextProps {
  children: ReactNode;
  className?: string;
  base?: string;        // culoarea de bază a textului
  shine?: string;       // culoarea glintului
  duration?: number;    // secunde / trecere
  delay?: number;
  repeatDelay?: number; // pauză între treceri (calm)
}

export function ShimmerText({
  children,
  className,
  base = 'rgba(124,214,193,0.72)',     // viridian-light, lizibil dar discret
  shine = 'rgba(236,250,246,0.98)',    // viridian-ultra, glint
  duration = 2.2,
  delay = 0.8,
  repeatDelay = 4,
}: ShimmerTextProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <span className={className} style={{ color: base }}>{children}</span>;
  }

  return (
    <motion.span
      className={cn('inline-block', className)}
      style={{
        color: base,
        WebkitTextFillColor: 'transparent',
        // Doar longhand (fără shorthand `background`) ca să nu ciocnim cu
        // backgroundPositionX animat de framer-motion (altfel React avertizează).
        backgroundColor: base,
        backgroundImage: `linear-gradient(110deg, ${base} 0%, ${base} 38%, ${shine} 50%, ${base} 62%, ${base} 100%)`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '220% 100%',
        backgroundPositionY: '0%',
      }}
      initial={{ backgroundPositionX: '180%' }}
      animate={{ backgroundPositionX: ['180%', '-80%'] }}
      transition={{ duration, delay, repeat: Infinity, repeatDelay, ease: 'linear' }}
    >
      {children}
    </motion.span>
  );
}

export default ShimmerText;
