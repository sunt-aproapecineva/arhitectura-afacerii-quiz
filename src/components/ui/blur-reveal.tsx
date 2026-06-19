import type { CSSProperties, ElementType } from 'react';

// Inspirat din spell-ui (xxtomm/spell-ui, MIT). Reveal cuvânt-cu-cuvânt cu blur
// care se limpezește. Implementat pur CSS (.blur-word + @keyframes blurWord în
// Quiz.tsx), cu animationDelay calculat per cuvânt — la fel de fiabil ca restul
// animațiilor din app și imun la montare condiționată (scanning→revealed).
// prefers-reduced-motion e tratat în CSS (text static, fără mișcare).

interface BlurRevealProps {
  children: string;
  className?: string;
  wordClassName?: string;   // aplicat pe fiecare cuvânt (ex: gradient text)
  as?: ElementType;
  delay?: number;       // secunde înainte de start
  stagger?: number;     // secunde între cuvinte
  duration?: number;    // secunde per cuvânt
  style?: CSSProperties;
}

export function BlurReveal({
  children,
  className,
  wordClassName,
  as = 'span',
  delay = 0,
  stagger = 0.055,
  duration = 0.55,
  style,
}: BlurRevealProps) {
  const Tag = as as ElementType;
  const words = children.split(' ');

  return (
    <Tag className={className} style={style} aria-label={children}>
      <span className="sr-only">{children}</span>
      {words.map((word, i) => (
        <span key={i} aria-hidden className="inline-block whitespace-nowrap">
          <span
            className={wordClassName ? `blur-word ${wordClassName}` : 'blur-word'}
            style={{ animationDelay: `${delay + i * stagger}s`, ['--blur-dur' as string]: `${duration}s` }}
          >
            {word}
          </span>
          {i < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}

export default BlurReveal;
