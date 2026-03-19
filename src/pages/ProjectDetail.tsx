import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";
import portfolioData from "@/data/portfolio.json";
import { useTranslation } from "react-i18next";
import projectContents from "@/components/projects";

const ProjectDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "fr" ? "fr" : "en";
  const project = portfolioData.projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">{t("portfolio.not_found")}</h1>
            <Button asChild>
              <Link to={`/${lang}`}>
                <ArrowLeft className="mr-2" size={16} />
                {t("portfolio.back_home")}
              </Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button variant="ghost" className="mb-8" asChild>
            <Link to={`/${lang}#portfolio`}>
              <ArrowLeft className="mr-2" size={16} />
              {t("portfolio.back")}
            </Link>
          </Button>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
          <div className="w-20 h-1 bg-gradient-warm rounded-full mb-8"></div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft mb-8">
            <p className="text-lg md:text-xl text-foreground/90 leading-relaxed mb-8">
              {t(`portfolio.projects.${project.id}.description`, { defaultValue: project.description })}
            </p>

            <h2 className="text-2xl font-semibold mb-4">{t("portfolio.tech_stack")}</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {project.stack.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20"
                >
                  {tech}
                </span>
              ))}
            </div>

            <Button className="bg-gradient-warm shadow-soft hover:shadow-hover transition-all duration-300" asChild>
              <a href={project.link}>
                {t("portfolio.view_project")}
                <ExternalLink className="ml-2" size={16} />
              </a>
            </Button>
          </div>

          {projectContents[project.id] && (
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft">
              {(() => { const Content = projectContents[project.id]; return <Content />; })()}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
