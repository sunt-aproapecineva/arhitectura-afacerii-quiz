import { useState } from 'react';

interface ExplanatoryNoteProps {
  text: string;
  noteId: string;
  onExpand?: (noteId: string) => void;
}

export function ExplanatoryNote({ text, noteId, onExpand }: ExplanatoryNoteProps) {
  const [expanded, setExpanded] = useState(false);

  const toggle = () => {
    setExpanded(!expanded);
    if (!expanded) {
      onExpand?.(noteId);
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); toggle(); }}
        className="text-sm text-[var(--viridian-light)] opacity-70 hover:opacity-100 transition-opacity font-arimo"
      >
        {expanded ? '▾ Ascunde detalii' : '▸ Ce înseamnă asta?'}
      </button>
      {expanded && (
        <p className="text-sm text-[var(--viridian-ultra)]/70 mt-2 leading-relaxed animate-in slide-in-from-top-1 duration-200 font-arimo">
          {text}
        </p>
      )}
    </div>
  );
}