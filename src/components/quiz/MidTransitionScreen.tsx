import { useState, useEffect } from 'react';

const MESSAGES = [
  "Scanăm răspunsurile inițiale...",
  "Validăm consistența profilului tău...",
  "Identificăm primele tipare psihologice...",
  "Sincronizăm arhitectura decizională..."
];

interface MidTransitionScreenProps {
  onComplete: () => void;
}

export function MidTransitionScreen({ onComplete }: MidTransitionScreenProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => {
        if (i < MESSAGES.length - 1) return i + 1;
        return i;
      });
    }, 3750);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 15000);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="relative w-24 h-24 mb-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm animate-pulse" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[var(--viridian-main)] border-r-[var(--viridian-light)] opacity-80 animate-spin transition-all duration-1000 ease-in-out" />
        <div className="absolute inset-2 rounded-full border-[2px] border-transparent border-b-[var(--viridian-ultra)] border-l-[var(--viridian-dark)] opacity-40 animate-spin-reverse delay-150 transition-all duration-1000" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
      </div>

      <div className="h-16 flex items-center justify-center w-full">
        <p key={index} className="text-xl font-arimo text-[var(--viridian-ultra)] tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-1000 drop-shadow-md px-4">
          {MESSAGES[index]}
        </p>
      </div>

      <div className="mt-8 w-48 h-1 bg-black/40 rounded-full overflow-hidden border border-white/5 blur-[0.5px]">
        <div 
          className="h-full bg-gradient-to-r from-[var(--viridian-dark)] via-[var(--viridian-main)] to-[var(--viridian-light)] w-full origin-left animate-in"
          style={{ 
            animation: 'fillScale 15s linear forwards' 
          }}
        />
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fillScale {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
      `}} />
    </div>
  );
}