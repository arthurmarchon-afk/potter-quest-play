export type Maison = "gryffondor" | "serpentard" | "serdaigle" | "poufsouffle";

export type Reponse = { texte: string; maison: Maison };
export type QuestionChoixpeau = { question: string; reponses: Reponse[] };

export const maisons: Record<
  Maison,
  { nom: string; initiale: string; devise: string; traits: string[]; couleur: string }
> = {
  gryffondor: {
    nom: "Gryffondor",
    initiale: "G",
    devise: "Le courage avant tout.",
    traits: [
      "La bravoure est votre force première.",
      "Vous foncez là où les autres hésitent.",
      "Point d'honneur : vous n'abandonnez jamais.",
    ],
    couleur: "var(--gryffondor)",
  },
  serpentard: {
    nom: "Serpentard",
    initiale: "S",
    devise: "L'ambition trace la voie.",
    traits: [
      "Vous savez ce que vous voulez, et comment l'obtenir.",
      "La ruse vaut mieux qu'un duel perdu d'avance.",
      "Vos alliances sont choisies, jamais subies.",
    ],
    couleur: "var(--serpentard)",
  },
  serdaigle: {
    nom: "Serdaigle",
    initiale: "R",
    devise: "L'esprit sans limite.",
    traits: [
      "Vous cherchez la réponse plus que la victoire.",
      "Un livre ouvert vaut mille baguettes.",
      "Votre curiosité ne dort jamais.",
    ],
    couleur: "var(--serdaigle)",
  },
  poufsouffle: {
    nom: "Poufsouffle",
    initiale: "P",
    devise: "La loyauté, patiemment.",
    traits: [
      "Vous tenez parole, toujours.",
      "Le travail honnête vous porte plus loin que la gloire.",
      "On vous confie ce qu'on ne dit à personne.",
    ],
    couleur: "var(--poufsouffle)",
  },
};

export const questionsChoixpeau: QuestionChoixpeau[] = [
  {
    question: "Si votre patronus était une créature, que serait-il ?",
    reponses: [
      { texte: "Un cerf — fidèle et lumineux", maison: "gryffondor" },
      { texte: "Un serpent — patient et calculateur", maison: "serpentard" },
      { texte: "Un corbeau — curieux et vif d'esprit", maison: "serdaigle" },
      { texte: "Un blaireau — obstiné et généreux", maison: "poufsouffle" },
    ],
  },
  {
    question: "Un couloir interdit s'ouvre devant vous à minuit. Vous...",
    reponses: [
      { texte: "J'y entre, la baguette levée", maison: "gryffondor" },
      { texte: "J'observe qui d'autre y va, puis j'en tire parti", maison: "serpentard" },
      { texte: "Je note les runes gravées sur la porte", maison: "serdaigle" },
      { texte: "Je préviens un ami avant de faire quoi que ce soit", maison: "poufsouffle" },
    ],
  },
  {
    question: "Quel objet emporteriez-vous dans votre malle ?",
    reponses: [
      { texte: "Une épée héritée d'un ancêtre", maison: "gryffondor" },
      { texte: "Une bague qui ouvre bien des portes", maison: "serpentard" },
      { texte: "Un grimoire annoté à la main", maison: "serdaigle" },
      { texte: "Un chaudron et de quoi soigner", maison: "poufsouffle" },
    ],
  },
  {
    question: "On vous accuse à tort devant toute la Grande Salle. Vous...",
    reponses: [
      { texte: "Je me lève et je réponds, fort", maison: "gryffondor" },
      { texte: "Je me tais et je prépare ma revanche", maison: "serpentard" },
      { texte: "Je démonte l'accusation, preuve par preuve", maison: "serdaigle" },
      { texte: "Je demande à m'expliquer calmement, en privé", maison: "poufsouffle" },
    ],
  },
  {
    question: "Quel cours attendez-vous chaque semaine ?",
    reponses: [
      { texte: "Défense contre les forces du Mal", maison: "gryffondor" },
      { texte: "Potions", maison: "serpentard" },
      { texte: "Sortilèges", maison: "serdaigle" },
      { texte: "Botanique", maison: "poufsouffle" },
    ],
  },
  {
    question: "Le Miroir du Riséd vous montre...",
    reponses: [
      { texte: "Moi, protégeant ceux que j'aime", maison: "gryffondor" },
      { texte: "Moi, au sommet, enfin reconnu", maison: "serpentard" },
      { texte: "Moi, comprenant enfin le grand secret", maison: "serdaigle" },
      { texte: "Moi, entouré des miens, en paix", maison: "poufsouffle" },
    ],
  },
  {
    question: "Comment gagnez-vous un duel de sorciers ?",
    reponses: [
      { texte: "En attaquant le premier", maison: "gryffondor" },
      { texte: "En connaissant la faiblesse de l'autre", maison: "serpentard" },
      { texte: "Avec un contre-sort que personne n'attend", maison: "serdaigle" },
      { texte: "En tenant plus longtemps que l'adversaire", maison: "poufsouffle" },
    ],
  },
  {
    question: "Que craignez-vous le plus qu'un épouvantard révèle ?",
    reponses: [
      { texte: "Ma propre lâcheté", maison: "gryffondor" },
      { texte: "L'oubli et l'insignifiance", maison: "serpentard" },
      { texte: "L'ignorance, définitive", maison: "serdaigle" },
      { texte: "La trahison d'un proche", maison: "poufsouffle" },
    ],
  },
];

export function calculerMaison(choix: Maison[]): Maison {
  const scores: Record<Maison, number> = {
    gryffondor: 0,
    serpentard: 0,
    serdaigle: 0,
    poufsouffle: 0,
  };
  for (const c of choix) scores[c] += 1;
  return (Object.keys(scores) as Maison[]).reduce((a, b) => (scores[b] > scores[a] ? b : a));
}
