import { Database, Server, Monitor, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Skills = () => {
  const skills = [
    {
      icon: <Monitor className="text-primary" size={40} />,
      title: "Frontend",
      technologies: ["React", "Angular", "TypeScript", "JavaScript"],
      description: "Interfaces modernes et réactives avec les frameworks les plus performants",
    },
    {
      icon: <Server className="text-primary" size={40} />,
      title: "Backend",
      technologies: ["Elixir", "Node.js", "C++"],
      description: "APIs robustes et scalables pour des applications performantes",
    },
    {
      icon: <Database className="text-primary" size={40} />,
      title: "Databases",
      technologies: ["PostgreSQL", "MongoDB", "Riak"],
      description: "Conception et optimisation de bases de données relationnelles et NoSQL",
    },
    {
      icon: <Code className="text-primary" size={40} />,
      title: "Développement",
      technologies: ["Architecture", "DevOps", "Testing", "CI/CD"],
      description: "Bonnes pratiques et méthodologies pour un code maintenable",
    },
  ];

  return (
    <section id="skills" className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Compétences & Technologies
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
