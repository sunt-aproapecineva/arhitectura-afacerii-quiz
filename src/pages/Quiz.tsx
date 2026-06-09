import { QuizShell } from '@/components/quiz/QuizShell';
import { Helmet } from 'react-helmet-async';

export default function QuizPage() {
  return (
    <>
      <Helmet>
        <title>Diagnosticul afacerii tale · Victor Morar</title>
        <meta name="description" content="Quiz de 5 minute care îți arată exact ce e construit greșit în afacerea ta. Primești gratuit un PDF personalizat cu pașii de reparație." />
        <link rel="canonical" href="https://live.morarvictor.com/quiz" />
        <meta property="og:title" content="Diagnosticul afacerii tale · Victor Morar" />
        <meta property="og:description" content="În 5 minute știi exact ce e construit greșit în afacerea ta." />
        <meta property="og:url" content="https://live.morarvictor.com/quiz" />
        <meta property="og:type" content="website" />
      </Helmet>
      <style dangerouslySetInnerHTML={{__html: `
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
        
        h1, h2, h3, h4, .font-archivo {
          font-family: 'Archivo Narrow', sans-serif;
          text-transform: uppercase;
        }
        
        .progress-fill {
          background: linear-gradient(90deg, var(--viridian-dark) 0%, var(--viridian-main) 100%);
        }
      `}} />
      <main className="min-h-screen w-full bg-[var(--midnight)] text-[var(--viridian-ultra)] flex flex-col items-center antialiased">
        <QuizShell />
      </main>
    </>
  );
}
