import { appliquerRecompense, type Joueur, type Recompense } from "./joueur";

/* ------------------------------------------------------------------ objets */

export type Objet = {
  id: string;
  nom: string;
  icone: string;
  description: string;
  /** Effet obtenu en consommant l'objet. */
  effet?: Recompense;
};

export const objets: Record<string, Objet> = {
  chocogrenouille: {
    id: "chocogrenouille",
    nom: "Chocogrenouille",
    icone: "🍫",
    description: "Une friandise sautillante. Redonne un peu d'énergie magique.",
    effet: { xp: 30 },
  },
  fiole: {
    id: "fiole",
    nom: "Fiole de Felicis",
    icone: "🧪",
    description: "Quelques gouttes de chance liquide : un vrai coup de pouce.",
    effet: { xp: 90, gallions: 20 },
  },
  plume: {
    id: "plume",
    nom: "Plume dorée",
    icone: "🪶",
    description: "Elle rédige seule vos devoirs. Les professeurs sont généreux.",
    effet: { gallions: 60 },
  },
  patacitrouille: {
    id: "patacitrouille",
    nom: "Patacitrouille",
    icone: "🎃",
    description: "Pâtisserie des Trois Balais. Réconforte et rapporte des points.",
    effet: { xp: 40, points: 5 },
  },
  carte: {
    id: "carte",
    nom: "Carte du Maraudeur",
    icone: "🗺️",
    description: "Relique de collection. Se garde précieusement, ne se consomme pas.",
  },
  vif: {
    id: "vif",
    nom: "Vif d'or",
    icone: "🥇",
    description: "Trophée d'attrapeur. Preuve d'une saison remarquable.",
  },
};

/* ------------------------------------------------------------- compteurs */

export type CleCompteur = "parties" | "victoires" | "bonnes" | "xpJour";

export type Journal = {
  jour: string;
  compteurs: Record<CleCompteur, number>;
  reclamees: string[];
};

export type Totaux = Record<"parties" | "victoires" | "bonnes" | "parfaits", number>;

export const journalVide = (): Journal => ({
  jour: jourCourant(),
  compteurs: { parties: 0, victoires: 0, bonnes: 0, xpJour: 0 },
  reclamees: [],
});

export const totauxVides = (): Totaux => ({
  parties: 0,
  victoires: 0,
  bonnes: 0,
  parfaits: 0,
});

