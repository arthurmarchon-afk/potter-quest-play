/**
 * Configuration des destinations marchandes de Pré-au-Lard.
 *
 * Pour brancher une vraie boutique plus tard, il suffit de remplacer les URL
 * ci-dessous (ou de renseigner les variables d'environnement VITE_BOUTIQUE_*).
 * Aucun autre fichier n'a besoin d'être modifié.
 */

export type Echoppe = {
  id: string;
  nom: string;
  enseigne: string;
  icone: string;
  specialite: string;
  description: string;
  url: string;
  /** Lien encore inactif : on affiche « bientôt » au lieu d'ouvrir un onglet. */
  bientot?: boolean;
};

const env = import.meta.env as Record<string, string | undefined>;

/** URL de repli tant que la vraie boutique n'existe pas. */
export const URL_BOUTIQUE = env["VITE_BOUTIQUE_URL"] ?? "https://example.com/potter-quest-boutique";

export const echoppes: Echoppe[] = [
  {
    id: "ollivander",
    nom: "Ollivander & Fils",
    enseigne: "Fabricants de baguettes depuis 382 av. J.-C.",
    icone: "🪄",
    specialite: "Baguettes",
    description:
      "Des milliers de coffrets poussiéreux empilés jusqu'au plafond. C'est la baguette qui choisit son sorcier.",
    url: env["VITE_BOUTIQUE_BAGUETTES_URL"] ?? URL_BOUTIQUE,
    bientot: !env["VITE_BOUTIQUE_BAGUETTES_URL"],
  },
  {
    id: "apothicaire",
    nom: "L'Apothicaire",
    enseigne: "Ingrédients rares & objets enchantés",
    icone: "🧪",
    specialite: "Potions",
    description:
      "Bocaux d'yeux de tritons, racines de mandragore et fioles de chance liquide alignées sur le comptoir de chêne.",
    url: env["VITE_BOUTIQUE_POTIONS_URL"] ?? URL_BOUTIQUE,
    bientot: !env["VITE_BOUTIQUE_POTIONS_URL"],
  },
  {
    id: "merch",
    nom: "Comptoir Potter Quest",
    enseigne: "Écharpes, parchemins & souvenirs de maison",
    icone: "🎁",
    specialite: "Produits dérivés",
    description:
      "Le comptoir officiel de l'aventure : écharpes aux couleurs de votre maison, carnets de sortilèges et affiches.",
    url: env["VITE_BOUTIQUE_MERCH_URL"] ?? URL_BOUTIQUE,
    bientot: !env["VITE_BOUTIQUE_MERCH_URL"],
  },
];
