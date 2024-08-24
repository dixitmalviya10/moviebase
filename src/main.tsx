import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "rsuite/dist/rsuite.min.css";
import { ThemeProvider } from "./provider/Theme.tsx";
import "./index.less";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
