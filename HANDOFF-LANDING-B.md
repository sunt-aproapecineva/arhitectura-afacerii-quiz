# Handoff — Landing B personalizat (mini-cursul FUNDAȚIA)

Document pentru cuplarea landing-ului în Lovable: ce e fix, ce generează AI-ul din
datele quizului, schema sloturilor, prompt-ul de generare și maparea quiz → slot.

---

## 1. Ce e și cum funcționează

Pagina: `src/pages/LandingB.tsx`, rută `/draft-b`. Vinde **un singur lucru** — mini-cursul
FUNDAȚIA (ramura B din quiz). Model de ofertă: **prima lecție gratis → 29€ (Singur) / 79€
(Cu expert, consultație 1:1)**.

Personalizarea are **două niveluri**:

1. **Per profil** (3 variante statice): `ZERO`, `ANGAJAT`, `ARS` — vin din clasificarea
   quizului (`bProfile`). Schimbă tonul/încadrarea.
2. **Per om** (AI): pornind de la varianta profilului + datele exacte ale omului
   (nume, durerea lui în cuvintele lui, scopul lui), AI-ul rescrie sloturile ca să fie
   despre el. Tot landingul încălzește pe durerea lui și-i vinde viitorul.

Preview manual: `/draft-b?profil=ANGAJAT`, `/draft-b?profil=ARS` (default `ZERO`).
`?nolenis=1` dezactivează smooth-scroll (util la dezvoltare).

---

## 2. Cele două straturi în cod

În `LandingB.tsx`:

