import { useState } from 'react';
import type { AnswerOption as AnswerOptionType } from '@/lib/quiz/types';
import { ExplanatoryNote } from './ExplanatoryNote';

interface AnswerOptionProps {
  option: AnswerOptionType;
  selected: boolean;
  onSelect: (option: AnswerOptionType) => void;
  onExpandNote?: (noteId: string) => void;
  questionId: string;
  mode?: 'radio' | 'checkbox';
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
}

export function AnswerOption({
  option,
  selected,
  onSelect,
  onExpandNote,
  questionId,
  mode = 'radio',
  otherText,
  onOtherTextChange,
}: AnswerOptionProps) {
  return (
    <div className="w-full">
      <button
        type="button"
        onClick={() => onSelect(option)}
        className={`w-full text-left p-4 md:p-5 rounded-xl border cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
          selected
            ? 'border-[var(--viridian-main)] bg-[var(--viridian-dark)]/40 shadow-[0_0_20px_rgba(10,150,120,0.2)] backdrop-blur-md'
            : 'border-white/10 bg-white/5 backdrop-blur-md hover:border-[var(--viridian-main)]/50 hover:bg-white/10 hover:shadow-lg'
        }`}
      >
        <div className="flex items-start gap-4">
          {mode === 'radio' ? (
            <span className={`shrink-0 mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
              selected ? 'border-[var(--viridian-main)]' : 'border-[var(--viridian-light)]/30'
            }`}>
              {selected && (
                <span className="w-3 h-3 rounded-full bg-[var(--viridian-main)] animate-in zoom-in duration-200" />
              )}
            </span>
          ) : (
            <span className={`shrink-0 mt-1 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
              selected ? 'border-[var(--viridian-main)] bg-[var(--viridian-main)]' : 'border-[var(--viridian-light)]/30'
            }`}>
              {selected && (
                <svg className="w-4 h-4 text-white animate-in zoom-in duration-200" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
          )}
          <div className="flex-1">
            <span className="text-base md:text-lg leading-relaxed text-[var(--viridian-ultra)] font-arimo">
              {option.emoji && <span className="mr-3">{option.emoji}</span>}
              {option.text}
            </span>
          </div>
        </div>
      </button>

      {option.isOther && selected && (
        <div className="ml-10 mt-3 animate-in slide-in-from-top-2 duration-300">
          <input
            type="text"
            placeholder="Scrie aici detaliile..."
            value={otherText ?? ''}
            onChange={(e) => onOtherTextChange?.(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-black/40 border border-white/10 focus:border-[var(--viridian-main)] focus:ring-1 focus:ring-[var(--viridian-main)] text-[var(--viridian-ultra)] rounded-lg px-4 py-3 outline-none transition-all shadow-inner backdrop-blur-sm"
            autoFocus
          />
        </div>
      )}

      {option.note && (
        <div className="ml-10 mt-2">
          <ExplanatoryNote
            text={option.note.text}
            noteId={`${questionId}_${option.code}`}
            onExpand={onExpandNote}
          />
        </div>
      )}
    </div>
  );
}