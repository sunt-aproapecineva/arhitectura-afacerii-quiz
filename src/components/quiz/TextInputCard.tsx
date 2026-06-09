import { useState } from 'react';

interface TextInputCardProps {
  question: string;
  subtitle?: string;
  placeholder: string;
  example?: string;
  buttonText?: string;
  onSubmit: (value: string) => void;
  showBack?: boolean;
  optional?: boolean;
  onBack?: () => void;
  initialValue?: string;
  type?: string;
  note?: string;
}

export function TextInputCard({
  question,
  subtitle,
  placeholder,
  example,
  buttonText = 'CONTINUĂ',
  onSubmit,
  showBack,
  optional = false,
  onBack,
  initialValue = '',
  type = 'text',
  note,
}: TextInputCardProps) {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!optional && !trimmed) {
      setError('Acest câmp este obligatoriu.');
      return;
    }
    if (type === 'email' && trimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Te rugăm să introduci un email valid.');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  const handleSkip = () => {
    setError('');
    onSubmit('');
  };

  return (
    <div className="flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 w-full max-w-lg mx-auto pb-10">
      
      <div className="bg-white/5 backdrop-blur-xl p-6 md:p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--viridian-dark)] to-[var(--viridian-light)] opacity-80" />
        
        <h2 className="font-archivo text-2xl md:text-3xl uppercase tracking-wide leading-tight text-white mb-3">
          {question}
        </h2>

        {subtitle && (
          <p className="text-base text-[var(--viridian-light)] opacity-90 font-arimo mb-5">
            {subtitle}
          </p>
        )}

        <div className="relative mt-2">
          <input
            type={type}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (error) setError('');
            }}
            placeholder={placeholder}
            className="w-full px-5 py-4 rounded-xl border border-white/10 bg-black/40 text-[var(--viridian-ultra)] text-lg focus:outline-none focus:border-[var(--viridian-main)] focus:ring-1 focus:ring-[var(--viridian-main)] transition-all shadow-inner placeholder:text-[var(--viridian-light)]/30 font-arimo"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            autoFocus
          />
          {example && (
            <p className="text-sm text-[var(--viridian-light)] opacity-70 mt-2 ml-1">
              Ex: {example}
            </p>
          )}
          {error && <p className="text-red-400 text-sm mt-2 ml-1 animate-in slide-in-from-top-1 font-medium">{error}</p>}
        </div>

        {note && (
          <div className="mt-5 p-3 rounded-lg bg-[var(--midnight)] border border-[var(--viridian-dark)]">
            <p className="text-sm text-[var(--viridian-light)] opacity-80 leading-snug">
              🔒 {note}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 mt-2">
        <button 
          onClick={handleSubmit} 
          className="w-full bg-gradient-to-r from-[var(--viridian-dark)] to-[var(--viridian-main)] hover:from-[var(--viridian-main)] hover:to-[var(--viridian-light)] text-white py-4 text-lg font-archivo uppercase tracking-wider rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-[0_0_20px_var(--viridian-main)]"
        >
          {buttonText} {optional && value.trim() === '' ? '(Omite)' : '→'}
        </button>
        
        {optional && value.trim() === '' && (
          <button 
            onClick={handleSkip}
            className="text-sm text-[var(--viridian-light)] opacity-70 hover:opacity-100 uppercase tracking-widest font-archivo py-2"
          >
            Sari peste
          </button>
        )}

        {showBack && onBack && (
          <button 
            onClick={onBack}
            className="mt-2 text-[var(--viridian-light)] opacity-60 hover:opacity-100 font-arimo text-sm py-2 transition-opacity"
          >
            ← Înapoi
          </button>
        )}
      </div>
    </div>
  );
}