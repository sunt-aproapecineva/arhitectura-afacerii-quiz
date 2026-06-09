import { ProfileAxis, ResultTemplate } from '@/lib/quiz/types';

const CTA_DEFAULT = {
  HOT: { text: 'Primește planul personalizat pe WhatsApp →', subtext: 'Consultantul îți trimite materialul personalizat în 24h.', action: 'waitlist' as const },
  WARM: { text: 'Primește planul personalizat pe WhatsApp →', subtext: 'Consultantul îți trimite materialul personalizat în 24h.', action: 'waitlist' as const },
  COLD: { text: 'Primește planul personalizat pe WhatsApp →', subtext: 'Consultantul îți trimite materialul personalizat în 24h.', action: 'waitlist' as const },
};

const R_TEMPLATE: ResultTemplate = {
  profileLabel: 'Problema de Recrutare',
  levelLabel: 'Nu găsesc oameni buni',
  headline: 'Angajezi în panică și tot tu rămâi cu treaba.',
  sections: [
    { icon: '🔍', title: 'Ce se întâmplă de fapt', body: 'Nu e o problemă de candidați — e o problemă de sistem. Fără un proces clar de selecție, vei continua să angajezi în grabă și să concediezi cu regret.' },
    { icon: '🔧', title: 'Cum se rezolvă', body: 'Un sistem corect de selecție începe cu un profil clar al postului și un proces structurat — nu cu anunțuri și speranță.' },
    { icon: '📈', title: 'Rezultatul concret', body: 'Timp de recrutare redus cu 60%, rata de retenție crescută, și ieșirea din cercul vicios: angajez → nu merge → concediez → angajez.' },
  ],
  socialProof: '„Am angajat 4 oameni în 3 luni fără nicio surpriză negativă. Primul om potrivit la locul potrivit." — client Victor Morar',
  cta: CTA_DEFAULT,
};

const RE_TEMPLATE: ResultTemplate = {
  profileLabel: 'Problema de Retenție',
  levelLabel: 'Formez oameni care pleacă',
  headline: 'Investești în oameni care pleacă cu know-how-ul tău.',
  sections: [
    { icon: '📋', title: 'Ce se întâmplă de fapt', body: 'Know-how-ul firmei e în capul oamenilor, nu în procese documentate. Când pleacă, iau tot cu ei — uneori și clienți.' },
    { icon: '🔧', title: 'Cum se rezolvă', body: 'Documentarea proceselor și un sistem de retenție transformă cunoașterea individuală în capital organizațional al firmei.' },
    { icon: '📈', title: 'Rezultatul concret', body: 'Fiecare plecare devine mai puțin dureroasă. Onboarding-ul noilor angajați scade de la 3 luni la 3 săptămâni.' },
  ],
  socialProof: '„Primul om care a plecat după ce am implementat sistemul — am format înlocuitorul în 2 săptămâni, nu 3 luni." — client Victor Morar',
  cta: CTA_DEFAULT,
};

const M_TEMPLATE: ResultTemplate = {
  profileLabel: 'Problema de Motivație',
  levelLabel: 'Plătesc, dar nu primesc rezultat',
  headline: 'Angajații vin la program. Tu vrei să vină la performanță.',
  sections: [
    { icon: '📊', title: 'Ce se întâmplă de fapt', body: 'Salariul fix fără KPI creează un echilibru greșit: angajatul e mulțumit, tu nu ești. Motivarea prin bani nu funcționează fără structura clară a așteptărilor.' },
    { icon: '🔧', title: 'Cum se rezolvă', body: 'Un sistem de KPI și evaluare clar leagă compensarea de rezultate reale — nu de prezență și ore lucrate.' },
    { icon: '📈', title: 'Rezultatul concret', body: 'Profitul per angajat crește. Cei care performează sunt recompensați corect, cei care nu — devin vizibili rapid.' },
  ],
  socialProof: '„În 60 de zile am știut exact cine contribuie și cine ocupă loc. KPI-urile au schimbat totul." — client Victor Morar',
  cta: CTA_DEFAULT,
};

