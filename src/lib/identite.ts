import type { Maison } from "./choixpeau";

/* Baguette et Patronus : deux rituels narratifs. Rien n'est « calculé » à l'écran,
   le bois et le cœur se choisissent le sorcier, pas l'inverse. */

export type Bois = {
  id: string;
  nom: string;
  texte: string;
  affinite: Maison;
};

export type Coeur = {
  id: string;
  nom: string;
  texte: string;
  trait: string;
};

export type Baguette = {
  bois: string;
  coeur: string;
  /** Longueur en pouces, tirée par la baguette elle-même. */
  longueur: number;
  souplesse: string;
  /** Phrase d'Ollivander, figée le jour de l'achat. */
  verdict: string;
};

export const bois: readonly Bois[] = [
  {
    id: "houx",
    nom: "Houx",
    texte:
      "Le houx protège ceux qui doivent surmonter la colère. Il choisit rarement une vie tranquille.",
    affinite: "gryffondor",
  },
  {
    id: "if",
    nom: "If",
    texte:
      "L'if pousse dans les cimetières. On lui prête pouvoir de vie et de mort ; il ne va jamais aux médiocres.",
    affinite: "serpentard",
  },
  {
    id: "vigne",
    nom: "Vigne",
    texte:
      "Les baguettes de vigne cherchent une vie plus grande que celle qu'on leur promet.",
    affinite: "serdaigle",
  },
  {
    id: "saule",
    nom: "Saule",
    texte:
      "Le saule va à ceux qui doutent encore d'eux-mêmes, et qui ont pourtant un immense potentiel.",
    affinite: "poufsouffle",
  },
  {
    id: "chene",
    nom: "Chêne",
    texte: "Le chêne demande une main ferme et une loyauté sans faille. Il tient bon sous l'orage.",
    affinite: "gryffondor",
  },
  {
    id: "ebene",
    nom: "Ébène",
    texte: "L'ébène se plaît au combat et aux convictions que rien ne fait plier.",
    affinite: "serpentard",
  },
  {
    id: "aubepine",
    nom: "Aubépine",
    texte: "L'aubépine guérit et maudit avec la même aisance. Elle aime les âmes contradictoires.",
    affinite: "serdaigle",
  },
  {
    id: "hetre",
    nom: "Hêtre",
    texte: "Le hêtre exige de la sagesse chez les vieux, de la tolérance chez les jeunes.",
    affinite: "poufsouffle",
  },
] as const;

export const coeurs: readonly Coeur[] = [
  {
    id: "phenix",
    nom: "Plume de phénix",
    texte:
      "Le plus capricieux des cœurs. Il agit parfois de sa propre initiative et met du temps à se donner.",
    trait: "indépendante",
  },
  {
    id: "dragon",
    nom: "Ventricule de dragon",
    texte:
      "Le plus puissant, le plus prompt aux éclats. Il apprend vite et change d'allégeance si on le maltraite.",
    trait: "ardente",
  },
  {
    id: "licorne",
    nom: "Crin de licorne",
    texte:
      "Le plus fidèle : il ne se retourne jamais contre son sorcier et répugne à la magie noire.",
    trait: "constante",
  },
  {
    id: "veela",
    nom: "Cheveu de Vélane",
    texte: "Un cœur rare, capricieux, redoutable entre les mains d'un tempérament de feu.",
    trait: "capricieuse",
  },
] as const;

export const souplesses = [
  "rigide",
  "légèrement souple",
  "souple",
  "docile",
  "inflexible",
] as const;

export function verdictOllivander(b: Bois, c: Coeur, maison: Maison | null): string {
  const debut = `${b.nom} et ${c.nom.toLowerCase()}`;
  const fin: Record<Maison, string> = {
    gryffondor: "Elle chauffera dans votre paume avant les orages. Prenez-en soin.",
    serpentard: "Curieux… vraiment curieux. Cette baguette attend beaucoup de vous.",
    serdaigle: "Elle vous suivra jusque dans les livres que personne n'ouvre plus.",
    poufsouffle: "Une baguette qui ne vous trahira pas. Il n'y en a pas tant que cela.",
  };
  return `${debut} : la baguette a choisi. ${maison ? fin[maison] : "Nous verrons bien ce que vous en ferez."}`;
}

/* ------------------------------------------------------------ patronus */

export type Patronus = {
  nom: string;
  texte: string;
};

export type FormePatronus = {
  id: string;
  nom: string;
  texte: string;
  /** Souvenirs qui appellent cette forme. */
  souvenirs: readonly string[];
};

