export interface PdfData {
  contact: {
    name: string;
    email: string;
    instagram: string;
    phone: string;
  };
  profile: {
    primary: string;
    primaryLabel: string;
    primaryName: string;
    primaryEmoji: string;
    secondary: string;
    secondaryLabel: string;
    secondaryName: string;
  };
  business: {
    employeeCount: string | null;
    currentRevenue: string | null;
    entrepreneurialEducation: string[];
    socialMediaTime: string | null;
    identityQuote: string | null;
  };
  pain: {
    monthlyCost: string | null;
    problemDuration: string | null;
    triedSolutions: string[];
    solutionResult: string | null;
    weeklySymptoms?: string[];
    whyNowPriority?: string | null;
  };
  emotional: {
    personalImpact: string[];
    emotionalState: string | null;
    futureConsequences: string[];
  };
  goals: {
    mainGoal: string | null;
    revenueTarget: string | null;
  };
  meta: {
    submittedAt: string;
    annualCostEstimate: string;
  };
  generatedText: {
    section3: string;
    section4: string;
    section5: string;
    section6: string;
  };
}

export const TEST_PDF_DATA: PdfData = {
  contact: {
    name: "Andrei Ionescu",
    email: "andrei@firma.ro",
    instagram: "@andrei_ionescu",
    phone: "+40 722 000 000",
  },
  profile: {
    primary: "D",
    primaryLabel: "Faci tu totul, că altfel iese prost.",
    primaryName: "DELEGARE",
    primaryEmoji: "⚙️",
    secondary: "R",
    secondaryLabel: "Nu găsești oameni buni.",
    secondaryName: "RECRUTARE",
  },
  business: {
    employeeCount: "5–15 angajați",
    currentRevenue: "20.000–50.000€/lună",
    entrepreneurialEducation: ["Am lucrat cu un mentor sau consultant"],
    socialMediaTime: "30–60 minute pe zi",
    identityQuote: "Lucrează inteligent, nu mult.",
  },
  pain: {
    monthlyCost: "1.000–5.000€",
    problemDuration: "1–3 ani",
    triedSolutions: [
      "Am încercat să deleg — tot eu am refăcut",
      "Am angajat un manager — nu a funcționat",
    ],
    solutionResult: "Puțin — a ajutat temporar",
    weeklySymptoms: [
      "Am refăcut eu muncă pe care o delegasem",
      "Am anulat ceva personal din cauza unui incendiu la firmă",
    ],
    whyNowPriority: "M-am săturat — e de prea mult timp",
  },
  emotional: {
    personalImpact: [
      "Vin târziu acasă, nu am timp de familie",
      "Copiii mei cresc și eu nu sunt prezent",
    ],
    emotionalState: "Sunt epuizat și nu mai am energie",
    futureConsequences: [
      "Voi continua să pierd bani și energie la fel",
      "O să ajung la burnout. Sunt aproape",
    ],
  },
  goals: {
    mainGoal: "Să am timp liber — sport, familie, vacanțe fără telefon",
    revenueTarget: "Să dublez cifra actuală",
  },
  meta: {
    submittedAt: "26.03.2026",
    annualCostEstimate: "12.000 – 60.000€",
  },
  generatedText: {
    section3: "Andrei, ce s-a întâmplat nu e complicat de explicat. Ai construit o firmă în care TU ești singurul nod care leagă totul. Nu pentru că ești un om care nu poate da drumul — ci pentru că nimeni nu ți-a arătat cum să construiești sistemul care face asta posibil. Ai delegat sarcini. Ai delegat taskuri. Dar n-ai delegat niciodată responsabilitate, instrucțiuni clare și autoritate. Și fără astea trei împreună, delegarea nu funcționează — nici dacă angajezi cel mai bun om din piață.\n\nAi încercat să dai treaba altora și ai văzut că iese prost. Ai angajat un manager și tot tu ai rămas cu deciziile. Concluzia naturală a oricărui om rațional în situația ta a fost: mai bine fac eu. Și ai avut dreptate — în contextul în care nu exista sistem. Problema nu e că ai refăcut tu muncă. Problema e că sistemul era construit în așa fel încât altceva nu era posibil.\n\nNu e vina ta că ai ajuns aici. E consecința logică a unui business construit fără arhitectură.",
    section4: "Andrei, hai să punem cifrele pe masă. Dacă problema te costă 1.000–5.000€ pe lună — și asta de 1–3 ani — vorbim de o sumă semnificativă ieșită fără să rezolvi nimic. Și asta e doar ce poți cuantifica.\n\nCe nu apare în niciun tabel: copiii care cresc fără tine de față, serile în care ajungi acasă după ce ei dorm, energia pe care o lași în firmă și n-o mai ai pentru altceva.\n\nCostul real nu e financiar. E că trăiești o viață pe care nu ai ales-o — și o faci în fiecare zi.",
    section5: "Andrei, ești epuizat — ai spus-o direct. Dacă nu schimbi nimic în 6 luni, nu o să apară brusc un angajat care rezolvă problema singur. Vei continua să refaci muncă delegată și să anulezi lucruri personale din cauza incendiilor din firmă.\n\nCifra pe care vrei să o dublezi nu se poate dubla dacă tu ești singurul care poate lua decizii. Nu pentru că nu ai capacitatea — ci pentru că nu există suficiente ore într-o zi.\n\nBurnout-ul nu vine dintr-odată. Vine exact așa — câte un incendiu pe zi, câte o seară pierdută pe săptămână.",
    section6: "Andrei, imaginează-ți o zi de luni în care te trezești, îți bei cafeaua și nu deschizi telefonul cu groaza că s-a întâmplat ceva. Ai oameni care știu exact ce au de făcut, cum să decidă și cui să raporteze. Nu pentru că ai găsit angajații perfecți — ci pentru că ai construit un sistem în care oamenii normali livrează rezultate predictibile.\n\nConcret: iei cina cu familia în fiecare seară. Pleci în vacanță și te întorci la o firmă care a funcționat fără tine. Faci sport — nu pentru că ai timp liber, ci pentru că nu mai ești ostaticul propriei tale afaceri.\n\nCifra dublată nu înseamnă că lucrezi de două ori mai mult. Înseamnă o structură care crește fără să depindă de prezența ta zilnică. Am construit asta în 5 companii cu 250 de angajați. Știu exact cum arată drumul.",
  },
};
