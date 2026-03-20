import { Github, Linkedin, Mail } from "lucide-react";
import social_links from "@/data/social_links.json"
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-primary mb-2">{"Florian Batard"}</p>
              <p className="text-muted-foreground">
                {t("footer.role")}
              </p>
            </div>

            <div className="flex gap-4">
              <a
                href={social_links.github.link}
                className="p-3 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a
                href={social_links.linkedin.link}
                className="p-3 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={`mailto:${social_links.mail.email}`}
                className="p-3 bg-secondary rounded-lg hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border text-center text-muted-foreground">
            <p>© {currentYear} {t("footer.rights")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
