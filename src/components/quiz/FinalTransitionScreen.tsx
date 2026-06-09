import { useState, useEffect } from 'react';

const STAGES = [
  "Centralizăm toate structurile decizionale...",
  "Calculăm indicele de calificare Sandler...",
  "💡 \"Cei 1% nu iau decizii. Ei urmează principii.\" — V. Morar",
  "Generăm planul de acțiune personalizat...",
  "Finalizăm auditul celor 6 tipologii de performanță..."
];

interface FinalTransitionScreenProps {
  onComplete: () => void;
}

export function FinalTransitionScreen({ onComplete }: FinalTransitionScreenProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => {
        if (i < STAGES.length - 1) return i + 1;
        return i;
      });
    }, 5000);

    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 25000);

    return () => {
      clearInterval(interval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 max-w-lg mx-auto w-full">
      <div className="mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[var(--viridian-main)]/10 rounded-full blur-[60px] animate-pulse" style={{ animationDuration: '4s' }} />
        
        <div className="relative w-28 h-28 flex items-center justify-center">
          <svg className="w-full h-full text-[var(--viridian-main)] animate-spin" style={{ animationDuration: '8s' }} viewBox="0 0 100 100">
             <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="300" strokeDashoffset="150" className="opacity-40" />
             <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="150" strokeDashoffset="50" className="opacity-80 drop-shadow-md" />
             <circle cx="50" cy="50" r="32" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="100" strokeDashoffset="0" className="opacity-30" />
          </svg>
          <div className="absolute flex items-center justify-center text-[10px] uppercase font-archivo tracking-[0.2em] text-[var(--viridian-ultra)] shadow-lg animate-pulse" style={{ animationDuration: '2s' }}>
            VICTOR MORAR
          </div>
        </div>
      </div>

      <div className="min-h-[80px] w-full flex items-center justify-center px-6">
        <p key={index} className="text-xl md:text-2xl font-arimo text-[var(--viridian-ultra)]/90 tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-1000 leading-relaxed drop-shadow-sm">
          {STAGES[index]}
        </p>
      </div>

      <div className="mt-16 w-full max-w-xs relative flex flex-col items-center">
        <div className="w-full flex justify-between text-xs font-archivo text-[var(--viridian-light)]/60 uppercase tracking-widest mb-3">
          <span>Stadiu Audit</span>
          <span>{Math.min(100, Math.round(((index + 1) / STAGES.length) * 100))}%</span>
        </div>
        
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden shadow-inner backdrop-blur-md">
          <div 
            className="h-full bg-gradient-to-r from-[var(--viridian-dark)] via-[var(--viridian-main)] to-[#fff] origin-left shadow-[0_0_10px_var(--viridian-main)]"
            style={{ 
              animation: 'fillScale 25s cubic-bezier(0.1, 0.7, 1.0, 0.1) forwards' 
            }}
          />
        </div>
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