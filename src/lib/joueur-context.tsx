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
import {
  ajouterObjet,
  journalDuJour,
  objets,
  progressionQuete,
  quetesQuotidiennes,
  verifierSucces,
  type CleCompteur,
} from "./progression";

export type EvenementJeu = {
  victoire?: boolean;
  bonnes?: number;
  parfait?: boolean;
};

type Notif = { id: number; lignes: string[]; niveau?: number | undefined };

type Ctx = {
  joueur: Joueur | null;
  pret: boolean;
  creerSorcier: (nom: string) => void;
  definirMaison: (maison: Maison) => void;
  gagner: (r: Recompense, contexte?: string) => void;
  signalerPartie: (evt: EvenementJeu) => void;
  reclamerQuete: (id: string) => void;
  utiliserObjet: (id: string) => void;
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
        const { joueur: final } = verifierSucces(j);
        sauverJoueur(final);
        return final;
      });
    },
    [],
  );

  const gagner = useCallback(
    (r: Recompense, contexte?: string) => {
      setJoueur((prev) => {
        if (!prev) return prev;
        const { joueur: base, niveauxGagnes } = appliquerRecompense(prev, r);
        const journal = journalDuJour(base.journal);
        const avecJournal: Joueur = {
          ...base,
          journal: {
            ...journal,
            compteurs: {
              ...journal.compteurs,
              xpJour: journal.compteurs.xpJour + (r.xp ?? 0),
            },
          },
        };
        const { joueur: j, nouveaux } = verifierSucces(avecJournal);
        sauverJoueur(j);
        if (nouveaux.length) {
          setTimeout(
            () => pousser(nouveaux.map((s) => `🏅 Succès débloqué — ${s.titre}`)),
            600,
          );
        }
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

  const signalerPartie = useCallback((evt: EvenementJeu) => {
    setJoueur((prev) => {
      if (!prev) return prev;
      const journal = journalDuJour(prev.journal);
      const inc = (cle: CleCompteur, n: number) => (journal.compteurs[cle] ?? 0) + n;
      const j: Joueur = {
        ...prev,
        journal: {
          ...journal,
          compteurs: {
            ...journal.compteurs,
            parties: inc("parties", 1),
            victoires: inc("victoires", evt.victoire ? 1 : 0),
            bonnes: inc("bonnes", evt.bonnes ?? 0),
          },
        },
        totaux: {
          parties: (prev.totaux?.parties ?? 0) + 1,
          victoires: (prev.totaux?.victoires ?? 0) + (evt.victoire ? 1 : 0),
          bonnes: (prev.totaux?.bonnes ?? 0) + (evt.bonnes ?? 0),
          parfaits: (prev.totaux?.parfaits ?? 0) + (evt.parfait ? 1 : 0),
        },
      };
      sauverJoueur(j);
      return j;
    });
  }, []);

  const reclamerQuete = useCallback(
    (id: string) => {
      setJoueur((prev) => {
        if (!prev) return prev;
        const q = quetesQuotidiennes.find((x) => x.id === id);
        if (!q) return prev;
        const etat = progressionQuete(prev, q);
        if (!etat.complete || etat.reclamee) return prev;
        const journal = journalDuJour(prev.journal);
        const { joueur: base } = appliquerRecompense(prev, q.recompense);
        const j: Joueur = {
          ...base,
          journal: { ...journal, reclamees: [...journal.reclamees, q.id] },
          inventaire: q.objet ? ajouterObjet(base.inventaire, q.objet) : base.inventaire,
        };
        const { joueur: final, nouveaux } = verifierSucces(j);
        sauverJoueur(final);
        const lignes = [`📜 Quête accomplie — ${q.titre}`];
        if (q.recompense.xp) lignes.push(`✨ +${q.recompense.xp} XP`);
        if (q.recompense.gallions) lignes.push(`🪙 +${q.recompense.gallions} Gallions`);
        if (q.recompense.points) lignes.push(`🏆 +${q.recompense.points} points`);
        if (q.objet) lignes.push(`${objets[q.objet]?.icone ?? "🎁"} ${objets[q.objet]?.nom}`);
        pousser(lignes);
        if (nouveaux.length) {
          setTimeout(
            () => pousser(nouveaux.map((s) => `🏅 Succès débloqué — ${s.titre}`)),
            600,
          );
        }
        return final;
      });
    },
    [pousser],
  );

  const utiliserObjet = useCallback(
    (id: string) => {
      setJoueur((prev) => {
        if (!prev) return prev;
        const objet = objets[id];
        const reste = prev.inventaire?.[id] ?? 0;
        if (!objet?.effet || reste <= 0) return prev;
        const { joueur: base } = appliquerRecompense(prev, objet.effet);
        const inventaire = { ...base.inventaire, [id]: reste - 1 };
        if (inventaire[id] === 0) delete inventaire[id];
        const { joueur: final, nouveaux } = verifierSucces({ ...base, inventaire });
        sauverJoueur(final);
        const lignes = [`${objet.icone} ${objet.nom} utilisé`];
        if (objet.effet.xp) lignes.push(`✨ +${objet.effet.xp} XP`);
        if (objet.effet.gallions) lignes.push(`🪙 +${objet.effet.gallions} Gallions`);
        if (objet.effet.points) lignes.push(`🏆 +${objet.effet.points} points`);
        pousser(lignes);
        if (nouveaux.length) {
          setTimeout(
            () => pousser(nouveaux.map((s) => `🏅 Succès débloqué — ${s.titre}`)),
            600,
          );
        }
        return final;
      });
    },
    [pousser],
  );

  const reinitialiser = useCallback(() => {
    effacerJoueur();
    setJoueur(null);
  }, []);

  const value = useMemo(
    () => ({
      joueur,
      pret,
      creerSorcier,
      definirMaison,
      gagner,
      signalerPartie,
      reclamerQuete,
      utiliserObjet,
      reinitialiser,
      notifs,
    }),
    [
      joueur,
      pret,
      creerSorcier,
      definirMaison,
      gagner,
      signalerPartie,
      reclamerQuete,
      utiliserObjet,
      reinitialiser,
      notifs,
    ],
  );

  return <JoueurContext.Provider value={value}>{children}</JoueurContext.Provider>;
}

export function useJoueur() {
  const ctx = useContext(JoueurContext);
  if (!ctx) throw new Error("useJoueur doit être utilisé dans <JoueurProvider>");
  return ctx;
}
