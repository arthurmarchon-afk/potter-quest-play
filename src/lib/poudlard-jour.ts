/* « Que s'est-il passé à Poudlard aujourd'hui ? »
   Un fait du jour, identique pour tout le monde, qui change à minuit :
   le château continue d'exister quand le visiteur n'est pas là. */

export type FaitDuJour = {
  lieu: string;
  titre: string;
  texte: string;
};

const faits: readonly FaitDuJour[] = [
  {
    lieu: "Couloir du troisième étage",
    titre: "Une rumeur circule",
    texte:
      "Deux préfets jurent avoir entendu un escalier changer de direction sans prévenir. Rusard a passé la nuit à compter les marches.",
  },
  {
    lieu: "Bibliothèque · Réserve",
    titre: "Un ouvrage inhabituel est apparu",
    texte:
      "Un volume sans titre a été rangé entre deux traités de métamorphose. Il refuse de s'ouvrir avant le coucher du soleil.",
  },
  {
    lieu: "Grande Salle",
    titre: "Le plafond hésite",
    texte:
      "Le ciel enchanté est resté orageux toute la matinée, alors que dehors il faisait grand soleil. Personne n'a d'explication.",
  },
  {
    lieu: "Serres numéro trois",
    titre: "Une créature a été aperçue",
    texte:
      "Quelque chose de petit et de rapide a renversé trois pots de Mandragores. On a retrouvé des empreintes qui montent au mur.",
  },
  {
    lieu: "Cachots",
    titre: "Une odeur suspecte",
    texte:
      "Un chaudron a débordé pendant la nuit. La vapeur violette qui s'en échappe fait rimer involontairement ceux qui la respirent.",
  },
  {
    lieu: "Volière",
    titre: "Le courrier a du retard",
    texte:
      "Les hiboux refusent de partir vers le nord. Un vieux grand-duc tourne au-dessus de la tour depuis l'aube.",
  },
  {
    lieu: "Salle sur Demande",
    titre: "Une salle est exceptionnellement ouverte",
    texte:
      "Une porte est apparue au septième étage. Elle ne s'ouvre que pour ceux qui savent déjà ce qu'ils y cherchent.",
  },
] as const;

/** Index stable dérivé de la date : même fait pour tous, tout au long du jour. */
export function faitDuJour(d: Date = new Date()): FaitDuJour {
  const jours = Math.floor(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000,
  );
  return faits[((jours % faits.length) + faits.length) % faits.length]!;
}

/** Maison qui bénéficie d'une faveur du jour (points doublés dans le récit). */
export function maisonFavoriseeDuJour(d: Date = new Date()): number {
  const jours = Math.floor(
    Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000,
  );
  return ((jours * 3) % 4 + 4) % 4;
}
