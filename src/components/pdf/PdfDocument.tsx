import type { PdfData } from '@/lib/quiz/pdf-types';

/* ─── CSS Variables as JS constants ─────────────────── */
const V = {
  midnight:        '#0B1319',
  midnightLight:   '#131E27',
  midnightCard:    '#162430',
  midnightBorder:  '#1E3040',
  midnightHover:   '#203546',
  viridian:        '#0A9678',
  viridianDark:    '#055C4A',
  viridianLight:   '#73D4BE',
  viridianUltra:   '#E0F4F0',
  textPrimary:     '#FFFFFF',
  textSecondary:   '#E0F4F0',
  textMuted:       '#73D4BE',
  textDim:         'rgba(224, 244, 240, 0.5)',
  gold:            '#E8B84B',
  goldLight:       '#F5D48A',
  dangerSoft:      '#FF6B6B',
};

const FONT_ARCHIVO = "'Archivo Narrow', sans-serif";
const FONT_ARIMO = "'Arimo', sans-serif";

/* ─── Page shell ────────────────────────────────────── */
const pageStyle: React.CSSProperties = {
  width: '210mm',
  height: '297mm',
  background: V.midnight,
  margin: '0 auto 32px',
  position: 'relative',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  fontFamily: FONT_ARIMO,
  color: V.textSecondary,
  boxSizing: 'border-box',
};

/* ─── Shared sub-components ─────────────────────────── */

function AccentBar() {
  return (
    <div style={{
      height: 3,
      background: `linear-gradient(90deg, ${V.viridianDark} 0%, ${V.viridian} 50%, ${V.viridianLight} 100%)`,
      flexShrink: 0,
    }} />
  );
}

function PageFooter({ page, total, name, date }: { page: number; total: number; name: string; date: string }) {
  return (
    <div style={{
      marginTop: 'auto',
      padding: '14px 20mm',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: `1px solid ${V.midnightBorder}`,
    }}>
      <span style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: V.midnightHover }}>
        Victor Morar
      </span>
      <span style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', letterSpacing: '0.12em', textTransform: 'uppercase', color: V.midnightHover }}>
        Analiză: {date} · {name}
      </span>
      <span style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', letterSpacing: '0.08em', color: V.viridianDark }}>
        {page} / {total}
      </span>
    </div>
  );
}

function PageHeader({ num, title, page, total }: { num: string; title: string; page: number; total: number }) {
  return (
    <div style={{
      padding: '10mm 20mm 0',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `1px solid ${V.midnightBorder}`,
      paddingBottom: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: FONT_ARCHIVO, fontSize: 28, fontWeight: 700, color: V.midnightHover, lineHeight: 1 }}>{num}</span>
        <span style={{ fontFamily: FONT_ARCHIVO, fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.textDim }}>{title}</span>
      </div>
      <span style={{ fontFamily: FONT_ARCHIVO, fontSize: 9, letterSpacing: '0.12em', color: V.midnightHover }}>{page} / {total}</span>
    </div>
  );
}

function SectionPill({ text }: { text: string }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      background: V.midnightHover,
      border: `1px solid ${V.midnightBorder}`,
      borderRadius: 20,
      padding: '5px 14px',
      alignSelf: 'flex-start',
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: V.viridian, flexShrink: 0 }} />
      <span style={{ fontFamily: FONT_ARCHIVO, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.textMuted }}>{text}</span>
    </div>
  );
}

function QuoteCard({ text, author }: { text: string; author: string }) {
  return (
    <div style={{
      borderLeft: `4px solid ${V.gold}`,
      background: V.midnightLight,
      borderRadius: '0 10px 10px 0',
      padding: '18px 20px',
      borderTop: `1px solid rgba(232,184,75,0.1)`,
      borderRight: `1px solid ${V.midnightBorder}`,
      borderBottom: `1px solid ${V.midnightBorder}`,
    }}>
      <p style={{ fontFamily: FONT_ARIMO, fontSize: 14, fontStyle: 'italic', lineHeight: 1.7, color: V.textSecondary, marginBottom: 10 }}>
        „{text}"
      </p>
      <span style={{ fontFamily: FONT_ARCHIVO, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.gold }}>
        — {author}
      </span>
    </div>
  );
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: FONT_ARIMO, fontSize: '13.5px', lineHeight: 1.75, color: V.textSecondary }}>
      {children}
    </div>
  );
}

function renderParagraphs(text: string) {
  return text.split('\n\n').map((p, i) => (
    <p key={i} style={{ marginBottom: 10 }}>{p}</p>
  ));
}

