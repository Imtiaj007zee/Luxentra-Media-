import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/react-app/index.css";
import App from "@/react-app/App.tsx";

// Press glass: while a clickable option is pressed it wears the full
// glass treatment (.is-pressing in index.css). Pointer events drive it
// so a tap on a touch device shows the glass too, where :active alone
// is easy to miss, and the class lingers a beat after release so the
// press visibly registers before the option springs back.
const PRESS_SELECTOR = 'a, button, [role="button"]';
let pressingEl: HTMLElement | null = null;
let pressingTimer: number | undefined;

function endPress() {
  pressingEl?.classList.remove("is-pressing");
  pressingEl = null;
}

window.addEventListener(
  "pointerdown",
  (event) => {
    const el = (event.target as HTMLElement).closest<HTMLElement>(
      PRESS_SELECTOR
    );
    if (!el || el.hasAttribute("disabled")) return;
    // Image links (the logo lockup, photo cards) never wear the glass;
    // a box around the logo reads as a selection, not a press.
    if (el instanceof HTMLAnchorElement && el.querySelector("img")) return;
    window.clearTimeout(pressingTimer);
    endPress();
    pressingEl = el;
    el.classList.add("is-pressing");
  },
  true
);
window.addEventListener(
  "pointerup",
  () => {
    pressingTimer = window.setTimeout(endPress, 350);
  },
  true
);
window.addEventListener("pointercancel", endPress, true);
window.addEventListener("blur", endPress);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