export function jourCourant(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Remet le journal à zéro si l'on a changé de jour. */
export function journalDuJour(j: Journal | undefined): Journal {
  const base = j ?? journalVide();
  if (base.jour !== jourCourant()) return journalVide();
  return base;
}

/* --------------------------------------------------------------- quêtes */

export type Quete = {
  id: string;
  titre: string;
  description: string;
  icone: string;
  compteur: CleCompteur;
  cible: number;
  recompense: Recompense;
  objet?: string;
};

export const quetesQuotidiennes: Quete[] = [
  {
    id: "q-parties",
    titre: "Journée studieuse",
    description: "Terminer 3 parties dans la salle des mini-jeux.",
    icone: "🎮",
    compteur: "parties",
    cible: 3,
    recompense: { xp: 60, gallions: 25, points: 5 },
  },
  {
    id: "q-victoire",
    titre: "Première victoire",
    description: "Remporter une partie, quel que soit le jeu.",
    icone: "🏅",
    compteur: "victoires",
    cible: 1,
    recompense: { xp: 80, gallions: 30, points: 10 },
    objet: "chocogrenouille",
  },
  {
    id: "q-quiz",
    titre: "Élève appliqué",
    description: "Donner 8 bonnes réponses au Quiz du Professeur.",
    icone: "📖",
    compteur: "bonnes",
    cible: 8,
    recompense: { xp: 70, gallions: 25, points: 5, stat: { cle: "intelligence", valeur: 1 } },
  },
  {
    id: "q-xp",
    titre: "Magie soutenue",
    description: "Accumuler 200 XP dans la journée.",
    icone: "✨",
    compteur: "xpJour",
    cible: 200,
    recompense: { xp: 100, gallions: 50, points: 10 },
    objet: "fiole",
  },
];

export function progressionQuete(j: Joueur, q: Quete) {
  const journal = journalDuJour(j.journal);
  const valeur = Math.min(q.cible, journal.compteurs[q.compteur] ?? 0);
  return {
    valeur,
    complete: valeur >= q.cible,
    reclamee: journal.reclamees.includes(q.id),
  };
}

/* --------------------------------------------------------------- succès */

export type Succes = {
  id: string;
  titre: string;
  description: string;
  icone: string;
  test: (j: Joueur) => boolean;
  recompense: Recompense;
  objet?: string;
};

export const succesListe: Succes[] = [
  {
    id: "s-choixpeau",
    titre: "Réparti",
    description: "Recevoir sa maison du Choixpeau magique.",
    icone: "🎩",
    test: (j) => j.maison !== null,
    recompense: { xp: 50, gallions: 20 },
  },
  {
    id: "s-niv3",
    titre: "Deuxième année",
    description: "Atteindre le niveau 3.",
    icone: "🕯️",
    test: (j) => j.niveau >= 3,
    recompense: { xp: 60, gallions: 40 },
    objet: "patacitrouille",
  },
  {
    id: "s-niv5",
    titre: "Préfet",
    description: "Atteindre le niveau 5.",
    icone: "🎖️",
    test: (j) => j.niveau >= 5,
    recompense: { xp: 120, gallions: 80, points: 15 },
    objet: "carte",
  },
  {
    id: "s-niv10",
    titre: "Sorcier accompli",
    description: "Atteindre le niveau 10.",
    icone: "🧙",
    test: (j) => j.niveau >= 10,
    recompense: { xp: 300, gallions: 200, points: 40 },
    objet: "vif",
  },
  {
    id: "s-victoires",
    titre: "Duelliste",
    description: "Remporter 10 parties au total.",
    icone: "⚔️",
    test: (j) => (j.totaux?.victoires ?? 0) >= 10,
    recompense: { xp: 150, gallions: 60, points: 20, stat: { cle: "courage", valeur: 1 } },
  },
  {
    id: "s-parfait",
    titre: "Sans une faute",
    description: "Terminer un quiz avec un score parfait.",
    icone: "🌟",
    test: (j) => (j.totaux?.parfaits ?? 0) >= 1,
    recompense: { xp: 140, gallions: 50, stat: { cle: "sagesse", valeur: 1 } },
    objet: "plume",
  },
  {
    id: "s-gallions",
    titre: "Coffre de Gringotts",
    description: "Posséder 500 Gallions.",
    icone: "🏦",
    test: (j) => j.gallions >= 500,
    recompense: { xp: 100, points: 10 },
  },
  {
    id: "s-points",
    titre: "Fierté de la maison",
    description: "Apporter 150 points à sa maison.",
    icone: "🏆",
    test: (j) => j.pointsMaison >= 150,
    recompense: { xp: 180, gallions: 70 },
  },
];

/** Débloque tous les succès nouvellement remplis et applique leurs récompenses. */
export function verifierSucces(j: Joueur): { joueur: Joueur; nouveaux: Succes[] } {
  let joueur = j;
  const nouveaux: Succes[] = [];
  for (const s of succesListe) {
    if (joueur.succes?.includes(s.id)) continue;
    if (!s.test(joueur)) continue;
    const res = appliquerRecompense(joueur, s.recompense);
    joueur = {
      ...res.joueur,
      succes: [...(joueur.succes ?? []), s.id],
      inventaire: s.objet ? ajouterObjet(joueur.inventaire, s.objet) : res.joueur.inventaire,
    };
    nouveaux.push(s);
  }
  return { joueur, nouveaux };
}

export function ajouterObjet(inv: Record<string, number> | undefined, id: string, n = 1) {
  const base = { ...(inv ?? {}) };
  base[id] = (base[id] ?? 0) + n;
  return base;
}
