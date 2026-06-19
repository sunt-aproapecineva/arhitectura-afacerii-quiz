import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Lenis from 'lenis';
import { MotionIcon } from 'motion-icons-react';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { ShimmerText } from '@/components/ui/shimmer-text';
import { TiltCard } from '@/components/ui/tilt-card';
import { Reveal, ScrubReveal, ScrollProgress } from '@/components/landing/scroll';
import 'motion-icons-react/style.css';

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700&family=Arimo:ital,wght@0,400..700&display=swap';

// ════════════════════════════════════════════════════════════════════════
// CONȚINUT — două straturi, separate intenționat pentru generarea per-user.
//   🟢 SLOT-URI  = ce umple AI-ul din datele quizului (per profil + per om)
//   ⬜ FIX       = partajat de toate profilurile, NU se generează niciodată
// La build-ul real: C = { ...userData, ...FIXED, ...PROFILES[profil] }
// Vezi HANDOFF-LANDING-B.md pentru schema + prompt + maparea quiz→slot.
// ════════════════════════════════════════════════════════════════════════

// 🟢 PER-USER — vine din quiz (formData.name). Aici un exemplu.
const SAMPLE_USER = { name: 'Andrei' };

// 🟢 PER-PROFIL — 3 variante. AI pleacă de la varianta profilului + datele lui.
// heroA se randează ca `${name}, ${heroA}`. heroAccent = cuvântul pe auriu.
const PROFILES: Record<string, {
  diagnostic: string; heroA: string; heroAccent: string; heroB: string;
  mirror: string; pains: { icon: string; t: string; b: string }[];
  proofLine: string; ps: string;
}> = {
  ZERO: {
    diagnostic: 'Începătorul de la Zero',
    heroA: 'nu-ți lipsește',
    heroAccent: 'informația.',
    heroB: 'Îți lipsește ordinea.',
    mirror: 'Te documentezi de un an. Salvezi idei. Și tot pe loc ești. Nu fiindcă ești leneș. Fiindcă nimeni nu ți-a dat ordinea.',
    pains: [
      { icon: 'Bookmark', t: 'Colecționezi, nu începi', b: 'Zeci de idei salvate. Niciuna pornită.' },
      { icon: 'BookOpen', t: 'Citești de luni', b: 'Multă teorie. Niciun pas făcut.' },
      { icon: 'HelpCircle', t: '„Se vinde sau mi se pare mie?"', b: 'Te învârți în cerc. Singur n-ai cum să afli.' },
      { icon: 'Hourglass', t: 'Aștepți să fii „gata"', b: 'Momentul perfect nu vine. Niciodată.' },
    ],
    proofLine: 'Testul tocmai ți-a spus unde ești blocat și de ce. N-a fost noroc. A fost structura. Aceeași structură care te-a citit acum îți pune ordinea la loc.',
    ps: 'Ai spus că vrei să nu mai depinzi de un salariu. Drumul ăla nu cere mai mult curaj. Cere o hartă. Uite-o.',
  },
  ANGAJAT: {
    diagnostic: 'Angajatul-Antreprenor',
    heroA: 'nu-ți lipsește',
    heroAccent: 'curajul.',
    heroB: 'Îți lipsește un plan care să nu-ți riște salariul.',
    mirror: 'Ai un salariu care-ți dă siguranță. Și exact el te ține pe loc. Aștepți momentul „sigur" ca să sari. Momentul ăla nu vine. Vine doar un plan.',
    pains: [
      { icon: 'Briefcase', t: 'Job de zi, idee de noapte', b: 'Te zbați între două lumi. Niciuna întreagă.' },
      { icon: 'Hourglass', t: 'Aștepți momentul „sigur"', b: 'Nu vine niciodată. Doar îți amână visul.' },
      { icon: 'Scale', t: '„Și dacă pierd tot?"', b: 'Ai ce pierde. De-asta nu te miști.' },
      { icon: 'Lock', t: 'Salariul te ține captiv', b: 'Confortabil. Și exact de-asta periculos.' },
    ],
    proofLine: 'Testul a văzut un om precaut, nu fricos, și din motive bune. Ai ceva de pierdut. De-aia ai nevoie de un plan care construiește în paralel, nu de un salt în gol.',
    ps: 'Ai spus că vrei al tău, dar fără să arunci în aer ce ai. Se poate. În ordine: întâi planul, apoi demisia. Niciodată invers.',
  },
  ARS: {
    diagnostic: 'Întemeietorul Ars',
    heroA: 'n-ai eșuat fiindcă',
    heroAccent: 'nu ești bun.',
    heroB: 'Ai construit în ordinea greșită.',
    mirror: 'Ai mai construit o dată. Ai pus bani, ai pus suflet, s-a închis. De-aici frica: „dacă se repetă?". Dar prima dată n-ai avut un sistem. Ai avut entuziasm. Nu-i același lucru.',
    pains: [
      { icon: 'Flame', t: 'Porți o rană reală', b: 'Ai pus bani și suflet. S-a închis. Doare.' },
      { icon: 'RotateCcw', t: '„Dacă se repetă?"', b: 'Frica firească după o cădere.' },
      { icon: 'Wrench', t: 'Ai improvizat, n-ai avut sistem', b: 'Entuziasm, nu metodă. De-aia s-a dus.' },
      { icon: 'Search', t: 'Nu știi exact DE CE a căzut', b: 'Fără răspunsul ăsta, repeți greșeala.' },
    ],
    proofLine: 'Testul a văzut un om care a plătit deja taxa de intrare în antreprenoriat. Întrebarea nu mai e dacă poți. E ce faci diferit a doua oară. Diferența e una singură: ordinea.',
    ps: 'Ai spus că vrei să reconstruiești. Dar nu la fel. De data asta cu harta în față, nu pe nisip. Experiența ta devine avantaj, dacă o pui într-un sistem.',
  },
};

