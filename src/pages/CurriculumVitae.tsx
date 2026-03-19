import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, MapPin, Mail, Phone, Calendar } from "lucide-react";
import essentialCvPdf from "@/assets/Essential_CV.pdf";

// ── Types ──────────────────────────────────────────────────────────────────────

interface Experience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  stack?: string[];
}

interface Education {
  degree: string;
  school: string;
  period: string;
  location: string;
  detail?: string;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const experiences: Experience[] = [
  {
    title: "Lead Développeur",
    company: "KBRW",
    period: "05/2023 – 03/2026",
    location: "Paris, France",
    description: "Développement d'un logiciel de prise et de gestion de commande pour Michelin.",
    stack: ["Elixir", "React", "Riak", "LXC"],
  },
  {
    title: "Ingénieur en développement C++",
    company: "Viveris",
    period: "05/2021 – 05/2023",
    location: "Évry, France",
    description:
      "Différentes missions pour des grandes entreprises : SNCF — traitement de données Lidar pour la détection des rails dans le cadre du projet train autonome ; MBDA — développement logiciel de la partie applicative d'un projet pour MBDA Software Engineering.",
    stack: ["C++"],
  },
  {
    title: "Ingénieur R&D Python",
    company: "HORIBA",
    period: "03/2020 – 08/2020",
    location: "Palaiseau, France",
    description:
      "Conception et développement d'un banc de test pour l'électronique d'un outil de mesure de distance.",
    stack: ["Python"],
  },
  {
    title: "Étudiant chercheur",
    company: "Jožef Stefan Institute",
    period: "06/2019 – 09/2019",
    location: "Ljubljana, Slovénie",
    description:
      "Rédaction d'un article de recherche sur la matrice de corrélation des mesures sur les neutrons retardés.",
  },
  {
    title: "Développeur Java",
    company: "Eurofeedback",
    period: "06/2018 – 09/2018",
    location: "Lisses, France",
    description:
      "Conception et développement d'un outil d'affichage de données SQL et déploiement sur Raspberry Pi.",
    stack: ["Java"],
  },
];

const freelanceProjects: Experience[] = [
  {
    title: "Développeur Freelance",
    company: "BETA Vêtements",
    period: "06/2024 – présent",
    location: "Remote",
    description:
      "Architecture, spécification et développement du site web order.betavetements.com, site de prise de commande de vêtements et accessoires personnalisés.",
    stack: ["Docker", "Angular", "Node.js", "MongoDB", "Redis"],
  },
];

const education: Education[] = [
  {
    degree: "Ingénieur en informatique",
    school: "ENSIIE",
    period: "09/2017 – 03/2021",
    location: "Évry, France",
    detail: "Spécialisation en Intelligence Artificielle et Recherche Opérationnelle",
  },
  {
    degree: "Master ANDROID",
    school: "Université Pierre-et-Marie-Curie",
    period: "09/2019 – 12/2020",
    location: "Paris, France",
    detail: "Agents Distribués, Robotique, Recherche Opérationnelle, Interaction, Décision",
  },
  {
    degree: "Licence en Mathématiques appliquées",
    school: "Université d'Évry",
    period: "09/2017 – 09/2018",
    location: "Évry, France",
    detail: "En partenariat avec l'ENSIIE",
  },
  {
    degree: "Classe préparatoire MPSI/MP*",
    school: "Lycée Camille Guérin",
    period: "09/2015 – 09/2017",
    location: "Poitiers, France",
  },
];

// ── Sub-components ─────────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-primary uppercase tracking-wide">{children}</h2>
    <div className="w-full h-px bg-border mt-2" />
  </div>
);

const Tag = ({ label }: { label: string }) => (
  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
    {label}
  </span>
);

const ExperienceCard = ({ exp }: { exp: Experience }) => (
  <div className="mb-6">
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
      <h3 className="font-bold text-lg">{exp.title}</h3>
      <span className="text-muted-foreground text-sm shrink-0">
        {exp.period} | {exp.location}
      </span>
    </div>
    <p className="text-primary font-medium italic mb-2">{exp.company}</p>
    <p className="text-foreground/80 text-sm leading-relaxed mb-3">{exp.description}</p>
    {exp.stack && (
      <div className="flex flex-wrap gap-2">
        {exp.stack.map((tech) => (
          <Tag key={tech} label={tech} />
        ))}
      </div>
    )}
  </div>
);

