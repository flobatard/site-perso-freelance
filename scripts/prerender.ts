import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");
const template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");

const { render, i18n } = await import(
  path.join(distPath, "server/entry-server.js")
);

const projectIds = [
  "beta_order_capture",
  "volley_team_optimizer",
  "guillaume_galland",
];
const langs = ["fr", "en"];

const routes = [
  ...langs.map((l) => `/${l}`),
  ...langs.map((l) => `/${l}/curriculum_vitae`),
  ...langs.flatMap((l) => projectIds.map((id) => `/${l}/projet/${id}`)),
];

for (const route of routes) {
  const lang = route.split("/")[1];
  await i18n.changeLanguage(lang);

  const appHtml = render(route);
  const html = template.replace("<!--ssr-outlet-->", appHtml);

  const filePath = path.join(distPath, route, "index.html");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`✓ ${route}`);
}

// Nettoyer le bundle SSR (ne doit pas être servi par nginx)
fs.rmSync(path.join(distPath, "server"), { recursive: true });
console.log("Prerendering terminé.");
