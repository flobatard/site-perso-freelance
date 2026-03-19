import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const CurriculumVitae = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Curriculum Vitae</h1>
          <div className="w-20 h-1 bg-gradient-warm rounded-full mb-8"></div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CurriculumVitae;
