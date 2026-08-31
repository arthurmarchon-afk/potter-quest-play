import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayerSummary } from "@/components/jeu/PlayerSummary";
import { HouseBadge } from "@/components/jeu/HouseBadge";
import { maisons as infosMaisons } from "@/lib/choixpeau";
import { ordreMaisons, pointsCoupe } from "@/lib/joueur";
import { useJoueur } from "@/lib/joueur-context";
import grimoire from "@/assets/grimoire.jpg";
import train from "@/assets/train.jpg";
import voie from "@/assets/voie.jpg";

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

const maisons = [
  { nom: "Gryffondor", devise: "Le courage avant tout", lettre: "G" },
  { nom: "Poufsouffle", devise: "La loyauté patiente", lettre: "P" },
  { nom: "Serdaigle", devise: "L'esprit sans limite", lettre: "S" },
  { nom: "Serpentard", devise: "L'ambition maîtrisée", lettre: "S" },
] as const;

const etapes = [
  {
    n: "I",
    titre: "Le quai",
    texte: "Franchissez la barrière de la voie 9¾ et laissez la brique se refermer derrière vous.",
  },
  {
    n: "II",
    titre: "Le voyage",
    texte: "Le Poudlard Express file vers le nord, chariot de friandises et chandelles allumées.",
  },
  {
    n: "III",
    titre: "La répartition",
    texte: "Le Choixpeau fouille votre mémoire, puis annonce la maison qui vous revient.",
  },
  {
    n: "IV",
    titre: "Les épreuves",
    texte: "Échecs sorciers, memory de sortilèges et quiz du professeur, en trois difficultés.",
  },
] as const;

function Accueil() {
  return (
    <>
      <TableauDeBord />
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
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              {[
                ["4", "maisons"],
                ["8", "questions"],
                ["3", "mini-jeux"],
              ].map(([v, l]) => (
                <div key={l}>
                  <dt className="font-display text-2xl font-semibold text-brass-2">{v}</dt>
                  <dd className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
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

      <section>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-16">
          <div className="panel order-2 p-3 lg:order-1">
            <img
              src={train}
              alt="Le Poudlard Express, locomotive écarlate et fumante, à quai sous les lanternes"
              loading="lazy"
              width={1024}
              height={768}
              className="aspect-[4/3] w-full rounded-[12px] object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
              11 h 00 · Départ
            </p>
            <h2 className="text-balance font-display text-2xl font-semibold sm:text-4xl">
              Le Poudlard Express
            </h2>
            <p className="mt-5 max-w-[48ch] text-pretty text-muted-foreground">
              La locomotive écarlate crache sa vapeur sur les pavés du quai. Malles empilées,
              hiboux qui hululent, wagons de bois verni : le voyage vers le château dure toute la
              journée et se termine à la lueur des lanternes, au bord du lac noir.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>✦ Chariot de friandises au troisième wagon</li>
              <li>✦ Robes de sorcier à enfiler avant l'arrivée</li>
              <li>✦ Barques et calèches attendent à Pré-au-Lard</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:py-16">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
              King's Cross · Entre les quais 9 et 10
            </p>
            <h2 className="text-balance font-display text-2xl font-semibold sm:text-4xl">
              La voie 9¾
            </h2>
            <p className="mt-5 max-w-[48ch] text-pretty text-muted-foreground">
              Poussez votre chariot droit sur le pilier de brique, sans hésiter et sans ralentir. La
              pierre se fait fumée, et le quai secret apparaît de l'autre côté, saturé de vapeur et
              de voix.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/choixpeau"
                className="inline-flex items-center rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
              >
                Monter à bord
              </Link>
              <Link
                to="/jeux"
                className="inline-flex items-center rounded-[10px] px-5 py-3 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
              >
                Salle des mini-jeux
              </Link>
            </div>
          </div>
          <div className="panel p-3">
            <img
              src={voie}
              alt="Panneau émaillé Platform 9¾ sur un pilier de brique, chariot à malles et hibou en cage"
              loading="lazy"
              width={1024}
              height={768}
              className="aspect-[4/3] w-full rounded-[12px] object-cover"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 py-12 lg:py-16">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Les quatre maisons</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {maisons.map((m) => (
              <div key={m.nom} className="panel p-5">
                <span className="font-display text-3xl text-brass-2">{m.lettre}</span>
                <h3 className="mt-3 font-display text-lg">{m.nom}</h3>
                <p className="mt-1 text-sm italic text-muted-foreground">{m.devise}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-4">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Votre première année</h2>
          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {etapes.map((e) => (
              <li key={e.n} className="panel p-5">
                <span className="text-xs uppercase tracking-[0.3em] text-brass-2">{e.n}</span>
                <h3 className="mt-3 font-display text-lg">{e.titre}</h3>
                <p className="mt-2 text-pretty text-sm text-muted-foreground">{e.texte}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}

function TableauDeBord() {
  const { joueur, pret } = useJoueur();

  if (!pret) return null;

  if (!joueur) {
    return (
      <section>
        <div className="mx-auto max-w-6xl px-6 pt-10">
          <div className="panel flex flex-wrap items-center justify-between gap-4 p-6">
            <div className="max-w-[46ch]">
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
                Votre parcours commence ici
              </p>
              <h2 className="font-display text-2xl font-semibold">Créez votre sorcier</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Nom, maison, niveau, XP, Gallions et points de maison : votre progression est
                conservée sur cet appareil.
              </p>
            </div>
            <Link
              to="/sorcier"
              className="inline-flex items-center rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
            >
              🪄 Créer mon sorcier
            </Link>
          </div>
        </div>
      </section>
    );
  }

  const points = pointsCoupe(joueur);
  const classement = [...ordreMaisons].sort((a, b) => points[b] - points[a]);

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 pt-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Bienvenue à Poudlard
        </p>
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Bonjour, {joueur.nom}.
        </h2>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <PlayerSummary joueur={joueur} />

          <div className="grid gap-5">
            <div className="panel p-5">
              <h3 className="font-display text-lg">🎮 Continuer à jouer</h3>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {[
                  { to: "/jeux/quiz", label: "🧠 Quiz" },
                  { to: "/jeux/memory", label: "🧪 Memory" },
                  { to: "/jeux/echecs", label: "♟️ Échecs" },
                ].map((g) => (
                  <Link
                    key={g.to}
                    to={g.to}
                    className="rounded-[10px] bg-foreground/5 px-3 py-2.5 text-center text-sm ring-1 ring-border transition-transform hover:-translate-y-0.5"
                  >
                    {g.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="panel p-5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg">🏆 Coupe des maisons</h3>
                <Link to="/coupe" className="text-sm text-brass-2">
                  Voir →
                </Link>
              </div>
              <ul className="mt-3 space-y-2">
                {classement.map((cle) => (
                  <li key={cle} className="flex items-center gap-3 text-sm">
                    <HouseBadge maison={cle} taille="sm" />
                    <span className="flex-1 text-foreground/80">{infosMaisons[cle].nom}</span>
                    <span className="text-brass-2">{points[cle]} pts</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
