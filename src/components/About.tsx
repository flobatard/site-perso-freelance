import { Code2, Heart, Users, User } from "lucide-react";

const About = () => {
  return (
    <section id="about" className="py-20 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            À propos de moi
          </h2>
          <div className="w-20 h-1 bg-gradient-warm mx-auto mb-12 rounded-full"></div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-soft">
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-8">
              {/* Photo placeholder */}
              <div className="shrink-0 w-60 h-60 rounded-2xl bg-secondary border-2 border-primary/20 overflow-hidden flex items-center justify-center shadow-soft">
                 <img src="/me_alpha_bg_resized.png" alt="Photo" className="grayscale hover:grayscale-0 transition duration-300 w-full h-full object-cover" />
              </div>

              <div>
                <p className="text-lg md:text-xl text-foreground/90 mb-6 leading-relaxed">
                  Développeur full-stack passionné avec <strong>5 ans d'expérience</strong>, j'accompagne 
                  mes clients dans la réalisation de leurs projets digitaux, de la conception à la mise en production.
                </p>
                
                <p className="text-lg md:text-xl text-foreground/90 leading-relaxed">
                  Ce qui me distingue ? Une approche <strong>centrée sur l'humain</strong>. Je crois fermement 
                  qu'une bonne communication et une écoute active sont aussi importantes que les compétences techniques. 
                  Mon objectif : créer des solutions qui répondent vraiment à vos besoins, tout en restant maintenables 
                  et évolutives.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="text-center p-6 bg-secondary/50 rounded-xl">
                <Code2 className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-lg mb-2">Expertise Technique</h3>
                <p className="text-muted-foreground">
                  Maîtrise des technologies modernes et des bonnes pratiques
                </p>
              </div>
              
              <div className="text-center p-6 bg-secondary/50 rounded-xl">
                <Heart className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-lg mb-2">Approche Humaine</h3>
                <p className="text-muted-foreground">
                  Communication transparente et collaboration étroite
                </p>
              </div>
              
              <div className="text-center p-6 bg-secondary/50 rounded-xl">
                <Users className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-semibold text-lg mb-2">Travail d'Équipe</h3>
                <p className="text-muted-foreground">
                  Intégration facile dans vos équipes et processus
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