/* ═══════════════════════════════════════════════════════
   PAGE 1 — COVER
   ═══════════════════════════════════════════════════════ */
function CoverPage({ data }: { data: PdfData }) {
  return (
    <div className="pdf-page" style={{ ...pageStyle, height: '297mm' }}>
      <AccentBar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '0 20mm' }}>
        {/* Top row */}
        <div style={{ paddingTop: '14mm', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <span style={{ fontFamily: FONT_ARCHIVO, fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: V.viridian }}>
            Diagnostic Personalizat
          </span>
          <span style={{ fontFamily: FONT_ARIMO, fontSize: 10, color: V.textDim, textAlign: 'right' }}>
            {data.meta.submittedAt}
          </span>
        </div>

        {/* Recipient */}
        <div style={{ marginTop: '18mm' }}>
          <p style={{ fontFamily: FONT_ARIMO, fontSize: 11, color: V.textDim, marginBottom: 6 }}>Pregătit exclusiv pentru</p>
          <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 22, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: V.textPrimary }}>
            {data.contact.name}
          </p>
        </div>

        {/* Headline */}
        <div style={{ marginTop: 'auto', paddingTop: '12mm' }}>
          <p style={{ fontFamily: FONT_ARIMO, fontSize: 12, color: V.textMuted, marginBottom: 10, letterSpacing: '0.04em' }}>
            Arhitectură de Sisteme de Business
          </p>
          <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 52, fontWeight: 700, lineHeight: 1.0, color: V.textPrimary }}>
            Diagnosticul<br />
            Businessului<br />
            <span style={{ color: V.viridian }}>Tău.</span>
          </p>
        </div>

        {/* Rule */}
        <div style={{ marginTop: '10mm', height: 1, background: V.midnightBorder, width: '60%' }} />

        {/* Author */}
        <div style={{ marginTop: '8mm' }}>
          <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 13, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: V.textPrimary, marginBottom: 3 }}>
            Victor Morar
          </p>
          <p style={{ fontFamily: FONT_ARIMO, fontSize: 11, color: V.textMuted }}>
            Consultant · Arhitectură de Sisteme de Business · 18 ani experiență
          </p>
        </div>

        {/* Meta cards */}
        <div style={{ marginTop: '12mm', marginBottom: '12mm', display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: V.midnightCard, border: `1px solid ${V.midnightBorder}`, borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.viridian, marginBottom: 6 }}>
              Profil Dominant
            </p>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 16, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: V.textPrimary }}>
              {data.profile.primaryName}
            </p>
            <p style={{ fontFamily: FONT_ARIMO, fontSize: 10, color: V.textMuted, marginTop: 3 }}>
              Tipologia {data.profile.primary} — centralizare în exces
            </p>
          </div>
          <div style={{ flex: 1, background: V.midnightCard, border: `1px solid ${V.midnightBorder}`, borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.viridian, marginBottom: 6 }}>
              Punct Nevralgic Secundar
            </p>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 16, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: V.textPrimary }}>
              {data.profile.secondaryName}
            </p>
            <p style={{ fontFamily: FONT_ARIMO, fontSize: 10, color: V.textMuted, marginTop: 3 }}>
              Echipa nu funcționează fără tine
            </p>
          </div>
          <div style={{ flex: 1, background: V.midnightCard, border: `1px solid ${V.midnightBorder}`, borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.viridian, marginBottom: 6 }}>
              Durata Problemei
            </p>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 16, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: V.textPrimary }}>
              {data.pain.problemDuration ?? '—'}
            </p>
            <p style={{ fontFamily: FONT_ARIMO, fontSize: 10, color: V.textMuted, marginTop: 3 }}>
              Problema persistă de mult timp
            </p>
          </div>
        </div>
      </div>

      <PageFooter page={1} total={6} name={data.contact.name} date={data.meta.submittedAt} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE 2 — Arhitectura Businessului (Profil + Diagnostic)
   ═══════════════════════════════════════════════════════ */
