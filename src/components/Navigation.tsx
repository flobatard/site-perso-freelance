import { useState, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import portfolioData from "@/data/portfolio.json";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/#about", label: "À propos" },
    { href: "/#skills", label: "Compétences" },
    { href: "/curriculum_vitae", label: "CV" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-card/95 backdrop-blur-md shadow-soft" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-perso.png" className="object-contain h-10 w-auto"></img>
            <a href="/#hero" className="text-2xl font-bold text-primary">
              {"Florian Batard"}
            </a>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.href.includes("#") ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
                >
                  {link.label}
                </Link>
              )
            )}

            {/* Portfolio Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-1 text-foreground hover:text-primary transition-colors duration-300 font-medium outline-none">
                <a>Portfolio</a>
                <ChevronDown size={16} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-56">
                {portfolioData.projects.map((project) => (
                  <DropdownMenuItem
                    key={project.id}
                    className="cursor-pointer"
                    onClick={() => navigate(`/projet/${project.id}`)}
                  >
                    {project.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <a href="/#contact">
              <Button className="bg-gradient-warm shadow-soft hover:shadow-hover transition-all duration-300">
                Me contacter
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) =>
                link.href.includes("#") ? (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
              
              {/* Mobile Portfolio Links */}
              <div className="py-2">
                <a href="/#portfolio" className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">Portfolio</a>
                <div className="flex flex-col gap-2 mt-2 pl-3 border-l-2 border-primary/20">
                  {portfolioData.projects.map((project) => (
                    <Link
                      key={project.id}
                      to={`/projet/${project.id}`}
                      className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-1"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {project.title}
                    </Link>
                  ))}
                </div>
              </div>

              <a href="/#contact" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="bg-gradient-warm shadow-soft hover:shadow-hover transition-all duration-300 w-full">
                  Me contacter
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
