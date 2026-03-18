import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-primary mb-2">{"<Dev />"}</p>
              <p className="text-muted-foreground">
                Développeur Full-Stack Freelance
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href="#"
                className="p-3 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="p-3 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href="mailto:contact@example.com"
                className="p-3 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {currentYear} Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
