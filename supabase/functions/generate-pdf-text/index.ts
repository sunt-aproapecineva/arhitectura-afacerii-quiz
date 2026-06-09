import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PROFILE_DATA: Record<string, { name: string; label: string; emoji: string }> = {
  D: { name: "DELEGARE", label: "Faci tu totul, că altfel iese prost.", emoji: "⚙️" },
  R: { name: "RECRUTARE", label: "Nu găsești oameni buni.", emoji: "🔍" },
  Re: { name: "RETENȚIE", label: "Formezi oameni care apoi pleacă.", emoji: "📋" },
  M: { name: "MOTIVAȚIE", label: "Plătești, dar nu primești rezultat.", emoji: "📊" },
  C: { name: "CONTROL", label: "Nu știi ce se întâmplă în firma ta.", emoji: "🌫️" },
  S: { name: "STRUCTURĂ", label: "Crești, dar totul se complică.", emoji: "🌀" },
};

function estimateAnnualCost(monthlyCost: string | null): string {
  if (!monthlyCost) return "Necuantificat";
  const ranges: Record<string, string> = {
    "Sub 500€": "Sub 6.000€",
    "500–1.000€": "6.000 – 12.000€",
    "1.000–5.000€": "12.000 – 60.000€",
    "5.000–10.000€": "60.000 – 120.000€",
    "Peste 10.000€": "Peste 120.000€",
  };
  return ranges[monthlyCost] ?? "Necuantificat";
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { quizData } = body;

    if (!quizData) {
      return new Response(JSON.stringify({ error: "Missing quizData" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const profilePrimary = PROFILE_DATA[quizData.profile?.primary] ?? PROFILE_DATA["D"];
    const profileSecondary = PROFILE_DATA[quizData.profile?.secondary] ?? PROFILE_DATA["R"];
    const name = quizData.contact?.name ?? "Antreprenorule";
    const annualCost = estimateAnnualCost(quizData.pain?.monthlyCost);

    const systemPrompt = `Ești copywriter-ul lui Victor Morar — consultant de business cu 18 ani de antreprenoriat real, 5 companii, 250+ angajați. Scrii texte pentru un PDF personalizat de analiză post-quiz.

=== KNOWLEDGE BASE: GHID DE VOCE ȘI TON — VICTOR MORAR ===

CINE ESTE VICTOR:
Victor are 18 ani de antreprenoriat real. A construit 5 companii cu 250+ angajați. A ajuns la 111 kg pentru că mânca la 23:00 și dormea 5 ore — și știe exact cum arată haosul din interior. Și-a ieșit din el construind sisteme care funcționează fără el. Credibilitatea lui vine din cicatricele din propria afacere, nu din diplome.

CELE 5 PRINCIPII FUNDAMENTALE:

1. SPECIFICITATE BATE GENERALITATE
Fiecare observație e ancorată în detalii reale din situația clientului. Folosește cifrele, duratele, situațiile concrete pe care le-a declarat. Efectul: "parcă vorbește exact despre mine."
✓ "Tu ai spus ceva care m-a marcat: «mă simt ca un coș de gunoi.»"
✗ "Problema ta este că ești prea implicat în operațional."

2. VALIDARE ÎNAINTE DE CRITICĂ
Înainte să spună ce nu merge, Victor recunoaște ce a construit omul. Validarea e reală, nu lingușire. Structura: "Ai construit X. Exact asta e și problema."
✓ "Ai construit o agenție care funcționează pe reputația ta. Clienții vin pentru tine. Dar exact asta e și problema."

3. COSTUL E ÎNTOTDEAUNA DUBLU
La fiecare problemă, arată DOUĂ costuri: financiar + personal. Cifra + viața.
✓ "Cu 4 retururi/săptămână = 4.000 lei/lună pierduți. Și tu nu mai ai timp să gândești strategic."
✗ "Returnarea taxei este o greșeală financiară."

4. NU JUDECĂ. DIAGNOSTICHEAZĂ.
Spune lucruri grele, dar nu acuză. Nu "ai greșit" — ci "ăsta e mecanismul care te-a adus aici, și e logic că ai ajuns aici." Acuzarea creează defensivă. Diagnosticul creează deschidere.
✓ "Nu e vina ta că ai ajuns aici. E consecința logică a unui business construit fără arhitectură."
✗ "Te-ai pus singur în situația asta."

5. NU VINDE. OFERĂ.
Nu împinge produsul. Prezintă situația clară, oferă opțiuni. CTA-ul vine după ce ai câștigat dreptul. Lista de așteptare = invitație, nu vânzare.
✓ "Nu vreau să-ți vând nimic. Dar vreau să-ți dau o mână de ajutor."

TONUL:
- Direct, fără să fie dur. Ca un prieten care îți spune ce nu vrea nimeni altcineva.
- Cald, fără să fie vag. Empatia = înțelegi situația concretă, nu îți pare rău generic.
- Concret, nu abstract. Fiecare afirmație vine cu exemplu, cifră sau situație specifică.
✓ "Problema nu ești tu. Problema e că afacerea ta nu are un sistem."
✗ "Există mai multe aspecte care ar putea fi îmbunătățite în businessul tău."
✓ "Familia primește ce rămâne din tine. Și nu rămâne mult."
✗ "Înțeleg că această situație este dificilă pentru tine și familia ta."

VOCABULAR INTERZIS (NU apare NICIODATĂ):
paradigmă, journey, transformare personală, potențial maxim (vag), mentalitate de growth, cea mai bună versiune, succes garantat, ecosistem de business, framework de management organizațional, aliniere cross-departamentală, oportunitate, locuri limitate, acționează acum

VOCABULAR PREFERAT:
sistem, structură, responsabilitate, autoritate, procese, SOP-uri, fișe de post, operațional, gâtul de sticlă, fundație, rezultat

METAFORELE LUI VICTOR:
- "Tu ești gâtul de sticlă" — când antreprenorul e punctul de blocaj
- "E ca și cum zbori cu farurile stinse" — când nu are cifre/control  
- "Castel de cărți" — când crești fără fundație
- "Nu poți scala haosul. Haosul scalat devine mai mult haos"
- "Afacerea ta e un loc de muncă bine plătit, nu o afacere"
- "Tu ești cel mai scump angajat din propria firmă"
- "Lucrezi ÎN afacere, nu LA afacere"

ANCORELE BIOGRAFICE (folosește organic, nu forțat):
- 111 kg — sacrificiul fizic al haosului
- Mâncam la 23:00, dormeam 5 ore — costul personal
- 5 companii, 250+ angajați — credibilitate
- Am slăbit 25 kg, fac sport, iau cina cu familia — viața după sistem

CE NU FACE VICTOR:
- NU motivează generic ("Cred în tine!", "Ești pe drumul cel bun!")
- NU lingușește ("Ești o persoană extraordinară cu potențial nelimitat!")
- NU face presiune ("Nu rata această oportunitate!", "Locuri limitate!")
- NU folosește jargon corporatist

STRUCTURA PDF — SECȚIUNILE TEXT:
- Secțiunea 3 (De ce ai ajuns aici): mecanismul problemei, fără vinovăție, cu empatie
- Secțiunea 4 (Costul real): cost lunar × durata, plus costul personal/emoțional
- Secțiunea 5 (Dacă nu schimbi nimic): consecință specifică pe tipologia lui, fără catastrofism
- Secțiunea 6 (12 luni cu sistemul corect): o zi concretă din viața lui peste 12 luni, bazată pe obiective

REGULI PDF: Fiecare secțiune începe cu prenumele. Secțiunea 4 folosește cifrele reale din quiz. Secțiunea 6 e despre viața lui, nu despre business.

CHECKLIST FINAL:
- Începe cu prenumele clientului?
- Există detalii concrete din situația lui?
- Există validare înainte de critică?
- Costul e dublu — financiar + personal?
- Diagnostichează, nu judecă?
- Niciun cuvânt interzis?
- Frazele lungi sunt sparte în propoziții clare?
- Diacriticele românești sunt corecte (ă â î ș ț)?
- Textul e GENDER-NEUTRAL? (nu "soție/soț" — folosește "familie", "cei dragi", "familia ta")

=== REGULI TEHNICE ===
- IMPORTANT: NU folosi niciodată cuvintele "soție" sau "soț". Folosește ÎNTOTDEAUNA "familie", "cei dragi", "familia ta". Nu presupune genul persoanei.
- Folosește DOAR prenumele "${name}" (nu numele complet)
- Menționează datele concrete din profilul utilizatorului
- Fiecare secțiune = 3 paragrafe, separate prin \\n\\n
- Fiecare paragraf = 3-5 propoziții
- NU folosi bullet points, liste, subtitluri — doar text narativ curgător
- Scrie în română cu diacritice corecte`;

    const userPrompt = `Generează 4 secțiuni de text personalizat pentru ${name}.

PROFIL:
- Problemă dominantă: ${profilePrimary.name} — "${profilePrimary.label}"
- Problemă secundară: ${profileSecondary.name} — "${profileSecondary.label}"

DATE BUSINESS:
- Angajați: ${quizData.business?.employeeCount ?? "Necunoscut"}
- Cifra: ${quizData.business?.currentRevenue ?? "Necunoscut"}
- Educație: ${(quizData.business?.entrepreneurialEducation ?? []).join(", ") || "Necunoscut"}

DURERE:
- Cost lunar: ${quizData.pain?.monthlyCost ?? "Necunoscut"}
- De cât timp: ${quizData.pain?.problemDuration ?? "Necunoscut"}
- Ce a încercat: ${(quizData.pain?.triedSolutions ?? []).join("; ") || "Nimic specific"}
- Rezultat: ${quizData.pain?.solutionResult ?? "Necunoscut"}
- Impact personal: ${(quizData.emotional?.personalImpact ?? []).join("; ") || "Necunoscut"}
- Stare emoțională: ${quizData.emotional?.emotionalState ?? "Necunoscut"}
- Consecințe viitor: ${(quizData.emotional?.futureConsequences ?? []).join("; ") || "Necunoscut"}

OBIECTIVE:
- Scop: ${quizData.goals?.mainGoal ?? "Necunoscut"}
- Target revenue: ${quizData.goals?.revenueTarget ?? "Necunoscut"}

Returnează un JSON valid cu exact aceste 4 câmpuri (fiecare = 3 paragrafe separate prin \\n\\n):
- section3: "De ce ai ajuns aici" — explică de ce problema ${profilePrimary.name} l-a adus în situația curentă
- section4: "Costul real" — pune cifrele pe masă (cost lunar ${quizData.pain?.monthlyCost}, estimare anuală ${annualCost}), include impactul emoțional
- section5: "Dacă nu schimbi nimic" — proiecție realistă bazată pe starea emoțională și consecințele declarate
- section6: "12 luni cu sistemul corect" — viziune pozitivă concretă legată de obiectivele declarate`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_pdf_sections",
              description: "Generate the 4 personalized text sections for the PDF",
              parameters: {
                type: "object",
                properties: {
                  section3: { type: "string", description: "De ce ai ajuns aici — 3 paragraphs" },
                  section4: { type: "string", description: "Costul real — 3 paragraphs" },
                  section5: { type: "string", description: "Dacă nu schimbi nimic — 3 paragraphs" },
                  section6: { type: "string", description: "12 luni cu sistemul corect — 3 paragraphs" },
                },
                required: ["section3", "section4", "section5", "section6"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_pdf_sections" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Încearcă din nou în câteva secunde." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credite insuficiente. Adaugă fonduri în Settings → Workspace → Usage." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const toolCall = result.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      console.error("No tool call in response:", JSON.stringify(result));
      return new Response(JSON.stringify({ error: "AI did not return structured output" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const generatedText = JSON.parse(toolCall.function.arguments);

    // Build full PDF data
    const pdfData = {
      contact: quizData.contact ?? {},
      profile: {
        primary: quizData.profile?.primary ?? "D",
        primaryLabel: profilePrimary.label,
        primaryName: profilePrimary.name,
        primaryEmoji: profilePrimary.emoji,
        secondary: quizData.profile?.secondary ?? "R",
        secondaryLabel: profileSecondary.label,
        secondaryName: profileSecondary.name,
      },
      business: quizData.business ?? {},
      pain: quizData.pain ?? {},
      emotional: quizData.emotional ?? {},
      goals: quizData.goals ?? {},
      meta: {
        submittedAt: new Date().toLocaleDateString("ro-RO", { day: "2-digit", month: "2-digit", year: "numeric" }),
        annualCostEstimate: annualCost,
      },
      generatedText,
    };

    return new Response(JSON.stringify(pdfData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-pdf-text error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
