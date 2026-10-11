import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Reveal-on-scroll elements start hidden only when motion is allowed and JS runs.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("motion-ok");
}

createRoot(document.getElementById("root")!).render(<App />);
