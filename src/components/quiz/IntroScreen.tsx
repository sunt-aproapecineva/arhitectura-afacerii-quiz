import { INTRO_CONTENT } from '@/content/quiz/intro';
import { Clock, Gauge, Lock } from 'lucide-react';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { ShimmerText } from '@/components/ui/shimmer-text';

const CHIP_ICONS = { clock: Clock, gauge: Gauge, lock: Lock } as const;

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-2 py-8">

      <div className="flex items-center gap-3 mb-6 animate-in fade-in duration-700">
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--viridian-main)]" />
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--viridian-main)] shadow-[0_0_12px_var(--viridian-main)] animate-pulse" />
        <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--viridian-main)]" />
      </div>

      <ShimmerText className="font-archivo uppercase tracking-[0.35em] text-[11px] mb-7 animate-in fade-in duration-700">
        Arhitectura Afacerii · Diagnostic
      </ShimmerText>

      <div className="mb-10 w-full max-w-2xl mx-auto space-y-6">
        <BlurReveal
          as="h1"
          wordClassName="hero-text"
          stagger={0.07}
          duration={0.62}
          className="block text-4xl md:text-6xl font-archivo uppercase tracking-tight leading-[1.05] drop-shadow-[0_2px_30px_rgba(10,150,120,0.25)]"
        >
          {INTRO_CONTENT.title}
        </BlurReveal>
        <p className="text-[var(--viridian-ultra)]/80 font-arimo text-lg md:text-xl leading-relaxed max-w-xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both">
          {INTRO_CONTENT.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 animate-in fade-in duration-700 delay-700 fill-mode-both">
          {INTRO_CONTENT.chips.map((chip) => {
            const Icon = CHIP_ICONS[chip.icon as keyof typeof CHIP_ICONS] ?? Clock;
            return (
              <span
                key={chip.text}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[13px] font-arimo text-[var(--viridian-ultra)]/75"
              >
                <Icon className="w-3.5 h-3.5 text-[var(--viridian-light)]" strokeWidth={1.75} />
                {chip.text}
              </span>
            );
          })}
        </div>
      </div>

      <div className="w-full max-w-sm mx-auto mt-6 animate-in zoom-in-95 duration-500 delay-300 fill-mode-both">
        <button
          onClick={onStart}
          className="btn-premium group w-full text-white py-4 px-8 rounded-2xl font-archivo text-xl uppercase tracking-wider"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {INTRO_CONTENT.buttonText}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
        </button>
      </div>

      <div className="glass border-l-4 border-l-[var(--viridian-main)] !rounded-l-md p-6 mt-16 max-w-2xl text-left animate-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both relative overflow-hidden">
        <div className="absolute -right-4 -top-8 text-8xl text-white/5 opacity-40 font-serif">"</div>
        <p className="text-[var(--viridian-light)] text-base font-arimo italic relative z-10">
          "{INTRO_CONTENT.quote}"
        </p>
        <p className="text-sm font-archivo text-[var(--viridian-main)] uppercase tracking-wider mt-4 relative z-10">
          — {INTRO_CONTENT.author}
        </p>
      </div>

    </div>
  );
}