// ⬜ FIX — partajat de toate profilurile (poze, mecanism, module, prețuri, FAQ).
const FIXED = {
  heroSub:
    'Un mini-curs care nu-ți promite primii bani. Îți arată cum arată o afacere reală și în ce ordine se ridică. Atât. Și asta schimbă tot.',
  cta: 'Vreau prima lecție — e gratis',
  trust: 'Prima lecție e gratis. Fără card. Te înregistrezi, vezi cu ochii tăi, apoi decizi.',
  victorRole: 'Antreprenor · arhitect de afaceri',
  victorBio:
    'Și Victor a pornit de la zero. Fără rețetă, fără cineva care să-i spună de unde se începe. A plătit ani de greșeli ca să afle ordinea. Tu o primești gata, în câteva ore.',
  victorMilestones: [
    { icon: 'Sprout', t: 'A pornit de la zero', b: '18 ani, făcea de toate cu mâna lui. A învățat greu, ca să te coste pe tine ușor.' },
    { icon: 'Store', t: 'A construit afaceri reale', b: 'Wine Time, o vinărie. Nu teorie. Afaceri care există.' },
    { icon: 'GraduationCap', t: 'Școală serioasă', b: 'Studii în UK, a trecut pe la Clifford Chance. Apoi a ales antreprenoriatul.' },
    { icon: 'Compass', t: 'Principii, nu noroc', b: '„Cei 1% nu iau decizii. Ei urmează principii."' },
  ],
  victorPhotos: [
    { src: '/victor/inceput.jpg', caption: '18 ani. De la zero.' },
    { src: '/victor/maurt.jpg', caption: 'Făcea de toate, cu mâna lui.' },
    { src: '/victor/winetime.jpg', caption: 'Apoi, afaceri adevărate.' },
    { src: '/victor/premier.jpg', caption: 'Lângă premierul Moldovei.', position: '78% 50%' },
  ],
  ptB: {
    headline: 'Libertatea pe care o vrei arată cam așa.',
    sub: 'Victor a pornit exact de unde ești tu. Aici a ajuns. Cu ordinea corectă, nu cu noroc.',
    photos: [
      { src: '/victor/pb-vinarie.jpg', caption: 'Afacerea lui. Merge și fără el.' },
      { src: '/victor/pb-vacanta.jpg', caption: 'Timp cu familia. Oriunde.' },
      { src: '/victor/pb-copii.jpg', caption: 'Prezent. Nu prins în telefon.' },
    ],
    close: 'Drumul de la „început de la zero" până aici are o ordine. Pe aia o iei azi.',
  },
  modules: [
    { n: '01', icon: 'Eye', t: 'Viziunea', b: 'Acum totul pare la fel de important, fiindcă nu vezi unde duce. Aici vezi capătul: o afacere care merge fără tine. Adică exact libertatea pe care o cauți.' },
    { n: '02', icon: 'Target', t: 'Ideea și piața', b: 'Te roade „se vinde, sau mi se pare mie?". Aici afli, fără să bagi un ban orbește, dacă ideea ta ține.' },
    { n: '03', icon: 'Tag', t: 'Oferta', b: 'De ce nu cumpără nimeni, chiar dacă produsul e bun. Înțelegi ce plătesc oamenii de fapt.' },
    { n: '04', icon: 'Megaphone', t: 'Vânzarea', b: 'Dacă te-a oprit „nu pot să vând, mi-e jenă", aici scapi de ea. Vânzarea ca să ajuți omul, nu ca să-l păcălești.' },
    { n: '05', icon: 'Map', t: 'Planul', b: 'Prima dată când vezi drumul întreg, nu frânturi prin telefon. Tot ce-ai adunat într-un an, pus în ordine.' },
  ],
  outcomes: [
    { icon: 'Map', t: 'Planul tău', b: 'Ideea ta, pusă în ordine, pe hârtie.' },
    { icon: 'Award', t: 'Certificatul de arhitect', b: 'Dovada că știi cum se ridică o afacere.', gold: true },
    { icon: 'Compass', t: 'Claritate, nu haos', b: 'Știi exact primul pas. Și de ce.' },
  ],
  steps: [
    { n: '1', t: 'Prima lecție, gratis', b: 'Te înregistrezi și intri. Vezi platforma, exercițiile, calitatea. Fără card.' },
    { n: '2', t: 'Îți place? Alegi planul', b: 'Continui cu 29€ sau 79€, de unde ai rămas.' },
    { n: '3', t: 'Pleci cu harta', b: 'Cele 5 module, Planul tău pe hârtie, certificatul.' },
  ],
  notList: [
    'Nu e schemă de îmbogățire rapidă.',
    'Nu te trimite să vinzi mâine pe stradă.',
    'Nu-ți promite clienți peste noapte.',
  ],
  faq: [
    { q: 'Chiar e gratis prima lecție?', a: 'Da. Te înregistrezi, intri în platformă și faci prima lecție fără să plătești nimic. Vezi exercițiile, calitatea, tot. Plătești doar dacă vrei mai departe.' },
    { q: 'Care e diferența între 29€ și 79€?', a: 'La 29€ faci totul singur, în ritmul tău. La 79€ primești în plus o consultație 1:1: un expert cu peste 10 ani în afaceri îți citește exercițiile și îți dă un plan de acțiuni pe situația ta.' },
    { q: 'N-am încă o idee clară. E pentru mine?', a: 'Da. Nu trebuie să vii cu ideea gata. Modulul 2 te ajută să o găsești și să vezi dacă ține.' },
    { q: 'E doar teorie?', a: 'Nu. La fiecare modul lucrezi: un exercițiu, un test, și completezi o bucată din Planul tău. Pleci cu el făcut.' },
    { q: 'De ce nu-mi promiteți primii bani?', a: 'Fiindcă ar fi o minciună. Un curs video îți dă claritate, nu clienți. Clienții cer execuție și pe cineva lângă tine. Aia vine după.' },
  ],
  priceReassure: 'Începi fără card. Plătești doar dacă, după prima lecție, vrei mai departe.',
  tiers: [
    {
      name: 'Singur', price: '29€', tagline: 'În ritmul tău.', highlight: false,
      features: ['Acces complet la platformă', 'Cele 5 module video', 'Toate exercițiile practice', 'Planul tău + certificatul'],
      cta: 'Vreau acces',
    },
    {
      name: 'Cu expert', price: '79€', tagline: 'Cineva se uită peste umărul tău.', highlight: true,
      features: ['Tot ce primești la „Singur"', 'O consultație 1:1 cu un expert (peste 10 ani în afaceri)', 'Îți analizează exercițiile, una câte una', 'Pleci cu un plan de acțiuni făcut pe tine'],
      cta: 'Vreau și consultația',
    },
  ],
};

