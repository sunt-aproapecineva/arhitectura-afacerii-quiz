import { INTRO_CONTENT } from '@/content/quiz/intro';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-2 py-8">
      
      <div className="w-12 h-1 bg-[var(--viridian-main)] mb-8 animate-pulse" />

      <div className="mb-10 w-full max-w-2xl mx-auto space-y-6 animate-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-5xl font-archivo text-white uppercase tracking-wide leading-tight">
          {INTRO_CONTENT.title}
        </h1>
        <p className="text-[var(--viridian-ultra)] opacity-80 font-arimo text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
          {INTRO_CONTENT.subtitle}
        </p>
      </div>

      <div className="w-full max-w-sm mx-auto mt-6 animate-in zoom-in-95 duration-500 delay-300 fill-mode-both">
        <button 
          onClick={onStart} 
          className="w-full bg-gradient-to-r from-[var(--viridian-dark)] to-[var(--viridian-main)] text-white hover:from-[var(--viridian-main)] hover:to-[var(--viridian-light)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] py-4 px-8 rounded-xl font-archivo text-xl uppercase tracking-wider relative overflow-hidden group shadow-[0_0_20px_rgba(10,150,120,0.3)] hover:shadow-[0_0_30px_var(--viridian-main)]"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {INTRO_CONTENT.buttonText}
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </span>
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 backdrop-blur-md border-l-4 border-l-[var(--viridian-main)] rounded-r-xl p-6 mt-16 max-w-2xl text-left shadow-[0_8px_32px_rgba(0,0,0,0.3)] animate-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-both relative overflow-hidden">
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