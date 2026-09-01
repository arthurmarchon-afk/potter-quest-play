import { createFileRoute, Link } from "@tanstack/react-router";

import { Reveler } from "@/components/immersif/Reveler";
import { Curiosite, CompteurTrouvailles } from "@/components/immersif/Curiosite";
import { SermentMaraudeurs } from "@/components/immersif/SermentMaraudeurs";
import {
  Blason,
  IconeBaguette,
  IconeCarte,
  IconeChandelle,
  IconeChaudron,
  IconeCoupe,
  IconeLivre,
  IconeParchemin,
  IconePlume,
  Ornement,
} from "@/components/immersif/Icones";
import { maisons as infosMaisons } from "@/lib/choixpeau";
import { ordreMaisons, pointsCoupe } from "@/lib/joueur";
import { useJoueur } from "@/lib/joueur-context";
import { faitDuJour, maisonFavoriseeDuJour } from "@/lib/poudlard-jour";

export const Route = createFileRoute("/chateau")({
  head: () => ({
    meta: [
      { title: "Le château — Grande Salle, bibliothèque et couloirs | Potter Quest" },
      {
        name: "description",
        content:
          "Franchissez les portes : la Grande Salle et ses sabliers, la bibliothèque, la salle de duel, les cachots, la volière et les couloirs où dorment quelques secrets.",
      },
      { property: "og:title", content: "Le château de Poudlard — Potter Quest" },
      {
        property: "og:description",
        content:
          "Le monde est le menu : chaque salle du château ouvre une part de Potter Quest.",
      },
    ],
  }),
  component: Chateau,
});

/* Chaque zone est une scène, pas une carte : matière, lumière et porte propres. */
const zones = [
  {
    to: "/coupe",
    nom: "La Grande Salle",
    Icone: IconeCoupe,
    ligne: "Quatre sabliers, un plafond enchanté, et le silence juste avant le dîner.",
    porte: "Entrer sous le plafond enchanté",
    fond: "linear-gradient(160deg, oklch(0.16 0.04 60/70%), oklch(0.09 0.02 265/85%))",
  },
  {
    to: "/bibliotheque",
    nom: "La bibliothèque",
    Icone: IconeLivre,
    ligne: "Des rayonnages qui montent trop haut et une Réserve qu'on ne montre pas.",
    porte: "Pousser la grille de la Réserve",
    fond: "linear-gradient(160deg, oklch(0.17 0.03 90/60%), oklch(0.09 0.02 265/88%))",
  },
  {
    to: "/duels",
    nom: "La salle de duel",
    Icone: IconeBaguette,
    ligne: "Une longue estrade, deux baguettes levées, et beaucoup de bruit ensuite.",
    porte: "Monter sur l'estrade",
    fond: "linear-gradient(160deg, oklch(0.18 0.06 25/55%), oklch(0.09 0.02 265/88%))",
  },
  {
    to: "/jeux/potions",
    nom: "Les cachots",
    Icone: IconeChaudron,
    ligne: "La recette au tableau, l'ordre exact des ingrédients, la vapeur qui pique.",
    porte: "Allumer le feu sous le chaudron",
    fond: "linear-gradient(160deg, oklch(0.16 0.05 170/50%), oklch(0.08 0.02 265/90%))",
  },
  {
    to: "/quetes",
    nom: "La volière",
    Icone: IconeParchemin,
    ligne: "Le panneau d'affichage disparaît sous les parchemins et les lettres du jour.",
    porte: "Décrocher un parchemin",
    fond: "linear-gradient(160deg, oklch(0.18 0.03 250/55%), oklch(0.09 0.02 265/88%))",
  },
  {
    to: "/jeux",
    nom: "La salle commune",
    Icone: IconeChandelle,
    ligne: "Feu de cheminée, échiquier abandonné, quiz du professeur et un balai contre le mur.",
    porte: "Se glisser près du feu",
    fond: "linear-gradient(160deg, oklch(0.19 0.05 45/55%), oklch(0.09 0.02 265/88%))",
  },
] as const;

