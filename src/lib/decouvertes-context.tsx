import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  chargerDecouvertes,
  sauverDecouvertes,
  type EtatDecouvertes,
} from "@/lib/decouvertes";

type Ctx = {
  etat: EtatDecouvertes;
  /** Vrai si l'anecdote a déjà été lue. */
  connue: (id: string) => boolean;
  trouver: (id: string) => void;
  secretTrouve: (id: string) => boolean;
  revelerSecret: (id: string) => void;
  /** Total de trouvailles, tous types confondus. */
  total: number;
};

const DecouvertesContext = createContext<Ctx | null>(null);

export function DecouvertesProvider({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<EtatDecouvertes>({ anecdotes: [], secrets: [] });

  useEffect(() => {
    setEtat(chargerDecouvertes());
  }, []);

  const maj = useCallback((suivant: EtatDecouvertes) => {
    setEtat(suivant);
    sauverDecouvertes(suivant);
  }, []);

  const trouver = useCallback(
    (id: string) =>
      setEtat((e) => {
        if (e.anecdotes.includes(id)) return e;
        const s = { ...e, anecdotes: [...e.anecdotes, id] };
        sauverDecouvertes(s);
        return s;
      }),
    [],
  );

  const revelerSecret = useCallback(
    (id: string) =>
      setEtat((e) => {
        if (e.secrets.includes(id)) return e;
        const s = { ...e, secrets: [...e.secrets, id] };
        sauverDecouvertes(s);
        return s;
      }),
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      etat,
      connue: (id) => etat.anecdotes.includes(id),
      trouver,
      secretTrouve: (id) => etat.secrets.includes(id),
      revelerSecret,
      total: etat.anecdotes.length + etat.secrets.length,
    }),
    [etat, trouver, revelerSecret],
  );

  // Le mode Maraudeur teinte tout le site une fois le serment prononcé.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("maraudeur", etat.secrets.includes("maraudeurs"));
  }, [etat.secrets]);

  // `maj` reste disponible pour d'éventuelles réinitialisations futures.
  void maj;

  return <DecouvertesContext.Provider value={value}>{children}</DecouvertesContext.Provider>;
}

export function useDecouvertes() {
  const ctx = useContext(DecouvertesContext);
  if (!ctx) throw new Error("useDecouvertes doit être utilisé dans <DecouvertesProvider>");
  return ctx;
}
