interface SocialProofPauseProps {
  content: {
    text: string;
    buttonText: string;
    image?: string;
  };
  onContinue: () => void;
}

export function SocialProofPause({ content, onContinue }: SocialProofPauseProps) {
  return (
    <div className="flex flex-col items-center pt-6 max-w-lg mx-auto w-full px-2 pb-10">
      
      {content.image ? (
        <div className="w-[90%] mb-6 rounded-2xl overflow-hidden border border-white/10 animate-scale-in shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          <img
            src={content.image}
            alt="Victor Morar Client"
            className="w-full h-auto object-cover"
          />
        </div>
      ) : (
        <div className="w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-[var(--viridian-main)] to-[var(--viridian-dark)] border border-white/20 flex items-center justify-center animate-in zoom-in shadow-[0_0_20px_rgba(10,150,120,0.3)]">
          <svg className="w-10 h-10 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
      )}

      <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 mb-8 w-full border border-white/10 animate-in slide-in-from-bottom-6 duration-700 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-[var(--midnight)] border-t border-l border-white/10 rotate-45" />
        
        {content.text.split('\n\n').map((paragraph, i) => (
          <p key={i} className="font-arimo text-[17px] leading-relaxed mb-4 last:mb-0 text-[var(--viridian-ultra)] text-center italic relative z-10">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="w-full animate-in zoom-in-95 duration-500 delay-300 fill-mode-both">
        <button 
          onClick={onContinue} 
          className="w-full bg-gradient-to-r from-[var(--viridian-dark)] to-[var(--viridian-main)] hover:from-[var(--viridian-main)] hover:to-[var(--viridian-light)] text-white py-4 text-lg font-archivo uppercase tracking-wider rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_0_20px_var(--viridian-main)]"
        >
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}