const EducationCard = ({ edu }: { edu: Education }) => (
  <div className="mb-6">
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
      <h3 className="font-bold text-lg">{edu.degree}</h3>
      <span className="text-muted-foreground text-sm shrink-0">
        {edu.period} | {edu.location}
      </span>
    </div>
    <p className="text-primary font-medium italic mb-1">{edu.school}</p>
    {edu.detail && <p className="text-foreground/80 text-sm">{edu.detail}</p>}
  </div>
);

// ── Page ───────────────────────────────────────────────────────────────────────

const CurriculumVitae = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-12">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Florian Batard</h1>
              <div className="w-20 h-1 bg-gradient-warm rounded-full mb-5" />
              <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                <span className="flex items-center gap-2">
                  <Mail size={14} className="text-primary shrink-0" />
                  fb.batard@gmail.com
                </span>
                <span className="flex items-center gap-2">
                  <Phone size={14} className="text-primary shrink-0" />
                  06 38 75 19 39
                </span>
                <span className="flex items-center gap-2">
                  <MapPin size={14} className="text-primary shrink-0" />
                  27 Rue Léon Frot, 75011, Paris
                </span>
                <span className="flex items-center gap-2">
                  <Calendar size={14} className="text-primary shrink-0" />
                  29/01/1998
                </span>
              </div>
            </div>
            <a href={essentialCvPdf} download="CV_Florian_Batard.pdf">
              <Button className="bg-gradient-warm shadow-soft hover:shadow-hover transition-all duration-300 shrink-0">
                <Download size={16} className="mr-2" />
                Télécharger le CV
              </Button>
            </a>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft space-y-12">

            {/* Profil */}
            <section>
              <SectionTitle>Profil</SectionTitle>
              <p className="text-foreground/80 leading-relaxed">
                Je suis une personne curieuse, toujours à la recherche de nouvelles choses à apprendre et à explorer.
                J'ai l'esprit d'initiative et j'aime comprendre les choses dans leur globalité, ce qui me permet de
                faire évoluer des compétences dans des domaines plus variés que ma formation initiale.
                Je recherche une mission en freelance à partir de début Avril 2026.
              </p>
            </section>

            {/* Expérience */}
            <section>
              <SectionTitle>Expérience</SectionTitle>
              {experiences.map((exp) => (
                <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp} />
              ))}
            </section>

            {/* Freelance */}
            <section>
              <SectionTitle>Projets Freelance</SectionTitle>
              {freelanceProjects.map((exp) => (
                <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp} />
              ))}
            </section>

            {/* Formation */}
            <section>
              <SectionTitle>Formation</SectionTitle>
              {education.map((edu) => (
                <EducationCard key={`${edu.school}-${edu.period}`} edu={edu} />
              ))}
            </section>

            {/* Compétences */}
            <section>
              <SectionTitle>Compétences</SectionTitle>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Langages informatiques</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Elixir", "C/C++", "Python", "JavaScript", "Java", "C#", "Caml", "R", "Matlab"].map((lang) => (
                      <Tag key={lang} label={lang} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Environnement & Outils</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Linux", "Git", "Jenkins", "Docker", "Méthode Agile", "Suite Office", "LaTeX"].map((tool) => (
                      <Tag key={tool} label={tool} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Logiciels</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Fusion360", "FLStudio", "Gimp", "Suite Adobe"].map((soft) => (
                      <Tag key={soft} label={soft} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Patient", "À l'écoute", "Réactif", "Moteur"].map((skill) => (
                      <Tag key={skill} label={skill} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Langues */}
            <section>
              <SectionTitle>Langues</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { lang: "Français", level: "Langue maternelle" },
                  { lang: "English", level: "C1 (BULATS)" },
                  { lang: "Espagnol", level: "C1" },
                ].map(({ lang, level }) => (
                  <div key={lang} className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="font-semibold">{lang}</p>
                    <p className="text-muted-foreground text-sm mt-1">{level}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projets personnels */}
            <section>
              <SectionTitle>Projets personnels</SectionTitle>
              <div className="mb-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <h3 className="font-bold text-lg">Coupe de robotique</h3>
                  <span className="text-muted-foreground text-sm shrink-0">09/2017 – 05/2022</span>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                  4 participations à la coupe de France de robotique via l'association de l'ENSIIE.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Python", "C++", "Arduino", "Raspberry Pi", "SLAM", "ICP", "Fusion360", "Lidar"].map((tech) => (
                    <Tag key={tech} label={tech} />
                  ))}
                </div>
              </div>
            </section>

            {/* Centres d'intérêt */}
            <section>
              <SectionTitle>Centres d'intérêt</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {["Robotique", "Volley", "Football", "Vulgarisation scientifique", "Jeux de société"].map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CurriculumVitae;
