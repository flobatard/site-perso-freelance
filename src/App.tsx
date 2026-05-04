import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import OfferingDetail from "./pages/OfferingDetail";
import CurriculumVitae from "./pages/CurriculumVitae";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import LegalNotice from "./pages/LegalNotice";
import NotFound from "./pages/NotFound";
import { ThemeProvider } from "./hooks/use-theme";
import CookieBanner from "./components/CookieBanner";

const queryClient = new QueryClient();

const SUPPORTED_LANGS = ["fr", "en"];

const normalizeLang = (lang: string) =>
  SUPPORTED_LANGS.includes(lang) ? lang : lang.startsWith("fr") ? "fr" : "en";

const RootRedirect = () => {
  const { i18n } = useTranslation();
  return <Navigate to={`/${normalizeLang(i18n.language)}`} replace />;
};

const LanguageRoute = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (lang && SUPPORTED_LANGS.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to={`/${normalizeLang(i18n.language)}`} replace />;
  }

  return <Outlet />;
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/:lang" element={<LanguageRoute />}>
              <Route index element={<Index />} />
              <Route path="curriculum_vitae" element={<CurriculumVitae />} />
              <Route path="projet/:id" element={<ProjectDetail />} />
              <Route path="offering/:id" element={<OfferingDetail />} />
              <Route path="confidentialite" element={<PrivacyPolicy />} />
              <Route path="mentions-legales" element={<LegalNotice />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <CookieBanner />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
