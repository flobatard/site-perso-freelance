import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "hybrid";

interface ThemeContextType {
  theme: Theme;
  cycleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light" || stored === "dark" || stored === "hybrid") return stored;
    return "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    // hybrid and dark both keep .dark on <html> (nav + non-Index pages stay dark)
    if (theme === "light") {
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const cycleTheme = () =>
    setTheme((t) => {
      if (t === "dark") return "light";
      if (t === "light") return "hybrid";
      return "dark";
    });

  return (
    <ThemeContext.Provider value={{ theme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};
