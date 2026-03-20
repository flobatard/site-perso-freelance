import { Server, Code, Brain, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Skills = () => {
  const { t } = useTranslation();

  const skills = [
    {
      icon: <Layers className="text-primary" size={40} />,
      title: t("skills.fullstack_title"),
      technologies: ["React", "Angular", "TypeScript", "Elixir", "Node.js", "Python"],
      description: t("skills.fullstack_desc"),
    },
    {
      icon: <Brain className="text-primary" size={40} />,
      title: t("skills.ai_title"),
      technologies: ["RAG", "LangChain", "n8n", "MCP", "PyTorch"],
      description: t("skills.ai_desc"),
    },
    {
      icon: <Server className="text-primary" size={40} />,
      title: t("skills.infra_title"),
      technologies: ["PostgreSQL", "MongoDB", "Docker", "CI/CD", "Redis"],
      description: t("skills.infra_desc"),
    },
    {
      icon: <Code className="text-primary" size={40} />,
      title: t("skills.archi_title"),
      technologies: ["System Design", "Testing", "Clean Code", "Agile"],
      description: t("skills.archi_desc"),
    },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            {t("skills.title")}
          </h2>
          <div className="w-20 h-1 bg-gradient-warm mx-auto mb-12 rounded-full"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <Card
                key={index}
                className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary/50"
              >
                <CardContent className="p-6">
                  <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
                    {skill.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{skill.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {skill.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
