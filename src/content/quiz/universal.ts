import type { Question } from '@/lib/quiz/types';

// =======================================
// GATE — Ai angajati?
// =======================================

export const Q_HAS_EMPLOYEES: Question = {
  id: 'Q_HAS_EMPLOYEES',
  phase: 'Q_HAS_EMPLOYEES',
  text: 'Ai angajați în businessul tău?',
  multiSelect: false,
  noteAbove: 'Câteva întrebări despre businessul tău',
  options: [
    { code: 'EMP_YES', text: 'Da, am angajați' },
    { code: 'EMP_NO', text: 'Nu — lucrez singur sau cu colaboratori externi' },
  ],
};

// =======================================
// FAZA 1 — Identificarea tipologiei (scoring)
// =======================================

export const Q1_SOLO: Question = {
  id: 'Q1_SOLO',
  phase: 'Q1_SOLO',
  text: '[PRENUME], care e cea mai mare frustrare a ta în businessul tău?',
  multiSelect: true,
  quote: { text: "Știi ce am descoperit după 18 ani? Problema nu sunt niciodată oamenii. Problema e SISTEMUL. Un sistem prost face ca chiar și cel mai capabil om să se simtă prins.", author: "Victor Morar" },
  options: [
    { code: 'Q1SA', text: 'Fac eu totul — nu am pe cine mă baza pentru a delega ceva cu adevărat.', scores: { D: 3 } },
    { code: 'Q1SB', text: 'Nu știu exact de unde vin banii sau ce merge cu adevărat în businessul meu.', scores: { C: 3 } },
    { code: 'Q1SC', text: 'Am crescut, dar cu cât cresc mai mult, cu atât e mai complicat să gestionez singur.', scores: { S: 3 } },
    { code: 'Q1SD', text: 'Vreau să angajez primul om, dar nu știu cum să aleg sau pe cine să caut.', scores: { R: 3 } },
  ],
};

export const Q2_SOLO: Question = {
  id: 'Q2_SOLO',
  phase: 'Q2_SOLO',
  text: 'Cum arată o zi de lucru tipică pentru tine?',
  multiSelect: false,
  isDiscriminatory: true,
  quote: { text: "Eram prizonierul propriei mele afaceri. Petreceam 60% din timp pe execuție, 40% pe stins focuri. Zero timp strategic. Am schimbat asta cu un sistem.", author: "Victor Morar" },
  options: [
    { code: 'Q2SA', text: 'Fac tot eu — livrare, clienți, admin, marketing. Fără oprire.', scores: { D: 3 } },
    { code: 'Q2SB', text: 'Sting incendii toată ziua. Nu ajung la ce contează cu adevărat.', scores: { D: 2, C: 1 } },
    { code: 'Q2SC', text: 'Mă ocup de proiecte, dar nu știu cifrele și starea reală a businessului.', scores: { C: 3 } },
    { code: 'Q2SD', text: 'Cresc, dar totul devine mai complicat. Nu am procese sau sisteme clare.', scores: { S: 3 } },
  ],
};

export const Q4_SOLO: Question = {
  id: 'Q4_SOLO',
  phase: 'Q4_SOLO',
  text: 'Dacă pleci 2 săptămâni în vacanță și îți închizi telefonul, ce se întâmplă?',
  multiSelect: false,
  isTieBreaker: true,
  quote: { text: "Am condus 5 companii și am călătorit în 5 țări anul trecut. Nu am angajați geniali. Am SISTEM.", author: "Victor Morar" },
  options: [
    { code: 'Q4SA', text: 'Businessul se oprește. Depinde 100% de prezența mea.', scores: { D: 3 } },
    { code: 'Q4SB', text: 'Pierd clienți sau comenzi — nu există nimeni să preia.', scores: { D: 2, R: 1 } },
    { code: 'Q4SC', text: 'N-am idee — nu am putut vreodată să mă deconectez cu adevărat.', scores: { D: 2, C: 1 } },
    { code: 'Q4SD', text: 'Cifrele ar scădea — nu am vizibilitate sau control fără să fiu prezent.', scores: { C: 3 } },
    { code: 'Q4SE', text: 'Câteva lucruri merg singure, dar creșterea s-ar bloca imediat.', scores: { S: 2, D: 1 } },
  ],
};

