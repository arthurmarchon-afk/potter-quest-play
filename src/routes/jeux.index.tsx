import { createFileRoute, Link } from "@tanstack/react-router";
import echecsImg from "@/assets/echecs.jpg";
import memoryImg from "@/assets/memory.jpg";
import quizImg from "@/assets/quiz.jpg";
import sortsImg from "@/assets/sorts.jpg";
import potionsImg from "@/assets/potions.jpg";
import personnageImg from "@/assets/personnage.jpg";
import quidditchImg from "@/assets/quidditch.jpg";
import { Salle, EnTetePage, CoinsLaiton } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import {
  Ornement,
  IconeEchiquier,
  IconeParchemin,
  IconeLivre,
  IconeBaguette,
  IconeChaudron,
  IconeLoupe,
  IconeBalai,
} from "@/components/immersif/Icones";

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
    Icone: IconeEchiquier,
  },
  {
    to: "/jeux/memory",
    titre: "Memory de Sortilèges",
    texte: "Retrouvez les paires d'incantations avant que le temps ne s'écoule.",
    image: memoryImg,
    alt: "Cartes de parchemin gravées de runes lumineuses sur un sol de pierre",
    Icone: IconeParchemin,
  },
  {
    to: "/jeux/quiz",
    titre: "Le Quiz du Professeur",
    texte: "Dix questions tirées des carnets de cours pour éprouver votre savoir sorcier.",
    image: quizImg,
    alt: "Parchemin de questions, plume et cachet de cire à la lueur d'une bougie",
    Icone: IconeLivre,
  },
  {
    to: "/jeux/sorts",
    titre: "Maître des Sorts",
    texte: "Associez chaque effet à son incantation avant la fin du sablier.",
    image: sortsImg,
    alt: "Baguette lançant des étincelles au-dessus d'un grimoire ouvert",
    Icone: IconeBaguette,
  },
  {
    to: "/jeux/potions",
    titre: "Laboratoire de Potions",
    texte: "Mémorisez la recette et versez les ingrédients dans le bon ordre.",
    image: potionsImg,
    alt: "Chaudron fumant et fioles colorées dans un laboratoire de potions",
    Icone: IconeChaudron,
  },
  {
    to: "/jeux/personnage",
    titre: "Devine le Personnage",
    texte: "Trois indices, une identité : trouvez le sorcier caché.",
    image: personnageImg,
    alt: "Portrait encadré d'une silhouette encapuchonnée sur un mur de pierre",
    Icone: IconeLoupe,
  },
  {
    to: "/jeux/quidditch",
    titre: "Quidditch — Vif d'or",
    texte: "Attrapez le Vif, marquez au Souafle et esquivez les Cognards.",
    image: quidditchImg,
    alt: "Vif d'or doré volant au-dessus d'un stade au crépuscule",
    Icone: IconeBalai,
  },
] as const;

function Jeux() {
  return (
    <Salle large>
      <EnTetePage
        surtitre="Salle des mini-jeux"
        titre="Tentez vos sorts"
        intro="Sept épreuves magiques, trois niveaux de difficulté, des Gallions à la clé."
        icone={<IconeEchiquier />}
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jeux.map((j, i) => (
          <Reveler key={j.to} delai={i * 80}>
            <Link
              to={j.to}
              className="group relative block overflow-hidden rounded-[3px] plaque p-4 transition-transform duration-500 hover:-translate-y-1"
            >
              <CoinsLaiton />
              <div className="relative overflow-hidden rounded-[2px] filet-or">
                <img
                  src={j.image}
                  alt={j.alt}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="aspect-[4/3] w-full object-cover opacity-85 grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,oklch(0.09_0.02_265/85%))]" />
                <span className="pointer-events-none absolute inset-0 opacity-0 shadow-[inset_0_0_60px_color-mix(in_oklab,var(--or)_55%,transparent)] transition-opacity duration-500 group-hover:opacity-100" />
                <span className="chandelle absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-or/30 bg-black/50 text-or [&>svg]:h-4 [&>svg]:w-4">
                  <j.Icone />
                </span>
              </div>
              <h2 className="mt-4 font-display text-base uppercase tracking-[0.16em] text-parchemin">
                {j.titre}
              </h2>
              <p className="annotation mt-2 text-sm leading-relaxed">{j.texte}</p>
              <span className="mt-4 inline-flex items-center gap-2 font-display text-[0.62rem] uppercase tracking-[0.32em] text-or transition-transform duration-500 group-hover:translate-x-1">
                Jouer
                <Ornement className="h-2.5 w-2.5" />
              </span>
            </Link>
          </Reveler>
        ))}
      </div>
    </Salle>
  );
}