const D_TEMPLATE: ResultTemplate = {
  profileLabel: 'Problema de Delegare',
  levelLabel: 'Fac eu totul, că altfel iese prost',
  headline: 'Tu ești gâtul de sticlă al propriei afaceri.',
  sections: [
    { icon: '⛓️', title: 'Ce se întâmplă de fapt', body: 'Firma e dependentă 100% de prezența ta. 12+ ore pe zi, telefon mereu pornit. Ai încercat să delegi — tot tu ai refăcut. Problema nu e că oamenii sunt proști — e că nu ai un sistem de delegare.' },
    { icon: '🔧', title: 'Cum se rezolvă', body: 'Un framework clar de delegare îți dă instrumentele să ieși din execuție fără ca firma să se destrame.' },
    { icon: '📈', title: 'Rezultatul concret', body: 'Primele 3 ore libere pe zi în 30 de zile. Primul weekend fără telefon în 90 de zile. Firma rulează fără tine prezent fizic.' },
  ],
  socialProof: '„Eram în birou 14 ore pe zi. Acum firma rulează fără mine 3 zile pe săptămână." — client Victor Morar',
  cta: CTA_DEFAULT,
};

const C_TEMPLATE: ResultTemplate = {
  profileLabel: 'Problema de Control',
  levelLabel: 'Nu știu ce se întâmplă în firma mea',
  headline: 'Iei decizii pe instinct. Afli problemele abia când e dezastru.',
  sections: [
    { icon: '🌫️', title: 'Ce se întâmplă de fapt', body: 'Fără cifre clare și raportare în timp real, ești pilot fără instrumente de bord. Pierzi bani fără să știi exact unde. Deciziile greșite se acumulează silențios.' },
    { icon: '🔧', title: 'Cum se rezolvă', body: 'Un tablou de bord personalizat îți arată starea reală a firmei în 15 minute pe săptămână — nu 4 ore.' },
    { icon: '📈', title: 'Rezultatul concret', body: 'Știi în timp real ce merge, ce nu merge, și unde se pierd bani. Deciziile devin predictibile, nu reactive.' },
  ],
  socialProof: '„Am descoperit că pierdeam 3.000€/lună pe un departament despre care credeam că e profitabil." — client Victor Morar',
  cta: CTA_DEFAULT,
};

const S_TEMPLATE: ResultTemplate = {
  profileLabel: 'Problema de Structură',
  levelLabel: 'Cresc, dar totul se complică',
  headline: 'Creșterea ta amplifică haosul, nu eficiența.',
  sections: [
    { icon: '🌀', title: 'Ce se întâmplă de fapt', body: 'Cifra urcă, echipa crește, haosul crește odată cu ea. Fiecare manager face cum vrea. Nu există organigramă clară sau procese standard.' },
    { icon: '🔧', title: 'Cum se rezolvă', body: 'O organigramă metrică, procese standardizate și o structură scalabilă îți dau arhitectura pentru 2x–3x creștere fără haos suplimentar.' },
    { icon: '📈', title: 'Rezultatul concret', body: 'Fiecare angajat știe exact ce face, cui raportează și cum e măsurat. Creșterea devine un multiplicator al ordinii, nu al dezordinii.' },
  ],
  socialProof: '„Am trecut de la 12 la 28 de angajați fără să-mi pierd mințile. Organigrama metrică a fost revelația." — client Victor Morar',
  cta: CTA_DEFAULT,
};

const DEFAULT_TEMPLATE: ResultTemplate = {
  profileLabel: 'Antreprenor în Tranziție',
  levelLabel: 'Caută claritate',
  headline: 'Ai construit ceva real. Acum e momentul să construiești sistemele care să îl susțină.',
  sections: [
    { icon: '🏗️', title: 'Situația Curentă', body: 'Funcționezi pe baza efortului personal și a adaptabilității — dar modelul ăsta are un plafon clar.' },
    { icon: '💡', title: 'Pasul Următor', body: 'Un sistem bine construit înlocuiește efortul repetat cu procese care rulează fără tine.' },
  ],
  socialProof: '',
  cta: CTA_DEFAULT,
};

const TEMPLATES: Record<string, ResultTemplate> = {
  R: R_TEMPLATE,
  Re: RE_TEMPLATE,
  M: M_TEMPLATE,
  D: D_TEMPLATE,
  C: C_TEMPLATE,
  S: S_TEMPLATE,
};

export function getResultTemplate(profile: ProfileAxis | null): ResultTemplate {
  if (!profile) return DEFAULT_TEMPLATE;
  return TEMPLATES[profile] || DEFAULT_TEMPLATE;
}