function ProfilePage({ data }: { data: PdfData }) {
  return (
    <div className="pdf-page" style={pageStyle}>
      <AccentBar />
      <PageHeader num="01" title="Arhitectura Businessului Tău" page={2} total={6} />

      <div style={{ padding: '9mm 20mm', flex: 1, display: 'flex', flexDirection: 'column', gap: '7mm' }}>
        {/* Profile card */}
        <div style={{ background: V.midnightCard, border: `1px solid ${V.midnightBorder}`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{
            background: `linear-gradient(135deg, ${V.viridianDark} 0%, ${V.viridian} 100%)`,
            padding: '20px 24px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT_ARCHIVO, fontSize: 18, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {data.profile.primary}
            </div>
            <div>
              <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.65)', marginBottom: 3 }}>
                Profil Dominant
              </p>
              <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 24, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', color: '#FFFFFF', lineHeight: 1 }}>
                {data.profile.primaryName}
              </p>
            </div>
          </div>
          <div style={{ padding: '18px 24px 20px' }}>
            <p style={{ fontFamily: FONT_ARIMO, fontSize: 14, fontStyle: 'italic', color: V.viridianLight, marginBottom: 14, lineHeight: 1.5 }}>
              „{data.profile.primaryLabel}"
            </p>
            <div style={{ height: 1, background: V.midnightBorder, marginBottom: 14 }} />
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.viridian, marginBottom: 5 }}>
              Punct Nevralgic Secundar
            </p>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: V.textPrimary }}>
              {data.profile.secondaryName} — {data.profile.secondaryLabel}
            </p>
          </div>
        </div>

        {/* Section pill + body text */}
        <SectionPill text="De ce ai ajuns aici" />

        <BodyText>
          {renderParagraphs(data.generatedText.section3)}
        </BodyText>

        {/* Quote */}
        <QuoteCard
          text="Ceea ce nu se poate face fără tine, nu este o afacere. Este un job de lux pe care ți l-ai creat singur."
          author="Victor Morar"
        />
      </div>

      <PageFooter page={2} total={6} name={data.contact.name} date={data.meta.submittedAt} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE 3 — Radiografia Pierderilor
   ═══════════════════════════════════════════════════════ */
