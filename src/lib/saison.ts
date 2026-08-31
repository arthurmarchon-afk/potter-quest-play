import type { Joueur } from "./joueur";
import { emblemes, ordreMaisons } from "./joueur";
import type { Maison } from "./choixpeau";

export type Saison = {
  numero: number;
  nom: string;
  debut: Date;
  fin: Date;
  /** Progression 0-100 de la saison en cours. */
  progression: number;
  joursRestants: number;
};

const nomsSaisons = [
  "Trimestre d'Automne",
  "Trimestre d'Hiver",
  "Trimestre de Printemps",
  "Trimestre d'Été",
];

/** Saison courante : un trimestre calendaire. */
export function saisonCourante(maintenant = new Date()): Saison {
  const annee = maintenant.getFullYear();
  const t = Math.floor(maintenant.getMonth() / 3);
  const debut = new Date(annee, t * 3, 1);
  const fin = new Date(annee, t * 3 + 3, 0, 23, 59, 59);
  const total = fin.getTime() - debut.getTime();
  const ecoule = maintenant.getTime() - debut.getTime();
  return {
    numero: (annee - 2020) * 4 + t + 1,
    nom: `${nomsSaisons[t]} ${annee}`,
    debut,
    fin,
    progression: Math.round((ecoule / total) * 100),
    joursRestants: Math.max(0, Math.ceil((fin.getTime() - maintenant.getTime()) / 86400000)),
  };
}

export type Entree = {
  id: string;
  nom: string;
  maison: Maison;
  niveau: number;
  xp: number;
  joueur?: boolean;
};

const rivaux: { nom: string; maison: Maison; base: number }[] = [
  { nom: "Cassandra Vance", maison: "serdaigle", base: 1.25 },
  { nom: "Elias Rookwood", maison: "serpentard", base: 1.12 },
  { nom: "Maëlys Dubois", maison: "gryffondor", base: 1.05 },
  { nom: "Tobias Crane", maison: "poufsouffle", base: 0.95 },
  { nom: "Ines Sallow", maison: "serpentard", base: 0.88 },
  { nom: "Orion Fawley", maison: "serdaigle", base: 0.8 },
  { nom: "Prudence Bell", maison: "poufsouffle", base: 0.72 },
  { nom: "Rowan Kettleburn", maison: "gryffondor", base: 0.62 },
  { nom: "Anouk Lefèvre", maison: "gryffondor", base: 0.5 },
  { nom: "Silas Greengrass", maison: "serpentard", base: 0.4 },
];

/** Classement individuel : le joueur face aux élèves de l'école. */
export function classement(j: Joueur | null): Entree[] {
  const reference = Math.max(400, (j?.xpTotal ?? 0) + 200);
  const liste: Entree[] = rivaux.map((r, i) => ({
    id: `pnj-${i}`,
    nom: r.nom,
    maison: r.maison,
    xp: Math.round(reference * r.base),
    niveau: Math.max(1, Math.round((reference * r.base) / 220)),
  }));
  if (j) {
    liste.push({
      id: "joueur",
      nom: j.nom,
      maison: j.maison ?? "gryffondor",
      xp: j.xpTotal,
      niveau: j.niveau,
      joueur: true,
    });
  }
  return liste.sort((a, b) => b.xp - a.xp);
}

/** Classement des maisons pour la saison, alimenté par les points du joueur. */
export function classementMaisons(j: Joueur | null) {
  const referentiel: Record<Maison, number> = {
    gryffondor: 180,
    serpentard: 210,
    serdaigle: 165,
    poufsouffle: 145,
  };
  return ordreMaisons
    .map((m) => ({
      maison: m,
      embleme: emblemes[m],
      points: referentiel[m] + (j?.maison === m ? j.pointsMaison : 0),
      vous: j?.maison === m,
    }))
    .sort((a, b) => b.points - a.points);
}

/** Récompense de fin de saison estimée selon le rang. */
export function recompenseRang(rang: number) {
  if (rang === 1) return { titre: "Champion de la saison", xp: 500, gallions: 250 };
  if (rang <= 3) return { titre: "Podium de la saison", xp: 300, gallions: 150 };
  if (rang <= 6) return { titre: "Élève remarqué", xp: 150, gallions: 70 };
  return { titre: "Participation honorable", xp: 60, gallions: 30 };
}
