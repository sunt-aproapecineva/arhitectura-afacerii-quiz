import { useEffect, useState } from 'react';
import { MotionIcon } from 'motion-icons-react';
import type { Branch } from '@/lib/quiz/types';

// „Asamblăm diagnosticul" — checklist vizibil de la început (planul la vedere
// e el însuși anticipare onestă), bifat metronomic. Fără procente false.

const SLOT_MS = 900;
const EXIT_MS = 240;

function buildItems(branch: Branch | null, name: string): string[] {
  const who = name || 'tine';
  if (branch === 'B') {
    return [
      'Analizăm punctul tău de pornire',
      'Confirmăm profilul de start',
      'Calculăm pregătirea de start',
      `Pregătim primul pas pentru ${who}`,
    ];
  }
  return [
    'Analizăm răspunsurile tale',
    'Identificăm tiparul principal',
    'Calculăm Scorul de Libertate',
    `Pregătim planul pentru ${who}`,
  ];
}

interface FinalTransitionScreenProps {
  onComplete: () => void;
  branch?: Branch | null;
  userName?: string;
}

export function FinalTransitionScreen({ onComplete, branch = null, userName = '' }: FinalTransitionScreenProps) {
  const items = buildItems(branch, userName);
  const total = items.length * SLOT_MS;
  const [done, setDone] = useState(0);          // câte item-uri sunt bifate
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDone(d => Math.min(d + 1, items.length));
    }, SLOT_MS);
    const exitT = setTimeout(() => setLeaving(true), total);
    const doneT = setTimeout(onComplete, total + EXIT_MS);
    return () => { clearInterval(interval); clearTimeout(exitT); clearTimeout(doneT); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[70vh] px-4 max-w-md mx-auto w-full transition-[opacity,transform] duration-[240ms]"
      style={{
        transitionTimingFunction: 'cubic-bezier(.55,0,1,.45)',
        opacity: leaving ? 0 : 1,
        transform: leaving ? 'translateY(-8px)' : 'none',
      }}
    >
      <div className="flex items-center gap-2.5 mb-10 animate-in fade-in duration-500">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--viridian-main)] shadow-[0_0_10px_var(--viridian-main)]" />
        <span className="font-archivo text-sm font-bold tracking-[0.3em] text-[var(--viridian-ultra)]/80">
          VICTOR MORAR
        </span>
      </div>

      <div className="glass w-full p-6 md:p-7 flex flex-col gap-5">
        {items.map((label, i) => {
          const isDone = i < done;
          const isActive = i === done;
          return (
            <div
              key={label}
              className="flex items-center gap-4 transition-opacity duration-300"
              style={{ opacity: isDone ? 0.85 : isActive ? 1 : 0.35 }}
            >
              <span className="relative shrink-0 w-6 h-6 grid place-items-center">
                {isDone ? (
                  <span className="w-6 h-6 rounded-full bg-[var(--viridian-main)] grid place-items-center animate-in zoom-in-75 duration-200 shadow-[0_0_14px_-2px_var(--viridian-main)]">
                    <MotionIcon name="Check" animation="success" trigger="always" size={14} color="#ffffff" />
                  </span>
                ) : isActive ? (
                  <MotionIcon name="Loader2" animation="spin" trigger="always" size={22} color="var(--viridian-main)" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-white/15" />
                )}
              </span>
              <span className={`text-[15px] font-arimo text-left ${isDone ? 'text-[var(--viridian-light)]' : 'text-[var(--viridian-ultra)]'}`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-[var(--viridian-ultra)]/40 font-arimo italic mt-8 text-center max-w-xs">
        „Cei 1% nu iau decizii. Ei urmează principii." — Victor Morar
      </p>
    </div>
  );
}