function NumbersPage({ data }: { data: PdfData }) {
  return (
    <div className="pdf-page" style={pageStyle}>
      <AccentBar />
      <PageHeader num="02" title="Radiografia Pierderilor" page={3} total={6} />

      <div style={{ padding: '9mm 20mm', flex: 1, display: 'flex', flexDirection: 'column', gap: '7mm' }}>
        {/* Number cards row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{
            flex: 1, borderLeft: `4px solid ${V.dangerSoft}`, background: 'rgba(255,107,107,0.04)',
            border: `1px solid ${V.midnightBorder}`, borderRadius: 10, padding: '18px 18px 16px',
          }}>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.dangerSoft, opacity: 0.7, marginBottom: 8 }}>
              Cost Real / An (estimat)
            </p>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 30, fontWeight: 700, color: '#FF8E8E', lineHeight: 1, marginBottom: 6 }}>
              {data.meta.annualCostEstimate}
            </p>
            <p style={{ fontFamily: FONT_ARIMO, fontSize: '10.5px', color: V.textDim, lineHeight: 1.4 }}>
              dacă problema nu este rezolvată din rădăcină
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            <div style={{ flex: 1, background: V.midnightCard, border: `1px solid ${V.midnightBorder}`, borderRadius: 10, padding: '18px 18px 16px' }}>
              <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.textDim, marginBottom: 8 }}>
                Durată problemă
              </p>
              <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 30, fontWeight: 700, color: V.textPrimary, lineHeight: 1, marginBottom: 6 }}>
                {data.pain.problemDuration ?? '—'}
              </p>
            </div>
            <div style={{ flex: 1, background: V.midnightCard, border: `1px solid ${V.midnightBorder}`, borderRadius: 10, padding: '18px 18px 16px' }}>
              <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.textDim, marginBottom: 8 }}>
                Cost lunar
              </p>
              <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 30, fontWeight: 700, color: V.textPrimary, lineHeight: 1, marginBottom: 6 }}>
                {data.pain.monthlyCost ?? '—'}
              </p>
            </div>
          </div>
        </div>

        {/* AI generated body text */}
        <BodyText>
          {renderParagraphs(data.generatedText.section4)}
        </BodyText>

        {/* Quote */}
        <QuoteCard
          text="Nu te uita la banii pierduți. Uită-te la momentele cu copiii tăi pe care nu le poți cumpăra înapoi cu niciun profit."
          author="Victor Morar"
        />

        {/* Tried solutions */}
        <SectionPill text="Încercări anterioare" />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
          {data.pain.triedSolutions.map((sol, i) => (
            <span key={i} style={{
              background: V.midnightHover,
              border: `1px solid ${V.midnightBorder}`,
              borderRadius: 20,
              padding: '5px 12px',
              fontFamily: FONT_ARIMO,
              fontSize: '11.5px',
              color: V.textMuted,
            }}>{sol}</span>
          ))}
        </div>

        {/* Result box */}
        <div style={{
          background: V.midnightCard,
          border: `1px solid ${V.midnightBorder}`,
          borderRadius: 10,
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.viridian, whiteSpace: 'nowrap', flexShrink: 0 }}>
            Rezultatul analizat
          </span>
          <div style={{ width: 1, height: 28, background: V.midnightBorder, flexShrink: 0 }} />
          <span style={{ fontFamily: FONT_ARCHIVO, fontSize: 14, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: V.textPrimary }}>
            {data.pain.solutionResult ?? '—'}
          </span>
        </div>
      </div>

      <PageFooter page={3} total={6} name={data.contact.name} date={data.meta.submittedAt} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE 4 — Impactul Real & Ce Urmează
   ═══════════════════════════════════════════════════════ */
function ImpactPage({ data }: { data: PdfData }) {
  return (
    <div className="pdf-page" style={pageStyle}>
      <AccentBar />
      <PageHeader num="03" title="Impactul Real & Ce Urmează" page={4} total={6} />

      <div style={{ padding: '9mm 20mm', flex: 1, display: 'flex', flexDirection: 'column', gap: '7mm' }}>
        {/* Personal impact */}
        <SectionPill text="Cum te afectează personal" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.emotional.personalImpact.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 12,
              padding: '12px 16px',
              background: V.midnightCard,
              border: `1px solid ${V.midnightBorder}`,
              borderRadius: 8,
            }}>
              <div style={{ width: 6, height: 6, borderRadius: 1, background: V.viridian, flexShrink: 0, marginTop: 5 }} />
              <span style={{ fontFamily: FONT_ARIMO, fontSize: 13, lineHeight: 1.55, color: V.textSecondary }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Quote */}
        <QuoteCard
          text="Am fost exact acolo. În 2023 am vrut să vând tot. Dar am înțeles: nu trebuie să renunț la afacere — trebuie să renunț la modul în care o conduceam."
          author="Victor Morar"
        />

        {/* AI text section 5 */}
        <BodyText>
          {renderParagraphs(data.generatedText.section5)}
        </BodyText>

        {/* Future consequences */}
        <SectionPill text="Dacă nu schimbi nimic în 6 luni" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {data.emotional.futureConsequences.map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 14px',
              background: 'rgba(255,107,107,0.04)',
              border: '1px solid rgba(255,107,107,0.1)',
              borderRadius: 8,
            }}>
              <span style={{ fontSize: 12, flexShrink: 0, marginTop: 1, color: V.dangerSoft }}>→</span>
              <span style={{ fontFamily: FONT_ARIMO, fontSize: '12.5px', lineHeight: 1.5, color: 'rgba(224,244,240,0.75)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <PageFooter page={4} total={6} name={data.contact.name} date={data.meta.submittedAt} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE 5 — Cum Arată 12 Luni de Acum + CTA
   ═══════════════════════════════════════════════════════ */
function VisionPage({ data }: { data: PdfData }) {
  return (
    <div className="pdf-page" style={pageStyle}>
      <AccentBar />
      <PageHeader num="04" title="Cum Arată 12 Luni de Acum" page={5} total={6} />

      <div style={{ padding: '9mm 20mm', flex: 1, display: 'flex', flexDirection: 'column', gap: '7mm' }}>
        {/* Vision card */}
        <div style={{
          background: 'linear-gradient(135deg, #0D2520 0%, #0F2B25 100%)',
          border: '1px solid rgba(10,150,120,0.2)',
          borderRadius: 12,
          padding: '22px 24px',
        }}>
          <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: V.viridian, marginBottom: 8 }}>
            Obiectivul tău declarat
          </p>
          <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 18, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: V.textPrimary, marginBottom: 10, lineHeight: 1.2 }}>
            {data.goals.mainGoal}
          </p>
          <p style={{ fontFamily: FONT_ARIMO, fontSize: 13, lineHeight: 1.7, color: V.viridianLight, opacity: 0.85 }}>
            Asta nu e un vis. Este un rezultat concret, măsurabil, care se obține prin arhitectura corectă a businessului tău — nu prin muncă mai multă.
          </p>
        </div>

        {/* Goal cards row */}
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, background: V.midnightCard, border: `1px solid ${V.midnightBorder}`, borderRadius: 10, padding: '16px 18px' }}>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.viridian, marginBottom: 7 }}>
              Țintă financiară
            </p>
            <p style={{ fontFamily: FONT_ARIMO, fontSize: 13, lineHeight: 1.55, color: V.textSecondary }}>
              {data.goals.revenueTarget} — fără să dublez și haosul din firmă.
            </p>
          </div>
          <div style={{ flex: 1, background: V.midnightCard, border: `1px solid ${V.midnightBorder}`, borderRadius: 10, padding: '16px 18px' }}>
            <p style={{ fontFamily: FONT_ARCHIVO, fontSize: '8.5px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: V.viridian, marginBottom: 7 }}>
              Ce se schimbă structural
            </p>
            <p style={{ fontFamily: FONT_ARIMO, fontSize: 13, lineHeight: 1.55, color: V.textSecondary }}>
              Un sistem care lucrează fără prezența ta fizică la fiecare decizie.
            </p>
          </div>
        </div>

        {/* AI text section 6 */}
        <BodyText>
          {renderParagraphs(data.generatedText.section6)}
        </BodyText>

        {/* Quote */}
        <QuoteCard
          text="Am condus 5 companii și am călătorit în 5 țări anul trecut. Nu am angajați geniali. Am SISTEM."
          author="Victor Morar"
        />
      </div>

      <PageFooter page={5} total={6} name={data.contact.name} date={data.meta.submittedAt} />
    </div>
  );
}

