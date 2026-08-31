import { createFileRoute, Link } from "@tanstack/react-router";

import { Decor } from "@/components/immersif/Decor";
import { Reveler } from "@/components/immersif/Reveler";
import { BoutonExterne, BoutonInterne, Enseigne, SurTitre } from "@/components/immersif/Atomes";
import {
  Blason,
  IconeBaguette,
  IconeBalai,
  IconeCarte,
  IconeChandelle,
  IconeChaudron,
  IconeChoixpeau,
  IconeCle,
  IconeEchiquier,
  IconeEpees,
  IconeLivre,
  IconeParchemin,
  IconeSablier,
  Ornement,
} from "@/components/immersif/Icones";
import { maisons as infosMaisons } from "@/lib/choixpeau";
import { ordreMaisons, pointsCoupe, xpRequis } from "@/lib/joueur";
import { useJoueur } from "@/lib/joueur-context";
import { echoppes, URL_BOUTIQUE } from "@/lib/boutiques";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Potter Quest — De la voie 9¾ aux portes de Poudlard" },
      {
        name: "description",
        content:
          "Montez à bord du Poudlard Express, traversez les Highlands, franchissez les portes du château, explorez la forêt interdite et flânez dans Pré-au-Lard enneigé.",
      },
      { property: "og:title", content: "Potter Quest — Votre voyage vers Poudlard" },
      {
        property: "og:description",
        content:
          "Une traversée en scroll cinématographique : King's Cross, le train, la campagne, le château, la forêt interdite et Pré-au-Lard.",
      },
    ],
  }),
  component: Accueil,
});

/* -------------------------------------------------------------- données */

const couloirs = [
  {
    Icone: IconeLivre,
    titre: "La bibliothèque",
    texte: "Seize pages de grimoire dorment sous la poussière : sortilèges, créatures, lieux.",
    to: "/bibliotheque",
    action: "Ouvrir un ouvrage",
  },
  {
    Icone: IconeEpees,
    titre: "La salle de duel",
    texte: "Sept sortilèges, cinq adversaires, une baguette qui tremble un peu.",
    to: "/duels",
    action: "Lever la baguette",
  },
  {
    Icone: IconeChaudron,
    titre: "Les cachots",
    texte: "La recette au tableau, l'ordre exact des ingrédients, l'ébullition qui approche.",
    to: "/jeux/potions",
    action: "Allumer le feu",
  },
  {
    Icone: IconeEchiquier,
    titre: "La salle commune",
    texte: "Échecs sorciers, memory de sortilèges, quiz du professeur, Quidditch.",
    to: "/jeux",
    action: "Pousser la porte",
  },
] as const;

const rites = [
  { n: "I", Icone: IconeChoixpeau, texte: "Le Choixpeau murmure et scelle ta maison." },
  { n: "II", Icone: IconeBaguette, texte: "Ta baguette se choisit ; tes statistiques s'éveillent." },
  { n: "III", Icone: IconeEpees, texte: "Duels, quêtes et défis remplissent ton registre." },
  { n: "IV", Icone: IconeSablier, texte: "Chaque point rejoint le sablier de ta maison." },
  { n: "V", Icone: IconeLivre, texte: "Le monde magique s'écrit, page après page." },
] as const;

const sentiers = [
  { Icone: IconeCarte, nom: "La carte du château", to: "/carte" },
  { Icone: IconeBalai, nom: "Le terrain de Quidditch", to: "/jeux/quidditch" },
  { Icone: IconeBaguette, nom: "Maître des sorts", to: "/jeux/sorts" },
] as const;

/* ------------------------------------------------------------ éléments */

