import { useContext } from "react";
import { ThemeContext } from "../provider/Theme";
import IconButton from "rsuite/IconButton";
import { Moon, Sun } from "lucide-react";

const DarkMode: React.FC = () => {
  // Ensure ThemeContext is properly typed
  const themeContext = useContext(ThemeContext);

  // Handle the case where ThemeContext might be undefined
  if (!themeContext) {
    throw new Error("DarkMode must be used within a ThemeProvider");
  }

  const { theme, toggleTheme } = themeContext;

  return (
    <>
      <IconButton
        size="xs"
        onClick={toggleTheme}
        circle
        icon={theme === "dark" ? <Sun /> : <Moon />}
      />
    </>
  );
};

export default DarkMode;
