import { ArrowRight, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/Hero_Banner.jpg";

const Hero = () => {
  return (
    <section
      id="hero"
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(30, 20, 15, 0.8), rgba(30, 20, 15, 0.9)), url(${heroBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-block mb-6 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20">
            <span className="text-primary font-medium">Développeur Full-Stack Freelance</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
            Transformons vos idées
            <br />
            <span className="bg-gradient-warm bg-clip-text text-transparent">
              en solutions digitales
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            5 ans d'expérience en développement full-stack. 
            J'allie expertise technique et approche humaine pour créer des applications performantes et sur-mesure.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button
              size="lg"
              className="bg-gradient-warm shadow-hover hover:scale-105 transition-all duration-300 text-lg px-8"
              asChild
            >
              <a href="#portfolio">
                Voir mon travail
                <ArrowRight className="ml-2" size={20} />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-foreground hover:bg-white hover:text-primary transition-all duration-300 text-lg px-8"
              asChild
            >
              <a href="/#contact">Me contacter</a>
            </Button>
          </div>

          <div className="flex gap-4 justify-center">
            <a
              href="#"
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="text-white" size={24} />
            </a>
            <a
              href="#"
              className="p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-all duration-300 hover:scale-110"
              aria-label="LinkedIn"
            >
              <Linkedin className="text-white" size={24} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
