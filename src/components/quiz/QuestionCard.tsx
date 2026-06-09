import { useState, useCallback } from 'react';
import type { Question, AnswerOption as AnswerOptionType } from '@/lib/quiz/types';
import { AnswerOption } from './AnswerOption';

interface QuestionCardProps {
  question: Question;
  onAnswer?: (option: AnswerOptionType) => void;
  onMultiAnswer?: (options: AnswerOptionType[]) => void;
  onBack?: () => void;
  onExpandNote?: (noteId: string) => void;
  showBack?: boolean;
  preSelectedCode?: string;
  preSelectedCodes?: string[];
}

export function QuestionCard({
  question,
  onAnswer,
  onMultiAnswer,
  onBack,
  onExpandNote,
  showBack = false,
  preSelectedCode,
  preSelectedCodes
}: QuestionCardProps) {
  const isMulti = question.multiSelect;
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(() => {
    if (preSelectedCodes && preSelectedCodes.length > 0) {
      return new Set(preSelectedCodes);
    }
    if (preSelectedCode) {
      return new Set(preSelectedCode.split(','));
    }
    return new Set();
  });
  const [otherTexts, setOtherTexts] = useState<Record<string, string>>({});

  const handleSingleSelect = useCallback((option: AnswerOptionType) => {
    setSelectedCodes(new Set([option.code]));
  }, []);

  const handleSingleSubmit = useCallback(() => {
    if (selectedCodes.size === 0) return;
    const option = question.options.find(o => selectedCodes.has(o.code));
    if (!option) return;
    if (option.isOther) {
      const customText = otherTexts[option.code] || option.text;
      onAnswer?.({ ...option, text: customText });
    } else {
      onAnswer?.(option);
    }
  }, [selectedCodes, question.options, otherTexts, onAnswer]);

  const handleMultiToggle = useCallback((option: AnswerOptionType) => {
    setSelectedCodes(prev => {
      const next = new Set(prev);
      if (next.has(option.code)) {
        next.delete(option.code);
      } else {
        next.add(option.code);
      }
      return next;
    });
  }, []);

  const handleOtherTextChange = useCallback((code: string, text: string) => {
    setOtherTexts(prev => ({ ...prev, [code]: text }));
  }, []);

  const handleMultiSubmit = useCallback(() => {
    if (selectedCodes.size === 0) return;
    const selected = question.options
      .filter(o => selectedCodes.has(o.code))
      .map(o => {
        if (o.isOther && otherTexts[o.code]) {
          return { ...o, text: otherTexts[o.code] };
        }
        return o;
      });
    onMultiAnswer?.(selected);
  }, [selectedCodes, question.options, otherTexts, onMultiAnswer]);

  return (
    <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {question.quote && (
        <div className="bg-white/5 backdrop-blur-md border border-white/10 border-l-[3px] border-l-[var(--viridian-main)] shadow-lg rounded-r-xl p-5 mb-8 relative">
          <div className="absolute -left-3 -top-4 text-6xl text-[var(--viridian-main)] opacity-20 font-serif">"</div>
          <p className="text-[var(--viridian-ultra)] font-arimo italic text-base leading-relaxed relative z-10">
            "{question.quote.text}"
          </p>
          <p className="text-[var(--viridian-main)] font-archivo uppercase text-xs tracking-wider mt-3">
            — {question.quote.author}
          </p>
        </div>
      )}

      {question.noteAbove && (
        <p className="text-sm font-archivo tracking-widest text-[var(--viridian-main)] uppercase mb-3 drop-shadow-sm">
          {question.noteAbove}
        </p>
      )}

      <h2 className="text-2xl md:text-3xl font-archivo uppercase tracking-wide mb-3 text-white leading-tight">
        {question.text}
      </h2>

      {question.subtitle && (
        <p className="text-base text-[var(--viridian-light)] opacity-80 mb-6 font-arimo">
           {question.subtitle}
        </p>
      )}

      <div className="flex flex-col gap-4 mt-8">
        {question.options.map((option, index) => (
          <div
            key={option.code}
            className="animate-in slide-in-from-bottom-4 fade-in"
            style={{ animationDelay: `${index * 70}ms`, animationFillMode: 'both' }}
          >
            <AnswerOption
              option={option}
              selected={selectedCodes.has(option.code)}
              onSelect={isMulti ? handleMultiToggle : handleSingleSelect}
              onExpandNote={onExpandNote}
              questionId={question.id}
              mode={isMulti ? 'checkbox' : 'radio'}
              otherText={otherTexts[option.code]}
              onOtherTextChange={(text) => handleOtherTextChange(option.code, text)}
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={isMulti ? handleMultiSubmit : handleSingleSubmit}
          disabled={selectedCodes.size === 0}
          className="w-full bg-[var(--viridian-main)] hover:bg-[var(--viridian-dark)] text-white py-4 text-lg font-archivo uppercase tracking-wider rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg"
        >
          CONTINUĂ →
        </button>
      </div>
    </div>
  );
}