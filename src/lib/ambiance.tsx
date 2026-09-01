import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

/* Ambiance sonore générée à la volée (aucun fichier audio) :
   souffle de couloir, crépitement de chandelles, notes de harpe lointaines.
   Silencieuse par défaut : rien ne démarre sans un geste du visiteur. */

type Ctx = {
  actif: boolean;
  basculer: () => void;
  /** Petit son ponctuel : clic de plume, sortilège, page tournée. */
  jouer: (type: "plume" | "sort" | "page") => void;
};

const AmbianceContext = createContext<Ctx | null>(null);

const CLE = "potterquest.ambiance.v1";

export function AmbianceProvider({ children }: { children: ReactNode }) {
  const [actif, setActif] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nœudsRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    try {
      setActif(window.localStorage.getItem(CLE) === "1");
    } catch {
      /* stockage indisponible */
    }
  }, []);

  const contexte = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctxRef.current = new AC();
    }
    if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const demarrer = useCallback(() => {
    const ctx = contexte();
    if (!ctx || nœudsRef.current) return;

    // Souffle : bruit filtré, très grave, comme un courant d'air de couloir.
    const taille = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, taille, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < taille; i++) data[i] = (Math.random() * 2 - 1) * 0.4;
    const bruit = ctx.createBufferSource();
    bruit.buffer = buffer;
    bruit.loop = true;

    const filtre = ctx.createBiquadFilter();
    filtre.type = "lowpass";
    filtre.frequency.value = 320;

    const gainSouffle = ctx.createGain();
    gainSouffle.gain.value = 0.05;

    // Lente respiration du souffle
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.03;
    lfo.connect(lfoGain).connect(gainSouffle.gain);

    // Bourdon grave du château
    const drone = ctx.createOscillator();
    drone.type = "sine";
    drone.frequency.value = 58;
    const gainDrone = ctx.createGain();
    gainDrone.gain.value = 0.025;

    bruit.connect(filtre).connect(gainSouffle).connect(ctx.destination);
    drone.connect(gainDrone).connect(ctx.destination);
    bruit.start();
    drone.start();
    lfo.start();

    // Notes de harpe éparses, très espacées
    const notes = [523.25, 587.33, 659.25, 783.99, 880];
    const minuterie = window.setInterval(() => {
      if (Math.random() > 0.55) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = notes[Math.floor(Math.random() * notes.length)]!;
      g.gain.setValueAtTime(0.0001, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.035, ctx.currentTime + 0.4);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 3.6);
    }, 6000);

    nœudsRef.current = {
      stop: () => {
        window.clearInterval(minuterie);
        try {
          bruit.stop();
          drone.stop();
          lfo.stop();
        } catch {
          /* déjà arrêté */
        }
      },
    };
  }, [contexte]);

  const arreter = useCallback(() => {
    nœudsRef.current?.stop();
    nœudsRef.current = null;
  }, []);

  useEffect(() => {
    if (actif) demarrer();
    else arreter();
    return () => arreter();
  }, [actif, demarrer, arreter]);

  const basculer = useCallback(() => {
    setActif((a) => {
      const suivant = !a;
      try {
        window.localStorage.setItem(CLE, suivant ? "1" : "0");
      } catch {
        /* stockage indisponible */
      }
      return suivant;
    });
  }, []);

  const jouer = useCallback(
    (type: "plume" | "sort" | "page") => {
      if (!actif) return;
      const ctx = contexte();
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const base = type === "sort" ? 880 : type === "page" ? 220 : 440;
      o.type = type === "sort" ? "sine" : "triangle";
      o.frequency.setValueAtTime(base, ctx.currentTime);
      if (type === "sort") o.frequency.exponentialRampToValueAtTime(base * 2, ctx.currentTime + 0.25);
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.45);
    },
    [actif, contexte],
  );

  const value = useMemo(() => ({ actif, basculer, jouer }), [actif, basculer, jouer]);

  return <AmbianceContext.Provider value={value}>{children}</AmbianceContext.Provider>;
}

export function useAmbiance() {
  const ctx = useContext(AmbianceContext);
  if (!ctx) throw new Error("useAmbiance doit être utilisé dans <AmbianceProvider>");
  return ctx;
}
