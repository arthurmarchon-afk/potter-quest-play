import type { Maison } from "./choixpeau";

/* Cérémonie de répartition : des scènes vécues, pas un questionnaire.
   Les poids restent invisibles pour le visiteur — le Choixpeau seul sait. */

export type OptionScene = {
  id: string;
  /** Ce que fait le sorcier, écrit à la première personne. */
  geste: string;
  /** Murmure du Choixpeau après le geste. */
  murmure: string;
  poids: Partial<Record<Maison, number>>;
  /** Attirance pour les arts sombres, révélée bien plus tard. */
  obscur?: number;
};

export type SceneCeremonie = {
  id: string;
  lieu: string;
  /** Décor de la scène, en une phrase. */
  tableau: string;
  situation: string;
  options: OptionScene[];
};

export const scenesCeremonie: readonly SceneCeremonie[] = [
  {
    id: "quai",
    lieu: "Quai 9¾ — 10 h 52",
    tableau: "La vapeur monte jusqu'à la verrière ; le train siffle une première fois.",
    situation:
      "Un enfant plus jeune que vous n'ose pas traverser le mur. Sa malle tremble entre ses mains.",
    options: [
      {
        id: "quai-1",
        geste: "Je prends son chariot et je cours avec lui.",
        murmure: "Tu ne demandes pas la permission, toi. Tu y vas.",
        poids: { gryffondor: 3, poufsouffle: 1 },
      },
      {
        id: "quai-2",
        geste: "Je lui explique le mur, pierre par pierre, jusqu'à ce qu'il comprenne.",
        murmure: "Comprendre avant d'agir… voilà une habitude.",
        poids: { serdaigle: 3, poufsouffle: 1 },
      },
      {
        id: "quai-3",
        geste: "Je reste avec lui jusqu'à ce qu'il se décide, même si je rate le départ.",
        murmure: "Tu donnerais ton siège pour un inconnu. C'est rare.",
        poids: { poufsouffle: 3, gryffondor: 1 },
      },
      {
        id: "quai-4",
        geste: "Je passe devant : le train n'attendra personne, et j'ai un compartiment à choisir.",
        murmure: "Tu vois loin. Certains appelleront cela de la froideur.",
        poids: { serpentard: 3, serdaigle: 1 },
        obscur: 1,
      },
    ],
  },
  {
    id: "compartiment",
    lieu: "Poudlard Express — troisième wagon",
    tableau: "La campagne défile ; une pluie fine raye la vitre.",
    situation:
      "Trois élèves se moquent d'un garçon dont la robe est trop grande. Personne ne bouge.",
    options: [
      {
        id: "comp-1",
        geste: "Je me lève et je leur dis d'arrêter, à voix haute.",
        murmure: "Ta voix porte. Tu ne crains pas d'être seul de ton camp.",
        poids: { gryffondor: 3 },
      },
      {
        id: "comp-2",
        geste: "Je m'assieds à côté de lui et je parle d'autre chose.",
        murmure: "Tu répares sans faire de bruit.",
        poids: { poufsouffle: 3 },
      },
      {
        id: "comp-3",
        geste: "Je retiens leurs noms. On se recroisera.",
        murmure: "Une dette notée est une dette qui se paie. Tu sais attendre.",
        poids: { serpentard: 3 },
        obscur: 2,
      },
      {
        id: "comp-4",
        geste: "Je lance un sortilège de couture appris la veille dans un manuel.",
        murmure: "Tu as lu avant même d'arriver. Évidemment.",
        poids: { serdaigle: 3, poufsouffle: 1 },
      },
    ],
  },
  {
    id: "barque",
    lieu: "Le lac noir — la nuit",
    tableau: "Les barques glissent ; le château apparaît d'un coup, brûlant de fenêtres.",
    situation: "Quelque chose bouge sous la coque. L'eau se creuse d'un long remous.",
    options: [
      {
        id: "barque-1",
        geste: "Je plonge la main dans l'eau noire pour voir.",
        murmure: "La peur ne te retient pas assez longtemps pour t'être utile.",
        poids: { gryffondor: 3, serpentard: 1 },
      },
      {
        id: "barque-2",
        geste: "Je compte les remous : ils reviennent toutes les sept secondes.",
        murmure: "Un motif. Toujours un motif, chez toi.",
        poids: { serdaigle: 3 },
      },
      {
        id: "barque-3",
        geste: "Je passe un bras devant l'élève assis au bord.",
        murmure: "Protéger d'abord. Comprendre ensuite.",
        poids: { poufsouffle: 3, gryffondor: 1 },
      },
      {
        id: "barque-4",
        geste: "Je me tais : inutile d'affoler la barque et de perdre l'avantage.",
        murmure: "Tu gardes ce que tu sais. C'est une forme de pouvoir.",
        poids: { serpentard: 3 },
        obscur: 1,
      },
    ],
  },
  {
    id: "escalier",
    lieu: "Les escaliers mouvants",
    tableau: "Une volée de marches pivote et vous laisse devant un couloir interdit.",
    situation: "La porte du fond est entrebâillée. Rien n'oblige à s'en approcher.",
    options: [
      {
        id: "esc-1",
        geste: "J'entre, baguette levée.",
        murmure: "Bien sûr que tu entres.",
        poids: { gryffondor: 3 },
        obscur: 1,
      },
      {
        id: "esc-2",
        geste: "Je relève les runes gravées sur le montant avant de décider.",
        murmure: "Tu lis les murs comme d'autres lisent les visages.",
        poids: { serdaigle: 3 },
      },
      {
        id: "esc-3",
        geste: "Je fais demi-tour : ce couloir n'est pas le mien ce soir.",
        murmure: "De la mesure. On la confond souvent avec de la timidité.",
        poids: { poufsouffle: 3 },
      },
      {
        id: "esc-4",
        geste: "Je repère la porte, je m'en vais — et je reviendrai seul, plus tard.",
        murmure: "Patient. Calculateur. Je connais cette musique.",
        poids: { serpentard: 3 },
        obscur: 2,
      },
    ],
  },
  {
    id: "miroir",
    lieu: "Une salle abandonnée — le Miroir",
    tableau: "Un grand miroir doré, une inscription à l'envers gravée sur le fronton.",
    situation: "Le verre s'anime. Vous vous y voyez, mais autrement.",
    options: [
      {
        id: "mir-1",
        geste: "Je me vois debout devant une foule que je protège.",
        murmure: "Le courage se rêve avant de s'exercer.",
        poids: { gryffondor: 3 },
      },
      {
        id: "mir-2",
        geste: "Je me vois au sommet, enfin reconnu de tous.",
        murmure: "Ah. L'ambition, nue, sans excuse. J'aime cette franchise.",
        poids: { serpentard: 3 },
        obscur: 2,
      },
      {
        id: "mir-3",
        geste: "Je me vois comprenant enfin ce que personne n'a compris.",
        murmure: "Le savoir comme désir. Il ne se rassasie jamais.",
        poids: { serdaigle: 3 },
      },
      {
        id: "mir-4",
        geste: "Je me vois entouré des miens, tous vivants, tous là.",
        murmure: "Rien de spectaculaire. Et pourtant, presque personne ne voit cela.",
        poids: { poufsouffle: 3 },
      },
    ],
  },
  {
    id: "faute",
    lieu: "Grande Salle — le lendemain",
    tableau: "Les chandelles flottent bas ; les couverts se sont tus d'un coup.",
    situation:
      "On vous accuse d'une faute que vous n'avez pas commise. Vous savez qui l'a commise.",
    options: [
      {
        id: "faute-1",
        geste: "Je me lève et je dis la vérité devant tout le monde.",
        murmure: "Debout, tout de suite. Sans peser le prix.",
        poids: { gryffondor: 3 },
      },
      {
        id: "faute-2",
        geste: "Je prends la punition : le dénoncer briserait davantage.",
        murmure: "Porter la faute d'un autre… peu de gens en sont capables.",
        poids: { poufsouffle: 3 },
      },
      {
        id: "faute-3",
        geste: "Je démonte l'accusation point par point, sans nommer personne.",
        murmure: "Tu gagnes sans salir. Élégant.",
        poids: { serdaigle: 3 },
      },
      {
        id: "faute-4",
        geste: "Je me tais, et je m'arrange pour qu'il me doive quelque chose.",
        murmure: "Une faveur vaut mieux qu'une vengeance. Tu l'as compris seul.",
        poids: { serpentard: 3 },
        obscur: 3,
      },
    ],
  },
  {
    id: "epouvantard",
    lieu: "Salle de Défense — l'armoire tremble",
    tableau: "Le bois grince. Ce qui est enfermé là prendra votre forme la plus intime.",
    situation: "Vous êtes le prochain. La porte s'ouvre.",
    options: [
      {
        id: "epo-1",
        geste: "Ma propre lâcheté, un jour, au mauvais moment.",
        murmure: "Tu crains de manquer de courage : c'est déjà en avoir.",
        poids: { gryffondor: 3 },
      },
      {
        id: "epo-2",
        geste: "L'oubli. Une vie qui ne laisse aucune trace.",
        murmure: "Tu veux durer. Cela ne pardonne pas grand-chose.",
        poids: { serpentard: 3 },
        obscur: 1,
      },
      {
        id: "epo-3",
        geste: "L'ignorance, définitive, sur la seule question qui compte.",
        murmure: "Un gouffre sans fond. Tu y tomberas souvent.",
        poids: { serdaigle: 3 },
      },
      {
        id: "epo-4",
        geste: "La trahison d'un proche.",
        murmure: "Tu confies beaucoup. Cela se paie parfois.",
        poids: { poufsouffle: 3 },
      },
    ],
  },
  {
    id: "tabouret",
    lieu: "Le tabouret — sous le Choixpeau",
    tableau: "Le feutre descend sur vos yeux. La salle disparaît.",
    situation: "« Et toi… où voudrais-tu aller ? » Le chapeau écoute vraiment.",
    options: [
      {
        id: "tab-1",
        geste: "« Là où l'on ne recule pas. »",
        murmure: "Alors qu'il en soit ainsi.",
        poids: { gryffondor: 2 },
      },
      {
        id: "tab-2",
        geste: "« Là où l'on me laissera devenir quelqu'un. »",
        murmure: "Tu iras loin. Reste à savoir par où.",
        poids: { serpentard: 2 },
        obscur: 1,
      },
      {
        id: "tab-3",
        geste: "« Là où l'on cherche encore. »",
        murmure: "Les questions t'attendront toute ta vie.",
        poids: { serdaigle: 2 },
      },
      {
        id: "tab-4",
        geste: "« Là où l'on ne me lâchera pas. »",
        murmure: "On ne te lâchera pas.",
        poids: { poufsouffle: 2 },
      },
      {
        id: "tab-5",
        geste: "« Pas Serpentard. Tout, mais pas Serpentard. »",
        murmure: "Tu es sûr ? Tu pourrais y être grand… vraiment grand.",
        poids: { gryffondor: 2, serpentard: 1 },
      },
    ],
  },
] as const;

export type VerdictCeremonie = {
  maison: Maison;
  /** Maison qui a failli l'emporter : le Choixpeau hésite toujours. */
  hesitation: Maison | null;
  obscur: number;
};

export function verdict(choix: readonly OptionScene[]): VerdictCeremonie {
  const scores: Record<Maison, number> = {
    gryffondor: 0,
    serpentard: 0,
    serdaigle: 0,
    poufsouffle: 0,
  };
  let obscur = 0;
  for (const o of choix) {
    obscur += o.obscur ?? 0;
    for (const [m, p] of Object.entries(o.poids) as [Maison, number][]) {
      scores[m] += p;
    }
  }
  const classe = (Object.keys(scores) as Maison[]).sort((a, b) => scores[b] - scores[a]);
  const maison = classe[0] ?? "gryffondor";
  const second = classe[1] ?? null;
  const ecart = second ? scores[maison] - scores[second] : 99;
  return { maison, hesitation: ecart <= 3 ? second : null, obscur };
}