export const Q1: Question = {
  id: 'Q1',
  phase: 'Q1',
  text: '[PRENUME], care e cea mai mare frustrare a ta legată de echipă?',
  multiSelect: true,
  quote: { text: "Știi ce am descoperit după 18 ani și 250+ angajați? Problema nu sunt niciodată oamenii. Problema e SISTEMUL în care îi pui. Un om bun într-un sistem prost va părea incompetent. Mereu.", author: "Victor Morar" },
  options: [
    { code: 'Q1A', text: 'Nu găsesc oameni buni. Angajez în panică și tot eu rămân cu treaba.', scores: { R: 3 } },
    { code: 'Q1B', text: 'ÎNVĂȚ oameni, și apoi pleacă. Unii își deschid firme concurente.', scores: { Re: 3 } },
    { code: 'Q1C', text: 'Am oameni, dar nu performează. Vin la program, nu la rezultat.', scores: { M: 3 } },
    { code: 'Q1D', text: 'Am oameni, dar tot EU fac munca importantă. Altfel iese prost.', scores: { D: 3 } },
    { code: 'Q1E', text: 'Echipa e ok, dar fiecare face cum vrea. Nu există standard.', scores: { S: 2, C: 2 } },
  ],
};

export const Q2: Question = {
  id: 'Q2',
  phase: 'Q2',
  text: 'Cum arată o zi de lucru tipică pentru tine?',
  multiSelect: false,
  isDiscriminatory: true,
  quote: { text: "Eu petreceam 60% din timp pe mărunțișuri, 35% management, 5% strategie. Eram cel mai scump angajat din propria firmă — făceam muncă de 500€ cu un cost de 5.000€.", author: "Victor Morar" },
  options: [
    { code: 'Q2A', text: 'Interviuri, anunțuri, probabil concediez pe cineva luna asta.', scores: { R: 3 } },
    { code: 'Q2B', text: 'Formez pe cineva nou, pentru că cel vechi a plecat.', scores: { Re: 3 } },
    { code: 'Q2C', text: 'Verific ce au făcut angajații, corectez, refac.', scores: { D: 2, M: 2 } },
    { code: 'Q2D', text: 'Sting focuri de dimineață până seara. Nu ajung la ce e strategic.', scores: { D: 3 } },
    { code: 'Q2E', text: 'Am ședințe, dar managerii vin cu probleme, nu cu soluții.', scores: { S: 3, C: 1 } },
  ],
};

export const Q4: Question = {
  id: 'Q4',
  phase: 'Q4',
  text: 'Dacă pleci 2 săptămâni în vacanță și îți închizi telefonul, ce găsești?',
  multiSelect: false,
  isTieBreaker: true,
  quote: { text: "Am condus 5 companii și am călătorit în 5 țări anul trecut. Nu am angajați geniali. Am SISTEM.", author: "Victor Morar" },
  options: [
    { code: 'Q4A', text: 'Haos. Nimeni nu știe ce să facă fără mine.', scores: { D: 3 } },
    { code: 'Q4B', text: 'Calitate scăzută. Clienți nemulțumiți că nu am fost eu.', scores: { D: 2, Re: 1 } },
    { code: 'Q4C', text: '1–2 oameni cheie au plecat și au luat clienți cu ei.', scores: { Re: 3 } },
    { code: 'Q4D', text: 'Vânzările au scăzut. Nimeni nu a urmărit cifrele.', scores: { C: 3 } },
    { code: 'Q4E', text: 'Fiecare departament a făcut ce a vrut. Zero coordonare.', scores: { S: 3 } },
    { code: 'Q4F', text: 'Nici nu pot pleca 3 zile, darămite 2 săptămâni.', scores: { D: 2, R: 1 } },
  ],
};