function Acte({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative mx-auto w-full max-w-6xl px-6 ${className}`}>{children}</section>
  );
}

/** Petit cartouche manuscrit à l'encre, posé de travers. */
function Note({ children, angle = -1.6 }: { children: React.ReactNode; angle?: number }) {
  return (
    <p
      className="annotation text-base leading-relaxed sm:text-lg"
      style={{ transform: `rotate(${angle}deg)` }}
    >
      {children}
    </p>
  );
}

function Sabliers() {
  const { joueur } = useJoueur();
  const points = pointsCoupe(joueur);
  const classement = [...ordreMaisons].sort((a, b) => points[b] - points[a]);
  const max = Math.max(1, ...ordreMaisons.map((m) => points[m]));

  return (
    <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
      {classement.map((m, i) => {
        const hauteur = Math.round((points[m] / max) * 100);
        return (
          <Reveler key={m} delai={i * 120} className="flex flex-col items-center text-center">
            {/* Bannière suspendue */}
            <span className="h-10 w-px bg-gradient-to-b from-transparent to-or/45" aria-hidden />
            <div className="oscille flex flex-col items-center">
              <Blason maison={m} className="h-20 w-20 drop-shadow-[0_10px_24px_oklch(0_0_0/70%)]" />
              <h3 className="mt-4 font-display text-[0.72rem] uppercase tracking-[0.28em] text-parchemin/85">
                {infosMaisons[m].nom}
              </h3>
              <p className="annotation mt-1 text-sm">{infosMaisons[m].devise}</p>
            </div>

            {/* Sablier : le sable monte selon les points */}
            <div className="relative mt-6 h-28 w-8 overflow-hidden rounded-b-[14px] rounded-t-sm border border-or/30 bg-[oklch(0.1_0.02_265/_55%)]">
              <div
                className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[var(--or-sombre)] to-[var(--or)] transition-[height] duration-1000"
                style={{ height: `${hauteur}%` }}
              />
              <span className="absolute inset-x-0 top-0 h-px bg-or/40" />
            </div>
            <p className="chiffre mt-3 text-2xl">{points[m]}</p>
            <p className="annotation text-xs uppercase tracking-[0.3em]">points</p>
          </Reveler>
        );
      })}
    </div>
  );
}

function Registre() {
  const { joueur } = useJoueur();

  return (
    <div className="parchemin relative mx-auto max-w-3xl px-7 py-10 sm:px-14 sm:py-14">
      <div className="pointer-events-none absolute inset-2 border border-[oklch(0.4_0.06_60/_25%)]" />
      <p className="text-center font-display text-[0.62rem] uppercase tracking-[0.45em] text-[oklch(0.36_0.06_50)]">
        Registre des élèves · Poudlard
      </p>

      {joueur ? (
        <>
          <div className="mt-7 flex flex-col items-center gap-4 sm:flex-row sm:items-end sm:justify-center">
            {joueur.maison ? <Blason maison={joueur.maison} className="h-16 w-16" /> : null}
            <div className="text-center sm:text-left">
              <p className="font-titre text-3xl text-[oklch(0.24_0.03_45)]">{joueur.nom}</p>
              <p className="font-manuscrit text-lg italic text-[oklch(0.38_0.05_45)]">
                {joueur.maison ? infosMaisons[joueur.maison].nom : "Maison à attribuer"}
              </p>
            </div>
          </div>

          <dl className="mx-auto mt-9 grid max-w-lg grid-cols-3 gap-6 text-center">
            {[
              ["Niveau", joueur.niveau],
              ["Gallions", joueur.gallions],
              ["Points", joueur.pointsMaison],
            ].map(([k, v]) => (
              <div key={k as string}>
                <dt className="font-display text-[0.55rem] uppercase tracking-[0.3em] text-[oklch(0.42_0.05_50)]">
                  {k}
                </dt>
                <dd className="font-titre text-2xl text-[oklch(0.3_0.08_45)]">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="mx-auto mt-8 max-w-md">
            <div className="flex items-baseline justify-between font-manuscrit text-sm italic text-[oklch(0.4_0.05_50)]">
              <span>Expérience accumulée</span>
              <span>
                {joueur.xp} / {xpRequis(joueur.niveau)}
              </span>
            </div>
            <div className="mt-2 h-[6px] w-full bg-[oklch(0.4_0.05_50/_20%)]">
              <div
                className="h-full bg-[oklch(0.35_0.08_50)] transition-[width] duration-700"
                style={{
                  width: `${Math.min(100, (joueur.xp / xpRequis(joueur.niveau)) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <BoutonInterne to="/sorcier" icone={<IconeParchemin className="h-4 w-4" />}>
              Mon parchemin
            </BoutonInterne>
            <BoutonInterne
              to="/quetes"
              icone={<IconeCle className="h-4 w-4" />}
              className="border-or/25"
            >
              Quêtes du jour
            </BoutonInterne>
          </div>
        </>
      ) : (
        <>
          <p className="mx-auto mt-8 max-w-md text-center font-manuscrit text-lg italic leading-relaxed text-[oklch(0.34_0.04_45)]">
            Aucune ligne à ton nom pour l'instant. La plume attend, l'encre est fraîche : inscris-toi
            au registre et le Choixpeau fera le reste.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <BoutonInterne to="/choixpeau" icone={<IconeChoixpeau className="h-4 w-4" />}>
              Passer le Choixpeau
            </BoutonInterne>
            <BoutonInterne
              to="/sorcier"
              icone={<IconeBaguette className="h-4 w-4" />}
              className="border-or/25"
            >
              Créer mon sorcier
            </BoutonInterne>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- la page */

function Accueil() {
  return (
    <>
      <Decor />

      {/* ═══════════ I — KING'S CROSS ═══════════ */}
      <Acte className="flex min-h-[94svh] flex-col items-center justify-center py-24 text-center">
        <Reveler>
          <SurTitre>King's Cross · Voie 9¾ · 11 h 00</SurTitre>
        </Reveler>
        <Reveler delai={150}>
          <h1 className="titre-monument mt-8 text-[15vw] sm:text-8xl lg:text-9xl">
            Potter
            <span className="mt-2 block text-or">Quest</span>
          </h1>
        </Reveler>
        <Reveler delai={330}>
          <div className="mt-7 flex items-center justify-center gap-4 text-or/45">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-or/45" />
            <Ornement className="h-2.5 w-2.5" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-or/45" />
          </div>
        </Reveler>
        <Reveler delai={430}>
          <Note angle={-1.2}>
            « Le mur entre les quais 9 et 10. Prends ton élan, et surtout, ne ralentis pas. »
          </Note>
        </Reveler>
        <Reveler delai={560}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <BoutonInterne to="/choixpeau" icone={<IconeChoixpeau className="h-4 w-4" />}>
              Franchir le mur
            </BoutonInterne>
            <BoutonInterne
              to="/jeux"
              icone={<IconeEchiquier className="h-4 w-4" />}
              className="border-or/20 tracking-[0.2em]"
            >
              La salle des jeux
            </BoutonInterne>
          </div>
        </Reveler>
        <Reveler delai={760} className="mt-20">
          <div className="flex flex-col items-center gap-3 text-or/55">
            <span className="font-display text-[0.58rem] uppercase tracking-[0.45em]">
              Monter à bord
            </span>
            <span className="chandelle block h-16 w-px bg-gradient-to-b from-or/60 to-transparent" />
          </div>
        </Reveler>
      </Acte>

      {/* ═══════════ II — LE VOYAGE EN TRAIN ═══════════ */}
      <Acte className="flex min-h-[95svh] items-center py-24">
        <div className="max-w-xl">
          <Reveler>
            <SurTitre>Compartiment C · le train s'ébranle</SurTitre>
          </Reveler>
          <Reveler delai={140}>
            <h2 className="titre-monument mt-6 text-4xl sm:text-6xl">
              La vitre <span className="text-or">se couvre de pluie.</span>
            </h2>
          </Reveler>
          <Reveler delai={300}>
            <p className="mt-8 max-w-lg text-pretty text-lg leading-[1.8] text-parchemin/70">
              Le quai s'efface dans la vapeur. Le chariot de friandises passe dans le couloir, la
              banquette sent le vieux velours, et quelqu'un, deux compartiments plus loin, essaie
              déjà un sortilège qui ne fonctionne pas.
            </p>
          </Reveler>
          <Reveler delai={460}>
            <Note angle={1.1}>« Une question reste à trancher avant les grilles du château. »</Note>
          </Reveler>
          <Reveler delai={600}>
            <div className="mt-10">
              <BoutonInterne to="/choixpeau" icone={<IconeChoixpeau className="h-4 w-4" />}>
                Découvrir ma maison
              </BoutonInterne>
            </div>
          </Reveler>
        </div>
      </Acte>

      {/* ═══════════ III — CAMPAGNE BRITANNIQUE ═══════════ */}
      <Acte className="flex min-h-[85svh] flex-col items-center justify-center py-24 text-center">
        <Reveler>
          <SurTitre>Highlands · viaduc de Glenfinnan</SurTitre>
        </Reveler>
        <Reveler delai={180}>
          <p className="mx-auto mt-8 max-w-3xl text-balance font-titre text-2xl leading-snug text-parchemin/90 sm:text-4xl">
            Landes, lochs, brouillard bas — le monde ordinaire reste
            <span className="text-or"> loin derrière</span>.
          </p>
        </Reveler>
        <Reveler delai={360}>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-x-10 gap-y-8">
            {ordreMaisons.map((m) => (
              <div key={m} className="group flex flex-col items-center">
                <Blason
                  maison={m}
                  className="h-12 w-12 opacity-60 transition-all duration-500 group-hover:scale-110 group-hover:opacity-100"
                />
                <span className="mt-3 font-display text-[0.56rem] uppercase tracking-[0.3em] text-parchemin/45 transition-colors group-hover:text-or">
                  {infosMaisons[m].nom}
                </span>
              </div>
            ))}
          </div>
        </Reveler>
        <Reveler delai={520}>
          <Note angle={-0.8}>« Quatre maisons. Une seule t'attend au bout de la voie. »</Note>
        </Reveler>
      </Acte>

      {/* ═══════════ IV — ARRIVÉE À POUDLARD ═══════════ */}
      <Acte className="flex min-h-[100svh] flex-col items-center justify-center py-28 text-center">
        <Reveler>
          <SurTitre>Traversée du lac noir · les barques</SurTitre>
        </Reveler>
        <Reveler delai={180}>
          <h2 className="titre-monument mt-7 text-5xl sm:text-7xl lg:text-8xl">
            Poudlard
          </h2>
        </Reveler>
        <Reveler delai={340}>
          <div className="mt-6 flex items-center justify-center gap-4 text-or/45">
            <span className="h-px w-20 bg-gradient-to-r from-transparent to-or/45" />
            <IconeChandelle className="chandelle h-5 w-5" />
            <span className="h-px w-20 bg-gradient-to-l from-transparent to-or/45" />
          </div>
        </Reveler>
        <Reveler delai={460}>
          <p className="mx-auto mt-7 max-w-lg text-balance text-lg italic text-parchemin/70">
            Les tours sortent de la brume, une à une. Personne ne parle dans les barques.
          </p>
        </Reveler>
      </Acte>

      {/* ═══════════ V — LES SABLIERS DE LA GRANDE SALLE ═══════════ */}
      <Acte className="py-24">
        <Reveler className="text-center">
          <SurTitre>Grande salle · sabliers de la Coupe</SurTitre>
          <h2 className="titre-monument mx-auto mt-5 max-w-2xl text-3xl sm:text-5xl">
            Quatre sabliers, une seule Coupe.
          </h2>
        </Reveler>
        <div className="mt-16">
          <Sabliers />
        </div>
        <Reveler delai={260} className="mt-14 text-center">
          <Note angle={0.6}>
            « Chaque victoire, chaque quête, chaque duel fait tomber quelques grains de plus. »
          </Note>
        </Reveler>
      </Acte>

      {/* ═══════════ VI — INTÉRIEUR DE POUDLARD ═══════════ */}
      <Acte className="py-28">
        <Reveler className="max-w-2xl">
          <SurTitre>Couloir du deuxième étage · après le dîner</SurTitre>
          <h2 className="titre-monument mt-5 text-3xl sm:text-5xl">
            Les portes ne sont pas toutes fermées.
          </h2>
        </Reveler>

        {/* Plaques gravées suspendues le long du couloir, en quinconce */}
        <ul className="mt-16 space-y-10">
          {couloirs.map((c, i) => (
            <Reveler as="li" key={c.titre} delai={i * 110}>
              <Link
                to={c.to}
                className={`group flex max-w-2xl items-start gap-6 border-l border-or/20 py-3 pl-6 transition-all duration-500 hover:border-or/60 hover:pl-8 ${
                  i % 2 ? "ml-auto" : ""
                }`}
              >
                <c.Icone className="mt-1 h-8 w-8 shrink-0 text-or/60 transition-colors duration-500 group-hover:text-or" />
                <div>
                  <h3 className="font-display text-sm uppercase tracking-[0.24em] text-parchemin transition-colors group-hover:text-or">
                    {c.titre}
                  </h3>
                  <p className="mt-2 max-w-md text-pretty leading-relaxed text-parchemin/55">
                    {c.texte}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 font-display text-[0.58rem] uppercase tracking-[0.32em] text-or/70">
                    {c.action}
                    <span className="transition-transform duration-500 group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </Reveler>
          ))}
        </ul>

        {/* Le registre du sorcier, posé sur la table du couloir */}
        <Reveler delai={200} className="mt-24">
          <Registre />
        </Reveler>

        {/* Les rites, gravés à même la pierre */}
        <Reveler delai={150} className="mt-24">
          <ol className="mx-auto max-w-3xl">
            {rites.map((r) => (
              <li key={r.n} className="flex items-center gap-6 py-5">
                <span className="chiffre w-8 shrink-0 text-lg opacity-70">{r.n}</span>
                <r.Icone className="h-5 w-5 shrink-0 text-or/50" />
                <span className="text-parchemin/70">{r.texte}</span>
              </li>
            ))}
          </ol>
        </Reveler>
      </Acte>

      {/* ═══════════ VII — FORÊT INTERDITE ═══════════ */}
      <Acte className="flex min-h-[95svh] flex-col items-center justify-center py-24 text-center">
        <Reveler>
          <SurTitre>Lisière ouest · bien après le couvre-feu</SurTitre>
        </Reveler>
        <Reveler delai={170}>
          <h2 className="titre-monument mt-7 max-w-3xl text-3xl sm:text-5xl">
            Certains secrets ne sont dans aucun livre.
          </h2>
        </Reveler>
        <Reveler delai={340}>
          <p className="mx-auto mt-8 max-w-lg text-pretty leading-relaxed text-parchemin/60">
            Huit lieux s'ouvrent à qui ose franchir la lisière. La première visite laisse une trace
            dans ton grimoire ; les suivantes réservent des trouvailles.
          </p>
        </Reveler>
        <Reveler delai={480}>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {sentiers.map((s) => (
              <li key={s.nom}>
                <Link
                  to={s.to}
                  className="group flex flex-col items-center gap-3 text-parchemin/55 transition-colors hover:text-or"
                >
                  <s.Icone className="h-7 w-7 opacity-70 transition-all duration-500 group-hover:-translate-y-1 group-hover:opacity-100" />
                  <span className="font-display text-[0.56rem] uppercase tracking-[0.3em]">
                    {s.nom}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveler>
        <Reveler delai={640}>
          <div className="mt-12">
            <BoutonInterne to="/carte" icone={<IconeCarte className="h-4 w-4" />}>
              Ouvrir la carte
            </BoutonInterne>
          </div>
        </Reveler>
      </Acte>

      {/* ═══════════ VIII — PRÉ-AU-LARD ═══════════ */}
      <Acte className="py-28">
        <Reveler className="text-center">
          <SurTitre>Pré-au-Lard · première neige</SurTitre>
          <h2 className="titre-monument mt-5 text-4xl sm:text-6xl">La grand-rue</h2>
          <p className="annotation mx-auto mt-6 max-w-lg text-lg">
            Les vitrines sont givrées, les enseignes grincent dans le vent, une Bièraubeurre
            attend quelque part.
          </p>
        </Reveler>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {echoppes.map((e, i) => (
            <Reveler key={e.id} delai={i * 130}>
              <Enseigne
                icone={<IconeChandelle className="mx-auto h-7 w-7 text-or/80" />}
                nom={e.nom}
                legende={e.enseigne}
                texte={e.description}
                action={
                  <>
                    <BoutonExterne href={e.url} className="px-4 py-2 text-[0.6rem]">
                      Pousser la porte
                    </BoutonExterne>
                    <p className="mt-3 font-display text-[0.55rem] uppercase tracking-[0.3em] text-parchemin/35">
                      {e.specialite}
                      {e.bientot ? " · vitrine en préparation" : ""}
                    </p>
                  </>
                }
              />
            </Reveler>
          ))}
        </div>

        <Reveler delai={220} className="mt-24 text-center">
          <div className="mx-auto max-w-2xl">
            <span className="sceau mx-auto h-16 w-16">
              <IconeCle className="h-7 w-7" />
            </span>
            <h3 className="titre-monument mt-7 text-2xl sm:text-3xl">La boutique du village</h3>
            <p className="mx-auto mt-5 max-w-md text-pretty leading-relaxed text-parchemin/60">
              La clochette tinte : écharpes de maison, baguettes et souvenirs de Potter Quest
              attendent derrière la vitre givrée.
            </p>
            <div className="mt-9">
              <BoutonExterne href={URL_BOUTIQUE}>Entrer dans la boutique</BoutonExterne>
            </div>
            <p className="annotation mt-6 text-sm">Ouvre un nouvel onglet.</p>
          </div>
        </Reveler>
      </Acte>
    </>
  );
}