function Section({ id, children, className = '' }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative w-full px-5 ${className}`}>
      <div className="max-w-4xl mx-auto">{children}</div>
    </section>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <ShimmerText className="lp-display uppercase tracking-[0.28em] text-[11px] mb-4 block">
      {children}
    </ShimmerText>
  );
}

// Foto Victor: imagine reală dacă are src; altfel placeholder elegant.
function Photo({ src, label, caption, position = 'center', className = '' }: { src?: string; label: string; caption?: string; position?: string; className?: string }) {
  return (
    <div className={`lp-photo relative rounded-2xl overflow-hidden border border-white/10 ${className}`} data-photo-slot>
      {src ? (
        <>
          <img src={src} alt={label} loading="lazy" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: position }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          {caption && (
            <span className="absolute bottom-3 left-3 right-3 text-[12px] text-white/90 font-arimo leading-tight drop-shadow">
              {caption}
            </span>
          )}
        </>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <div className="flex flex-col items-center gap-2 text-[var(--viridian-light)]/45 px-4 text-center">
            <MotionIcon name="Image" animation="none" trigger="always" size={26} color="currentColor" />
            <span className="text-[10px] uppercase tracking-[0.18em] leading-tight">{label}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function CtaButton({ label, big = false }: { label: string; big?: boolean }) {
  return (
    <button className={`lp-btn lp-display uppercase tracking-wider ${big ? 'text-xl px-12 py-5' : 'text-lg px-9 py-4'}`}>
      <span className="relative z-10 flex items-center gap-2">
        {label}
        <MotionIcon name="ArrowRight" animation="nudge" trigger="hover" size={big ? 22 : 20} color="#fff" />
      </span>
    </button>
  );
}

export default function LandingB() {
  // Profil din URL (?profil=ANGAJAT|ARS), default ZERO. În build-ul real
  // vine din quiz. C = userData ⊕ FIX ⊕ slot-urile profilului → toate C.x merg.
  const profileKey = (typeof window !== 'undefined'
    ? new URLSearchParams(window.location.search).get('profil')
    : '')?.toUpperCase() || 'ZERO';
  const C = { ...SAMPLE_USER, ...FIXED, ...(PROFILES[profileKey] ?? PROFILES.ZERO) };

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('nolenis')) return;
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);

  return (
    <>
      <Helmet>
        <title>Planul tău · Arhitectura Afacerii</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
      </Helmet>

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --midnight: #0B1319; --midnight-2: #0E1A22;
          --viridian-main: #0A9678; --viridian-dark: #055C4A;
          --viridian-light: #73D4BE; --viridian-ultra: #E0F4F0;
          --gold: #E8B25A;
          --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
          --glass-bg: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018));
        }
        html, body { background: var(--midnight); }
        html.lenis, html.lenis body { height: auto; }
        .lenis.lenis-smooth { scroll-behavior: auto !important; }
        .lenis.lenis-stopped { overflow: hidden; }
        .lp-root {
          background: var(--midnight); color: var(--viridian-ultra);
          font-family: 'Arimo', sans-serif; -webkit-font-smoothing: antialiased; overflow-x: hidden;
        }
        .lp-root h1, .lp-root h2, .lp-root h3, .lp-display { font-family: 'Archivo Narrow', sans-serif; }
        .lp-atmo {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(60% 40% at 50% -5%, rgba(10,150,120,0.18), transparent 70%),
            radial-gradient(50% 40% at 92% 25%, rgba(115,212,190,0.06), transparent 70%),
            radial-gradient(45% 35% at 5% 75%, rgba(232,178,90,0.06), transparent 70%);
        }
        .lp-grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 1; opacity: 0.04; mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .lp-glass {
          background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.10);
          box-shadow: 0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 60px -28px rgba(0,0,0,0.85);
          backdrop-filter: blur(10px);
        }
        .lp-card { transition: transform .3s var(--ease-enter), border-color .3s var(--ease-enter); }
        .lp-card:hover { transform: translateY(-3px); border-color: rgba(115,212,190,0.35); }
        .lp-photo { background: linear-gradient(135deg, rgba(115,212,190,0.07), rgba(232,178,90,0.04)); }
        .lp-hero-grad {
          background: linear-gradient(176deg, #ffffff 0%, var(--viridian-ultra) 52%, rgba(115,212,190,0.9) 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .lp-gold-grad {
          background: linear-gradient(176deg, #fff5e4 0%, var(--gold) 60%, #c98a2e 100%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
        .lp-btn {
          position: relative; display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
          background: linear-gradient(180deg, var(--viridian-main), var(--viridian-dark));
          color: #fff; border-radius: 1rem; overflow: hidden;
          box-shadow: 0 10px 40px -12px rgba(10,150,120,0.6);
          transition: transform .24s var(--ease-enter), filter .24s var(--ease-enter);
        }
        .lp-btn:hover { transform: translateY(-2px); filter: brightness(1.07); }
        .lp-btn::after {
          content: ''; position: absolute; top: 0; left: -75%; width: 50%; height: 100%;
          background: linear-gradient(120deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-20deg); transition: left .6s var(--ease-enter);
        }
        .lp-btn:hover::after { left: 160%; }
        details.lp-faq { border-bottom: 1px solid rgba(255,255,255,0.09); }
        details.lp-faq summary { list-style: none; cursor: pointer; }
        details.lp-faq summary::-webkit-details-marker { display: none; }
        details.lp-faq .lp-faq-ico { transition: transform .25s var(--ease-enter); }
        details.lp-faq[open] .lp-faq-ico { transform: rotate(180deg); }
        @media (prefers-reduced-motion: reduce) { .lp-btn::after { display: none; } }
      ` }} />

      <div className="lp-root relative min-h-screen w-full">
        <div className="lp-atmo" />
        <div className="lp-grain" />
        <ScrollProgress />

        <main className="relative z-10">

          {/* ── HERO ── */}
          <Section className="pt-24 md:pt-28 pb-16 text-center min-h-[90vh] flex flex-col justify-center">
            <div className="flex items-center justify-center gap-3 mb-7">
              <span className="h-px w-8 bg-gradient-to-r from-transparent to-[var(--viridian-main)]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--viridian-main)] shadow-[0_0_12px_var(--viridian-main)]" />
              <span className="h-px w-8 bg-gradient-to-l from-transparent to-[var(--viridian-main)]" />
            </div>
            <ShimmerText className="lp-display uppercase tracking-[0.32em] text-[11px] mb-7 block">
              Diagnosticul tău · {C.diagnostic}
            </ShimmerText>

            <h1 className="lp-display text-4xl md:text-6xl uppercase tracking-tight leading-[1.04] mb-6">
              <BlurReveal as="span" wordClassName="lp-hero-grad" className="block" stagger={0.06} duration={0.6}>{`${C.name}, ${C.heroA}`}</BlurReveal>
              <BlurReveal as="span" wordClassName="lp-gold-grad" className="block" delay={0.35} stagger={0.06} duration={0.6}>{C.heroAccent}</BlurReveal>
              <BlurReveal as="span" wordClassName="lp-hero-grad" className="block" delay={0.6} stagger={0.06} duration={0.6}>{C.heroB}</BlurReveal>
            </h1>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-[900ms] fill-mode-both">
              <p className="text-[var(--viridian-ultra)]/80 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">{C.heroSub}</p>
            </div>
            <div className="mt-9 animate-in fade-in zoom-in-95 duration-700 delay-[1050ms] fill-mode-both">
              <CtaButton label={C.cta} />
              <p className="text-[13px] text-[var(--viridian-light)]/55 mt-4">{C.trust}</p>
            </div>

            <div className="mt-14 flex flex-col items-center gap-2 text-[var(--viridian-light)]/40">
              <span className="text-[11px] uppercase tracking-[0.3em]">Derulează</span>
              <MotionIcon name="ChevronDown" animation="bounce" trigger="always" size={18} color="currentColor" />
            </div>
          </Section>

          {/* ── OGLINDA (scrub) + carduri „te recunoști?" ── */}
          <Section className="py-24 md:py-28">
            <div className="text-center mb-12">
              <ShimmerText className="lp-display uppercase tracking-[0.28em] text-[11px] mb-7 block">Unde ești acum</ShimmerText>
              <ScrubReveal text={C.mirror} className="lp-display text-2xl md:text-[2.1rem] leading-[1.5] text-white max-w-2xl mx-auto" />
            </div>
            <Reveal className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {C.pains.map((p) => (
                <div key={p.t} className="lp-glass lp-card rounded-2xl p-5 flex items-start gap-4">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-white/[0.04] border border-white/10 shrink-0">
                    <MotionIcon name={p.icon} animation="pop" trigger="hover" size={20} color="var(--viridian-light)" />
                  </span>
                  <div>
                    <h3 className="lp-display text-lg uppercase tracking-wide text-white mb-1">{p.t}</h3>
                    <p className="text-[14px] text-[var(--viridian-ultra)]/70 leading-snug">{p.b}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </Section>

          {/* ── MECANISM: ordinea corectă ── */}
          <Section className="py-20">
            <Reveal>
              <Kicker>De ce ești blocat</Kicker>
              <h2 className="lp-display text-3xl md:text-5xl uppercase tracking-tight leading-tight mb-6 text-white">
                Majoritatea încep cu <span className="lp-gold-grad">acoperișul.</span>
              </h2>
              <p className="text-[var(--viridian-ultra)]/80 text-lg leading-relaxed mb-10 max-w-2xl">
                Logo, nume, site, postări. Pe urmă se miră că nu vine nimeni. O afacere se ridică invers. Întâi fundația: cine plătește, pentru ce, în ce ordine. <span className="text-white">Asta îți arată FUNDAȚIA. Harta, nu încă o listă de sfaturi.</span>
              </p>
            </Reveal>

            <Reveal delay={0.1} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="lp-glass rounded-2xl p-6">
                <p className="text-[12px] uppercase tracking-[0.2em] text-red-300/70 mb-4">Cum încep cei mai mulți</p>
                {['Acoperiș (logo, site)', 'Pereți?', 'Fundație?'].map((t, i) => (
                  <div key={t} className={`rounded-lg px-4 py-3 mb-2 text-sm border ${i === 0 ? 'border-red-400/30 bg-red-500/5 text-white' : 'border-white/8 bg-white/[0.02] text-white/35 border-dashed'}`}>{t}</div>
                ))}
                <p className="text-[13px] text-white/40 mt-3 italic">Casă fără fundație. Se clatină la primul vânt.</p>
              </div>
              <div className="lp-glass rounded-2xl p-6 border-[var(--viridian-main)]/25">
                <p className="text-[12px] uppercase tracking-[0.2em] text-[var(--viridian-light)]/80 mb-4">Ordinea corectă</p>
                {[
                  { t: 'Fundație (cine plătește, pentru ce)', strong: true },
                  { t: 'Pereți (ofertă, vânzare)', strong: false },
                  { t: 'Acoperiș (brand, marketing)', strong: false },
                ].map((r, i) => (
                  <div key={r.t} className={`rounded-lg px-4 py-3 mb-2 text-sm border ${r.strong ? 'border-[var(--viridian-main)]/40 bg-[var(--viridian-main)]/10 text-white shadow-[0_0_24px_-10px_var(--viridian-main)]' : 'border-white/10 bg-white/[0.03] text-white/75'}`}>{i + 1}. {r.t}</div>
                ))}
                <p className="text-[13px] text-[var(--viridian-light)]/70 mt-3 italic">Se ridică în ordine. Ține.</p>
              </div>
            </Reveal>

            <Reveal delay={0.15} className="mt-8">
              <div className="lp-glass rounded-2xl p-6 border-l-2 border-l-[var(--gold)] flex items-start gap-4">
                <MotionIcon name="Fingerprint" animation="none" trigger="always" size={22} color="var(--gold)" />
                <p className="text-[var(--viridian-ultra)]/90 text-[15px] leading-relaxed">{C.proofLine}</p>
              </div>
            </Reveal>
          </Section>

          {/* ── VICTOR — cine te ghidează ── */}
          <Section className="py-24">
            <Reveal className="text-center mb-10">
              <Kicker>Cine te ghidează</Kicker>
              <h2 className="lp-display text-3xl md:text-5xl uppercase tracking-tight leading-tight text-white">Victor Morar</h2>
              <p className="text-[var(--viridian-light)]/70 text-sm uppercase tracking-[0.2em] mt-2">{C.victorRole}</p>
            </Reveal>

            <Reveal delay={0.08} className="grid grid-cols-1 md:grid-cols-5 gap-5 items-stretch">
              <Photo src="/victor/portret.jpg" label="Victor Morar" className="md:col-span-2 min-h-[320px]" />
              <div className="md:col-span-3 flex flex-col gap-4">
                <p className="text-[var(--viridian-ultra)]/85 text-lg leading-relaxed">{C.victorBio}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {C.victorMilestones.map((m) => (
                    <div key={m.t} className="lp-glass lp-card rounded-xl p-4 flex items-start gap-3">
                      <MotionIcon name={m.icon} animation="pop" trigger="hover" size={20} color="var(--viridian-light)" />
                      <div>
                        <h3 className="lp-display text-[15px] uppercase tracking-wide text-white mb-0.5">{m.t}</h3>
                        <p className="text-[13px] text-[var(--viridian-ultra)]/65 leading-snug">{m.b}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.12} className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
              {C.victorPhotos.map((p) => (
                <Photo key={p.src} src={p.src} label={p.caption} caption={p.caption} position={(p as { position?: string }).position} className="aspect-[4/5]" />
              ))}
            </Reveal>
          </Section>

          {/* ── PROMISIUNEA (Victor quote) ── */}
          <Section className="py-16">
            <Reveal>
              <TiltCard tiltLimit={4} className="lp-glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden max-w-3xl mx-auto">
                <div className="absolute -right-6 -top-10 text-[10rem] leading-none text-white/[0.04] font-serif select-none">”</div>
                <p className="lp-display text-2xl md:text-[2rem] leading-[1.4] text-white relative z-10">
                  „Nu-ți promit că în câteva zile faci primii bani. Îți promit că n-o să mai construiești pe orbește. Restul îl construim împreună.”
                </p>
                <div className="flex items-center justify-center gap-2.5 mt-7 relative z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--viridian-main)] shadow-[0_0_10px_var(--viridian-main)]" />
                  <span className="lp-display uppercase tracking-[0.28em] text-sm text-[var(--viridian-light)]">Victor Morar</span>
                </div>
              </TiltCard>
            </Reveal>
          </Section>

          {/* ── PUNCTUL B — viitorul pe care îl vrea ── */}
          <Section className="py-20">
            <Reveal className="text-center mb-10">
              <Kicker>Punctul B</Kicker>
              <h2 className="lp-display text-3xl md:text-5xl uppercase tracking-tight leading-tight text-white">
                {C.ptB.headline}
              </h2>
              <p className="text-[var(--viridian-ultra)]/75 text-lg mt-4 max-w-xl mx-auto">{C.ptB.sub}</p>
            </Reveal>
            <Reveal delay={0.08} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {C.ptB.photos.map((p) => (
                <Photo key={p.src} src={p.src} label={p.caption} caption={p.caption} className="aspect-[3/4]" />
              ))}
            </Reveal>
            <Reveal delay={0.12} className="mt-8 text-center">
              <p className="text-[var(--viridian-ultra)]/85 text-lg max-w-xl mx-auto">{C.ptB.close}</p>
            </Reveal>
          </Section>

          {/* ── MODULE ── */}
          <Section className="py-20">
            <Reveal className="text-center mb-12">
              <Kicker>Ce construiești înăuntru</Kicker>
              <h2 className="lp-display text-3xl md:text-5xl uppercase tracking-tight leading-tight text-white">
                5 module. La final, haosul din capul tău <span className="lp-hero-grad">devine o pagină.</span>
              </h2>
            </Reveal>
            <div className="flex flex-col gap-4">
              {C.modules.map((m, i) => (
                <Reveal key={m.n} delay={i * 0.05}>
                  <div className="lp-glass lp-card rounded-2xl p-6 flex gap-5 items-start">
                    <div className="shrink-0 flex flex-col items-center gap-3">
                      <span className="lp-display text-2xl lp-gold-grad font-bold tabular-nums">{m.n}</span>
                      <span className="grid place-items-center w-11 h-11 rounded-xl bg-[var(--viridian-main)]/12 border border-[var(--viridian-main)]/25">
                        <MotionIcon name={m.icon} animation="pop" trigger="hover" size={20} color="var(--viridian-light)" />
                      </span>
                    </div>
                    <div>
                      <h3 className="lp-display text-xl uppercase tracking-wide text-white mb-2">{m.t}</h3>
                      <p className="text-[15px] text-[var(--viridian-ultra)]/75 leading-relaxed">{m.b}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Section>

          {/* ── PLECI CU (outcomes grid) ── */}
          <Section className="py-20">
            <Reveal className="text-center mb-10">
              <Kicker>Cu ce pleci</Kicker>
              <h2 className="lp-display text-3xl md:text-4xl uppercase tracking-tight text-white">Nu cu mai multă informație. Cu o hartă.</h2>
            </Reveal>
            <Reveal delay={0.08} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {C.outcomes.map((o) => (
                <TiltCard key={o.t} tiltLimit={5} spotlightColor={o.gold ? 'rgba(232,178,90,0.16)' : 'rgba(115,212,190,0.16)'} className={`lp-glass rounded-2xl p-7 text-center ${o.gold ? 'border-[var(--gold)]/25' : ''}`}>
                  <span className={`grid place-items-center w-14 h-14 rounded-2xl mx-auto mb-4 border ${o.gold ? 'bg-[var(--gold)]/12 border-[var(--gold)]/30' : 'bg-[var(--viridian-main)]/12 border-[var(--viridian-main)]/25'}`}>
                    <MotionIcon name={o.icon} animation="pop" trigger="hover" size={24} color={o.gold ? 'var(--gold)' : 'var(--viridian-light)'} />
                  </span>
                  <h3 className={`lp-display text-lg uppercase tracking-wide mb-2 ${o.gold ? 'lp-gold-grad' : 'text-white'}`}>{o.t}</h3>
                  <p className="text-[14px] text-[var(--viridian-ultra)]/70 leading-snug">{o.b}</p>
                </TiltCard>
              ))}
            </Reveal>
          </Section>

          {/* ── CUM FUNCȚIONEAZĂ ── */}
          <Section className="py-16">
            <Reveal className="text-center mb-10"><Kicker>Cum funcționează</Kicker></Reveal>
            <Reveal delay={0.06} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {C.steps.map((s) => (
                <div key={s.n} className="lp-glass lp-card rounded-2xl p-6 text-center">
                  <span className="lp-display text-5xl lp-hero-grad font-bold block mb-3">{s.n}</span>
                  <h3 className="lp-display text-lg uppercase tracking-wide text-white mb-2">{s.t}</h3>
                  <p className="text-[14px] text-[var(--viridian-ultra)]/70 leading-snug">{s.b}</p>
                </div>
              ))}
            </Reveal>
          </Section>

          {/* ── CE NU E ── */}
          <Section className="py-16">
            <Reveal>
              <div className="lp-glass rounded-3xl p-8 md:p-10">
                <h2 className="lp-display text-2xl md:text-3xl uppercase tracking-tight text-white mb-6">Ca să fim cinstiți de la început</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {C.notList.map((t) => (
                    <div key={t} className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.02] p-4">
                      <MotionIcon name="X" animation="none" trigger="always" size={18} color="#ef9a9a" />
                      <span className="text-[var(--viridian-ultra)]/80 text-[14px] leading-snug">{t}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[var(--viridian-ultra)]/80 text-lg leading-relaxed">
                  Alea cer mentor, comunitate, cineva care să-ți ceară socoteală. Alea vin după. Asta e <span className="text-white">harta.</span> Fără ea, ce vine după n-are sens.
                </p>
              </div>
            </Reveal>
          </Section>

          {/* ── FAQ ── */}
          <Section className="py-16">
            <Reveal className="text-center mb-8"><Kicker>Întrebări firești</Kicker></Reveal>
            <Reveal delay={0.06} className="lp-glass rounded-3xl p-3 md:p-5">
              {C.faq.map((f) => (
                <details key={f.q} className="lp-faq group px-3 md:px-4">
                  <summary className="flex items-center justify-between gap-4 py-5">
                    <span className="lp-display text-[17px] md:text-lg uppercase tracking-wide text-white">{f.q}</span>
                    <MotionIcon name="ChevronDown" animation="none" trigger="always" size={20} color="var(--viridian-light)" className="lp-faq-ico shrink-0" />
                  </summary>
                  <p className="text-[15px] text-[var(--viridian-ultra)]/75 leading-relaxed pb-5 -mt-1 max-w-2xl">{f.a}</p>
                </details>
              ))}
            </Reveal>
          </Section>

          {/* ── PREȚ — prima lecție gratis + 2 planuri ── */}
          <Section className="py-20">
            <Reveal className="text-center mb-12">
              <Kicker>Prețuri</Kicker>
              <h2 className="lp-display text-3xl md:text-5xl uppercase tracking-tight text-white">
                Prima lecție e <span className="lp-gold-grad">gratis.</span> Pe urmă, tu alegi.
              </h2>
              <p className="text-[var(--viridian-ultra)]/70 text-base mt-4 max-w-xl mx-auto">{C.priceReassure}</p>
            </Reveal>

            <Reveal delay={0.08} className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto items-stretch">
              {C.tiers.map((t) => (
                <TiltCard
                  key={t.name}
                  tiltLimit={4}
                  spotlightColor={t.highlight ? 'rgba(232,178,90,0.16)' : 'rgba(115,212,190,0.16)'}
                  className={`lp-glass rounded-3xl p-7 md:p-8 flex flex-col relative ${t.highlight ? 'border-[var(--gold)]/35' : ''}`}
                >
                  {t.highlight && (
                    <span className="absolute top-4 right-4 z-30 lp-display uppercase tracking-wider text-[10px] px-2.5 py-1 rounded-full bg-[var(--gold)] text-[#3a2a08] font-bold whitespace-nowrap">
                      Recomandat
                    </span>
                  )}
                  <p className="lp-display uppercase tracking-[0.2em] text-[12px] text-[var(--viridian-light)]/70 mb-1">{t.name}</p>
                  <p className="text-[14px] text-[var(--viridian-ultra)]/65 mb-4">{t.tagline}</p>
                  <div className="flex items-end gap-1.5 mb-6">
                    <span className={`lp-display text-5xl font-bold leading-none ${t.highlight ? 'lp-gold-grad' : 'lp-hero-grad'}`}>{t.price}</span>
                    <span className="text-[13px] text-[var(--viridian-light)]/50 mb-1">o singură dată</span>
                  </div>
                  <ul className="flex flex-col gap-3 mb-7 flex-1">
                    {t.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[15px] text-[var(--viridian-ultra)]/80 leading-snug">
                        <MotionIcon name="Check" animation="none" trigger="always" size={18} color={t.highlight ? 'var(--gold)' : 'var(--viridian-light)'} className="mt-0.5 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="lp-btn lp-display uppercase tracking-wider text-base px-6 py-3.5 w-full">
                    <span className="relative z-10 flex items-center gap-2 justify-center">
                      {t.cta}
                      <MotionIcon name="ArrowRight" animation="nudge" trigger="hover" size={18} color="#fff" />
                    </span>
                  </button>
                </TiltCard>
              ))}
            </Reveal>

            <Reveal delay={0.12} className="mt-8 text-center">
              <div className="inline-flex items-center gap-2.5 lp-glass rounded-full px-5 py-2.5">
                <MotionIcon name="Gift" animation="none" trigger="always" size={18} color="var(--gold)" />
                <span className="text-[14px] text-[var(--viridian-ultra)]/75">Nu te decizi acum. <span className="text-white">Începe cu prima lecție, gratis.</span></span>
              </div>
            </Reveal>
          </Section>

          {/* ── CTA FINAL + PS ── */}
          <Section className="pt-10 pb-32 text-center">
            <Reveal>
              <h2 className="lp-display text-4xl md:text-6xl uppercase tracking-tight leading-[1.05] text-white mb-8">
                Oprește colecționatul.<br /><span className="lp-hero-grad">Începe ordinea.</span>
              </h2>
              <CtaButton label={C.cta} big />
            </Reveal>

            <Reveal delay={0.12} className="mt-14">
              <div className="lp-glass rounded-2xl p-6 max-w-xl mx-auto text-left border-l-2 border-l-[var(--gold)]">
                <p className="text-[var(--viridian-ultra)]/85 leading-relaxed">
                  <span className="lp-display uppercase tracking-wider text-[var(--gold)] text-sm">P.S. </span>{C.ps}
                </p>
              </div>
            </Reveal>
          </Section>

        </main>
      </div>
    </>
  );
}
