# KNOWLEDGE BASE — PDF ANALIZĂ PERSONALIZATĂ
## Victor Morar / Quiz Funnel / Lovable Implementation

---

## 1. CE CONSTRUIEȘTI

Un document HTML care se randează și se exportă ca PDF de 5 pagini.
PDF-ul este „Analiza Personalizată" pe care consultantul Victor Morar
o trimite manual fiecărui utilizator după ce completează quiz-ul.

**Stack:** React + Tailwind CSS + html2pdf.js (sau jsPDF)
**Output:** PDF A4, 5 pagini, dark theme
**Input:** Obiect JSON cu datele utilizatorului (completat din quiz)
**Trigger:** Buton „Generează PDF" — nu se generează automat

---

## 2. DESIGN SYSTEM

### Culori — folosește EXACT aceste valori
```
--bg-main:        #0B1319   /* background pagini */
--bg-card:        #162430   /* carduri */
--bg-accent:      #203546   /* accent fundal */
--green-main:     #0A9678   /* verde principal */
--green-dark:     #055C4A   /* verde întunecat */
--green-light:    #73D4BE   /* verde deschis */
--green-ultra:    #E0F4F0   /* verde foarte deschis */
--white:          #FFFFFF
--text-secondary: #E0F4F0
--text-dim:       #73D4BE
```

### Fonturi — Google Fonts
```html
<link href="https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700;1,400..700&family=Arimo:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
```

**Utilizare:**
- Titluri, label-uri, butoane, uppercase → `Archivo Narrow, bold 700`
- Body text, paragrafe → `Arimo, regular 400`
- Italic / citate → `Arimo, italic 400`
- Label-uri mici → `Archivo Narrow, 700, uppercase, letter-spacing: 0.15em`

### Format pagină
```
Format: A4 portrait (210mm × 297mm)
Margini: 20mm stânga/dreapta, 16mm sus/jos
Pagini: 5 fixe
```

### Linie accent (sus pe fiecare pagină)
```css
/* Gradient 3 culori, 3px înălțime, full width */
background: linear-gradient(90deg, #055C4A 0%, #0A9678 50%, #73D4BE 100%);
height: 3px;
width: 100%;
```

### Carduri
```css
/* Card standard */
background: #162430;
border-radius: 8px;
border-left: 4px solid #0A9678; /* doar pe carduri de importanță maximă */

/* Card accent (fundal mai deschis) */
background: #203546;
border-radius: 6px;
```

### Section header (band full-width)
```css
background: linear-gradient(90deg, #055C4A, #0A9678);
height: 40px;
padding: 0 20mm;
font: Archivo Narrow, 9px, uppercase, letter-spacing: 0.2em, color: #E0F4F0;
```

---

## 3. VARIABILE DE INPUT

Toate variabilele vin dintr-un singur obiect JSON:

```json
{
  "contact": {
    "name": "string",
    "email": "string",
    "instagram": "string",
    "phone": "string"
  },
  "profile": {
    "primary": "D",
    "primaryLabel": "Faci tu totul, că altfel iese prost.",
    "primaryName": "DELEGARE",
    "primaryEmoji": "⚙️",
    "secondary": "R",
    "secondaryLabel": "Nu găsești oameni buni.",
    "secondaryName": "RECRUTARE"
  },
  "business": {
    "employeeCount": "5–15 angajați",
    "currentRevenue": "20.000–50.000€/lună",
    "entrepreneurialEducation": ["Am lucrat cu un mentor sau consultant"],
    "socialMediaTime": "30–60 minute pe zi",
    "identityQuote": "Lucrează inteligent, nu mult."
  },
  "pain": {
    "monthlyCost": "1.000–5.000€",
    "problemDuration": "1–3 ani",
    "triedSolutions": [
      "Am încercat să deleg — tot eu am refăcut",
      "Am angajat un manager — nu a funcționat"
    ],
    "solutionResult": "Puțin — a ajutat temporar",
    "weeklySymptoms": [
      "Am refăcut eu muncă pe care o delegasem",
      "Am anulat ceva personal din cauza unui incendiu la firmă"
    ],
    "whyNowPriority": "M-am săturat — e de prea mult timp"
  },
  "emotional": {
    "personalImpact": [
      "Vin târziu acasă, nu am timp de familie",
      "Copiii mei cresc și eu nu sunt prezent"
    ],
    "emotionalState": "Sunt epuizat și nu mai am energie",
    "futureConsequences": [
      "Voi continua să pierd bani și energie la fel",
      "O să ajung la burnout. Sunt aproape"
    ]
  },
  "goals": {
    "mainGoal": "Să am timp liber — sport, familie, vacanțe fără telefon",
    "revenueTarget": "Să dublez cifra actuală"
  },
  "meta": {
    "submittedAt": "26.03.2026",
    "annualCostEstimate": "12.000 – 60.000€"
  },
  "generatedText": {
    "section3": "string — text generat AI pentru secțiunea De ce ai ajuns aici",
    "section4": "string — text generat AI pentru secțiunea Costul real",
    "section5": "string — text generat AI pentru secțiunea Dacă nu schimbi nimic",
    "section6": "string — text generat AI pentru secțiunea 12 luni cu sistemul corect"
  }
}
```

