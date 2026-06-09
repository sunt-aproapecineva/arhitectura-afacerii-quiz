import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const options = [
  {
    tier: "primary",
    eyebrow: "Lecție video · 20 min",
    title: "De ce peste hotare e mai bine — și ce poți face la tine, fără să pleci nicăieri",
    description:
      "După 18 ani de antreprenoriat și 5 companii conduse, îți explic în 20 de minute diferența reală dintre Moldova și Dubai, dintre Nokia și Apple. Răspunsul nu e ce crezi - și îți schimbă viziunea despre cum funcționează lumea și ce poți face cu firma și viața ta, chiar de mâine.",
    cta: "Privește lecția gratuit",
    href: "https://youtu.be/51PfrKd2qJc",
  },
  {
    tier: "secondary",
    eyebrow: "Diagnostic personalizat · 5 min",
    title: "Diagnosticul afacerii tale — în 5 minute știi exact ce e construit greșit",
    description:
      "Majoritatea afacerilor cresc greu pentru că au fost construite în ordinea greșită — peretele înainte de fundație. În 5 minute vezi exact unde s-a inversat ordinea la tine. Primești gratuit un PDF personalizat: ce e important, ce trebuie reparat, ce trebuie reconstruit.",
    cta: "Începe diagnosticul",
    href: "https://live.morarvictor.com/quiz",
  },
  {
    tier: "tertiary",
    eyebrow: "Lecție video · SUPER UTILĂ",
    title: "Cum se construiește o afacere care merge și fără tine — metoda în 6 etape",
    description:
      "Dacă firma ta se oprește când lipsești, nu ai o afacere — ai un loc de muncă prost plătit și fără concediu. Îți arăt cele 6 etape prin care o afacere haotică devine sistematizată. Aceleași pe care le-am aplicat pe Bacio di Bole, Aurelius Wine, Maurt și alte firme cu peste 250 de angajați cumulat.",
    cta: "Vezi metoda pas cu pas",
    href: "https://youtu.be/jJKNehzeX1M",
  },
  {
    tier: "quaternary",
    eyebrow: "Acces prioritar",
    title: "Lista de așteptare — pentru antreprenorii care vor să fie primii",
    description:
      "Lucrez cu un număr limitat de antreprenori și cei de pe listă primesc: acces la canalul meu privat de business, prioritate la următoarele servicii, mentorate și consultații individuale, plus diagnosticul personalizat gratuit. Durează doar 30 de secunde și este absolut gratuit. Lista doar îi filtrează pe cei care vor libertatea și afacere sistematizată și pe cei cărora încă pur și simplu nu le arde.",
    cta: "Înregistrează-te pe listă",
    href: "http://morarvictor.com/inreg",
  },
] as const;

