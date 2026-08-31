import type { Joueur, Stat } from "./joueur";

export type SortDuel = {
  id: string;
  nom: string;
  icone: string;
  description: string;
  /** Dégâts de base. */
  degats: number;
  /** Coût en énergie magique. */
  cout: number;
  /** Bouclier accordé pour le tour. */
  bouclier?: number;
  /** Soin appliqué au lanceur. */
  soin?: number;
  /** Statistique qui amplifie le sort. */
  stat: Stat;
  /** Probabilité de réussite de base (0-1). */
  precision: number;
};

export const sortsDuel: SortDuel[] = [
  {
    id: "expelliarmus",
    nom: "Expelliarmus",
    icone: "🪄",
    description: "Désarme l'adversaire. Fiable et peu coûteux.",
    degats: 12,
    cout: 10,
    stat: "magie",
    precision: 0.95,
  },
  {
    id: "stupefix",
    nom: "Stupéfix",
    icone: "⚡",
    description: "Un choc brutal, plus difficile à placer.",
    degats: 22,
    cout: 20,
    stat: "courage",
    precision: 0.8,
  },
  {
    id: "protego",
    nom: "Protego",
    icone: "🛡️",
    description: "Dresse un bouclier pour le tour adverse.",
    degats: 0,
    cout: 12,
    bouclier: 22,
    stat: "sagesse",
    precision: 1,
  },
  {
    id: "episkey",
    nom: "Episkey",
    icone: "💚",
    description: "Referme les blessures légères.",
    degats: 0,
    cout: 18,
    soin: 22,
    stat: "sagesse",
    precision: 1,
  },
  {
    id: "levicorpus",
    nom: "Levicorpus",
    icone: "🌀",
    description: "Suspend l'adversaire par la cheville.",
    degats: 17,
    cout: 15,
    stat: "agilite",
    precision: 0.88,
  },
  {
    id: "confringo",
    nom: "Confringo",
    icone: "💥",
    description: "Explosion dévastatrice, mais capricieuse.",
    degats: 34,
    cout: 32,
    stat: "magie",
    precision: 0.68,
  },
  {
    id: "legilimens",
    nom: "Legilimens",
    icone: "🔮",
    description: "Lit les intentions : dégâts modérés, toujours efficace.",
    degats: 14,
    cout: 14,
    stat: "intelligence",
    precision: 1,
  },
];

export type Adversaire = {
  id: string;
  nom: string;
  icone: string;
  niveau: number;
  pv: number;
  puissance: number;
  description: string;
  recompense: { xp: number; gallions: number; points: number };
};

export const adversaires: Adversaire[] = [
  {
    id: "epouvantard",
    nom: "Épouvantard",
    icone: "👻",
    niveau: 1,
    pv: 70,
    puissance: 0.7,
    description: "Une peur qui prend forme. Parfait pour un premier duel.",
    recompense: { xp: 80, gallions: 30, points: 5 },
  },
  {
    id: "eleve",
    nom: "Duelliste de Serpentard",
    icone: "🐍",
    niveau: 3,
    pv: 100,
    puissance: 1,
    description: "Un camarade ambitieux, entraîné au club de duel.",
    recompense: { xp: 140, gallions: 55, points: 10 },
  },
  {
    id: "mangemort",
    nom: "Mangemort masqué",
    icone: "🎭",
    niveau: 6,
    pv: 140,
    puissance: 1.3,
    description: "Rapide, brutal, sans pitié. Réservé aux sorciers aguerris.",
    recompense: { xp: 240, gallions: 100, points: 20 },
  },
  {
    id: "detraqueur",
    nom: "Détraqueur",
    icone: "🕯️",
    niveau: 9,
    pv: 180,
    puissance: 1.55,
    description: "Le froid gagne la salle. Seul un Patronus le repousse.",
    recompense: { xp: 360, gallions: 160, points: 35 },
  },
  {
    id: "voldemort",
    nom: "Le Seigneur des Ténèbres",
    icone: "☠️",
    niveau: 14,
    pv: 240,
    puissance: 1.85,
    description: "Le duel ultime. Peu en reviennent indemnes.",
    recompense: { xp: 600, gallions: 300, points: 60 },
  },
];

export function pvJoueur(j: Joueur): number {
  return 80 + j.niveau * 10 + (j.stats?.courage ?? 0) * 3;
}

export function energieJoueur(j: Joueur): number {
  return 60 + j.niveau * 5 + (j.stats?.magie ?? 0) * 3;
}

/** Dégâts effectifs d'un sort lancé par le joueur. */
export function degatsSort(j: Joueur, s: SortDuel): number {
  const bonus = 1 + (j.stats?.[s.stat] ?? 0) * 0.04;
  const alea = 0.85 + Math.random() * 0.3;
  return Math.round(s.degats * bonus * alea);
}

export function soinSort(j: Joueur, s: SortDuel): number {
  if (!s.soin) return 0;
  return Math.round(s.soin * (1 + (j.stats?.sagesse ?? 0) * 0.03));
}

export function reussite(j: Joueur, s: SortDuel): boolean {
  const p = Math.min(0.98, s.precision + (j.stats?.[s.stat] ?? 0) * 0.01);
  return Math.random() < p;
}

export function attaqueAdversaire(a: Adversaire): { degats: number; texte: string } {
  const coups = [
    { texte: "lance un sortilège cinglant", base: 14 },
    { texte: "riposte d'un éclair violet", base: 18 },
    { texte: "frappe d'un maléfice sournois", base: 22 },
    { texte: "hésite : son sort frôle votre épaule", base: 7 },
  ];
  const c = coups[Math.floor(Math.random() * coups.length)]!;
  return {
    degats: Math.round(c.base * a.puissance * (0.85 + Math.random() * 0.3)),
    texte: `${a.nom} ${c.texte}`,
  };
}