---

## 4. STRUCTURA PDF — PAGINĂ CU PAGINĂ

### PAGINA 1 — COPERTĂ

**Layout:** centrat vertical, dark background

```
[linie accent sus 3px gradient]

[top-right]
"ANALIZĂ PERSONALIZATĂ" — AN Bold, 9px, uppercase, #0A9678

[centru vertical]
"V I C T O R   M O R A R" — AN Bold, 12px, letter-spacing 0.4em, #73D4BE
"DIAGNOSTICUL" — AN Bold, 46px, #FFFFFF
"BUSINESSULUI TĂU" — AN Bold, 46px, #FFFFFF
"Pregătit exclusiv pentru {{contact.name}}" — Arimo Italic, 17px, #73D4BE

[linie separator 1px #203546, 80% width, centrat]

[jos pagina — 3 coloane]
Col 1: label "PROFIL DOMINANT" / valoare {{profile.primaryName}}
Col 2: label "TIPOLOGIE SECUNDARĂ" / valoare {{profile.secondaryName}}
Col 3: label "DATA ANALIZEI" / valoare {{meta.submittedAt}}
— label: AN Bold, 8px, uppercase, #0A9678
— valoare: Arimo Bold, 13px, #E0F4F0

[footer centrat]
"@morar_victor" — AN Regular, 9px, #203546
```

---

### PAGINA 2 — PROFILUL TĂU

**Header band:** "01 / PROFILUL TĂU DOMINANT"

