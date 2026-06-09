import type { SocialProofContent } from '@/lib/quiz/types';

export const PAUSE_C: Record<string, SocialProofContent> = {
  BEG: {
    text: `Angela avea cunoștințe în rețete sănătoase dar niciun produs digital.

A aplicat metoda și a creat primul ei ghid — 345€.

Expertiza ta există deja. Îi lipsea **metoda** de livrare online.`,
    buttonText: 'Continuă →',
  },
  EXP: {
    text: `"A murit versiunea mea care muncea mult fără sistem. S-a născut versiunea care gândește strategic și construiește ecosisteme."

Lansări punctuale → ecosistem stabil. Ăsta e următorul nivel.`,
    buttonText: 'Continuă →',
  },
  NEW: {
    text: `Raluca a aplicat metoda ca producător digital.

Prima lansare online cu expertul ei: sold out în 24h — **10.000 RON**.

Nu contează de unde pornești. Contează ce **metodă** aplici.`,
    buttonText: 'Continuă →',
  },
};
