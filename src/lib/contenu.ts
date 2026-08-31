import type { Recompense } from "./joueur";

/* --------------------------------------------------------- bibliothèque */

export type Categorie = "sortileges" | "creatures" | "potions" | "objets" | "lieux";

export const categoriesMeta: Record<Categorie, { nom: string; icone: string }> = {
  sortileges: { nom: "Sortilèges", icone: "✨" },
  creatures: { nom: "Créatures", icone: "🐉" },
  potions: { nom: "Potions", icone: "⚗️" },
  objets: { nom: "Objets magiques", icone: "🪄" },
  lieux: { nom: "Lieux", icone: "🏰" },
};

export type Article = {
  id: string;
  titre: string;
  categorie: Categorie;
  icone: string;
  resume: string;
  texte: string;
  /** Niveau minimum pour consulter la page. */
  niveau: number;
  /** Gagné une seule fois, à la première lecture. */
  recompense: Recompense;
};

export const articles: Article[] = [
  {
    id: "expelliarmus",
    titre: "Expelliarmus",
    categorie: "sortileges",
    icone: "🪄",
    resume: "Le sortilège de Désarmement, arme favorite des duellistes prudents.",
    texte:
      "D'un geste sec, l'Expelliarmus arrache la baguette de l'adversaire et l'envoie voler. Simple à lancer, il est enseigné dès les premiers clubs de duel — et suffit souvent à clore un affrontement sans blesser personne.",
    niveau: 1,
    recompense: { xp: 20 },
  },
  {
    id: "lumos",
    titre: "Lumos",
    categorie: "sortileges",
    icone: "💡",
    resume: "Une lumière au bout de la baguette pour les couloirs sans torches.",
    texte:
      "Lumos allume une flamme froide à la pointe de la baguette. On l'éteint d'un Nox. Indispensable dans les cachots, la Forêt interdite, et sous une cape d'invisibilité après le couvre-feu.",
    niveau: 1,
    recompense: { xp: 20 },
  },
  {
    id: "patronus",
    titre: "Spero Patronum",
    categorie: "sortileges",
    icone: "🦌",
    resume: "Un gardien d'argent né d'un souvenir heureux.",
    texte:
      "Le Patronus prend la forme d'un animal propre à chaque sorcier. Il repousse les Détraqueurs et peut porter un message. Sa réussite dépend moins de la puissance que de la sincérité du souvenir invoqué.",
    niveau: 4,
    recompense: { xp: 45, gallions: 15 },
  },
  {
    id: "wingardium",
    titre: "Wingardium Leviosa",
    categorie: "sortileges",
    icone: "🪶",
    resume: "Faire léviter — en insistant bien sur le « gar ».",
    texte:
      "Sortilège de lévitation enseigné en première année. La prononciation compte autant que le mouvement du poignet : swish and flick. Une plume d'abord, une massue de troll ensuite.",
    niveau: 2,
    recompense: { xp: 25 },
  },
  {
    id: "hippogriffe",
    titre: "L'Hippogriffe",
    categorie: "creatures",
    icone: "🦅",
    resume: "Moitié aigle, moitié cheval, entièrement susceptible.",
    texte:
      "On ne s'approche jamais d'un hippogriffe sans s'incliner d'abord et attendre qu'il rende le salut. Fier et rapide, il fait une monture remarquable pour qui a gagné son respect.",
    niveau: 2,
    recompense: { xp: 30 },
  },
  {
    id: "detraqueur",
    titre: "Le Détraqueur",
    categorie: "creatures",
    icone: "🌫️",
    resume: "Il aspire la joie et laisse le froid derrière lui.",
    texte:
      "Gardiens d'Azkaban, les Détraqueurs se nourrissent des souvenirs heureux. Leur approche givre les vitres et éteint les rires. Le chocolat réconforte ; seul le Patronus les chasse.",
    niveau: 5,
    recompense: { xp: 50, gallions: 20 },
  },
  {
    id: "elfe",
    titre: "L'elfe de maison",
    categorie: "creatures",
    icone: "🧦",
    resume: "Une magie propre, ancienne, et un vêtement pour toute liberté.",
    texte:
      "Les elfes de maison transplanent là où les sorciers ne peuvent pas. Liés à une famille, ils sont libérés le jour où leur maître leur remet un vêtement — une chaussette suffit.",
    niveau: 3,
    recompense: { xp: 35 },
  },
  {
    id: "polynectar",
    titre: "Le Polynectar",
    categorie: "potions",
    icone: "🧫",
    resume: "Un mois de préparation pour une heure sous une autre peau.",
    texte:
      "Épaisse, boueuse, au goût abominable, la potion de Polynectar prend la couleur de la personne imitée. Une erreur d'ingrédient — un poil de chat, par exemple — donne des résultats fâcheux.",
    niveau: 4,
    recompense: { xp: 45, gallions: 15 },
  },
  {
    id: "felixfelicis",
    titre: "Felix Felicis",
    categorie: "potions",
    icone: "🍀",
    resume: "La chance liquide, dorée et strictement rationnée.",
    texte:
      "Quelques gouttes suffisent à faire tourner la journée dans le bon sens. À forte dose, elle rend imprudent ; interdite lors des examens et des compétitions officielles.",
    niveau: 6,
    recompense: { xp: 60, gallions: 25 },
  },
  {
    id: "veritaserum",
    titre: "Veritaserum",
    categorie: "potions",
    icone: "💧",
    resume: "Trois gouttes, et la vérité sort toute seule.",
    texte:
      "Incolore et inodore, le Veritaserum arrache la vérité à qui l'avale. Son usage est encadré par le Ministère : un Occlumens entraîné peut malgré tout lui résister.",
    niveau: 7,
    recompense: { xp: 65, gallions: 25 },
  },
  {
    id: "retourneur",
    titre: "Le Retourneur de Temps",
    categorie: "objets",
    icone: "⏳",
    resume: "Un sablier au bout d'une chaîne, et quelques heures de plus.",
    texte:
      "Chaque tour du sablier fait reculer d'une heure. Règle d'or : ne jamais être vu de soi-même. Le Ministère n'en confie qu'à de rares élèves très studieux.",
    niveau: 5,
    recompense: { xp: 50, gallions: 20 },
  },
  {
    id: "marauder",
    titre: "La Carte du Maraudeur",
    categorie: "objets",
    icone: "🗺️",
    resume: "« Je jure solennellement que mes intentions sont mauvaises. »",
    texte:
      "Elle montre chaque couloir de Poudlard, chaque passage secret, et le nom de toute personne qui s'y déplace. On l'efface d'un « Méfait accompli », sans quoi elle raconte n'importe quoi aux curieux.",
    niveau: 3,
    recompense: { xp: 40 },
  },
  {
    id: "choixpeau-art",
    titre: "Le Choixpeau magique",
    categorie: "objets",
    icone: "🎩",
    resume: "Il lit dans votre tête, puis il tranche — parfois en discutant.",
    texte:
      "Vieux de mille ans, rapiécé, il compose chaque année une nouvelle chanson. Il tient compte des qualités du sorcier, mais aussi de ses choix : demander une maison pèse dans la balance.",
    niveau: 1,
    recompense: { xp: 20 },
  },
  {
    id: "voie",
    titre: "La Voie 9¾",
    categorie: "lieux",
    icone: "🚂",
    resume: "Un mur de brique à King's Cross, et un élan décidé.",
    texte:
      "Entre les quais 9 et 10, la barrière laisse passer les sorciers munis d'un billet. Derrière : la locomotive écarlate du Poudlard Express, la vapeur, et le chariot de friandises.",
    niveau: 1,
    recompense: { xp: 25 },
  },
  {
    id: "chemin-traverse",
    titre: "Le Chemin de Traverse",
    categorie: "lieux",
    icone: "🏪",
    resume: "Baguettes, chaudrons, hiboux : la rue des fournitures.",
    texte:
      "On y entre par le Chaudron Baveur en tapotant les briques dans le bon ordre. Ollivander, Fleury et Bott, Gringotts : tout s'y trouve, à condition d'avoir des Gallions.",
    niveau: 2,
    recompense: { xp: 30 },
  },
  {
    id: "foret",
    titre: "La Forêt interdite",
    categorie: "lieux",
    icone: "🌲",
    resume: "Centaures, acromantules et raisons très valables d'obéir au règlement.",
    texte:
      "Bordant le parc du château, elle est interdite aux élèves pour d'excellentes raisons. Les centaures y lisent les étoiles et supportent mal qu'on leur demande des réponses claires.",
    niveau: 6,
    recompense: { xp: 60, gallions: 25 },
  },
];