export default function HomePage() {
  useEffect(() => {
    document.title = "Victor Morar — Hai să sistematizăm afacerea ta";
  }, []);

  return (
    <>
      <Helmet>
        <title>Victor Morar · Antreprenor & Mentor</title>
        <meta name="description" content="Victor Morar — antreprenor cu 18 ani de experiență și mentor pentru afaceri. Hai să lucrăm. Hai să sistematizăm afacerea ta în 6 etape." />
        <link rel="canonical" href="https://live.morarvictor.com/" />
        <meta property="og:title" content="Victor Morar · Antreprenor & Mentor" />
        <meta property="og:description" content="Hai să lucrăm. Hai să sistematizăm afacerea ta." />
        <meta property="og:url" content="https://live.morarvictor.com/" />
        <meta property="og:type" content="website" />
      </Helmet>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Narrow:ital,wght@0,400..700&family=Arimo:ital,wght@0,400..700&display=swap');

        :root {
          --midnight: #0B1319;
          --midnight-light: #162430;
          --midnight-lighter: #203546;
          --viridian-main: #0A9678;
          --viridian-dark: #055C4A;
          --viridian-light: #73D4BE;
          --viridian-ultra: #E0F4F0;
          --silent-space: #F8FAFC;
        }

        body {
          background-color: var(--midnight);
          color: var(--viridian-ultra);
          font-family: 'Arimo', sans-serif;
        }

        .home-h1, .home-h2, .home-h3, .home-eyebrow, .home-cta {
          font-family: 'Archivo Narrow', sans-serif;
          text-transform: uppercase;
        }
      `,
        }}
      />
      <main className="min-h-screen w-full bg-[var(--midnight)] text-[var(--viridian-ultra)] antialiased">
        <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8 sm:py-16 md:py-20">
          {/* Intro */}
          <header className="mb-12 sm:mb-16 text-center">
            <h1 className="home-h1 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-5">
              Victor Morar · Antreprenor & Mentor
            </h1>
            <p className="home-eyebrow text-xs sm:text-sm tracking-[0.3em] text-[var(--viridian-light)] mb-4">
              Hai să lucrăm. Hai să sistematizăm.
            </p>
            <p className="text-base sm:text-lg text-[var(--viridian-ultra)]/80 max-w-2xl mx-auto leading-relaxed">
              Patru drumuri către aceeași destinație: o afacere care funcționează fără să te epuizeze. Alege de unde
              începi — sau parcurge-le pe toate, în ordinea de mai jos.
            </p>
          </header>

          {/* Cards */}
          <div className="space-y-6 sm:space-y-8">
            {options.map((opt, idx) => {
              const isPrimary = opt.tier === "primary";
              const isSecondary = opt.tier === "secondary";
              const isQuaternary = opt.tier === "quaternary";

              return (
                <article
                  key={opt.href}
                  className={[
                    "rounded-2xl border transition-all",
                    isPrimary
                      ? "p-7 sm:p-10 md:p-12 border-[var(--viridian-main)]/40 bg-gradient-to-br from-[var(--midnight-light)] to-[var(--midnight-lighter)] shadow-[0_20px_60px_-20px_rgba(10,150,120,0.45)]"
                      : isSecondary
                        ? "p-6 sm:p-8 md:p-10 border-[var(--viridian-main)]/30 bg-[var(--midnight-light)]"
                        : isQuaternary
                          ? "p-5 sm:p-6 md:p-7 border-[var(--viridian-ultra)]/10 bg-[var(--midnight-light)]/60"
                          : "p-6 sm:p-7 md:p-8 border-[var(--viridian-ultra)]/15 bg-[var(--midnight-light)]/80",
                  ].join(" ")}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="home-eyebrow text-[10px] sm:text-xs tracking-[0.25em] text-[var(--viridian-light)]">
                      {String(idx + 1).padStart(2, "0")} · {opt.eyebrow}
                    </span>
                  </div>

                  <h2
                    className={[
                      "home-h2 font-bold leading-tight mb-4",
                      isPrimary
                        ? "text-2xl sm:text-3xl md:text-4xl"
                        : isSecondary
                          ? "text-xl sm:text-2xl md:text-3xl"
                          : isQuaternary
                            ? "text-lg sm:text-xl md:text-2xl"
                            : "text-xl sm:text-2xl",
                    ].join(" ")}
                  >
                    {opt.title}
                  </h2>

                  <p
                    className={[
                      "text-[var(--viridian-ultra)]/85 leading-relaxed mb-6",
                      isPrimary ? "text-base sm:text-lg" : "text-sm sm:text-base",
                    ].join(" ")}
                  >
                    {opt.description}
                  </p>

                  <a
                    href={opt.href}
                    target={
                      opt.href.startsWith("http") && !opt.href.includes("live.morarvictor.com") ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                    className={[
                      "home-cta inline-flex items-center justify-center gap-2 rounded-lg font-bold tracking-wider transition-all",
                      isPrimary
                        ? "px-7 py-4 text-base sm:text-lg bg-[var(--viridian-main)] text-white hover:bg-[var(--viridian-dark)] shadow-lg shadow-[var(--viridian-main)]/30"
                        : isSecondary
                          ? "px-6 py-3.5 text-sm sm:text-base bg-[var(--viridian-main)] text-white hover:bg-[var(--viridian-dark)]"
                          : isQuaternary
                            ? "px-5 py-3 text-sm border border-[var(--viridian-light)]/40 text-[var(--viridian-light)] hover:bg-[var(--viridian-light)]/10"
                            : "px-6 py-3 text-sm sm:text-base border-2 border-[var(--viridian-main)] text-[var(--viridian-light)] hover:bg-[var(--viridian-main)] hover:text-white",
                    ].join(" ")}
                  >
                    {opt.cta} →
                  </a>
                </article>
              );
            })}
          </div>

          <footer className="mt-16 text-center text-xs text-[var(--viridian-ultra)]/40">
            © {new Date().getFullYear()} Victor Morar
          </footer>
        </div>
      </main>
    </>
  );
}
