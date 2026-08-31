import type { Maison } from "./choixpeau";
import type { Journal, Totaux } from "./progression";

export type Stat = "intelligence" | "courage" | "magie" | "agilite" | "sagesse";

export const statsMeta: Record<Stat, { nom: string; icone: string }> = {
  intelligence: { nom: "Intelligence", icone: "📖" },
  courage: { nom: "Courage", icone: "🦁" },
  magie: { nom: "Magie", icone: "✨" },
  agilite: { nom: "Agilité", icone: "🌀" },
  sagesse: { nom: "Sagesse", icone: "🔮" },
};

export const emblemes: Record<Maison, string> = {
  gryffondor: "🦁",
  serpentard: "🐍",
  serdaigle: "🦅",
  poufsouffle: "🦡",
};

export const ordreMaisons: Maison[] = [
  "gryffondor",
  "serpentard",
  "serdaigle",
  "poufsouffle",
];

/** Statistiques de départ selon la maison. */
export const statsInitiales: Record<Maison, Record<Stat, number>> = {
  gryffondor: { intelligence: 4, courage: 9, magie: 6, agilite: 7, sagesse: 4 },
  serpentard: { intelligence: 7, courage: 6, magie: 8, agilite: 5, sagesse: 4 },
  serdaigle: { intelligence: 9, courage: 4, magie: 6, agilite: 4, sagesse: 7 },
  poufsouffle: { intelligence: 5, courage: 6, magie: 5, agilite: 6, sagesse: 8 },
};

export type Joueur = {
  nom: string;
  maison: Maison | null;
  niveau: number;
  xp: number; // XP accumulée dans le niveau courant
  xpTotal: number;
  gallions: number;
  pointsMaison: number; // points apportés par CE joueur
  stats: Record<Stat, number>;
  creeLe: string;
  /** Quêtes du jour : compteurs et récompenses réclamées. */
  journal: Journal;
  /** Compteurs cumulés sur toute la carrière. */
  totaux: Totaux;
  /** Identifiants des succès débloqués. */
  succes: string[];
  /** Objets possédés : identifiant -> quantité. */
  inventaire: Record<string, number>;
  /** Articles de la bibliothèque déjà lus. */
  decouvertes: string[];
  /** Lieux de Poudlard déjà explorés. */
  lieuxVisites: string[];
};

export type PointsMaisons = Record<Maison, number>;

/** Points de base des maisons (contexte de la Coupe), enrichis par le joueur. */
export const pointsBase: PointsMaisons = {
  gryffondor: 0,
  serpentard: 0,
  serdaigle: 0,
  poufsouffle: 0,
};

export const joueurVide = (nom = ""): Joueur => ({
  nom,
  maison: null,
  niveau: 1,
  xp: 0,
  xpTotal: 0,
  gallions: 0,
  pointsMaison: 0,
  stats: { intelligence: 3, courage: 3, magie: 3, agilite: 3, sagesse: 3 },
  creeLe: new Date().toISOString(),
  journal: {
    jour: new Date().toISOString().slice(0, 10),
    compteurs: { parties: 0, victoires: 0, bonnes: 0, xpJour: 0 },
    reclamees: [],
  },
  totaux: { parties: 0, victoires: 0, bonnes: 0, parfaits: 0 },
  succes: [],
  inventaire: {},
  decouvertes: [],
  lieuxVisites: [],
});

/** XP nécessaire pour passer du niveau n au niveau n+1. */
export function xpRequis(niveau: number): number {
  return 150 + (niveau - 1) * 100;
}

export type Recompense = {
  xp?: number;
  gallions?: number;
  points?: number;
  stat?: { cle: Stat; valeur: number };
};

export type ResultatGain = {
  joueur: Joueur;
  niveauxGagnes: number;
};

export function appliquerRecompense(j: Joueur, r: Recompense): ResultatGain {
  const joueur: Joueur = {
    ...j,
    stats: { ...j.stats },
  };
  let niveauxGagnes = 0;

  if (r.gallions) joueur.gallions += r.gallions;
  if (r.points) joueur.pointsMaison += r.points;
  if (r.stat) joueur.stats[r.stat.cle] += r.stat.valeur;

  if (r.xp) {
    joueur.xp += r.xp;
    joueur.xpTotal += r.xp;
    while (joueur.xp >= xpRequis(joueur.niveau)) {
      joueur.xp -= xpRequis(joueur.niveau);
      joueur.niveau += 1;
      niveauxGagnes += 1;
      joueur.gallions += 50; // bonus de niveau
    }
  }

  return { joueur, niveauxGagnes };
}

export const CLE_STOCKAGE = "potter-quest:joueur:v1";

export function chargerJoueur(): Joueur | null {
  if (typeof window === "undefined") return null;
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return null;
    const parse = JSON.parse(brut) as Partial<Joueur>;
    if (!parse || typeof parse.nom !== "string") return null;
    return { ...joueurVide(parse.nom), ...parse } as Joueur;
  } catch {
    return null;
  }
}

export function sauverJoueur(j: Joueur) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(j));
  } catch {
    /* stockage indisponible */
  }
}

export function effacerJoueur() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CLE_STOCKAGE);
}

/** Points totaux affichés dans la Coupe : base + contribution du joueur. */
export function pointsCoupe(j: Joueur | null): PointsMaisons {
  const p = { ...pointsBase };
  if (j?.maison) p[j.maison] += j.pointsMaison;
  return p;
}