// =======================================
// FAZA 2 — Profilarea individuală (P1–P5)
// =======================================

export const P1: Question = {
  id: 'P1',
  phase: 'P1',
  text: 'Câți angajați ai în echipă acum?',
  multiSelect: false,
  options: [
    { code: 'P1A', text: '1–4 angajați' },
    { code: 'P1B', text: '5–15 angajați' },
    { code: 'P1C', text: '16–30 angajați' },
    { code: 'P1D', text: 'Peste 30 angajați' },
  ],
};

export const P2: Question = {
  id: 'P2',
  phase: 'P2',
  text: 'Cât generează businessul tău pe lună?',
  multiSelect: false,
  options: [
    { code: 'P2A', text: 'Sub 5.000€/lună' },
    { code: 'P2B', text: '5.000–20.000€/lună' },
    { code: 'P2C', text: '20.000–50.000€/lună' },
    { code: 'P2D', text: 'Peste 50.000€/lună' },
    { code: 'P2E', text: 'Nu știu exact — nu am o evidență clară' },
  ],
};

export const P_BUSINESS_AGE: Question = {
  id: 'P_BUSINESS_AGE',
  phase: 'P_BUSINESS_AGE',
  text: 'De cât timp dezvolți afacerea curentă?',
  multiSelect: false,
  options: [
    { code: 'AGE_1', text: 'Sub 1 an' },
    { code: 'AGE_2', text: '1–3 ani' },
    { code: 'AGE_3', text: '3–7 ani' },
    { code: 'AGE_4', text: 'Peste 7 ani' },
  ],
};

export const P3: Question = {
  id: 'P3',
  phase: 'P3',
  text: 'Ce educație antreprenorială ai?',
  multiSelect: true,
  subtitle: 'Alege toate variantele care se aplică.',
  options: [
    { code: 'P3A', text: 'Am studii universitare în domeniu' },
    { code: 'P3B', text: 'Am experiență practică — am învățat făcând' },
    { code: 'P3C', text: 'Am fost la cursuri sau traininguri de business' },
    { code: 'P3D', text: 'Am lucrat cu un mentor sau consultant' },
    { code: 'P3E', text: 'Consum conținut online — podcasturi, cărți, YouTube' },
    { code: 'P3F', text: 'Nu am investit în educație antreprenorială până acum' },
  ],
};

export const P5: Question = {
  id: 'P5',
  phase: 'P5',
  text: 'Cu care din afirmațiile de mai jos te identifici?',
  multiSelect: true,
  subtitle: 'Alege toate variantele care rezonează cu tine.',
  options: [
    { code: 'P5A', text: 'Vreau să cresc, dar nu singur.' },
    { code: 'P5B', text: 'Fără cifre clare, zbor pe întuneric.' },
    { code: 'P5C', text: 'Un sistem bun bate orice talent individual.' },
    { code: 'P5D', text: 'Muncesc mult, dar nu și inteligent.' },
    { code: 'P5E', text: 'Succesul de azi mă face vulnerabil mâine.' },
  ],
};

// =======================================
// FAZA 3 — Pain Funnel (L1, L2, L3)
// =======================================

export const L_PROBLEM_DURATION_BASE: Question = {
  id: 'L_PROBLEM_DURATION',
  phase: 'L_PROBLEM_DURATION',
  text: 'De cât timp ai această problemă?',
  multiSelect: false,
  options: [
    { code: 'PD_1', text: 'Sub 6 luni' },
    { code: 'PD_2', text: '6–12 luni' },
    { code: 'PD_3', text: '1–3 ani' },
    { code: 'PD_4', text: 'De când am pornit businessul' },
  ],
};

