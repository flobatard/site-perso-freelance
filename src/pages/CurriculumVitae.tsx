import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Download, MapPin, Mail, Phone, Calendar } from "lucide-react";
import essentialCvPdf from "@/assets/Essential_CV.pdf";
import { useTranslation } from "react-i18next";

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
    {exp.stack && exp.stack.length > 0 && (
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
  const { t } = useTranslation();

  const experiences = t("cv.experiences", { returnObjects: true }) as Experience[];
  const freelanceProjects = t("cv.freelance_projects", { returnObjects: true }) as Experience[];
  const education = t("cv.education", { returnObjects: true }) as Education[];
  const languagesList = t("cv.languages_list", { returnObjects: true }) as { lang: string; level: string }[];
  const interestsList = t("cv.interests_list", { returnObjects: true }) as string[];
  const softSkillsItems = t("cv.skills_section.soft_skills_items", { returnObjects: true }) as string[];

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
                {t("cv.download")}
              </Button>
            </a>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft space-y-12">

            {/* Profile */}
            <section>
              <SectionTitle>{t("cv.sections.profile")}</SectionTitle>
              <p className="text-foreground/80 leading-relaxed">
                {t("cv.profile_text")}
              </p>
            </section>

            {/* Experience */}
            <section>
              <SectionTitle>{t("cv.sections.experience")}</SectionTitle>
              {experiences.map((exp) => (
                <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp} />
              ))}
            </section>

            {/* Freelance */}
            <section>
              <SectionTitle>{t("cv.sections.freelance")}</SectionTitle>
              {freelanceProjects.map((exp) => (
                <ExperienceCard key={`${exp.company}-${exp.period}`} exp={exp} />
              ))}
            </section>

            {/* Education */}
            <section>
              <SectionTitle>{t("cv.sections.education")}</SectionTitle>
              {education.map((edu) => (
                <EducationCard key={`${edu.school}-${edu.period}`} edu={edu} />
              ))}
            </section>

            {/* Skills */}
            <section>
              <SectionTitle>{t("cv.sections.skills")}</SectionTitle>
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">{t("cv.skills_section.programming_label")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Elixir", "C/C++", "Python", "JavaScript", "Java", "C#", "Caml", "R", "Matlab"].map((lang) => (
                      <Tag key={lang} label={lang} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">{t("cv.skills_section.tools_label")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Linux", "Git", "Jenkins", "Docker", "Méthode Agile", "Suite Office", "LaTeX"].map((tool) => (
                      <Tag key={tool} label={tool} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">{t("cv.skills_section.software_label")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Fusion360", "FLStudio", "Gimp", "Suite Adobe"].map((soft) => (
                      <Tag key={soft} label={soft} />
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">{t("cv.skills_section.soft_skills_label")}</h3>
                  <div className="flex flex-wrap gap-2">
                    {softSkillsItems.map((skill) => (
                      <Tag key={skill} label={skill} />
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Languages */}
            <section>
              <SectionTitle>{t("cv.sections.languages")}</SectionTitle>
              <div className="grid grid-cols-3 gap-4">
                {languagesList.map(({ lang, level }) => (
                  <div key={lang} className="bg-secondary/50 rounded-xl p-4 text-center">
                    <p className="font-semibold">{lang}</p>
                    <p className="text-muted-foreground text-sm mt-1">{level}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Personal projects */}
            <section>
              <SectionTitle>{t("cv.sections.personal_projects")}</SectionTitle>
              <div className="mb-2">
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                  <h3 className="font-bold text-lg">{t("cv.personal_project.title")}</h3>
                  <span className="text-muted-foreground text-sm shrink-0">{t("cv.personal_project.period")}</span>
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                  {t("cv.personal_project.description")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Python", "C++", "Arduino", "Raspberry Pi", "SLAM", "ICP", "Fusion360", "Lidar"].map((tech) => (
                    <Tag key={tech} label={tech} />
                  ))}
                </div>
              </div>
            </section>

            {/* Interests */}
            <section>
              <SectionTitle>{t("cv.sections.interests")}</SectionTitle>
              <div className="flex flex-wrap gap-2">
                {interestsList.map((item) => (
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
