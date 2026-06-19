import { QuizShell } from '@/components/quiz/QuizShell';
import { Helmet } from 'react-helmet-async';
import 'motion-icons-react/style.css';

const FONTS_URL = 'https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700&family=Arimo:ital,wght@0,400..700&display=swap';

export default function QuizPage() {
  return (
    <>
      <Helmet>
        <title>Diagnosticul afacerii tale · Victor Morar</title>
        <meta name="description" content="Quiz de câteva minute care îți arată exact ce e construit greșit în afacerea ta. Primești scorul tău și un plan personalizat." />
        <link rel="canonical" href="https://live.morarvictor.com/quiz" />
        <meta property="og:title" content="Diagnosticul afacerii tale · Victor Morar" />
        <meta property="og:description" content="În câteva minute știi exact ce e construit greșit în afacerea ta." />
        <meta property="og:url" content="https://live.morarvictor.com/quiz" />
        <meta property="og:type" content="website" />
        {/* Preload fonturi — fără FOUT pe 3G (era @import în <style>, blocant) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS_URL} />
      </Helmet>
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --midnight: #0B1319;
          --midnight-light: #162430;
          --midnight-lighter: #203546;
          --viridian-main: #0A9678;
          --viridian-dark: #055C4A;
          --viridian-light: #73D4BE;
          --viridian-ultra: #E0F4F0;
          --silent-space: #F8FAFC;

          /* tokens premium — derivate din aceeași paletă */
          --glass-bg: linear-gradient(180deg, rgba(255,255,255,0.055), rgba(255,255,255,0.018));
          --glass-border: rgba(255,255,255,0.10);
          --glass-shadow: 0 1px 0 0 rgba(255,255,255,0.06) inset, 0 24px 60px -28px rgba(0,0,0,0.8);
          --radius-card: 18px;

          /* sistem de mișcare „onoare calmă" — o singură sursă de adevăr */
          --dur-instant: 90ms;
          --dur-fast: 160ms;
          --dur-base: 240ms;
          --dur-gentle: 360ms;
          --dur-slow: 560ms;
          --dur-grand: 900ms;
          --ease-enter: cubic-bezier(0.16, 1, 0.3, 1);
          --ease-exit: cubic-bezier(0.55, 0, 1, 0.45);
          --ease-move: cubic-bezier(0.2, 0.7, 0.3, 1);
          --ease-inout: cubic-bezier(0.65, 0, 0.35, 1);
        }

        body {
          background-color: var(--midnight);
          color: var(--viridian-ultra);
          font-family: 'Arimo', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }

        /* Atmosferă — glow-uri ambientale + vignette (fixe, niciodată animate) */
        body::before {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(70% 48% at 50% -8%, rgba(10,150,120,0.18), transparent 72%),
            radial-gradient(55% 45% at 100% 102%, rgba(5,92,74,0.22), transparent 70%),
            radial-gradient(48% 38% at -5% 75%, rgba(115,212,190,0.07), transparent 72%),
            radial-gradient(125% 120% at 50% 50%, transparent 58%, rgba(0,0,0,0.45) 100%);
        }
        body::after {
          content: '';
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        h1, h2, h3, h4, .font-archivo {
          font-family: 'Archivo Narrow', sans-serif;
          text-transform: uppercase;
        }

        ::selection { background: rgba(10,150,120,0.38); color: #fff; }

        *::-webkit-scrollbar { width: 10px; height: 10px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--viridian-dark), rgba(10,150,120,0.5));
          border-radius: 999px; border: 2px solid var(--midnight);
        }
        *::-webkit-scrollbar-thumb:hover { background: var(--viridian-main); }

        /* ── Glass card premium ── */
        .glass {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          box-shadow: var(--glass-shadow);
          -webkit-backdrop-filter: blur(16px) saturate(1.1);
          backdrop-filter: blur(16px) saturate(1.1);
          border-radius: var(--radius-card);
        }

        /* ── Buton premium cu sheen ── */
        .btn-premium {
          position: relative; overflow: hidden; isolation: isolate;
          background: linear-gradient(180deg, var(--viridian-main), var(--viridian-dark));
          box-shadow: 0 1px 0 rgba(255,255,255,0.28) inset, 0 12px 30px -12px rgba(10,150,120,0.6), 0 2px 10px rgba(0,0,0,0.45);
          transition: transform var(--dur-base) var(--ease-move), filter var(--dur-base) var(--ease-move);
        }
        .btn-premium:hover { transform: translateY(-2px); filter: brightness(1.06); }
        .btn-premium:active { transform: translateY(0) scale(.99); }
        .btn-premium:disabled { opacity: .35; transform: none; filter: none; cursor: not-allowed; }
        .btn-premium::after {
          content: ''; position: absolute; top: 0; left: -160%; width: 55%; height: 100%; z-index: -1;
          background: linear-gradient(110deg, transparent, rgba(255,255,255,0.28), transparent);
          transform: skewX(-22deg); transition: left .65s ease;
        }
        .btn-premium:hover::after { left: 160%; }

        /* ── Opțiune de răspuns ──
           Glow-ul de selecție stă pe ::after (pre-randat) și se animă DOAR opacity — GPU, nu repaint. */
        .answer-option {
          position: relative;
          background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015));
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 16px;
          transition: transform var(--dur-fast) var(--ease-move), border-color var(--dur-fast) var(--ease-move), background var(--dur-fast) var(--ease-move), opacity var(--dur-base) var(--ease-inout);
        }
        .answer-option::after {
          content: ''; position: absolute; inset: -1px; border-radius: 16px; pointer-events: none;
          box-shadow: 0 0 0 1px var(--viridian-main), 0 0 28px -6px rgba(10,150,120,0.55);
          opacity: 0; transition: opacity var(--dur-fast) var(--ease-move);
        }
        .answer-option:hover {
          transform: translateY(-2px);
          border-color: rgba(10,150,120,0.55);
          background: linear-gradient(180deg, rgba(10,150,120,0.12), rgba(255,255,255,0.02));
        }
        .answer-option:active { transform: scale(.985); }
        .answer-option[data-selected="true"] {
          border-color: var(--viridian-main);
          background: linear-gradient(180deg, rgba(10,150,120,0.24), rgba(10,150,120,0.06));
        }
        .answer-option[data-selected="true"]::after { opacity: 1; }

        /* În timpul dwell-ului de auto-advance: fraţii se sting și se blochează;
           răspunsul ales rămâne plin și APĂSABIL — al doilea tap avansează imediat. */
        [data-locked="true"] .answer-option:not([data-selected="true"]) { opacity: .4; pointer-events: none; }
        [data-locked="true"] .answer-option[data-selected="true"]:hover { transform: none; }

        /* ── Progres segmentat pe capitole ── */
        .seg-track { display: flex; gap: 6px; flex: 1; }
        .seg {
          position: relative; flex: 1; height: 4px; border-radius: 999px;
          background: rgba(255,255,255,0.055); overflow: hidden;
        }
        .seg-fill {
          position: absolute; inset: 0; border-radius: 999px;
          background: linear-gradient(90deg, var(--viridian-dark), var(--viridian-main) 55%, var(--viridian-light));
          transform-origin: left; transform: scaleX(0);
          transition: transform .4s var(--ease-enter);
        }
        .seg[data-done="true"] { box-shadow: 0 0 8px rgba(10,150,120,0.45); }
        .seg-sheen {
          position: absolute; top: 0; bottom: 0; width: 40%; opacity: 0; pointer-events: none;
          background: linear-gradient(110deg, transparent, rgba(255,255,255,0.5), transparent);
          transform: translateX(-110%);
        }
        .seg[data-just="true"] .seg-sheen { animation: segSheen .7s var(--ease-inout) 1 both; }
        @keyframes segSheen { from { transform: translateX(-110%); opacity: 1; } to { transform: translateX(260%); opacity: 1; } }

        /* ── Reveal interstițial: subliniere care se „desenează" ── */
        .reveal-underline {
          display: block; height: 2px; background: linear-gradient(90deg, var(--viridian-main), var(--viridian-light));
          transform: scaleX(0); transform-origin: left; border-radius: 999px;
          animation: drawLine .42s var(--ease-enter) forwards;
        }
        @keyframes drawLine { to { transform: scaleX(1); } }

        /* ── Reveal cuvânt-cu-cuvânt (BlurReveal) — pur CSS, robust la montare ── */
        .blur-word {
          display: inline-block;
          opacity: 0;
          will-change: opacity, filter, transform;
          animation: blurWord var(--blur-dur, .55s) var(--ease-enter) both;
        }
        @keyframes blurWord {
          from { opacity: 0; filter: blur(10px); transform: translateY(8px); }
          to   { opacity: 1; filter: blur(0);    transform: translateY(0); }
        }

        /* ── Checklist final: bifa se desenează din traseu ── */
        .check-draw { stroke-dasharray: 16; stroke-dashoffset: 16; animation: checkDraw .22s var(--ease-enter) forwards; }
        @keyframes checkDraw { to { stroke-dashoffset: 0; } }

        /* ── Celebrare rezultat: o singură expirație de lumină ── */
        .pulse-ring {
          position: absolute; inset: 0; border-radius: 9999px; pointer-events: none;
          border: 2px solid rgba(115,212,190,0.5); opacity: 0;
        }
        .pulse-ring[data-go="true"] { animation: ringExhale .9s cubic-bezier(0.22,0.61,0.36,1) 1 both; }
        @keyframes ringExhale { 0% { transform: scale(.92); opacity: .55; } 100% { transform: scale(1.22); opacity: 0; } }
        .pulse-glow {
          position: absolute; inset: -22px; border-radius: 9999px; pointer-events: none;
          background: radial-gradient(closest-side, rgba(10,150,120,0.7), transparent 70%);
          opacity: 0; transition: opacity .9s var(--ease-inout);
        }
        .pulse-glow[data-go="true"] { opacity: .25; }
        .score-nod[data-go="true"] { animation: scoreNod .5s var(--ease-inout) 1; }
        @keyframes scoreNod { 0% { transform: scale(1); } 45% { transform: scale(1.05); } 100% { transform: scale(1); } }

        /* ── Titlu hero cu degrade subtil ── */
        .hero-text {
          background: linear-gradient(176deg, #ffffff 0%, var(--viridian-ultra) 55%, rgba(115,212,190,0.85) 100%);
          -webkit-background-clip: text; background-clip: text;
          color: transparent;
        }

        /* Respectă reduce-motion: aceleași informații, același ritm, fără mișcare. */
        @media (prefers-reduced-motion: reduce) {
          .btn-premium::after, .seg-sheen, .pulse-ring, .score-nod[data-go="true"] { animation: none !important; transition: none !important; }
          .reveal-underline { animation: none; transform: scaleX(1); }
          .blur-word { animation: none; opacity: 1; filter: none; transform: none; }
          .check-draw { animation: none; stroke-dashoffset: 0; }
          .seg-fill { transition: none; }
          .answer-option, .btn-premium { transition: none; }
        }
      `}} />
      <main className="relative z-10 min-h-screen w-full text-[var(--viridian-ultra)] flex flex-col items-center antialiased">
        <QuizShell />
      </main>
    </>
  );
}
