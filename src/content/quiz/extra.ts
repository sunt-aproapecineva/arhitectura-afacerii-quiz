import type { Question } from "@/lib/quiz/types";

export const Q_INVEST_VARIANTS: Record<string, Question> = {
  BEG: {
    id: "Q_INVEST",
    phase: "Q_INVEST",
    text: "Cât de mult investești în dezvoltarea ta profesională?",
    options: [
      { code: "nothing", text: "Nu am investit încă în cursuri sau mentorat online", microValidation: "" },
      { code: "self_learn", text: "Citesc cărți de marketing & business, ascult podcasturi", microValidation: "" },
      { code: "courses_no_result", text: "Am fost la câteva cursuri, dar nu am văzut mare rezultat", microValidation: "" },
      { code: "want_complex", text: "Vreau un ghid clar care să mă ajute să transform expertiza în venituri online", microValidation: "" },
      { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
    ],
  },
  EXP: {
    id: "Q_INVEST",
    phase: "Q_INVEST",
    text: "Cât de mult investești în dezvoltarea ta profesională?",
    options: [
      { code: "self_learn", text: "Investesc în auto-educație (cărți, podcasturi, conținut gratuit)", microValidation: "" },
      { code: "courses_some", text: "Am investit în cursuri și mentorate, am avut și rezultate", microValidation: "" },
      { code: "courses_no_result", text: "Am investit în cursuri, dar nu am aplicat suficient sau rezultatele au fost sub așteptări", microValidation: "" },
      { code: "want_scale", text: "Caut un sistem complet care să mă ajute să scalez, nu doar informație", microValidation: "" },
      { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
    ],
  },
  NEW: {
    id: "Q_INVEST",
    phase: "Q_INVEST",
    text: "Ai investit vreodată în educația ta online?",
    options: [
      { code: "nothing", text: "Nu — e prima dată când iau în considerare ceva de acest gen", microValidation: "" },
      { code: "self_learn", text: "Am consumat conținut gratuit (YouTube, podcasturi, articole)", microValidation: "" },
      { code: "courses_no_result", text: "Am plătit pentru un curs, dar nu am finalizat sau aplicat", microValidation: "" },
      { code: "want_start", text: "Sunt pregătită să investesc în ceva care chiar funcționează", microValidation: "" },
      { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
    ],
  },
};

export const Q_FOLLOW: Question = {
  id: "Q_FOLLOW",
  phase: "Q_FOLLOW",
  text: "De cât timp mă urmărești pe Instagram?",
  options: [
    { code: "no_follow", text: "Nu te urmăresc", microValidation: "" },
    { code: "days", text: "De câteva zile", microValidation: "" },
    { code: "months", text: "Câteva luni", microValidation: "" },
    { code: "almost_year", text: "Te urmăresc de aproape un an", microValidation: "" },
    { code: "year_plus", text: "1 an +", microValidation: "" },
    { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
  ],
};

export const Q_SOURCE: Question = {
  id: "Q_SOURCE",
  phase: "Q_SOURCE",
  text: "De unde ai aflat de mine?",
  options: [
    { code: "reels", text: "Din reels", microValidation: "" },
    { code: "friend", text: "De la o prietenă", microValidation: "" },
    { code: "ad", text: "Din reclamă", microValidation: "" },
    { code: "tiktok", text: "Din TikTok", microValidation: "" },
    { code: "threads", text: "Din Threads", microValidation: "" },
    { code: "influencer", text: "De la un influencer", microValidation: "" },
    { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
  ],
};

export const Q_GOAL_VARIANTS: Record<string, Question> = {
  BEG: {
    id: "Q_GOAL",
    phase: "Q_GOAL",
    text: "Care ar fi rezultatul pe care ai vrea să îl obții în următoarele luni?",
    options: [
      { code: "first_client", text: "Primul client online plătitor", microValidation: "" },
      { code: "500", text: "Primii 500€ din produse/servicii digitale", microValidation: "" },
      { code: "1000", text: "1.000€ lunar din produse digitale", microValidation: "" },
      { code: "2000_5000", text: "2.000 – 5.000€ lunar", microValidation: "" },
      { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
    ],
  },
  EXP: {
    id: "Q_GOAL",
    phase: "Q_GOAL",
    text: "Care ar fi rezultatul pe care ai vrea să îl obții în următoarele luni?",
    options: [
      { code: "2000_5000", text: "2.000 – 5.000€ lunar constant", microValidation: "" },
      { code: "5000_10000", text: "5.000 – 10.000€ lunar", microValidation: "" },
      { code: "x2_x3", text: "Să dublez/triplez cifra actuală", microValidation: "" },
      { code: "10000_plus", text: "10.000€+ lunar", microValidation: "" },
      { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
    ],
  },
  NEW: {
    id: "Q_GOAL",
    phase: "Q_GOAL",
    text: "Care ar fi rezultatul pe care ai vrea să îl obții în următoarele luni?",
    options: [
      { code: "learn", text: "Să înțeleg cum funcționează o profesie online și de unde să încep", microValidation: "" },
      { code: "300", text: "Primii 300€ din online — orice sumă ar fi un pas imens", microValidation: "" },
      { code: "500", text: "500€ lunar din online", microValidation: "" },
      { code: "1000", text: "1.000€+ lunar", microValidation: "" },
      { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
    ],
  },
};

export const Q_EARN: Question = {
  id: "Q_EARN",
  phase: "Q_EARN",
  text: "Cât câștigi la moment? (rămâne confidențial)",
  options: [
    { code: "under_500", text: "Până la 500 de euro", microValidation: "" },
    { code: "500_1500", text: "500 – 1.500 euro lunar", microValidation: "" },
    { code: "2000", text: "2.000 de euro lunar", microValidation: "" },
    { code: "3000_plus", text: "3.000+ euro", microValidation: "" },
    { code: "5000_plus", text: "Peste 5.000 de euro", microValidation: "" },
    { code: "other", text: "Alt răspuns...", microValidation: "", isOther: true },
  ],
};