export const L1_COST: Question = {
  id: 'L1_COST',
  phase: 'L1_COST',
  text: 'Cât te costă această problemă per lună?',
  multiSelect: false,
  options: [
    { code: 'L1CA', text: 'Sub 1.000€ — dar mă consumă nervos' },
    { code: 'L1CB', text: '1.000–5.000€' },
    { code: 'L1CC', text: '5.000–10.000€' },
    { code: 'L1CD', text: 'Peste 10.000€ sau nu știu exact, ceea ce e și mai rău' },
  ],
};

export const L1_CONCRETE_BASE: Question = {
  id: 'L1_CONCRETE',
  phase: 'L1_CONCRETE',
  text: '[PRENUME], cum arată concret problema în businessul tău săptămâna asta?',
  multiSelect: true,
  subtitle: 'Alege tot ce se aplică.',
  options: [],
};

export const L1_CONCRETE_OPTIONS: Record<string, { code: string; text: string }[]> = {
  R: [
    { code: 'L1C_R_A', text: 'Am publicat anunțuri — nu am primit candidați potriviți' },
    { code: 'L1C_R_B', text: 'Am făcut interviuri și nu m-a convins nimeni' },
    { code: 'L1C_R_C', text: 'Am angajat pe cineva care nu a trecut de perioadă de probă' },
    { code: 'L1C_R_D', text: 'Am refuzat un proiect pentru că nu aveam oameni' },
  ],
  Re: [
    { code: 'L1C_RE_A', text: 'Un om format de mine a luat clienți și a plecat' },
    { code: 'L1C_RE_B', text: 'Am format pe cineva nou pentru același post' },
    { code: 'L1C_RE_C', text: 'Am descoperit că plecarea anterioară ne-a afectat cifra' },
    { code: 'L1C_RE_D', text: 'Nu am documente sau procese — totul e în capul oamenilor' },
  ],
  M: [
    { code: 'L1C_M_A', text: 'Am plătit salarii fără rezultate proporționale' },
    { code: 'L1C_M_B', text: 'Un angajat a făcut minimul necesar, deși știa că e mai mult' },
    { code: 'L1C_M_C', text: 'Am dat un bonus și nu s-a schimbat nimic în comportament' },
    { code: 'L1C_M_D', text: 'Nu am KPI-uri clare — nu știu cine performează și cine nu' },
  ],
  D: [
    { code: 'L1C_D_A', text: 'Am refăcut eu muncă pe care o delegasem' },
    { code: 'L1C_D_B', text: 'Nu am reușit să ies din birou înainte de ora 20' },
    { code: 'L1C_D_C', text: 'Am anulat ceva personal din cauza unui incendiu la firmă' },
    { code: 'L1C_D_D', text: 'Am verificat personal un lucru pe care îl delegasem deja' },
  ],
  C: [
    { code: 'L1C_C_A', text: 'Am luat o decizie pe instinct, fără date clare' },
    { code: 'L1C_C_B', text: 'Am aflat că ceva nu merge abia când era prea târziu' },
    { code: 'L1C_C_C', text: 'Nu știam cifrele reale din businessul meu în timp real' },
    { code: 'L1C_C_D', text: 'Am pierdut bani fără să știu exact pe ce' },
  ],
  S: [
    { code: 'L1C_S_A', text: 'Fiecare manager a făcut cum a vrut — fără proces comun' },
    { code: 'L1C_S_B', text: 'Am crescut echipa și lucrurile s-au complicat mai mult' },
    { code: 'L1C_S_C', text: 'Nu există o organigramă clară sau responsabilități definite' },
    { code: 'L1C_S_D', text: 'Am dublat cifra dar am dublat și haosul' },
  ],
};

export const L2_TRIED_BASE: Question = {
  id: 'L2_TRIED',
  phase: 'L2_TRIED',
  text: 'Ce ai încercat deja ca să rezolvi problema?',
  multiSelect: true,
  quote: { text: "Majoritatea încearcă să rezolve probleme de SISTEM cu soluții de OAMENI. Schimbă angajatul, măresc salariul. Dar problema rămâne.", author: "Victor Morar" },
  options: [],
};

