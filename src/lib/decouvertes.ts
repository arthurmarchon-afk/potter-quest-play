/* Couche « curiosité » : anecdotes cachées dans le décor et secrets du château.
   Rien n'est listé à l'avance pour le visiteur : le compteur affiche « n / ??? ». */

export type Anecdote = {
  id: string;
  /** Objet du décor derrière lequel se cache l'anecdote. */
  objet: string;
  titre: string;
  texte: string;
};

/** Anecdotes trouvables en observant les scènes (train, gare, château…). */
export const anecdotes: readonly Anecdote[] = [
  {
    id: "chariot",
    objet: "Le chariot de friandises",
    titre: "Le saviez-vous ?",
    texte:
      "Les Chocogrenouilles des tournages étaient en cire pour ne pas fondre sous les projecteurs ; les rares versions comestibles disparaissaient en quelques prises.",
  },
  {
    id: "valise",
    objet: "Une valise en cuir bouilli",
    titre: "Détail de décor",
    texte:
      "Chaque malle d'élève portait des initiales peintes à la main. Les accessoiristes en fabriquaient plusieurs centaines, dont beaucoup ne sont jamais visibles à l'écran.",
  },
  {
    id: "hibou",
    objet: "Une cage à hibou entrouverte",
    titre: "Le saviez-vous ?",
    texte:
      "Sept chouettes harfangs différentes ont interprété Hedwige ; la principale, Gizmo, refusait de voler tant qu'elle n'avait pas mangé.",
  },
  {
    id: "livre-compartiment",
    objet: "Un manuel abandonné sur la banquette",
    titre: "Livres contre films",
    texte:
      "Dans les romans, le Poudlard Express met presque toute une journée à rejoindre l'Écosse. À l'écran, le trajet tient en trois plans et un viaduc.",
  },
  {
    id: "vitre",
    objet: "La buée sur la vitre",
    titre: "Tournage",
    texte:
      "La pluie des fenêtres du train était projetée depuis des rampes à eau, image par image, pour que les gouttes glissent toujours dans le bon sens du mouvement.",
  },
  {
    id: "horloge",
    objet: "L'horloge du quai",
    titre: "King's Cross",
    texte:
      "Le vrai mur du quai 9¾ se trouve entre les voies 4 et 5 : l'architecture des quais 9 et 10 ne convenait pas au cadrage.",
  },
  {
    id: "bougies",
    objet: "Les chandelles flottantes",
    titre: "Grande Salle",
    texte:
      "Les premières bougies suspendues étaient de vraies bougies tenues par des fils. Les fils ont commencé à brûler : la suite a été faite en images de synthèse.",
  },
  {
    id: "portrait",
    objet: "Un portrait qui vous suit du regard",
    titre: "Couloirs",
    texte:
      "Beaucoup de tableaux du château représentent des membres de l'équipe technique, peints à l'huile puis animés en post-production.",
  },
  {
    id: "armure",
    objet: "Une armure qui grince",
    titre: "Détail de décor",
    texte:
      "Les armures des couloirs étaient en résine peinte : trop lourdes en métal, elles auraient été impossibles à déplacer entre deux plans.",
  },
  {
    id: "sablier",
    objet: "Les sabliers des maisons",
    titre: "Le saviez-vous ?",
    texte:
      "Les sabliers de la Coupe contiennent des pierres semi-précieuses : rubis, émeraudes, saphirs et topazes, une matière par maison.",
  },
] as const;

export const anecdoteParId = Object.fromEntries(anecdotes.map((a) => [a.id, a])) as Record<
  string,
  Anecdote
>;

/* --------------------------------------------------------------- secrets */

export type Secret = {
  id: string;
  nom: string;
  texte: string;
};

/** Secrets « majeurs » : jamais listés, seulement révélés une fois trouvés. */
export const secrets: readonly Secret[] = [
  {
    id: "maraudeurs",
    nom: "La carte du Maraudeur",
    texte:
      "Le parchemin s'est couvert d'encre. Des pas se déplacent dans les couloirs — certains ne devraient pas être là.",
  },
  {
    id: "passage",
    nom: "Le passage de la sorcière borgne",
    texte:
      "Derrière la statue, un escalier descend vers Pré-au-Lard. Personne ne vous a vu partir.",
  },
  {
    id: "obscur",
    nom: "Une invitation sans signature",
    texte:
      "Une lettre glissée sous la porte, scellée de cire noire. Elle ne porte aucun nom, seulement une heure.",
  },
] as const;

/* ---------------------------------------------------------- persistance */

const CLE = "potterquest.decouvertes.v1";

export type EtatDecouvertes = {
  anecdotes: string[];
  secrets: string[];
};

const vide: EtatDecouvertes = { anecdotes: [], secrets: [] };

export function chargerDecouvertes(): EtatDecouvertes {
  if (typeof window === "undefined") return vide;
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return vide;
    const j = JSON.parse(brut) as Partial<EtatDecouvertes>;
    return {
      anecdotes: Array.isArray(j.anecdotes) ? j.anecdotes : [],
      secrets: Array.isArray(j.secrets) ? j.secrets : [],
    };
  } catch {
    return vide;
  }
}

export function sauverDecouvertes(e: EtatDecouvertes) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CLE, JSON.stringify(e));
  } catch {
    /* stockage indisponible : la découverte reste le temps de la visite */
  }
}
