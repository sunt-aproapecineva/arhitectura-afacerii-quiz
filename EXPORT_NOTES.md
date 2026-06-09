# Quiz Export

Exported from the Lovable project. Contains:
- Quiz UI: `src/components/quiz/`, `src/pages/Quiz.tsx`
- PDF: `src/components/pdf/`, `src/pages/PdfPreview.tsx`, `src/lib/quiz/pdf-types.ts`
- Quiz logic: `src/lib/quiz/` (state machine, classification, results, submission, temperature, types)
- Content: `src/content/quiz/`, `src/content/knowledge-base/`
- Admin: `src/components/admin/`
- Backend: `supabase/functions/submit-quiz/`, `supabase/functions/generate-pdf-text/`, `supabase/migrations/`
- Briefings: `BRIEFING_*.html`
- Data dump: `data/quiz_submissions.{csv,json}` (50 rows)

## Setup
```
bun install
bun run dev
```
Add a `.env` with `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`, `VITE_SUPABASE_PROJECT_ID` from your own Supabase project, then run the migrations in `supabase/migrations/` and deploy the edge functions.
