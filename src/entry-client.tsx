import { hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";
import i18n from "./i18n";

// Pré-initialise la langue depuis le préfixe URL pour éviter le flash de traduction
const pathLang = window.location.pathname.split("/")[1];
if (pathLang === "fr" || pathLang === "en") {
  i18n.changeLanguage(pathLang);
}

hydrateRoot(document.getElementById("root")!, <App />);
