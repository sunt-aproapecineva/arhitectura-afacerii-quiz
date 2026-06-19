import type { ResultTemplate, SocialProofContent, BProfileAxis } from '@/lib/quiz/types';

// ============================================================
// RAMURA B — Rezultate pentru începători
// Toate rutează spre mini-curs (tripwire) → START.
// CTA-ul real (url) se rezolvă în QuizShell (constantă configurabilă).
// ============================================================

// CTA comun pe ramura B — diferă doar tonul pe temperatură, acțiunea e aceeași.
function bCta(label: string) {
  return {
    HOT: {
      text: 'Vreau primul pas →',
      subtext: `${label} Îți arăt exact de unde începi — fără să mai pierzi timp în pregătire.`,
      action: 'mini_curs' as const,
    },
    WARM: {
      text: 'Arată-mi primul pas →',
      subtext: `${label} Pas cu pas, adaptat exact situației tale de început.`,
      action: 'mini_curs' as const,
    },
    COLD: {
      text: 'Vreau să văd cum începe →',
      subtext: `${label} Fără presiune — doar claritate pe primul pas corect.`,
      action: 'mini_curs' as const,
    },
  };
}

// ── ANGAJAT — Angajatul-antreprenor ──────────────────────────
const ANGAJAT_TEMPLATE: ResultTemplate = {
  profileLabel: 'Angajatul-Antreprenor',
  levelLabel: 'Ai un venit sigur, vrei al tău',
  headline: 'Nu-ți lipsește curajul. Îți lipsește un plan care să nu-ți riște siguranța.',
  sections: [
    {
      icon: '🧭',
      title: 'Ce se întâmplă de fapt',
      body: 'Ai un venit care îți dă siguranță — și exact asta te ține pe loc. Aștepți momentul „sigur" să sari. Dar momentul perfect nu vine; vine doar un plan care îți permite să construiești în paralel, fără să arunci totul în aer.',
    },
    {
      icon: '🪜',
      title: 'Ce-ți lipsește concret',
      body: 'O ordine clară a pașilor cât încă ai salariul: ce nișă, cum testezi ideea fără să investești orbește, cum faci primele vânzări înainte să renunți la job. Tranziția sigură, nu saltul în gol.',
    },
    {
      icon: '➡️',
      title: 'Următorul pas corect',
      body: 'Nu-ți da demisia mâine. Începe să construiești corect, de azi, în timpul liber — ca atunci când renunți la job să o faci de pe poziții de forță, nu din disperare.',
    },
  ],
  socialProof: '',
  cta: bCta('Tranziția angajat → antreprenor se face în ordine.'),
};

// ── ARS — Întemeietorul ars ──────────────────────────────────
const ARS_TEMPLATE: ResultTemplate = {
  profileLabel: 'Întemeietorul Ars',
  levelLabel: 'Ai mai încercat o dată',
  headline: 'N-ai eșuat pentru că nu ești bun. Ai eșuat pentru că ai construit în ordinea greșită.',
  sections: [
    {
      icon: '🔥',
      title: 'Ce se întâmplă de fapt',
      body: 'Porți o rană reală — ai investit, ai muncit, și s-a închis. De aici frica firească: „dacă se repetă?". Dar prima dată n-ai avut un sistem. Ai avut entuziasm și improvizație. Nu e același lucru cu a o face „ca la carte".',
    },
    {
      icon: '🔍',
      title: 'Ce-ți lipsește concret',
      body: 'Să înțelegi exact DE CE a căzut prima afacere — ca să nu repeți greșeala — și o metodă pas cu pas care îți dă încredere că de data asta construiești pe fundație, nu pe nisip.',
    },
    {
      icon: '➡️',
      title: 'Următorul pas corect',
      body: 'Nu reporni la fel. Repornește cu harta în față. Experiența ta de prima dată devine un avantaj imens — dar doar dacă o pui într-un sistem corect.',
    },
  ],
  socialProof: '',
  cta: bCta('De data asta, cu o metodă — nu cu noroc.'),
};

// ── ZERO — Începătorul de la zero ────────────────────────────
const ZERO_TEMPLATE: ResultTemplate = {
  profileLabel: 'Începătorul de la Zero',
  levelLabel: 'Vrei să începi corect',
  headline: 'Nu-ți trebuie mai multă informație. Îți trebuie primul pas corect, în ordine.',
  sections: [
    {
      icon: '🌱',
      title: 'Ce se întâmplă de fapt',
      body: 'Consumi conținut, salvezi idei, te documentezi — dar nu te miști. Nu pentru că ești leneș, ci pentru că nimeni nu ți-a dat ordinea pașilor. Iar fără ordine, orice început pare la fel de riscant.',
    },
    {
      icon: '🗺️',
      title: 'Ce-ți lipsește concret',
      body: 'Claritate pe ce afacere ți se potrivește, cum o testezi înainte să investești, și pașii corecți în ordine pentru o afacere care poate crește — nu un hobby care te consumă.',
    },
    {
      icon: '➡️',
      title: 'Următorul pas corect',
      body: 'Oprește colecționatul de informație. Începe execuția ghidată. Primul pas mic, corect, bate o sută de pași în direcția greșită.',
    },
  ],
  socialProof: '',
  cta: bCta('Începutul corect, în ordinea corectă.'),
};

const B_TEMPLATES: Record<BProfileAxis, ResultTemplate> = {
  ANGAJAT: ANGAJAT_TEMPLATE,
  ARS: ARS_TEMPLATE,
  ZERO: ZERO_TEMPLATE,
};

export function getBResultTemplate(profile: BProfileAxis | null): ResultTemplate {
  if (!profile) return ZERO_TEMPLATE;
  return B_TEMPLATES[profile] ?? ZERO_TEMPLATE;
}

// ── Social proof B — vocea lui Victor (fără cifre fabricate) ──
// Placeholder-uri de înlocuit cu studii de caz reale din Flux 1.
export const PAUSE_B1_START: SocialProofContent = {
  text: `Toți cei pe care îi admiri au avut o zi 1.

Diferența? N-au așteptat să fie „gata". Au început înainte să se simtă pregătiți — dar cu pașii în ordinea corectă.

Asta schimbă tot.`,
  buttonText: 'Continuă →',
};

export const PAUSE_B2_START: SocialProofContent = {
  text: `„Am pornit de la zero, am și căzut pe drum, și am reconstruit. Ce mi-aș fi dorit la început? Cineva care să-mi dea ordinea pașilor, ca să nu pierd ani învățând pe pielea mea."

— Victor Morar`,
  buttonText: 'Aproape gata →',
};