- 🟢 `SAMPLE_USER` — slot per-user (`name`). Vine din `formData.name`.
- 🟢 `PROFILES` — slot-urile per profil (ZERO/ANGAJAT/ARS). **Astea le generează AI-ul.**
- ⬜ `FIXED` — restul (poze Victor, Punctul B, module, prețuri, FAQ, „ce NU e", mecanism).
  **AI-ul NU atinge niciodată acest strat.** Aici stau prețurile și dovezile.

La runtime: `const C = { ...userData, ...FIXED, ...PROFILES[profil] }`. Toate referințele
`C.x` din JSX merg neschimbate.

---

## 3. Sloturile AI (ce generează modelul)

Toate în română, vocea lui Victor. Per profil + personalizate cu datele omului.

| slot | tip | lungime | rol |
|---|---|---|---|
| `diagnostic` | string | 2–4 cuvinte | eticheta profilului (din `bProfile`, nu liber) |
| `heroA` | string | 2–5 cuvinte | deschiderea hero-ului (se randează `{name}, {heroA}`) |
| `heroAccent` | string | 1–2 cuvinte | cuvântul pe auriu = lucrul pe care **crede greșit** că-i lipsește |
| `heroB` | string | 3–9 cuvinte | reframe-ul (ce-i lipsește de fapt) |
| `mirror` | string | 30–45 cuvinte | oglinda durerii, în cuvintele lui. Fraze scurte (se scrie la scroll) |
| `pains[4]` | array | `t`: 2–4 cuv, `b`: 5–9 cuv | 4 carduri „te recunoști?" |
| `pains[].icon` | enum | — | una din: `Bookmark BookOpen HelpCircle Hourglass Briefcase Scale Lock Flame RotateCcw Wrench Search Target` |
| `proofLine` | string | 25–40 cuvinte | diagnosticul-ca-dovadă (testul l-a citit → aceeași structură îl repară) |
| `ps` | string | 20–35 cuvinte | leagă scopul lui (`mainGoal`) de primul pas |

`name` vine direct din quiz (nu se generează).

---

## 4. Schema JSON (pentru structured output)

```json
{
  "type": "object",
  "required": ["diagnostic","heroA","heroAccent","heroB","mirror","pains","proofLine","ps"],
  "properties": {
    "diagnostic":  { "type": "string", "maxLength": 40 },
    "heroA":       { "type": "string", "maxLength": 40 },
    "heroAccent":  { "type": "string", "maxLength": 24 },
    "heroB":       { "type": "string", "maxLength": 70 },
    "mirror":      { "type": "string", "maxLength": 320 },
    "pains": {
      "type": "array", "minItems": 4, "maxItems": 4,
      "items": {
        "type": "object",
        "required": ["icon","t","b"],
        "properties": {
          "icon": { "type": "string", "enum": ["Bookmark","BookOpen","HelpCircle","Hourglass","Briefcase","Scale","Lock","Flame","RotateCcw","Wrench","Search","Target"] },
          "t":    { "type": "string", "maxLength": 36 },
          "b":    { "type": "string", "maxLength": 70 }
        }
      }
    },
    "proofLine": { "type": "string", "maxLength": 280 },
    "ps":        { "type": "string", "maxLength": 240 }
  }
}
```

---

## 5. System prompt pentru generare

> Ești copywriter pentru Victor Morar, antreprenor din Moldova. Scrii copy pentru o pagină
> care vinde mini-cursul „FUNDAȚIA" unui om care a făcut un test de diagnostic.
>
> **Scopul paginii:** un singur lucru — să-l facă să înceapă mini-cursul (prima lecție e
> gratis). Nu vinzi nimic altceva. Nu pomeni alte produse.
>
> **Vocea:** română vorbită, caldă, directă. Fraze scurte, tăiate după ~12 cuvinte. „Tu",
> niciodată „dumneavoastră". Concret, nu abstract. Fără adverbe inutile, fără em-dash
> decorativ, fără entuziasm fals, fără clișee de AI („într-o lume în continuă schimbare").
> Citește cu voce tare: dacă sună a robot, rescrie.
>
> **Strategia:** tot textul apasă pe durerea lui (uneori cu cuvintele lui exacte din test,
> uneori parafrazat) și îi vinde viitorul pe care-l vrea. Demnitate: atingi rana, n-o
> scobești. Nu-l faci să se simtă prost, îl faci să se simtă văzut.
>
> **Reguli dure:**
> - Folosește DOAR datele primite. Nu inventa cifre, testimoniale, rezultate.
> - Nu promite bani sau clienți. Cursul livrează claritate, nu rezultate.
> - `heroAccent` = lucrul pe care omul crede GREȘIT că-i lipsește (ex: „informația",
>   „curajul"). `heroB` = ce-i lipsește de fapt (ordinea, planul, sistemul).
> - `mirror` = fraze scurte, ca un prieten care-l vede limpede.
> - `ps` leagă scopul lui declarat de primul pas (harta).
>
> Întorci DOAR JSON-ul conform schemei. Atât.

User message (exemplu): profilul + datele omului (vezi maparea de mai jos).

---

## 6. Maparea quiz → slot

Din `src/lib/quiz/submission.ts` (`QuizSubmission`):

| dată din quiz | alimentează |
|---|---|
| `contact.name` | `name` (direct) |
| `profile.primary` (`bProfile`) | alege varianta de bază: ZERO/ANGAJAT/ARS + setează `diagnostic` |
| `beginner.situation`, `beginner.blocker` | `mirror`, `pains` (de unde pornește, ce-l blochează) |
| `beginner.invest`, `beginner.readiness` | nuanțează `pains`, `proofLine` |
| `goals.mainGoal` | `ps` (viitorul pe care i-l vinzi), finalul lui `mirror` |
| `emotional.emotionalState`, `emotional.futureConsequences` | tonul lui `mirror` |
| `profile.temperature` (HOT/WARM/COLD) | cât de direct e CTA-ul (opțional; pe B rămâne blând) |

Cele 3 variante din `PROFILES` (în `LandingB.tsx`) sunt exemple canonice de voce per profil
— folosește-le ca few-shot pentru model.

---

## 7. Cuplarea în Lovable (pașii reali)

1. **Handoff token:** la submit, quizul salvează în Supabase și întoarce un `id`. Butonul
   „Vezi planul tău" din ecranul de rezultat duce la `/p/{id}` (fără PII în URL).
2. **Generare:** un edge function (`generate-offer`) ia datele după `id`, cheamă Claude cu
   prompt-ul de la §5 + schema de la §4, validează, salvează sloturile lângă submission.
   Recomandat: generezi **la submit** (pagina se încarcă instant) și poți revizui copy-ul
   înainte să fie live.
3. **Landing dinamic:** `LandingB` citește sloturile după `id` și le pune în locul lui
   `PROFILES[profil]`. `FIXED` rămâne neatins.
4. **Fallback:** dacă generarea pică, folosește varianta statică din `PROFILES[bProfile]`.
   Pagina nu se rupe niciodată.

**Model recomandat:** `claude-sonnet-4-6` pentru sloturi (raport calitate/cost bun la volum);
`claude-opus-4-8` doar dacă vrei vârf pe hero. Cheia Anthropic stă în env-ul edge
function-ului, niciodată în client.

---

## 8. De cărat odată cu pagina

- `src/pages/LandingB.tsx` + `src/components/landing/scroll.tsx`
- `src/components/ui/`: `blur-reveal.tsx`, `shimmer-text.tsx`, `tilt-card.tsx`
- pachet npm: `motion-icons-react`, `lenis`
- `public/victor/` (pozele optimizate)
- block-ul de design tokens viridian din `<style>` (în `LandingB.tsx`)

## 9. De confirmat (conținut real, nu se inventă)

- Prețuri/garanție finale (acum: gratis → 29€ / 79€).
- Expertul de la 79€: Victor sau o echipă?
- Reperele din bio Victor (Wine Time, vinărie, Clifford Chance — confirmate din poze).