export const L2_TRIED_OPTIONS: Record<string, { code: string; text: string }[]> = {
  R: [
    { code: 'L2T_R_A', text: 'Am schimbat platforma de anunțuri de recrutare' },
    { code: 'L2T_R_B', text: 'Am crescut salariul oferit' },
    { code: 'L2T_R_C', text: 'Am angajat un recrutor extern' },
    { code: 'L2T_R_D', text: 'Am cerut recomandări de la echipă' },
    { code: 'L2T_R_E', text: 'Nu am schimbat nimic — nu știu ce altceva să încerc' },
  ],
  Re: [
    { code: 'L2T_RE_A', text: 'Am oferit bonusuri de retenție' },
    { code: 'L2T_RE_B', text: 'Am mărit salariul fix' },
    { code: 'L2T_RE_C', text: 'Am schimbat modul de training' },
    { code: 'L2T_RE_D', text: 'Am pus clauze de non-concurență' },
    { code: 'L2T_RE_E', text: 'Nu am implementat nimic concret' },
  ],
  M: [
    { code: 'L2T_M_A', text: 'Am pus bonusuri de performanță' },
    { code: 'L2T_M_B', text: 'Am făcut ședințe motivaționale' },
    { code: 'L2T_M_C', text: 'Am schimbat oameni din echipă' },
    { code: 'L2T_M_D', text: 'Am încercat KPI-uri dar nu le-a urmărit nimeni' },
    { code: 'L2T_M_E', text: 'Nu am schimbat nimic — nu știu de unde să încep' },
  ],
  D: [
    { code: 'L2T_D_A', text: 'Am încercat să deleg — tot eu am refăcut' },
    { code: 'L2T_D_B', text: 'Am angajat un manager — nu a funcționat' },
    { code: 'L2T_D_C', text: 'Am documentat procese — nimeni nu le respectă' },
    { code: 'L2T_D_D', text: 'Am pus CRM sau soft de management' },
    { code: 'L2T_D_E', text: 'Nu am făcut nimic concret — nu am avut timp' },
  ],
  C: [
    { code: 'L2T_C_A', text: 'Am instalat un software de raportare' },
    { code: 'L2T_C_B', text: 'Am cerut rapoarte săptămânale de la echipă' },
    { code: 'L2T_C_C', text: 'Am angajat un contabil sau consultant' },
    { code: 'L2T_C_D', text: 'Am creat dashboards — nimeni nu le actualizează' },
    { code: 'L2T_C_E', text: 'Nu am implementat nimic concret' },
  ],
  S: [
    { code: 'L2T_S_A', text: 'Am construit o organigramă — nu e respectată' },
    { code: 'L2T_S_B', text: 'Am implementat un sistem de ședințe' },
    { code: 'L2T_S_C', text: 'Am angajat un consultant de organizare' },
    { code: 'L2T_S_D', text: 'Am documentat procese — rămase în documente' },
    { code: 'L2T_S_E', text: 'Nu am încercat nimic sistematic' },
  ],
};

export const L2_RESULT: Question = {
  id: 'L2_RESULT',
  phase: 'L2_RESULT',
  text: 'Cât de mult a funcționat ce ai încercat?',
  multiSelect: false,
  options: [
    { code: 'L2RA', text: 'Deloc — suntem exact unde eram' },
    { code: 'L2RB', text: 'Puțin — a ajutat temporar' },
    { code: 'L2RC', text: 'Parțial — îmbunătățit, dar problema persistă' },
    { code: 'L2RD', text: 'Nu am implementat nimic concret' },
  ],
};

export const L2_WHY: Question = {
  id: 'L2_WHY',
  phase: 'L2_WHY',
  text: '[PRENUME], de ce a devenit prioritatea ta nr. 1 acum?',
  multiSelect: false,
  options: [
    { code: 'L2WA', text: 'M-am săturat — e de prea mult timp' },
    { code: 'L2WB', text: 'A apărut un moment critic recent' },
    { code: 'L2WC', text: 'Concurența ne depășește' },
    { code: 'L2WD', text: 'Am realizat că altfel nu pot crește' },
  ],
};

