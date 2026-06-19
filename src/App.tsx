import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "./pages/Home.tsx";
import Quiz from "./pages/Quiz.tsx";
import LandingB from "./pages/LandingB.tsx";
import PdfPreview from "./pages/PdfPreview.tsx";
// NOTE: ./pages/ArhitecturaAfacerii.tsx nu există în repo (import suspendat care strica build-ul).
// Landing-ul "Arhitectura Afacerii" trăiește în alt proiect. Reactivează ruta când pagina e adăugată.
// import ArhitecturaAfacerii from "./pages/ArhitecturaAfacerii.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/draft-b" element={<LandingB />} />
          <Route path="/admin/pdf" element={<PdfPreview />} />
          {/* <Route path="/arhitectura-afacerii" element={<ArhitecturaAfacerii />} /> */}
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
