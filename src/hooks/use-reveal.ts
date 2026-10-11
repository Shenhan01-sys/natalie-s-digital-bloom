import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export const motionOk = () =>
  typeof document !== "undefined" && document.documentElement.classList.contains("motion-ok");

/** Clear the inline styles anime leaves behind so CSS hover transforms work again. */
const settle = (els: HTMLElement[]) =>
  els.forEach((el) => {
    el.style.removeProperty("transform");
    el.style.removeProperty("opacity");
  });

/**
 * Reveals every `[data-reveal]` inside the returned ref once, when it scrolls into view.
 * Elements in the same intersection batch are staggered (70ms, MASTER.md).
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !motionOk()) return;
    const items = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])"));

    const io = new IntersectionObserver(
      (entries) => {
        const batch = entries.filter((e) => e.isIntersecting).map((e) => e.target as HTMLElement);
        if (!batch.length) return;
        batch.forEach((el) => {
          io.unobserve(el);
          el.style.opacity = "0";
          el.setAttribute("data-revealed", "");
        });
        animate(batch, {
          opacity: [0, 1],
          translateY: [28, 0],
          duration: 760,
          delay: stagger(70),
          ease: "outQuint",
          onComplete: () => settle(batch),
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return ref;
}

/** Short stagger-in for a freshly rendered list (portfolio filter changes). */
export function staggerIn(els: HTMLElement[]) {
  if (!motionOk() || !els.length) return;
  els.forEach((el) => (el.style.opacity = "0"));
  animate(els, {
    opacity: [0, 1],
    translateY: [16, 0],
    duration: 520,
    delay: stagger(45),
    ease: "outQuint",
    onComplete: () => settle(els),
  });
}
