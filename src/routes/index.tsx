import { createFileRoute, Link } from "@tanstack/react-router";
import grimoire from "@/assets/grimoire.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Parchemin — Le grimoire des maisons de Poudlard" },
      {
        name: "description",
        content:
          "Passez l'épreuve du Choixpeau et découvrez votre maison, puis affrontez les mini-jeux sorciers : échecs, memory de sortilèges et quiz.",
      },
      { property: "og:title", content: "Parchemin — Le grimoire des maisons de Poudlard" },
      {
        property: "og:description",
        content: "Le Choixpeau, votre maison, et une salle de mini-jeux sorciers.",
      },
    ],
  }),
  component: Accueil,
});

function Accueil() {
  return (
    <section>
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
        <div>
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
            Poudlard · Année 1991
          </p>
          <h1 className="max-w-[20ch] text-balance font-display text-4xl font-semibold leading-tight sm:text-6xl">
            Le grimoire attend votre plume.
          </h1>
          <p className="mt-6 max-w-[46ch] text-pretty text-base text-muted-foreground sm:text-lg">
            Sous la lueur des chandelles, le Choixpeau murmure votre nom. Répondez à son
            interrogatoire, puis tentez vos sorts dans la salle des mini-jeux.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Link
              to="/choixpeau"
              className="inline-flex items-center rounded-[10px] bg-primary py-3 pl-4 pr-3 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
            >
              <span className="mr-2">✦</span>Commencer le Choixpeau
            </Link>
            <Link
              to="/jeux"
              className="inline-flex items-center rounded-[10px] px-5 py-3 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
            >
              Voir les mini-jeux
            </Link>
          </div>
        </div>
        <div className="panel p-3">
          <img
            src={grimoire}
            alt="Grimoire relié cuir ouvert sur un lutrin de pierre, à la lueur des chandelles"
            width={1024}
            height={1280}
            className="aspect-[4/5] w-full rounded-[12px] object-cover"
          />
          <p className="px-2 pb-1 pt-3 text-sm italic text-muted-foreground">
            Le grimoire relié cuir, ouvert à la lueur des chandelles.
          </p>
        </div>
      </div>
    </section>
  );
}
