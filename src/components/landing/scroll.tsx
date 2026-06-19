import { useRef } from 'react';
import type { ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';

// ── Reveal: intrare la scroll (whileInView) sau la montare (immediate) ──
// `immediate` pentru conținut above-the-fold (hero) — nu depinde de scroll.
export function Reveal({
  children, className, delay = 0, y = 28, immediate = false,
}: { children: ReactNode; className?: string; delay?: number; y?: number; immediate?: boolean }) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  const anim = { opacity: 1, y: 0 };
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(immediate ? { animate: anim } : { whileInView: anim, viewport: { once: true, margin: '-12%' } })}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ── ScrubReveal: textul se „scrie singur", cuvânt cu cuvânt, legat de scroll ──
// Mișcarea-semnătură: omul controlează revelarea durerii lui cu degetul pe scroll.
function ScrubWord({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const blur = useTransform(progress, range, ['blur(4px)', 'blur(0px)']);
  return (
    <motion.span style={{ opacity, filter: blur }} className="inline-block mr-[0.28em]">
      {children}
    </motion.span>
  );
}

export function ScrubReveal({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.5'] });
  const words = text.split(' ');

  if (reduced) return <p className={className}>{text}</p>;

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => {
        const start = i / words.length;
        const end = Math.min(1, start + 1.4 / words.length);
        return (
          <ScrubWord key={i} progress={scrollYProgress} range={[start, end]}>
            {w}
          </ScrubWord>
        );
      })}
    </p>
  );
}

// ── Bară de progres la scroll, sus de tot ──
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-50 bg-gradient-to-r from-[var(--viridian-dark)] via-[var(--viridian-main)] to-[var(--gold)]"
    />
  );
}
