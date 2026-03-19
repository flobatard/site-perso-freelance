import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Skills from "@/components/Skills";
import Portfolio from "@/components/Portfolio";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { useTheme } from "@/hooks/use-theme";

// Sections marked "light" get a .section-light wrapper in hybrid mode,
// overriding the global .dark vars. All others inherit dark from <html>.
const sectionThemes: Record<string, "dark" | "light"> = {
  hero: "dark",
  about: "dark",
  skills: "light",
  portfolio: "dark",
  contact: "light",
};

const Wrap = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { theme } = useTheme();
  if (theme === "hybrid" && sectionThemes[id] === "light") {
    return <div className="section-light">{children}</div>;
  }
  return <>{children}</>;
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Wrap id="hero"><Hero /></Wrap>
      <Wrap id="about"><About /></Wrap>
      <Wrap id="skills"><Skills /></Wrap>
      <Wrap id="portfolio"><Portfolio /></Wrap>
      <Wrap id="contact"><Contact /></Wrap>
      <Footer />
    </div>
  );
};

export default Index;