/* ---------------------------------------------------------- exploration */

export type Lieu = {
  id: string;
  nom: string;
  icone: string;
  description: string;
  niveau: number;
  /** Récompense de la première exploration. */
  recompense: Recompense;
  /** Petites trouvailles pour les visites suivantes. */
  trouvailles: string[];
  /** Article de la bibliothèque révélé par la visite. */
  article?: string;
};

export const lieux: Lieu[] = [
  {
    id: "grande-salle",
    nom: "La Grande Salle",
    icone: "🕯️",
    description: "Quatre longues tables, un plafond enchanté, et l'odeur du festin.",
    niveau: 1,
    recompense: { xp: 40, gallions: 15, points: 5 },
    trouvailles: [
      "Le plafond imite un ciel d'orage : personne ne s'inquiète.",
      "Un fantôme s'assoit à côté de vous et raconte deux siècles de menus.",
      "Vous rendez un pichet renversé avant le professeur : cinq points bien vus.",
    ],
  },
  {
    id: "salle-commune",
    nom: "Votre salle commune",
    icone: "🔥",
    description: "Feu de cheminée, fauteuils usés, devoirs en retard.",
    niveau: 1,
    recompense: { xp: 35, gallions: 10 },
    trouvailles: [
      "Une partie de bavboules s'improvise près du feu.",
      "Un préfet vous conseille pour votre prochain devoir de Sortilèges.",
      "Vous retrouvez une plume perdue depuis septembre.",
    ],
  },
  {
    id: "bibliotheque-lieu",
    nom: "La Bibliothèque",
    icone: "📚",
    description: "Madame Pince veille. Ne cornez surtout pas une page.",
    niveau: 2,
    recompense: { xp: 50, gallions: 15 },
    article: "marauder",
    trouvailles: [
      "Un livre de la Réserve grogne quand vous passez devant.",
      "Vous prenez une page de notes qui servira au prochain quiz.",
      "Un rayon poussiéreux révèle un traité de métamorphose oublié.",
    ],
  },
  {
    id: "cachots",
    nom: "Les Cachots",
    icone: "⚗️",
    description: "Humide, sombre, et une odeur tenace de chaudron mal rincé.",
    niveau: 3,
    recompense: { xp: 60, gallions: 20, points: 5 },
    article: "polynectar",
    trouvailles: [
      "Une fiole roule sous une étagère : ingrédient récupéré.",
      "Vous réussissez un Philtre de Paix du premier coup.",
      "Un chaudron abandonné fume encore. Mieux vaut ne rien toucher.",
    ],
  },
  {
    id: "terrain",
    nom: "Le terrain de Quidditch",
    icone: "🧹",
    description: "Le vent dans les tribunes et six anneaux qui attendent.",
    niveau: 3,
    recompense: { xp: 55, gallions: 20 },
    trouvailles: [
      "Vous rattrapez un Souafle perdu en pleine course.",
      "Un Cognard vous frôle : réflexes améliorés.",
      "L'attrapeur de la maison vous montre une feinte de Wronski.",
    ],
  },
  {
    id: "tour-astronomie",
    nom: "La Tour d'Astronomie",
    icone: "🔭",
    description: "Le point le plus haut du château, et le plus silencieux.",
    niveau: 4,
    recompense: { xp: 70, gallions: 25, points: 5 },
    trouvailles: [
      "Vous cartographiez trois lunes de Jupiter sans erreur.",
      "Une chouette se pose sur la rambarde et repart aussitôt.",
      "Le ciel dégagé vaut bien un devoir d'astronomie.",
    ],
  },
  {
    id: "salle-demande",
    nom: "La Salle sur Demande",
    icone: "🚪",
    description: "Trois passages devant un mur nu, et elle apparaît.",
    niveau: 5,
    recompense: { xp: 85, gallions: 30, points: 10 },
    article: "retourneur",
    trouvailles: [
      "La salle vous offre exactement le manuel qu'il vous fallait.",
      "Un miroir poussiéreux vous montre autre chose que votre reflet.",
      "Une armoire pleine d'objets confisqués depuis un siècle.",
    ],
  },
  {
    id: "foret-lieu",
    nom: "La Forêt interdite",
    icone: "🌲",
    description: "Interdite. Ce qui n'a jamais arrêté grand monde.",
    niveau: 6,
    recompense: { xp: 100, gallions: 40, points: 10 },
    article: "foret",
    trouvailles: [
      "Un centaure vous parle des étoiles, sans jamais répondre vraiment.",
      "Des sabots d'argent brillent entre deux troncs : une licorne.",
      "Une toile immense barre le sentier. Demi-tour prudent.",
    ],
  },
];

export function articlesAccessibles(niveau: number, revelees: string[]) {
  return articles.filter((a) => a.niveau <= niveau || revelees.includes(a.id));
}
