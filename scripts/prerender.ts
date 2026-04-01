import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.resolve(__dirname, "../dist");
const template = fs.readFileSync(path.join(distPath, "index.html"), "utf-8");

const { render, i18n } = await import(
  path.join(distPath, "server/entry-server.js")
);

const portfolio = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../src/data/portfolio.json"), "utf-8")
);
const projectIds: string[] = portfolio.projects.map((p: { id: string }) => p.id);
const langs = ["fr", "en"];

const routes = [
  ...langs.map((l) => `/${l}`),
  ...langs.map((l) => `/${l}/curriculum_vitae`),
  ...langs.flatMap((l) => projectIds.map((id) => `/${l}/projet/${id}`)),
];

// ── SEO helpers ───────────────────────────────────────────────────────────────

const BASE_URL = "https://fbatard.fr";
const OG_IMAGE = `${BASE_URL}/me_alpha_bg_resized.png`;

const KEYWORDS_FR =
  "Lead Developer, Développeur Full-Stack, Consultant IA, Consultant SI, Architecte SI, Architecte IA, Freelance, React, Elixir, Angular, Node.js, Paris";
const KEYWORDS_EN =
  "Lead Developer, Full-Stack Developer, AI Consultant, IS Consultant, IS Architect, AI Architect, Freelance, React, Elixir, Angular, Node.js, Paris";

interface PageMeta {
  lang: string;
  title: string;
  description: string;
  keywords: string;
}

function getAltRoute(route: string, targetLang: string): string {
  const parts = route.split("/");
  parts[1] = targetLang;
  return parts.join("/");
}

function buildPersonJsonLd(lang: string): string {
  const jobTitlesFr = [
    "Lead Developer Freelance",
    "Développeur Full-Stack Freelance",
    "Consultant IA Freelance",
    "Consultant SI Freelance",
    "Architecte SI Freelance",
    "Architecte IA Freelance",
  ];
  const jobTitlesEn = [
    "Lead Developer Freelance",
    "Full-Stack Developer Freelance",
    "AI Consultant Freelance",
    "IS Consultant Freelance",
    "IS Architect Freelance",
    "AI Architect Freelance",
  ];
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Florian Batard",
    url: BASE_URL,
    email: "batard.florian.pro@gmail.com",
    jobTitle: lang === "fr" ? jobTitlesFr : jobTitlesEn,
    description:
      lang === "fr"
        ? "Développeur Full-Stack, Lead Developer et Consultant IA freelance avec 5 ans d'expérience. Expert React, Elixir, Angular, Node.js. Disponible pour missions. Paris, Remote."
        : "Full-Stack Developer, Lead Developer and AI Consultant freelance with 5 years of experience. React, Elixir, Angular, Node.js expert. Available for missions. Paris, Remote.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Paris",
      addressCountry: "FR",
    },
    sameAs: [
      "https://github.com/flobatard",
      "https://www.linkedin.com/in/florian-batard-aa43a9175",
    ],
    knowsAbout:
      lang === "fr"
        ? [
            "Développement Full-Stack",
            "Lead Development",
            "Intelligence Artificielle",
            "Architecture Logicielle",
            "Architecture SI",
            "React",
            "Elixir",
            "Angular",
            "Node.js",
          ]
        : [
            "Full-Stack Development",
            "Lead Development",
            "Artificial Intelligence",
            "Software Architecture",
            "IS Architecture",
            "React",
            "Elixir",
            "Angular",
            "Node.js",
          ],
  };
  return JSON.stringify(schema);
}

function buildProjectJsonLd(
  projectId: string,
  title: string,
  description: string,
  stack: string[],
  url: string,
  lang: string
): string {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: title,
    description,
    applicationCategory: "WebApplication",
    author: {
      "@type": "Person",
      name: "Florian Batard",
      url: BASE_URL,
    },
    programmingLanguage: stack,
    url,
    inLanguage: lang === "fr" ? "fr-FR" : "en-US",
  };
  return JSON.stringify(schema);
}

