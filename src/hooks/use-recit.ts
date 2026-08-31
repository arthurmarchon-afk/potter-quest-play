import { useEffect, useState } from "react";

/** Vrai si l'utilisateur demande à limiter les animations. */
export function useMouvementReduit() {
  const [reduit, setReduit] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const maj = () => setReduit(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);
  return reduit;
}

/**
 * Progression du scroll dans le document (0 → 1), échantillonnée en rAF.
 * Sert de « position de caméra » pour le décor continu de la page d'accueil.
 */
export function useProgressionScroll() {
  const [progression, setProgression] = useState(0);

  useEffect(() => {
    let raf = 0;
    const mesurer = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgression(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    const planifier = () => {
      if (!raf) raf = requestAnimationFrame(mesurer);
    };
    mesurer();
    window.addEventListener("scroll", planifier, { passive: true });
    window.addEventListener("resize", planifier);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", planifier);
      window.removeEventListener("resize", planifier);
    };
  }, []);

  return progression;
}