export const L3_IMPACT: Question = {
  id: 'L3_IMPACT',
  phase: 'L3_IMPACT',
  text: '[PRENUME], ce impact are problema asupra ta PERSONAL?',
  multiSelect: true,
  subtitle: 'Alege tot ce se aplică.',
  quote: { text: "Am fost exact acolo. În 2023 am vrut să vând tot. Dar am înțeles: nu trebuie să renunț la afacere — trebuie să renunț la modul în care o conduceam.", author: "Victor Morar" },
  options: [
    { code: 'L3IA', text: 'Vin târziu acasă, nu am timp de familie' },
    { code: 'L3IB', text: 'Nu fac sport, am pus kilograme' },
    { code: 'L3IC', text: 'Sunt irascibil, mă cert din cauza stresului' },
    { code: 'L3ID', text: 'Simt că îmi ratez viața stând în telefon' },
    { code: 'L3IE', text: 'Copiii mei cresc și eu nu sunt prezent' },
  ],
};

export const L3_FEELING: Question = {
  id: 'L3_FEELING',
  phase: 'L3_FEELING',
  text: 'Cum te simți față de situație în acest moment?',
  multiSelect: false,
  options: [
    { code: 'L3FA', text: 'O să se rezolve — sunt optimist' },
    { code: 'L3FB', text: 'E grav dar gestionabil' },
    { code: 'L3FC', text: 'Sunt epuizat și nu mai am energie' },
    { code: 'L3FD', text: 'Îmi vine să las totul jos' },
  ],
};

export const L3_FUTURE: Question = {
  id: 'L3_FUTURE',
  phase: 'L3_FUTURE',
  text: '[PRENUME], dacă nu schimbi NIMIC în 6 luni, ce se va întâmpla?',
  multiSelect: true,
  subtitle: 'Alege tot ce simți că e adevărat.',
  options: [
    { code: 'L3XA', text: 'Voi continua să pierd bani și energie la fel' },
    { code: 'L3XB', text: 'Voi pierde oameni cheie — va fi și mai greu' },
    { code: 'L3XC', text: 'O să ajung la burnout. Sunt aproape' },
    { code: 'L3XD', text: 'Concurența mă va depăși' },
    { code: 'L3XE', text: 'O să vreau să vând firma. Dar cine cumpără un business care depinde de mine?' },
  ],
};

// =======================================
// FAZA 4 — Scopul real (G1, G2)
// =======================================

export const G1: Question = {
  id: 'G1',
  phase: 'G1',
  text: 'Care e obiectivul tău principal pentru următoarele 12 luni?',
  multiSelect: true,
  options: [
    { code: 'G1A', text: 'Să am timp liber — sport, familie, vacanțe fără telefon' },
    { code: 'G1B', text: 'Să cresc vânzările fără să cresc și haosul' },
    { code: 'G1C', text: 'Să angajez și să rețin oamenii potriviți' },
    { code: 'G1D', text: 'Să știu ce se întâmplă în firmă fără să fiu prezent fizic' },
    { code: 'G1E', text: 'Să cresc exponențial — noi piețe, noi business-uri' },
  ],
};

export const G2: Question = {
  id: 'G2',
  phase: 'G2',
  text: 'Care e cifra de afaceri țintă în 12 luni?',
  multiSelect: false,
  options: [
    { code: 'G2A', text: 'Să stabilizez ce am — nu vreau să cresc acum, vreau să funcționeze' },
    { code: 'G2B', text: 'Să dublez cifra actuală' },
    { code: 'G2C', text: 'Să triplez sau mai mult — am piața, îmi lipsește structura' },
    { code: 'G2D', text: 'Nu știu exact — mai întâi vreau să rezolv problema curentă' },
  ],
};