**Card principal** (background #162430, border-left 4px #0A9678, rounded 8px):
```
{{profile.primaryEmoji}} — 32px
"{{profile.primaryName}}" — AN Bold, 26px, uppercase, #FFFFFF
"{{profile.primaryLabel}}" — Arimo Italic, 13px, #73D4BE
[linie separator 1px #203546]
{{generatedText.section3}} — Arimo Regular, 10px, line-height 1.7, #E0F4F0
(3 paragrafe, spacing 10px între ele)
```

**Card secundar** (background #203546, rounded 6px, margin-top 14px):
```
label: "PUNCT NEVRALGIC SECUNDAR" — AN Bold, 8px, uppercase, #0A9678
"{{profile.secondaryName}}" — AN Bold, 15px, #FFFFFF
"{{profile.secondaryLabel}}" — Arimo Regular, 11px, #73D4BE
```

---

### PAGINA 3 — COSTUL REAL & CE AI ÎNCERCAT

**Header band:** "02 / COSTUL REAL AL PROBLEMEI"

**Card highlight număr mare** (background #162430, border-left 4px #0A9678):
```
label: "PIERDERE ESTIMATĂ ÎN 12 LUNI" — AN Bold, 8px, uppercase, #0A9678
"{{meta.annualCostEstimate}}" — AN Bold, 46px, #FFFFFF
"Dacă problema rămâne nerezolvată" — Arimo Italic, 11px, #73D4BE
```

**Text** {{generatedText.section4}} — Arimo, 10px, #E0F4F0, 2–3 paragrafe

**Linie separator** 1px #203546

**Header band:** "03 / CE AI ÎNCERCAT DEJA"

**Chips** (pentru fiecare item din {{pain.triedSolutions}}):
```css
background: #203546;
border-radius: 20px;
padding: 5px 14px;
font: Arimo 10px, #73D4BE;
display: inline-flex;
margin: 4px;
```

**Card rezultat** (background #162430, border 1px #203546, rounded 8px):
```
label: "REZULTAT" — AN Bold, 8px, #0A9678
"{{pain.solutionResult}}" — Arimo Italic, 14px, #E0F4F0
```

---

### PAGINA 4 — IMPACT & VIITOR

**Header band:** "04 / DACĂ NU SCHIMBI NIMIC"

**Text** {{generatedText.section5}} — Arimo, 10px, #E0F4F0

**Lista impact personal** (pentru fiecare item din {{emotional.personalImpact}}):
```
• [text] — Arimo 11px, #E0F4F0
bullet: pătrat 5x5px solid #0A9678, margin-right 10px
```

**Linie separator** 1px #203546

**Header band:** "05 / CUM ARATĂ 12 LUNI CU SISTEMUL CORECT"

**Text** {{generatedText.section6}} — Arimo, 10px, #E0F4F0

**Card obiectiv** (gradient background #055C4A → #0A9678, rounded 8px, padding 20px):
```
label: "OBIECTIVUL TĂU DECLARAT" — AN Bold, 8px, uppercase, #E0F4F0
"{{goals.mainGoal}}" — AN Bold, 13px, #FFFFFF
"{{goals.revenueTarget}}" — Arimo Regular, 12px, #E0F4F0
```

---

### PAGINA 5 — LISTA DE AȘTEPTARE

**Linie accent sus**

**Conținut centrat:**
```
"U N   S I N G U R   P A S   M A I   D E P A R T E"
— AN Bold, 9px, letter-spacing 0.3em, #0A9678

"Nu vreau să-ți vând nimic."
"Dar vreau să-ți dau o mână de ajutor."
— AN Bold, 22px, #FFFFFF

[paragraf introductiv — Arimo Italic, 11px, #73D4BE, centrat]
"Am văzut diagnosticul tău. Problema pe care o ai e ca o rană — dacă o ignori,
nu dispare. Și știu asta pentru că am fost exact acolo. Aveam 111 kg,
mâncam la 23:00, 5 companii care depindeau de mine — și nu vedeam ieșirea."
```

**Card lista** (gradient #055C4A → #0d7a62, rounded 10px, border 0.4px #73D4BE):
```
label: "LISTA DE AȘTEPTARE — VICTOR MORAR" — AN Bold, 8px, #73D4BE
"Gratuită. Fără obligații. 1 minut." — AN Bold, 17px, #FFFFFF
[linie separator]

4 beneficii cu bullet verde (cerc solid #0A9678, 4px radius):
• "Înscrierea e gratuită și durează 1 minut. Nicio obligație."
• "Te contactez personal cu o propunere individuală,
   aleasă specific pentru problema și situația ta."
• "Intri într-o comunitate privată de antreprenori,
   curată de mine personal."
• "Cei de pe listă au acces la oferte de colaborare mai bune — și mai rapide."

[buton] background #FFFFFF, text #0B1319, AN Bold 13px, rounded 6px
"MĂ ÎNSCRIU PE LISTĂ →"

"@morar_victor pe Instagram" — Arimo 9px, #73D4BE, centrat sub buton
```

**Citat final:**
```
„Lista mă ajută să înțeleg cine chiar are nevoie de mine — și cine nu prea.
Dacă ești aici, înseamnă că ești printre cei care ard."
— Arimo Italic, 9px, #4a8a7e, centrat
```

**Footer:**
```
stânga: "@morar_victor"
centru: "Analiză generată pe {{meta.submittedAt}} exclusiv pentru {{contact.name}}"
dreapta: "pag. 5 / 5"
— AN Regular, 8px, #203546
```

---

## 5. REGULILE DE GENERARE PDF

### html2pdf.js — configurare recomandată
```javascript
const options = {
  margin: 0,
  filename: `Analiza_${contact.name.replace(' ', '_')}.pdf`,
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: {
    scale: 2,
    useCORS: true,
    backgroundColor: '#0B1319'
  },
  jsPDF: {
    unit: 'mm',
    format: 'a4',
    orientation: 'portrait'
  },
  pagebreak: { mode: 'css', before: '.page-break' }
};
```

### Fiecare pagină = un div cu clasa `.pdf-page`
```css
.pdf-page {
  width: 210mm;
  min-height: 297mm;
  max-height: 297mm;
  overflow: hidden;
  background: #0B1319;
  padding: 16mm 20mm;
  position: relative;
  page-break-after: always;
}

/* Forțează page break între pagini */
.page-break {
  page-break-before: always;
}
```

### Preview live
Înainte de export, utilizatorul vede un preview HTML al PDF-ului.
Butonul „Descarcă PDF" declanșează html2pdf.js.

---

## 6. TIPOLOGIILE — REFERINȚĂ RAPIDĂ

| Cod | Nume | Problema | Culoare identitate |
|-----|------|----------|-------------------|
| D | Delegare | „Fac eu totul, că altfel iese prost." | #69db7c |
| R | Recrutare | „Nu găsesc oameni buni." | #ff6b6b |
| Re | Retenție | „Formez oameni care poi pleacă." | #ffa94d |
| M | Motivație | „Plătesc dar nu primesc rezultat." | #ffd43b |
| C | Control | „Nu știu ce se întâmplă în firma mea." | #4dabf7 |
| S | Structură | „Cresc, dar totul se complică." | #cc5de8 |

---

## 7. DATE DE TEST — FOLOSEȘTE ASTEA PENTRU PREVIEW

```json
{
  "contact": {
    "name": "Andrei Ionescu",
    "email": "andrei@firma.ro",
    "instagram": "@andrei_ionescu",
    "phone": "+40 722 000 000"
  },
  "profile": {
    "primary": "D",
    "primaryLabel": "Faci tu totul, că altfel iese prost.",
    "primaryName": "DELEGARE",
    "primaryEmoji": "⚙️",
    "secondary": "R",
    "secondaryLabel": "Nu găsești oameni buni.",
    "secondaryName": "RECRUTARE"
  },
  "business": {
    "employeeCount": "5–15 angajați",
    "currentRevenue": "20.000–50.000€/lună",
    "entrepreneurialEducation": ["Am lucrat cu un mentor sau consultant"],
    "socialMediaTime": "30–60 minute pe zi",
    "identityQuote": "Lucrează inteligent, nu mult."
  },
  "pain": {
    "monthlyCost": "1.000–5.000€",
    "problemDuration": "1–3 ani",
    "triedSolutions": [
      "Am încercat să deleg — tot eu am refăcut",
      "Am angajat un manager — nu a funcționat"
    ],
    "solutionResult": "Puțin — a ajutat temporar",
    "weeklySymptoms": [
      "Am refăcut eu muncă pe care o delegasem",
      "Am anulat ceva personal din cauza unui incendiu la firmă"
    ],
    "whyNowPriority": "M-am săturat — e de prea mult timp"
  },
  "emotional": {
    "personalImpact": [
      "Vin târziu acasă, nu am timp de familie",
      "Copiii mei cresc și eu nu sunt prezent"
    ],
    "emotionalState": "Sunt epuizat și nu mai am energie",
    "futureConsequences": [
      "Voi continua să pierd bani și energie la fel",
      "O să ajung la burnout. Sunt aproape"
    ]
  },
  "goals": {
    "mainGoal": "Să am timp liber — sport, familie, vacanțe fără telefon",
    "revenueTarget": "Să dublez cifra actuală"
  },
  "meta": {
    "submittedAt": "26.03.2026",
    "annualCostEstimate": "12.000 – 60.000€"
  },
  "generatedText": {
    "section3": "Andrei, ce s-a întâmplat nu e complicat de explicat. Ai construit o firmă în care TU ești singurul nod care leagă totul. Nu pentru că ești un om care nu poate da drumul — ci pentru că nimeni nu ți-a arătat cum să construiești sistemul care face asta posibil. Ai delegat sarcini. Ai delegat taskuri. Dar n-ai delegat niciodată responsabilitate, instrucțiuni clare și autoritate. Și fără astea trei împreună, delegarea nu funcționează — nici dacă angajezi cel mai bun om din piață.\n\nAi încercat să dai treaba altora și ai văzut că iese prost. Ai angajat un manager și tot tu ai rămas cu deciziile. Concluzia naturală a oricărui om rațional în situația ta a fost: mai bine fac eu. Și ai avut dreptate — în contextul în care nu exista sistem. Problema nu e că ai refăcut tu muncă. Problema e că sistemul era construit în așa fel încât altceva nu era posibil.\n\nNu e vina ta că ai ajuns aici. E consecința logică a unui business construit fără arhitectură.",
    "section4": "Andrei, hai să punem cifrele pe masă. Dacă problema te costă {{pain.monthlyCost}} pe lună — și asta de {{pain.problemDuration}} — vorbim de o sumă semnificativă ieșită fără să rezolvi nimic. Și asta e doar ce poți cuantifica.\n\nCe nu apare în niciun tabel: copiii care cresc fără tine de față, serile în care ajungi acasă după ce ei dorm, energia pe care o lași în firmă și n-o mai ai pentru altceva.\n\nCostul real nu e financiar. E că trăiești o viață pe care nu ai ales-o — și o faci în fiecare zi.",
    "section5": "Andrei, ești epuizat — ai spus-o direct. Dacă nu schimbi nimic în 6 luni, nu o să apară brusc un angajat care rezolvă problema singur. Vei continua să refaci muncă delegată și să anulezi lucruri personale din cauza incendiilor din firmă.\n\nCifra pe care vrei să o dublezi nu se poate dubla dacă tu ești singurul care poate lua decizii. Nu pentru că nu ai capacitatea — ci pentru că nu există suficiente ore într-o zi.\n\nBurnout-ul nu vine dintr-odată. Vine exact așa — câte un incendiu pe zi, câte o seară pierdută pe săptămână.",
    "section6": "Andrei, imaginează-ți o zi de luni în care te trezești, îți bei cafeaua și nu deschizi telefonul cu groaza că s-a întâmplat ceva. Ai oameni care știu exact ce au de făcut, cum să decidă și cui să raporteze. Nu pentru că ai găsit angajații perfecți — ci pentru că ai construit un sistem în care oamenii normali livrează rezultate predictibile.\n\nConcret: iei cina cu familia în fiecare seară. Pleci în vacanță și te întorci la o firmă care a funcționat fără tine. Faci sport — nu pentru că ai timp liber, ci pentru că nu mai ești ostaticul propriei tale afaceri.\n\nCifra dublată nu înseamnă că lucrezi de două ori mai mult. Înseamnă o structură care crește fără să depindă de prezența ta zilnică. Am construit asta în 5 companii cu 250 de angajați. Știu exact cum arată drumul."
  }
}
```

---

## 8. PROMPT DE SISTEM PENTRU LOVABLE

Pastează asta ca primă instrucțiune:

```
Construiești un generator de PDF personalizat pentru Victor Morar 
— consultant de business.

INPUT: obiect JSON cu datele utilizatorului (structura în knowledge base)
OUTPUT: document HTML de 5 pagini A4, dark theme, exportabil ca PDF 
        via html2pdf.js

REGULI:
- Folosești EXACT culorile din design system (hex-uri exacte)
- Fonturile sunt Archivo Narrow (titluri) și Arimo (body) de la Google Fonts
- Fiecare pagină e un div.pdf-page de 210mm × 297mm, overflow hidden
- Nu există logică de quiz — primești datele gata, le afișezi
- Nu există backend — totul e frontend
- Există un buton "Descarcă PDF" care declanșează html2pdf.js
- Există un preview live înainte de descărcare
- Folosești datele de test din knowledge base pentru preview inițial
- Toate variabilele sunt {{notatie}} — înlocuiești cu valorile din JSON
- Textele din generatedText.section3/4/5/6 sunt paragrafe separate 
  (split după \n\n)
```

---

*Document generat pentru uz intern — Victor Morar / Antigravity*
*Versiune: 1.0 | 29.03.2026*