function getPageMeta(route: string): PageMeta {
  const parts = route.split("/").filter(Boolean);
  const lang = parts[0];
  const section = parts[1];

  if (section === "curriculum_vitae") {
    return lang === "fr"
      ? {
          lang: "fr",
          title: "CV — Florian Batard | Lead Developer, Consultant IA & Architecte SI Freelance",
          description:
            "Curriculum vitae de Florian Batard : Lead Developer, Développeur Full-Stack, Consultant IA et Architecte SI freelance. 5 ans d'expérience (KBRW, Michelin, SNCF, MBDA). Disponible pour missions.",
          keywords: KEYWORDS_FR,
        }
      : {
          lang: "en",
          title: "Resume — Florian Batard | Lead Developer, AI Consultant & IS Architect Freelance",
          description:
            "Resume of Florian Batard: Lead Developer, Full-Stack Developer, AI Consultant and IS Architect freelance. 5 years of experience (KBRW, Michelin, SNCF, MBDA). Available for missions.",
          keywords: KEYWORDS_EN,
        };
  }

  if (section === "projet" && parts[2]) {
    const id = parts[2];
    const project = portfolio.projects.find((p: { id: string }) => p.id === id);
    const projectTitle = project?.title ?? id;
    const stackStr = (project?.stack ?? []).join(", ");
    const desc =
      lang === "fr"
        ? (i18n.t(`portfolio.projects.${id}.description`) || project?.description || "")
        : (i18n.t(`portfolio.projects.${id}.description`) || project?.description || "");
    const shortDesc = `${desc} Stack : ${stackStr}.`.slice(0, 155);

    return {
      lang,
      title: `${projectTitle} | Florian Batard — Lead Developer Freelance`,
      description: shortDesc,
      keywords:
        lang === "fr"
          ? `${projectTitle}, ${stackStr}, ${KEYWORDS_FR}`
          : `${projectTitle}, ${stackStr}, ${KEYWORDS_EN}`,
    };
  }

  // Home page
  return lang === "fr"
    ? {
        lang: "fr",
        title: "Florian Batard — Lead Developer & Consultant IA Freelance | Paris",
        description:
          "Développeur Full-Stack, Lead Developer et Consultant IA freelance. 5 ans d'expérience. Expert React, Elixir, Angular, Node.js. Architecte SI & IA disponible en remote depuis Paris.",
        keywords: KEYWORDS_FR,
      }
    : {
        lang: "en",
        title: "Florian Batard — Lead Developer & AI Consultant Freelance | Paris",
        description:
          "Full-Stack Developer, Lead Developer and AI Consultant freelance. 5 years of experience. React, Elixir, Angular, Node.js expert. IS & AI Architect available remotely from Paris.",
        keywords: KEYWORDS_EN,
      };
}

function buildSeoBlock(route: string, meta: PageMeta): string {
  const canonical = `${BASE_URL}${route}`;
  const frUrl = `${BASE_URL}${getAltRoute(route, "fr")}`;
  const enUrl = `${BASE_URL}${getAltRoute(route, "en")}`;
  const locale = meta.lang === "fr" ? "fr_FR" : "en_US";

  // JSON-LD
  const parts = route.split("/").filter(Boolean);
  const section = parts[1];
  let jsonLd: string;
  if (section === "projet" && parts[2]) {
    const id = parts[2];
    const project = portfolio.projects.find((p: { id: string }) => p.id === id);
    const title = meta.title.split(" | ")[0];
    const desc = meta.description;
    const stack = project?.stack ?? [];
    const projectUrl = project?.link ?? canonical;
    jsonLd = buildProjectJsonLd(id, title, desc, stack, projectUrl, meta.lang);
  } else {
    jsonLd = buildPersonJsonLd(meta.lang);
  }

  return `
    <title>${meta.title}</title>
    <meta name="description" content="${meta.description}" />
    <meta name="author" content="Florian Batard" />
    <meta name="keywords" content="${meta.keywords}" />
    <link rel="canonical" href="${canonical}" />
    <link rel="alternate" hreflang="fr" href="${frUrl}" />
    <link rel="alternate" hreflang="en" href="${enUrl}" />
    <link rel="alternate" hreflang="x-default" href="${frUrl}" />
    <meta property="og:title" content="${meta.title}" />
    <meta property="og:description" content="${meta.description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:locale" content="${locale}" />
    <meta property="og:site_name" content="Florian Batard" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${meta.title}" />
    <meta name="twitter:description" content="${meta.description}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <script type="application/ld+json">${jsonLd}</script>`.trimStart();
}

// ── Prerender ─────────────────────────────────────────────────────────────────

for (const route of routes) {
  const lang = route.split("/")[1];
  await i18n.changeLanguage(lang);

  const meta = getPageMeta(route);
  const seoBlock = buildSeoBlock(route, meta);

  const appHtml = render(route);
  let html = template
    .replace("<!--ssr-lang-->", meta.lang)
    .replace("<!--ssr-seo-->", seoBlock)
    .replace("<!--ssr-outlet-->", appHtml);

  const filePath = path.join(distPath, route, "index.html");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, html, "utf-8");
  console.log(`✓ ${route}`);
}

// Nettoyer le bundle SSR (ne doit pas être servi par nginx)
fs.rmSync(path.join(distPath, "server"), { recursive: true });
console.log("Prerendering terminé.");
