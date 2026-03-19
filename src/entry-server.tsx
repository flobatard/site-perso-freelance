import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Index from "./pages/Index";
import ProjectDetail from "./pages/ProjectDetail";
import CurriculumVitae from "./pages/CurriculumVitae";
import NotFound from "./pages/NotFound";
import "./i18n";

export { default as i18n } from "./i18n";

const SUPPORTED_LANGS = ["fr", "en"];

const normalizeLang = (l: string) =>
  SUPPORTED_LANGS.includes(l) ? l : l.startsWith("fr") ? "fr" : "en";

const RootRedirect = () => {
  const { i18n } = useTranslation();
  return <Navigate to={`/${normalizeLang(i18n.language)}`} replace />;
};

const LanguageRoute = () => {
  const { lang } = useParams<{ lang: string }>();
  const { i18n } = useTranslation();
  if (!lang || !SUPPORTED_LANGS.includes(lang)) {
    return <Navigate to={`/${normalizeLang(i18n.language)}`} replace />;
  }
  return <Outlet />;
};

export function render(url: string) {
  const queryClient = new QueryClient();
  return renderToString(
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <StaticRouter location={url}>
            <Routes>
              <Route path="/" element={<RootRedirect />} />
              <Route path="/:lang" element={<LanguageRoute />}>
                <Route index element={<Index />} />
                <Route path="curriculum_vitae" element={<CurriculumVitae />} />
                <Route path="projet/:id" element={<ProjectDetail />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </StaticRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
