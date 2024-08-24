import { useContext } from "react";
import { ThemeContext } from "../provider/Theme";
import IconButton from "rsuite/IconButton";
import { Moon, Sun } from "lucide-react";

const DarkMode = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

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
