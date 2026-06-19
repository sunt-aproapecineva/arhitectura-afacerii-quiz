import { useState, useCallback, useRef, useEffect } from 'react';
import type { Question, AnswerOption as AnswerOptionType } from '@/lib/quiz/types';
import { AnswerOption } from './AnswerOption';

// Interacțiune „calm & ușor":
// — single-select: tap → 650ms de confirmare vizuală (fraţii se sting) → avans automat.
//   Tap din nou pe răspunsul ales = avans imediat (respectăm nerăbdarea).
//   Excepții: opțiunile „Alt răspuns" (au input) și revenirea cu Înapoi (Continuă vizibil).
// — multi-select: Continuă rămâne, cu contor („· 3 alese") ca să fie evident că e multi.

const DWELL_MS = 650;

interface QuestionCardProps {
  question: Question;
  onAnswer?: (option: AnswerOptionType) => void;
  onMultiAnswer?: (options: AnswerOptionType[]) => void;
  onBack?: () => void;
  onExpandNote?: (noteId: string) => void;
  showBack?: boolean;
  preSelectedCode?: string;
  preSelectedCodes?: string[];
  empathyNote?: string | null;
}

export function QuestionCard({
  question,
  onAnswer,
  onMultiAnswer,
  onBack,
  onExpandNote,
  showBack = false,
  preSelectedCode,
  preSelectedCodes,
  empathyNote,
}: QuestionCardProps) {
  const isMulti = question.multiSelect;
  const hadPreselection = !!(preSelectedCode || (preSelectedCodes && preSelectedCodes.length));
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
  const [locked, setLocked] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submittedRef = useRef(false);

  useEffect(() => () => { if (advanceTimer.current) clearTimeout(advanceTimer.current); }, []);

  const submitOption = useCallback((option: AnswerOptionType) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    if (option.isOther) {
      const customText = otherTexts[option.code] || option.text;
      onAnswer?.({ ...option, text: customText });
    } else {
      onAnswer?.(option);
    }
  }, [otherTexts, onAnswer]);

  const handleSingleSelect = useCallback((option: AnswerOptionType) => {
    if (submittedRef.current) return;

    // Al doilea tap pe opțiunea deja aleasă, în timpul dwell-ului → avans imediat.
    if (locked && selectedCodes.has(option.code)) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      submitOption(option);
      return;
    }

    setSelectedCodes(new Set([option.code]));

    // „Alt răspuns" cere tastare — fără auto-advance, apare Continuă.
    if (option.isOther) {
      setLocked(false);
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      return;
    }

    setLocked(true);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => submitOption(option), DWELL_MS);
  }, [locked, selectedCodes, submitOption]);

  const handleSingleSubmit = useCallback(() => {
    if (selectedCodes.size === 0) return;
    const option = question.options.find(o => selectedCodes.has(o.code));
    if (!option) return;
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    submitOption(option);
  }, [selectedCodes, question.options, submitOption]);

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
    if (selectedCodes.size === 0 || submittedRef.current) return;
    submittedRef.current = true;
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

  // Continuă apare doar când chiar e nevoie de el.
  const selectedIsOther = !isMulti && question.options.some(o => o.isOther && selectedCodes.has(o.code));
  const showContinue = isMulti || selectedIsOther || (hadPreselection && !locked && selectedCodes.size > 0);
  const count = selectedCodes.size;
  const countLabel = isMulti && count > 0 ? ` · ${count} ${count === 1 ? 'aleasă' : 'alese'}` : '';

  return (
    <div className="w-full max-w-2xl mx-auto pb-16">
      {empathyNote && (
        <div className="border-l-2 border-[var(--viridian-main)] pl-3 mb-6 animate-in fade-in slide-in-from-bottom-1 duration-500">
          <p className="text-[13px] text-[var(--viridian-light)]/85 font-arimo italic">
            {empathyNote}
          </p>
        </div>
      )}

      {question.quote && (
        <div className="glass border-l-[3px] border-l-[var(--viridian-main)] !rounded-l-md p-5 mb-8 relative">
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

      {question.subtitle ? (
        <p className="text-base text-[var(--viridian-light)] opacity-80 mb-6 font-arimo">
           {question.subtitle}
        </p>
      ) : isMulti ? (
        <p className="text-base text-[var(--viridian-light)] opacity-80 mb-6 font-arimo">
          Alege tot ce se aplică.
        </p>
      ) : null}

      <div className="flex flex-col gap-4 mt-8" data-locked={locked || undefined}>
        {question.options.map((option, index) => (
          <div
            key={option.code}
            className="animate-in slide-in-from-bottom-3 fade-in"
            style={{ animationDelay: `${90 + index * 50}ms`, animationFillMode: 'both', animationDuration: '340ms' }}
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

      {showContinue && (
        <div className="mt-8 animate-in fade-in duration-300">
          <button
            onClick={isMulti ? handleMultiSubmit : handleSingleSubmit}
            disabled={selectedCodes.size === 0}
            className="btn-premium w-full text-white py-4 text-lg font-archivo uppercase tracking-wider rounded-2xl"
          >
            CONTINUĂ{countLabel} →
          </button>
        </div>
      )}
    </div>
  );
}
