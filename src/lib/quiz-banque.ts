/* Banque de questions du Quiz du Professeur : classée par matière et par niveau
   (1 = Moldu curieux, 2 = Apprenti, 3 = Sorcier confirmé, 4 = Maître). */

export type Categorie =
  | "sortileges"
  | "creatures"
  | "personnages"
  | "histoire"
  | "potions"
  | "quidditch";

export type QuestionQuiz = {
  q: string;
  r: string[];
  bonne: number;
  d: 1 | 2 | 3 | 4;
  cat: Categorie;
};

export const categories: Record<Categorie, { nom: string; salle: string }> = {
  sortileges: { nom: "Sortilèges", salle: "Salle de Sortilèges" },
  creatures: { nom: "Créatures", salle: "Lisière de la Forêt" },
  personnages: { nom: "Personnages", salle: "Galerie des portraits" },
  histoire: { nom: "Histoire", salle: "Cours du professeur Binns" },
  potions: { nom: "Potions", salle: "Cachots" },
  quidditch: { nom: "Quidditch", salle: "Vestiaire du stade" },
};

export const banqueQuiz: readonly QuestionQuiz[] = [
  // ------------------------------------------------------------ sortilèges
  { q: "Quel sortilège allume le bout de sa baguette ?", r: ["Lumos", "Nox", "Incendio", "Sonorus"], bonne: 0, d: 1, cat: "sortileges" },
  { q: "Quel est le sortilège de désarmement ?", r: ["Stupéfix", "Petrificus Totalus", "Expelliarmus", "Impedimenta"], bonne: 2, d: 1, cat: "sortileges" },
  { q: "Que fait le sortilège Wingardium Leviosa ?", r: ["Il fait léviter", "Il répare", "Il déverrouille", "Il nettoie"], bonne: 0, d: 1, cat: "sortileges" },
  { q: "Quel sortilège ouvre une serrure ?", r: ["Alohomora", "Colloportus", "Reparo", "Aguamenti"], bonne: 0, d: 1, cat: "sortileges" },
  { q: "Contre quoi utilise-t-on Riddikulus ?", r: ["Un détraqueur", "Un épouvantard", "Un inferi", "Un strangulot"], bonne: 1, d: 2, cat: "sortileges" },
  { q: "Quel sortilège efface la mémoire ?", r: ["Obliviate", "Legilimens", "Confundo", "Silencio"], bonne: 0, d: 2, cat: "sortileges" },
  { q: "Quel contre-sort annule Lumos ?", r: ["Nox", "Finite", "Evanesco", "Tergeo"], bonne: 0, d: 2, cat: "sortileges" },
  { q: "Quelle formule ouvre la Carte du Maraudeur ?", r: ["Revelio", "Méfait accompli", "Je jure solennellement que mes intentions sont mauvaises", "Lumos Maxima"], bonne: 2, d: 3, cat: "sortileges" },
  { q: "Quel sortilège protège des Détraqueurs ?", r: ["Protego", "Spero Patronum", "Repulso", "Salvio Hexia"], bonne: 1, d: 2, cat: "sortileges" },
  { q: "Quel sort découpe et blesse gravement, inventé par Rogue ?", r: ["Sectumsempra", "Diffindo", "Reducto", "Confringo"], bonne: 0, d: 4, cat: "sortileges" },
  { q: "Que signifie « Priori Incantatem » ?", r: ["Un duel de baguettes sœurs", "Un sort de guérison", "Un charme de dissimulation", "Une malédiction ancienne"], bonne: 0, d: 4, cat: "sortileges" },

  // ------------------------------------------------------------- créatures
  { q: "Quelle créature garde les coffres profonds de Gringotts ?", r: ["Un hippogriffe", "Un dragon", "Un troll", "Un basilic"], bonne: 1, d: 1, cat: "creatures" },
  { q: "Quel animal représente Serdaigle ?", r: ["Un aigle", "Un corbeau", "Un blaireau", "Un serpent"], bonne: 0, d: 1, cat: "creatures" },
  { q: "Quelle créature attire tout ce qui brille ?", r: ["Le Niffleur", "Le Botruc", "Le Veaudelune", "Le Focifère"], bonne: 0, d: 3, cat: "creatures" },
  { q: "Quelle plante hurle mortellement quand on la déterre adulte ?", r: ["Le filet du diable", "La mandragore", "Le tentacula vénéneux", "L'asphodèle"], bonne: 1, d: 2, cat: "creatures" },
  { q: "Que ne peuvent voir que ceux qui ont vu la mort ?", r: ["Les Sombrals", "Les Détraqueurs", "Les Augureys", "Les Boursouflets"], bonne: 0, d: 2, cat: "creatures" },
  { q: "Comment tuer un basilic sans le regarder ?", r: ["Par le chant du coq", "Avec de l'eau bénite", "Avec un miroir brisé", "Par le feu"], bonne: 0, d: 3, cat: "creatures" },
  { q: "Quelle créature d'eau peuple le lac noir ?", r: ["Les strangulots", "Les kelpies", "Les lutins de Cornouailles", "Les Doxys"], bonne: 0, d: 2, cat: "creatures" },
  { q: "Quel est le nom de l'araignée géante de Hagrid ?", r: ["Aragog", "Mosag", "Norbert", "Touffu"], bonne: 0, d: 2, cat: "creatures" },

  // ---------------------------------------------------------- personnages
  { q: "Qui est le gardien des clés de Poudlard ?", r: ["Argus Rusard", "Rubeus Hagrid", "Horace Slughorn", "Filius Flitwick"], bonne: 1, d: 1, cat: "personnages" },
  { q: "Qui enseigne la métamorphose en 1991 ?", r: ["Pomona Chourave", "Minerva McGonagall", "Sibylle Trelawney", "Charity Burbage"], bonne: 1, d: 1, cat: "personnages" },
  { q: "Quel est le patronus de Severus Rogue ?", r: ["Une biche", "Un cerf", "Une loutre", "Un phénix"], bonne: 0, d: 2, cat: "personnages" },
  { q: "Qui est le fantôme de la maison Serpentard ?", r: ["Le Baron Sanglant", "Nick Quasi-Sans-Tête", "Le Moine Gras", "La Dame Grise"], bonne: 0, d: 2, cat: "personnages" },
  { q: "Quel elfe de maison appartenait aux Malefoy ?", r: ["Dobby", "Kreattur", "Winky", "Hokey"], bonne: 0, d: 1, cat: "personnages" },
  { q: "Quel est le vrai nom de Voldemort ?", r: ["Tom Elvis Jedusor", "Thomas Gaunt", "Tom Riddle Serpentard", "Marvolo Jedusor"], bonne: 0, d: 2, cat: "personnages" },
  { q: "Qui est la Dame Grise, fantôme de Serdaigle ?", r: ["Helena Serdaigle", "Rowena elle-même", "Ariana Dumbledore", "Myrtle Warren"], bonne: 0, d: 4, cat: "personnages" },
  { q: "Quel Maraudeur devient un rat ?", r: ["Peter Pettigrow", "Sirius Black", "Remus Lupin", "James Potter"], bonne: 0, d: 2, cat: "personnages" },

  // ------------------------------------------------------------- histoire
  { q: "Que voit-on dans le Miroir du Riséd ?", r: ["Le passé", "L'avenir", "Le désir le plus profond", "Ses peurs"], bonne: 2, d: 1, cat: "histoire" },
  { q: "Où se trouve la salle commune de Serpentard ?", r: ["Dans une tour", "Près des cuisines", "Dans les cachots", "Sous le lac gelé"], bonne: 2, d: 2, cat: "histoire" },
  { q: "Qui fonda l'Ordre du Phénix ?", r: ["Albus Dumbledore", "Alastor Maugrey", "Sirius Black", "Kingsley Shacklebolt"], bonne: 0, d: 3, cat: "histoire" },
  { q: "Combien d'usages du sang de dragon Dumbledore a-t-il découverts ?", r: ["Sept", "Neuf", "Douze", "Trois"], bonne: 2, d: 3, cat: "histoire" },
  { q: "Quel objet du journal de Jedusor en fait un Horcruxe ?", r: ["Un fragment d'âme", "Une goutte de sang", "Un cheveu", "Une larme"], bonne: 0, d: 3, cat: "histoire" },
  { q: "Combien de Reliques de la Mort existe-t-il ?", r: ["Trois", "Quatre", "Sept", "Deux"], bonne: 0, d: 1, cat: "histoire" },
  { q: "En quelle année le Tournoi des Trois Sorciers reprend-il ?", r: ["1994", "1991", "1998", "1988"], bonne: 0, d: 3, cat: "histoire" },
  { q: "Quel duel de 1945 mit fin au règne de Grindelwald ?", r: ["Dumbledore contre Grindelwald", "Flamel contre Grindelwald", "Maugrey contre Grindelwald", "Jedusor contre Grindelwald"], bonne: 0, d: 4, cat: "histoire" },

  // -------------------------------------------------------------- potions
  { q: "Quelle potion procure une chance insolente ?", r: ["Felix Felicis", "Polynectar", "Amortentia", "Veritaserum"], bonne: 0, d: 2, cat: "potions" },
  { q: "Quelle potion oblige à dire la vérité ?", r: ["Veritaserum", "Amortentia", "Goutte du Mort Vivant", "Philtre de Paix"], bonne: 0, d: 2, cat: "potions" },
  { q: "Que permet le Polynectar ?", r: ["Prendre l'apparence d'un autre", "Devenir invisible", "Respirer sous l'eau", "Guérir toute blessure"], bonne: 0, d: 1, cat: "potions" },
  { q: "Quelle plante permet de respirer sous l'eau ?", r: ["La Branchiflore", "L'aconit", "La bulbobulbe", "L'asphodèle"], bonne: 0, d: 3, cat: "potions" },
  { q: "Quels ingrédients composent la Goutte du Mort Vivant ?", r: ["Asphodèle et armoise", "Sang de dragon et menthe", "Bézoard et racine", "Corne de bicorne"], bonne: 0, d: 4, cat: "potions" },
  { q: "Où trouve-t-on un bézoard ?", r: ["Dans l'estomac d'une chèvre", "Sous les racines de mandragore", "Dans le foie d'un dragon", "Au fond du lac"], bonne: 0, d: 3, cat: "potions" },

  // ------------------------------------------------------------ quidditch
  { q: "Quelle balle vaut cent cinquante points ?", r: ["Le Souafle", "Le Cognard", "Le Vif d'or", "Le Percuteur"], bonne: 2, d: 1, cat: "quidditch" },
  { q: "Combien de joueurs compte une équipe ?", r: ["Sept", "Six", "Cinq", "Huit"], bonne: 0, d: 1, cat: "quidditch" },
  { q: "Qui frappe les Cognards ?", r: ["Les Batteurs", "Les Poursuiveurs", "Le Gardien", "L'Attrapeur"], bonne: 0, d: 2, cat: "quidditch" },
  { q: "Combien de points vaut un but au Souafle ?", r: ["Dix", "Cinq", "Vingt", "Cinquante"], bonne: 0, d: 2, cat: "quidditch" },
  { q: "Quel balai Harry reçoit-il en troisième année ?", r: ["Éclair de Feu", "Nimbus 2000", "Nimbus 2001", "Brossdur 11"], bonne: 0, d: 3, cat: "quidditch" },
  { q: "Quelle feinte consiste à plonger vers le sol pour tromper l'attrapeur ?", r: ["La feinte de Wronski", "Le plongeon de Porskoff", "La défense de Dopplebeater", "Le contre de Blitz"], bonne: 0, d: 4, cat: "quidditch" },
] as const;

