import { createFileRoute, Link } from "@tanstack/react-router";
import echecsImg from "@/assets/echecs.jpg";
import memoryImg from "@/assets/memory.jpg";
import quizImg from "@/assets/quiz.jpg";

export const Route = createFileRoute("/jeux/")({
  head: () => ({
    meta: [
      { title: "Mini-jeux sorciers — Échecs, memory et quiz" },
      {
        name: "description",
        content:
          "Trois épreuves magiques : les échecs des sorciers, le memory de sortilèges et le quiz du professeur.",
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
    icone: "🪄",
  },
  {
    to: "/jeux/potions",
    titre: "Laboratoire de Potions",
    texte: "Mémorisez la recette et versez les ingrédients dans le bon ordre.",
    icone: "⚗️",
  },
  {
    to: "/jeux/personnage",
    titre: "Devine le Personnage",
    texte: "Trois indices, une identité : trouvez le sorcier caché.",
    icone: "🔍",
  },
  {
    to: "/jeux/quidditch",
    titre: "Quidditch — Vif d'or",
    texte: "Attrapez le Vif, marquez au Souafle et esquivez les Cognards.",
    icone: "🧹",
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
            <h1 className="text-balance font-display text-2xl font-semibold leading-tight sm:text-3xl">
              Tentez vos sorts
            </h1>
          </div>
          <p className="text-sm italic text-parchemin/60">
            Trois épreuves, aucune boutique, aucun compte.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jeux.map((j) => (
            <Link
              key={j.to}
              to={j.to}
              className="panel group p-5 transition-transform hover:-translate-y-1"
            >
              {"image" in j ? (
                <img
                  src={j.image}
                  alt={j.alt}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full rounded-[12px] object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] w-full items-center justify-center rounded-[12px] bg-primary/10 text-6xl">
                  {j.icone}
                </div>
              )}
              <h2 className="mt-4 font-display text-lg font-medium">{j.titre}</h2>
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
