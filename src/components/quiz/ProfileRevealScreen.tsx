import { useEffect, useState } from 'react';
import { MotionIcon } from 'motion-icons-react';
import type { QuizState } from '@/lib/quiz/types';
import { PROFILE_REVEALS, B_PROFILE_REVEALS, REVEAL_FRAME } from '@/content/quiz/profile-reveals';
import { TiltCard } from '@/components/ui/tilt-card';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { ShimmerText } from '@/components/ui/shimmer-text';

// Momentul de onoare al quizului: numim tiparul omului, direct și demn.
// Coregrafie: eyebrow → „recunoaștem tiparul…" → numele profilului cu
// subliniere desenată → o frază de susținere → butonul, ultimul (~2.4s).

// Nume de icoane lucide (string-uri pentru motion-icons-react).
const PROFILE_ICON: Record<string, string> = {
  R: 'Users', Re: 'UserMinus', M: 'Scale', D: 'Link2', C: 'BarChart3', S: 'Network',
  ANGAJAT: 'Compass', ARS: 'Flame', ZERO: 'Sprout',
};

interface ProfileRevealScreenProps {
  state: QuizState;
  onContinue: () => void;
}

export function ProfileRevealScreen({ state, onContinue }: ProfileRevealScreenProps) {
  const key = state.branch === 'B' ? state.bProfile : state.profileAxis;
  const content = state.branch === 'B'
    ? (key ? B_PROFILE_REVEALS[key] : undefined)
    : (key ? PROFILE_REVEALS[key] : undefined);

  // Două stadii: scanare scurtă (anticipare onestă) → reveal.
  const [stage, setStage] = useState<'scanning' | 'revealed'>('scanning');
  useEffect(() => {
    const t = setTimeout(() => setStage('revealed'), 1100);
    return () => clearTimeout(t);
  }, []);

  const iconName = (key && PROFILE_ICON[key]) || 'Fingerprint';

  if (!content) {
    // Fallback defensiv — nu blocăm niciodată fluxul.
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <button onClick={onContinue} className="btn-premium text-white py-4 px-8 rounded-2xl font-archivo text-lg uppercase tracking-wider">
          {REVEAL_FRAME.button}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-2 py-8 text-center max-w-lg mx-auto w-full">

      <ShimmerText className="font-archivo uppercase tracking-[0.3em] text-[11px] mb-6 animate-in fade-in duration-500">
        {REVEAL_FRAME.eyebrow}
      </ShimmerText>

      <TiltCard className="glass w-full p-7 md:p-9 rounded-3xl animate-in fade-in zoom-in-[0.96] slide-in-from-bottom-2 duration-500 delay-200 fill-mode-both">
        {stage === 'scanning' ? (
          <div className="min-h-[180px] flex flex-col items-center justify-center gap-4">
            <MotionIcon name={iconName} animation="pulse" trigger="always" size={30} color="var(--viridian-light)" className="opacity-70" />
            <p className="text-base text-[var(--viridian-light)]/80 font-arimo animate-pulse">
              {REVEAL_FRAME.scanning}
            </p>
          </div>
        ) : (
          <div className="min-h-[180px] flex flex-col items-center justify-center gap-4">
            <span className="grid place-items-center w-14 h-14 rounded-2xl bg-[var(--viridian-main)]/12 border border-[var(--viridian-main)]/30 shadow-[0_0_28px_-6px_var(--viridian-main)]">
              <MotionIcon name={iconName} animation="pop" trigger="always" size={28} color="var(--viridian-light)" />
            </span>

            <div>
              <BlurReveal
                as="h2"
                stagger={0.06}
                duration={0.55}
                delay={0.12}
                className="block font-archivo text-2xl md:text-3xl text-white leading-tight"
              >
                {content.title}
              </BlurReveal>
              <span className="reveal-underline w-16 mx-auto mt-3" style={{ animationDelay: '650ms' }} />
            </div>

            <p className="text-[15px] text-[var(--viridian-ultra)]/80 leading-relaxed font-arimo max-w-sm animate-in fade-in slide-in-from-bottom-2 duration-400 delay-700 fill-mode-both">
              {content.description}
            </p>
          </div>
        )}
      </TiltCard>

      {stage === 'revealed' && (
        <>
          <p className="text-sm text-[var(--viridian-light)]/60 font-arimo mt-6 max-w-sm animate-in fade-in duration-400 delay-1000 fill-mode-both">
            {REVEAL_FRAME.openLoop}
          </p>
          <div className="w-full max-w-sm mt-6 animate-in fade-in zoom-in-[0.97] duration-400 delay-[1150ms] fill-mode-both">
            <button
              onClick={onContinue}
              className="btn-premium w-full text-white py-4 rounded-2xl font-archivo text-lg uppercase tracking-wider"
            >
              {REVEAL_FRAME.button}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
