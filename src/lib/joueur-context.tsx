import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Maison } from "./choixpeau";
import {
  appliquerRecompense,
  chargerJoueur,
  effacerJoueur,
  joueurVide,
  sauverJoueur,
  statsInitiales,
  type Joueur,
  type Recompense,
} from "./joueur";

type Notif = { id: number; lignes: string[]; niveau?: number | undefined };

type Ctx = {
  joueur: Joueur | null;
  pret: boolean;
  creerSorcier: (nom: string) => void;
  definirMaison: (maison: Maison) => void;
  gagner: (r: Recompense, contexte?: string) => void;
  reinitialiser: () => void;
  notifs: Notif[];
};

const JoueurContext = createContext<Ctx | null>(null);

export function JoueurProvider({ children }: { children: ReactNode }) {
  const [joueur, setJoueur] = useState<Joueur | null>(null);
  const [pret, setPret] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);

  useEffect(() => {
    setJoueur(chargerJoueur());
    setPret(true);
  }, []);

  const maj = useCallback((j: Joueur) => {
    setJoueur(j);
    sauverJoueur(j);
  }, []);

  const pousser = useCallback((lignes: string[], niveau?: number) => {
    if (!lignes.length && !niveau) return;
    const id = Date.now() + Math.random();
    setNotifs((n) => [...n, { id, lignes, niveau }]);
    setTimeout(() => setNotifs((n) => n.filter((x) => x.id !== id)), 3600);
  }, []);

  const creerSorcier = useCallback(
    (nom: string) => {
      const j = joueurVide(nom.trim() || "Sorcier");
      maj(j);
      pousser(["🪄 Sorcier créé — bienvenue à Poudlard !"]);
    },
    [maj, pousser],
  );

  const definirMaison = useCallback(
    (maison: Maison) => {
      setJoueur((prev) => {
        const base = prev ?? joueurVide("Sorcier");
        const j: Joueur = {
          ...base,
          maison,
          stats: { ...statsInitiales[maison] },
        };
        sauverJoueur(j);
        return j;
      });
    },
    [],
  );

  const gagner = useCallback(
    (r: Recompense, contexte?: string) => {
      setJoueur((prev) => {
        if (!prev) return prev;
        const { joueur: j, niveauxGagnes } = appliquerRecompense(prev, r);
        sauverJoueur(j);
        const lignes: string[] = [];
        if (contexte) lignes.push(contexte);
        if (r.xp) lignes.push(`✨ +${r.xp} XP`);
        if (r.gallions) lignes.push(`🪙 +${r.gallions} Gallions`);
        if (r.points) lignes.push(`🏆 +${r.points} points de maison`);
        pousser(lignes, niveauxGagnes > 0 ? j.niveau : undefined);
        return j;
      });
    },
    [pousser],
  );

  const reinitialiser = useCallback(() => {
    effacerJoueur();
    setJoueur(null);
  }, []);

  const value = useMemo(
    () => ({ joueur, pret, creerSorcier, definirMaison, gagner, reinitialiser, notifs }),
    [joueur, pret, creerSorcier, definirMaison, gagner, reinitialiser, notifs],
  );

  return <JoueurContext.Provider value={value}>{children}</JoueurContext.Provider>;
}

export function useJoueur() {
  const ctx = useContext(JoueurContext);
  if (!ctx) throw new Error("useJoueur doit être utilisé dans <JoueurProvider>");
  return ctx;
}
