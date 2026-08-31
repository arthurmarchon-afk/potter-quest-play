import { createFileRoute, Link } from "@tanstack/react-router";
import echecsImg from "@/assets/echecs.jpg";
import memoryImg from "@/assets/memory.jpg";
import quizImg from "@/assets/quiz.jpg";
import sortsImg from "@/assets/sorts.jpg";
import potionsImg from "@/assets/potions.jpg";
import personnageImg from "@/assets/personnage.jpg";
import quidditchImg from "@/assets/quidditch.jpg";

export const Route = createFileRoute("/jeux/")({
  head: () => ({
    meta: [
      { title: "Mini-jeux sorciers — Échecs, memory et quiz" },
      {
        name: "description",
        content:
          "Sept épreuves magiques : échecs sorciers, memory de sortilèges, quiz, sorts, potions, énigmes et Quidditch.",
      },
      { property: "og:title", content: "Mini-jeux sorciers de Poudlard" },
      {
        property: "og:description",
        content: "Échecs des sorciers, memory de sortilèges et quiz du professeur.",
      },
    ],
  }),
  component: Jeux,
});

const jeux = [
  {
    to: "/jeux/echecs",
    titre: "Échecs des Sorciers",
    texte: "Affrontez le grand maître en duel, pion par pion, sous les chandelles.",
    image: echecsImg,
    alt: "Échiquier magique aux pièces lumineuses sur une table de bois sombre",
  },
  {
    to: "/jeux/memory",
    titre: "Memory de Sortilèges",
    texte: "Retrouvez les paires d'incantations avant que le temps ne s'écoule.",
    image: memoryImg,
    alt: "Cartes de parchemin gravées de runes lumineuses sur un sol de pierre",
  },
  {
    to: "/jeux/quiz",
    titre: "Le Quiz du Professeur",
    texte: "Dix questions tirées des carnets de cours pour éprouver votre savoir sorcier.",
    image: quizImg,
    alt: "Parchemin de questions, plume et cachet de cire à la lueur d'une bougie",
  },
  {
    to: "/jeux/sorts",
    titre: "Maître des Sorts",
    texte: "Associez chaque effet à son incantation avant la fin du sablier.",
    image: sortsImg,
    alt: "Baguette lançant des étincelles au-dessus d'un grimoire ouvert",
  },
  {
    to: "/jeux/potions",
    titre: "Laboratoire de Potions",
    texte: "Mémorisez la recette et versez les ingrédients dans le bon ordre.",
    image: potionsImg,
    alt: "Chaudron fumant et fioles colorées dans un laboratoire de potions",
  },
  {
    to: "/jeux/personnage",
    titre: "Devine le Personnage",
    texte: "Trois indices, une identité : trouvez le sorcier caché.",
    image: personnageImg,
    alt: "Portrait encadré d'une silhouette encapuchonnée sur un mur de pierre",
  },
  {
    to: "/jeux/quidditch",
    titre: "Quidditch — Vif d'or",
    texte: "Attrapez le Vif, marquez au Souafle et esquivez les Cognards.",
    image: quidditchImg,
    alt: "Vif d'or doré volant au-dessus d'un stade au crépuscule",
  },
] as const;

function Jeux() {
  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-[40ch]">
            <p className="mb-3 font-display text-[0.62rem] uppercase tracking-[0.5em] text-or/70">
              Salle des mini-jeux
            </p>
            <h1 className="titre-cinema text-balance text-2xl leading-tight text-parchemin sm:text-4xl">
              Tentez vos sorts
            </h1>
          </div>
          <p className="text-sm italic text-parchemin/60">
            Sept épreuves magiques, trois niveaux de difficulté, des Gallions à la clé.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jeux.map((j) => (
            <Link
              key={j.to}
              to={j.to}
              className="panel group p-5 transition-transform hover:-translate-y-1"
            >
              <div className="relative overflow-hidden rounded-[3px] filet-or">
                <img
                  src={j.image}
                  alt={j.alt}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,oklch(0.09_0.02_265/85%))]" />
              </div>
              <h2 className="mt-4 font-display text-base uppercase tracking-[0.16em] text-parchemin">{j.titre}</h2>
              <p className="mt-2 text-pretty text-sm text-parchemin/60">{j.texte}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-or transition-transform group-hover:translate-x-1">
                Jouer <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
