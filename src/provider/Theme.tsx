import { createContext, useEffect, useState, ReactNode } from "react";
import CustomProvider from "rsuite/CustomProvider";

type ThemeType = "light" | "dark";

interface ThemeContextType {
  theme: ThemeType;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getTheme = (): ThemeType => {
  const theme = localStorage.getItem("theme") as ThemeType;
  if (!theme) {
    localStorage.setItem("theme", "light");
    return "light";
  }
  return theme;
};

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeType>(getTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <CustomProvider theme={theme}>{children}</CustomProvider>
    </ThemeContext.Provider>
  );
};

export { ThemeContext, ThemeProvider };