export type NiveauQuiz = "moldu" | "apprenti" | "sorcier" | "maitre";

export const niveauxQuiz: Record<
  NiveauQuiz,
  { label: string; max: 1 | 2 | 3 | 4; nb: number; chrono: number | null; mult: number; texte: string }
> = {
  moldu: {
    label: "Moldu curieux",
    max: 1,
    nb: 8,
    chrono: null,
    mult: 1,
    texte: "Les bases du monde sorcier, sans chronomètre. Personne ne vous regarde.",
  },
  apprenti: {
    label: "Apprenti",
    max: 2,
    nb: 10,
    chrono: 25,
    mult: 2,
    texte: "Première et deuxième année mêlées, vingt-cinq secondes par question.",
  },
  sorcier: {
    label: "Sorcier confirmé",
    max: 3,
    nb: 12,
    chrono: 15,
    mult: 3,
    texte: "Le programme des BUSE. Quinze secondes, et le professeur note.",
  },
  maitre: {
    label: "Maître",
    max: 4,
    nb: 12,
    chrono: 10,
    mult: 4,
    texte: "Niveau ASPIC : questions retorses, dix secondes chrono.",
  },
};

export function melanger<T>(liste: readonly T[]): T[] {
  const m = [...liste];
  for (let i = m.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [m[i], m[j]] = [m[j]!, m[i]!];
  }
  return m;
}

export function tirerQuestions(
  niveau: NiveauQuiz,
  categorie: Categorie | "toutes",
  express: boolean,
): QuestionQuiz[] {
  const conf = niveauxQuiz[niveau];
  const pool = banqueQuiz.filter(
    (q) => q.d <= conf.max && (categorie === "toutes" || q.cat === categorie),
  );
  const nb = express ? 3 : conf.nb;
  return melanger(pool).slice(0, Math.min(nb, pool.length));
}
