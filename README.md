# Victor Morar Quiz

Quiz diagnostic interactiv pentru antreprenori — 4 faze, 6 tipologii, flow adaptiv.

**Tech stack:** React 18 + TypeScript + Vite + Tailwind CSS

---

## Import în Lovable

### Pasul 1 — Urcare pe GitHub
1. Creează un repository nou pe [github.com](https://github.com)
2. În terminal, din folderul proiectului:
   ```bash
   git init
   git add .
   git commit -m "init"
   git remote add origin https://github.com/username/victor-quiz.git
   git push -u origin main
   ```

### Pasul 2 — Import în Lovable
1. Deschide [lovable.dev](https://lovable.dev)
2. **New Project → Import from GitHub**
3. Selectează repository-ul creat
4. Lovable va detecta automat Vite + React + Tailwind

### Pasul 3 — Configurare variabile de mediu în Lovable
În Lovable: **Settings → Environment Variables**, adaugă:

| Variabilă | Valoare | Descriere |
|---|---|---|
| `VITE_WHATSAPP_NUMBER` | `40700000000` | Numărul WhatsApp consultant (fără +) |
| `VITE_WEBHOOK_URL` | *(URL webhook)* | Opțional — pentru export răspunsuri |

---

## Export răspunsuri quiz

### Cum funcționează
La momentul afișării rezultatelor, datele completate de utilizator sunt trimise automat la `VITE_WEBHOOK_URL` (dacă e configurat) ca request `POST` cu `Content-Type: application/json`.

### Format JSON trimis
```json
{
  "submittedAt": "2024-03-26T14:30:00.000Z",
  "sessionId": "uuid",
  "contact": {
    "name": "Ion Popescu",
    "email": "ion@firma.ro",
    "phone": "+40 7...",
    "instagram": "@ion_popescu"
  },
  "profile": {
    "primary": "D",
    "secondary": "C",
    "temperature": "HOT"
  },
  "business": {
    "hasEmployees": true,
    "employeeCount": "5–15 angajați",
    "currentRevenue": "20.000–50.000€/lună",
    "businessAge": "3–7 ani",
    "entrepreneurialEducation": ["Am lucrat cu un mentor"],
    "socialMediaTime": "30–60 minute pe zi",
    "identityQuote": "..."
  },
  "pain": {
    "monthlyCost": "1.000–5.000€",
    "problemDuration": "1–3 ani",
    "concreteProblems": ["..."],
    "triedSolutions": ["..."],
    "solutionResult": "Puțin — a ajutat temporar",
    "priorityReason": "M-am săturat — e de prea mult timp"
  },
  "emotional": {
    "personalImpact": ["Vin târziu acasă"],
    "emotionalState": "Sunt epuizat",
    "futureConsequences": ["..."]
  },
  "goals": {
    "mainGoal": "Să am timp liber",
    "revenueTarget": "Să dublez cifra actuală"
  }
}
```

### Conectare Zapier → Google Sheets (5 minute)
1. **Zapier → New Zap → Trigger: Webhooks by Zapier → Catch Hook**
2. Copiezi URL-ul generat → paste în `VITE_WEBHOOK_URL`
3. **Action: Google Sheets → Create Spreadsheet Row**
4. Mapezi câmpurile JSON la coloane
5. Fiecare completare de quiz = rând nou în foaie

### Conectare Make (Integromat)
Identic cu Zapier — **Webhooks → Custom webhook → HTTP → JSON parser → Google Sheets**

### Conectare Supabase (recomandat în Lovable)
În Lovable: **Add integration → Supabase** → se creează automat tabelul și funcțiile.
Editezi `src/lib/quiz/submission.ts` să insereze în tabel în loc de fetch.

---

## Tipologii profil

| Cod | Profil | Problemă |
|---|---|---|
| `R` | Recrutare | Nu găsesc oameni buni |
| `Re` | Retenție | Formez oameni care pleacă |
| `M` | Motivație | Plătesc, dar nu primesc rezultat |
| `D` | Delegare | Fac eu totul, că altfel iese prost |
| `C` | Control | Nu știu ce se întâmplă în firma mea |
| `S` | Structură | Cresc, dar totul se complică |

---

## Structură proiect

```
src/
├── components/quiz/     # Componente UI quiz
├── content/quiz/        # Conținut (întrebări, rezultate, social proof)
├── lib/quiz/            # Logic (state machine, clasificare, submission)
├── pages/               # Pagina Quiz
└── assets/              # Imagini case studies
```
# victor-quiz
# victor-quiz
# victor-quiz
# victor-quiz