export const formesPatronus: readonly FormePatronus[] = [
  {
    id: "cerf",
    nom: "Le cerf",
    texte:
      "Il se dresse entre vous et le froid, bois baissés. Ceux qui l'ont vu disent qu'on cesse d'avoir peur.",
    souvenirs: ["serment", "protection"],
  },
  {
    id: "biche",
    nom: "La biche",
    texte:
      "Argentée, silencieuse, elle marche devant vous sans jamais se retourner. Elle vient d'un amour tenu secret.",
    souvenirs: ["absence", "protection"],
  },
  {
    id: "loutre",
    nom: "La loutre",
    texte: "Elle nage dans l'air en spirales joyeuses ; l'obscurité s'écarte comme une eau remuée.",
    souvenirs: ["rire", "reussite"],
  },
  {
    id: "renard",
    nom: "Le renard",
    texte: "Vif, rusé, il file entre les Détraqueurs et les emmène loin de vous.",
    souvenirs: ["evasion", "reussite"],
  },
  {
    id: "chouette",
    nom: "La chouette",
    texte: "Elle tourne au-dessus de votre tête, silencieuse, et voit ce que vous ne voyez pas.",
    souvenirs: ["lecture", "absence"],
  },
  {
    id: "loup",
    nom: "Le loup",
    texte: "Il ne vous quitte pas d'un pas. On dit qu'il vient d'une fidélité plus vieille que vous.",
    souvenirs: ["serment", "meute"],
  },
  {
    id: "lievre",
    nom: "Le lièvre",
    texte: "Il bondit d'abord, réfléchit ensuite — et pourtant il vous a déjà sauvé deux fois.",
    souvenirs: ["evasion", "rire"],
  },
  {
    id: "ours",
    nom: "L'ours",
    texte: "Massif, lent, impossible à contourner. Il tient la porte pendant que les autres passent.",
    souvenirs: ["protection", "meute"],
  },
  {
    id: "cheval",
    nom: "Le cheval",
    texte: "Il traverse la nuit au galop et vous emporte avec lui, sans jamais faiblir.",
    souvenirs: ["meute", "serment"],
  },
  {
    id: "corbeau",
    nom: "Le corbeau",
    texte: "Il se pose près de vous et attend. Il sait des choses qu'il ne dira pas encore.",
    souvenirs: ["lecture", "absence"],
  },
  {
    id: "chat",
    nom: "Le chat",
    texte: "Il apparaît quand on ne l'attend plus, se frotte à votre main, puis disparaît.",
    souvenirs: ["rire", "lecture"],
  },
  {
    id: "phenix",
    nom: "Le phénix",
    texte:
      "Rarissime. Il flambe d'une lumière blanche et son chant fait reculer tout ce qui n'a pas de visage.",
    souvenirs: ["reussite", "serment"],
  },
] as const;

export type Souvenir = {
  id: string;
  titre: string;
  texte: string;
  cle: string;
};

export const souvenirs: readonly Souvenir[] = [
  {
    id: "protection",
    titre: "Une main sur l'épaule",
    texte: "Quelqu'un s'est placé devant vous, un jour, sans hésiter une seconde.",
    cle: "protection",
  },
  {
    id: "rire",
    titre: "Un fou rire interdit",
    texte: "En pleine étude, un rire qu'on n'arrivait plus à ravaler. Rien de grave, tout de bon.",
    cle: "rire",
  },
  {
    id: "reussite",
    titre: "Le sortilège qui a enfin pris",
    texte: "Après trente échecs, la plume s'est levée toute seule et vous avez cessé de respirer.",
    cle: "reussite",
  },
  {
    id: "serment",
    titre: "Une promesse tenue",
    texte: "Vous aviez juré. Personne ne vérifiait. Vous l'avez fait quand même.",
    cle: "serment",
  },
  {
    id: "absence",
    titre: "Une voix qu'on n'entend plus",
    texte: "Un souvenir doux-amer, tellement lumineux qu'il fait mal — et pourtant il éclaire.",
    cle: "absence",
  },
  {
    id: "evasion",
    titre: "La fuite par les toits",
    texte: "Le vent, les ardoises, la peur transformée en joie pure au moment de sauter.",
    cle: "evasion",
  },
  {
    id: "lecture",
    titre: "La bibliothèque à minuit",
    texte: "Une chandelle, un livre trop vieux, et le sentiment que le monde s'agrandissait.",
    cle: "lecture",
  },
  {
    id: "meute",
    titre: "La table pleine",
    texte: "Tous les vôtres réunis, personne ne manquait, et cela semblait devoir durer toujours.",
    cle: "meute",
  },
] as const;

/** La forme se déduit des souvenirs convoqués, jamais annoncée à l'avance. */
export function formeDepuisSouvenirs(cles: readonly string[]): FormePatronus {
  let meilleure = formesPatronus[0]!;
  let score = -1;
  for (const f of formesPatronus) {
    const s = f.souvenirs.filter((x) => cles.includes(x)).length;
    if (s > score) {
      score = s;
      meilleure = f;
    }
  }
  return meilleure;
}
