interface MicroValidationProps {
  message: string;
  onComplete: () => void;
}

export function MicroValidation({ message, onComplete }: MicroValidationProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[30vh] px-4 gap-8 py-10">
      <div className="bg-[var(--midnight-lighter)] border-l-4 border-[var(--viridian-main)] rounded-r-xl p-8 max-w-lg text-center shadow-lg animate-in zoom-in-95 duration-500 relative">
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[var(--viridian-main)] flex items-center justify-center animate-bounce shadow-[0_0_15px_rgba(10,150,120,0.5)]">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-arimo text-xl leading-relaxed text-[var(--viridian-ultra)] pt-2 font-medium">
          {message}
        </p>
      </div>

      <div className="w-full max-w-sm animate-in slide-in-from-bottom-4 duration-500 delay-300 fill-mode-both">
        <button 
          onClick={onComplete} 
          className="w-full bg-[var(--viridian-main)] hover:bg-[var(--viridian-dark)] text-white py-4 px-6 rounded-xl font-archivo text-lg uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(10,150,120,0.2)] hover:shadow-[0_0_30px_rgba(10,150,120,0.4)]"
        >
          Mai departe →
        </button>
      </div>
    </div>
  );
}