/* ─── Page 6: CTA ───────────────────────────────────── */
function CtaPage({ data }: { data: PdfData }) {
  return (
    <div className="pdf-page" style={pageStyle}>
      <AccentBar />
      <PageHeader num="05" title="Pasul Următor" page={6} total={6} />

      <div style={{ padding: '10mm 20mm 12mm', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '6mm' }}>
        {/* CTA box */}
        <div style={{
          background: `linear-gradient(135deg, ${V.viridianDark} 0%, ${V.viridian} 100%)`,
          borderRadius: 14,
          padding: '28px 30px 26px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 160, height: 160,
            borderRadius: '50%', background: 'rgba(255,255,255,0.04)',
          }} />
          <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 9, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
            Pasul următor
          </p>
          <p style={{ fontFamily: FONT_ARCHIVO, fontSize: 24, fontWeight: 700, lineHeight: 1.15, color: '#FFFFFF', marginBottom: 16 }}>
            Ești gata să construiești businessul<br />care lucrează fără tine?
          </p>
          <ul style={{ listStyle: 'none', marginBottom: 22, display: 'flex', flexDirection: 'column', gap: 9, padding: 0 }}>
            {[
              `Identificăm exact ce te blochează — în prima săptămână`,
              `Construim sistemul de delegare adaptat profilului tău (${data.profile.primaryName})`,
              `Îți recâștigi minimum 15 ore/săptămână în primele 60 de zile`,
              `Nu teorie — implementare pas cu pas, cu responsabilitate`,
            ].map((b, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontFamily: FONT_ARIMO, fontSize: 13, lineHeight: 1.55, color: 'rgba(255,255,255,0.9)' }}>
                <span style={{ color: V.viridianUltra, fontWeight: 700, flexShrink: 0, marginTop: 1, fontSize: 14 }}>✓</span>
                {b}
              </li>
            ))}
          </ul>
          <a
            href="https://morarvictor.com/inreg/utm-quiz"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: '#FFFFFF',
              color: V.viridianDark,
              fontFamily: FONT_ARCHIVO,
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              padding: '14px 32px',
              borderRadius: 7,
              textAlign: 'center',
              textDecoration: 'none',
            }}
          >
            Rezervă locul tău →
          </a>
          <p style={{ marginTop: 14, fontFamily: FONT_ARIMO, fontSize: 11, fontStyle: 'italic', color: 'rgba(255,255,255,0.5)' }}>
            Număr limitat de locuri. Lista se închide când programul începe.
          </p>
        </div>
      </div>

      <PageFooter page={6} total={6} name={data.contact.name} date={data.meta.submittedAt} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════ */
export function PdfDocument({ data }: { data: PdfData }) {
  return (
    <div id="pdf-content" style={{ background: V.midnight }}>
      <CoverPage data={data} />
      <ProfilePage data={data} />
      <NumbersPage data={data} />
      <ImpactPage data={data} />
      <VisionPage data={data} />
      <CtaPage data={data} />
    </div>
  );
}