function Portail({ z, delai }: { z: (typeof zones)[number]; delai: number }) {
  return (
    <Reveler delai={delai}>
      <Link
        to={z.to}
        className="group relative block overflow-hidden rounded-t-[999px] border border-or/18 px-7 pb-8 pt-12 transition-all duration-700 hover:border-or/55"
        style={{ background: z.fond }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-8 top-0 h-40 rounded-b-full bg-[oklch(0.85_0.1_85/8%)] blur-2xl transition-opacity duration-700 group-hover:bg-[oklch(0.85_0.1_85/16%)]"
        />
        <span className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border border-or/30 bg-black/45 text-or/70 transition-colors duration-500 group-hover:text-or [&>svg]:h-6 [&>svg]:w-6">
          <z.Icone />
        </span>
        <h3 className="relative mt-6 text-center font-titre text-xl uppercase tracking-[0.2em] text-parchemin transition-colors group-hover:text-or">
          {z.nom}
        </h3>
        <p className="relative mx-auto mt-3 max-w-xs text-center text-pretty leading-relaxed text-parchemin/55">
          {z.ligne}
        </p>
        <p className="relative mt-6 text-center font-display text-[0.55rem] uppercase tracking-[0.35em] text-or/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          {z.porte}
        </p>
      </Link>
    </Reveler>
  );
}

function Chateau() {
  const { joueur } = useJoueur();
  const points = pointsCoupe(joueur);
  const fait = faitDuJour();
  const favorisee = ordreMaisons[maisonFavoriseeDuJour()]!;

  return (
    <div className="relative">
      {/* ── Hall d'entrée ── */}
      <section className="relative mx-auto flex min-h-[72svh] max-w-6xl flex-col items-center justify-center px-6 py-24 text-center">
        <span
          aria-hidden
          className="rai-lumiere pointer-events-none absolute -top-10 left-1/2 h-80 w-[48rem] -translate-x-1/2"
        />
        <Reveler>
          <p className="font-display text-[0.6rem] uppercase tracking-[0.5em] text-or/70">
            Hall d'entrée · escalier de marbre
          </p>
        </Reveler>
        <Reveler delai={140}>
          <h1 className="titre-monument mt-6 text-4xl sm:text-6xl lg:text-7xl">
            Le château est <span className="text-or">ouvert</span>
          </h1>
        </Reveler>
        <Reveler delai={280}>
          <p className="annotation mt-6 max-w-lg text-lg">
            « Les escaliers bougent. Prenez le temps de regarder : tout ici ne se laisse pas voir
            du premier coup. »
          </p>
        </Reveler>
        <Reveler delai={400} className="mt-8">
          <CompteurTrouvailles />
        </Reveler>
      </section>

      {/* ── Que s'est-il passé aujourd'hui ── */}
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <Reveler>
          <div className="parchemin relative px-7 py-9 sm:px-12" style={{ transform: "rotate(-0.4deg)" }}>
            <div className="pointer-events-none absolute inset-2 border border-[oklch(0.4_0.06_60/25%)]" />
            <p className="text-center font-display text-[0.55rem] uppercase tracking-[0.42em] text-[oklch(0.42_0.05_50)]">
              Affiché ce matin · {fait.lieu}
            </p>
            <h2 className="mt-3 text-center font-titre text-2xl text-[oklch(0.26_0.04_45)] sm:text-3xl">
              {fait.titre}
            </h2>
            <div className="mt-4 flex items-center justify-center gap-3 text-[oklch(0.45_0.06_55)]" aria-hidden>
              <span className="h-px w-14 bg-[oklch(0.45_0.06_55/45%)]" />
              <Ornement className="h-2 w-2" />
              <span className="h-px w-14 bg-[oklch(0.45_0.06_55/45%)]" />
            </div>
            <p className="mx-auto mt-5 max-w-xl text-center font-manuscrit text-lg italic leading-relaxed text-[oklch(0.3_0.04_45)]">
              {fait.texte}
            </p>
            <p className="mt-7 flex items-center justify-center gap-3 font-manuscrit text-base italic text-[oklch(0.36_0.06_50)]">
              <Blason maison={favorisee} className="h-8 w-8" />
              Faveur du jour : {infosMaisons[favorisee].nom} — le sablier y tombe plus vite
              aujourd'hui.
            </p>
          </div>
        </Reveler>
      </section>

      {/* ── Les portes du château ── */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveler className="mb-12 text-center">
          <p className="font-display text-[0.58rem] uppercase tracking-[0.45em] text-or/65">
            Couloirs du rez-de-chaussée
          </p>
          <h2 className="titre-monument mt-4 text-3xl sm:text-4xl">Six portes, six ambiances</h2>
        </Reveler>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((z, i) => (
            <Portail key={z.to} z={z} delai={i * 90} />
          ))}
        </div>
      </section>

      {/* ── Couloir des curiosités ── */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <Reveler>
          <p className="font-display text-[0.58rem] uppercase tracking-[0.45em] text-or/65">
            Deuxième étage · après le couvre-feu
          </p>
          <h2 className="titre-monument mt-4 text-2xl sm:text-3xl">
            Certaines choses attendent qu'on s'arrête.
          </h2>
        </Reveler>
        <div className="mt-8 grid gap-2 sm:grid-cols-2">
          <Curiosite id="portrait" icone={<IconePlume />} libelle="Un portrait qui vous suit du regard" />
          <Curiosite id="armure" icone={<IconeCarte />} libelle="Une armure qui grince toute seule" />
          <Curiosite id="bougies" icone={<IconeChandelle />} libelle="Les chandelles flottantes" />
          <Curiosite id="sablier" icone={<IconeCoupe />} libelle="Le sable rouge d'un sablier" />
        </div>
      </section>

      {/* ── Le serment ── */}
      <section className="mx-auto max-w-4xl px-6 pb-32">
        <div className="plaque px-6 py-12 sm:px-12">
          <p className="text-center font-display text-[0.58rem] uppercase tracking-[0.45em] text-or/65">
            Cinquième étage · derrière la statue
          </p>
          <div className="mt-8">
            <SermentMaraudeurs />
          </div>
        </div>
      </section>

      {/* ── Rappel discret de la Coupe ── */}
      <section className="mx-auto max-w-4xl px-6 pb-28">
        <Reveler className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {ordreMaisons.map((m) => (
            <Link
              key={m}
              to="/coupe"
              className="group flex flex-col items-center"
              aria-label={`Coupe des maisons : ${infosMaisons[m].nom}`}
            >
              <Blason
                maison={m}
                className="h-11 w-11 opacity-55 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
              />
              <span className="chiffre mt-2 text-sm text-parchemin/70">{points[m]}</span>
            </Link>
          ))}
        </Reveler>
      </section>
    </div>
  );
}
