import { createFileRoute, Link } from "@tanstack/react-router";

import { Decor } from "@/components/immersif/Decor";
import { Reveler } from "@/components/immersif/Reveler";
import {
  BoutonExterne,
  BoutonInterne,
  Enseigne,
  Plaque,
  SurTitre,
  TitreScene,
} from "@/components/immersif/Atomes";
import { XPBar } from "@/components/jeu/XPBar";
import { maisons as infosMaisons } from "@/lib/choixpeau";
import { emblemes, ordreMaisons, pointsCoupe } from "@/lib/joueur";
import { useJoueur } from "@/lib/joueur-context";
import { echoppes, URL_BOUTIQUE } from "@/lib/boutiques";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Potter Quest — De la voie 9¾ aux portes de Poudlard" },
      {
        name: "description",
        content:
          "Montez à bord du Poudlard Express, passez l'épreuve du Choixpeau, relevez les duels et les mini-jeux, puis flânez dans les échoppes de Pré-au-Lard.",
      },
      { property: "og:title", content: "Potter Quest — Votre voyage vers Poudlard" },
      {
        property: "og:description",
        content:
          "Une traversée en scroll : King's Cross, le train, le château, la forêt interdite et Pré-au-Lard.",
      },
    ],
  }),
  component: Accueil,
});

/* -------------------------------------------------------------- données */

const lieux = [
  { icone: "🏰", nom: "Le château", to: "/carte" },
  { icone: "📚", nom: "La bibliothèque", to: "/bibliotheque" },
  { icone: "🧪", nom: "Les potions", to: "/jeux/potions" },
  { icone: "⚔️", nom: "Les duels", to: "/duels" },
  { icone: "🧹", nom: "Le Quidditch", to: "/jeux/quidditch" },
  { icone: "🌲", nom: "La forêt interdite", to: "/carte" },
] as const;

const fondations = [
  {
    icone: "🎩",
    titre: "Le Choixpeau",
    texte: "Huit questions, un murmure au creux de l'oreille, et votre maison pour toujours.",
  },
  {
    icone: "🪄",
    titre: "La baguette",
    texte: "Vos statistiques — magie, courage, agilité — dessinent votre façon de lancer un sort.",
  },
  {
    icone: "🔮",
    titre: "Le patronus",
    texte: "Chaque niveau franchi affine votre sagesse et rend votre gardien plus lumineux.",
  },
  {
    icone: "🏠",
    titre: "La maison",
    texte: "Chaque point gagné rejoint le sablier de votre maison dans la grande salle.",
  },
] as const;

const salles = [
  {
    icone: "📚",
    titre: "Bibliothèque",
    texte: "Seize pages de grimoire à découvrir : sortilèges, créatures, potions et lieux oubliés.",
    to: "/bibliotheque",
    action: "Explorer",
  },
  {
    icone: "⚔️",
    titre: "Salle des duels",
    texte: "Baguette levée, sept sortilèges et cinq adversaires à faire plier, tour par tour.",
    to: "/duels",
    action: "Entrer en duel",
  },
  {
    icone: "🧪",
    titre: "Laboratoire de potions",
    texte: "Mémorisez la recette, versez les ingrédients dans l'ordre exact avant l'ébullition.",
    to: "/jeux/potions",
    action: "Allumer le chaudron",
  },
  {
    icone: "🎮",
    titre: "Salle des jeux",
    texte: "Échecs sorciers, memory de sortilèges, quiz, sorts, Quidditch — en trois difficultés.",
    to: "/jeux",
    action: "Rejoindre la salle",
  },
] as const;

const etapes = [
  { n: "I", icone: "🎩", texte: "Trouve ta maison auprès du Choixpeau." },
  { n: "II", icone: "🪄", texte: "Crée ton sorcier et façonne ses statistiques." },
  { n: "III", icone: "⚔️", texte: "Relève les défis, les duels et les quêtes du jour." },
  { n: "IV", icone: "🏆", texte: "Fais gagner des points à ta maison chaque saison." },
  { n: "V", icone: "📚", texte: "Découvre le monde magique, page après page." },
] as const;

/* ------------------------------------------------------------- sections */

function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`relative mx-auto w-full max-w-6xl px-6 ${className}`}>
      {children}
    </section>
  );
}

function Filet() {
  return (
    <div className="mx-auto my-24 h-px w-2/3 max-w-md bg-gradient-to-r from-transparent via-or/35 to-transparent" />
  );
}

function Accueil() {
  const { joueur } = useJoueur();
  const points = pointsCoupe(joueur);
  const classement = [...ordreMaisons].sort((a, b) => points[b] - points[a]);
  const maxPoints = Math.max(1, ...ordreMaisons.map((m) => points[m]));

  return (
    <>
      <Decor />

      {/* ---------------------------------------------- I — King's Cross */}
      <Section className="flex min-h-[92svh] flex-col items-center justify-center py-24 text-center">
        <Reveler>
          <SurTitre>Gare de King's Cross · Voie 9¾ · 11 h 00</SurTitre>
        </Reveler>
        <Reveler delai={150}>
          <h1 className="titre-cinema mt-8 text-[13vw] leading-[0.92] text-parchemin sm:text-7xl lg:text-8xl">
            Potter
            <span className="block text-or">Quest</span>
          </h1>
        </Reveler>
        <Reveler delai={320}>
          <p className="mt-8 max-w-md text-balance font-body text-lg italic text-parchemin/70">
            Votre aventure commence ici, entre la vapeur et les briques.
          </p>
        </Reveler>
        <Reveler delai={480}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <BoutonInterne to="/choixpeau" icone="🎩">
              Commencer l'aventure
            </BoutonInterne>
            <BoutonInterne to="/jeux" icone="🎮" className="border-or/20 tracking-[0.2em]">
              La salle des jeux
            </BoutonInterne>
          </div>
        </Reveler>
        <Reveler delai={700} className="mt-20">
          <div className="flex flex-col items-center gap-3 text-or/60">
            <span className="font-display text-[0.6rem] uppercase tracking-[0.45em]">
              Descendez sur le quai
            </span>
            <span className="chandelle block h-14 w-px bg-gradient-to-b from-or/60 to-transparent" />
          </div>
        </Reveler>
      </Section>

      {/* ----------------------------------------------- Le départ */}
      <Section className="flex min-h-[70svh] items-center justify-center py-16 text-center">
        <Reveler>
          <p className="font-display text-sm uppercase tracking-[0.5em] text-parchemin/70 sm:text-lg">
            Prochain arrêt : Poudlard
          </p>
          <p className="mt-6 text-sm italic text-parchemin/45">
            Les portières claquent. La locomotive souffle. Le quai s'efface dans la vapeur.
          </p>
        </Reveler>
      </Section>

      {/* ------------------------------------------------ II — Le voyage */}
      <Section className="flex min-h-[95svh] items-center py-24">
        <div className="max-w-xl">
          <Reveler>
            <SurTitre>Le Poudlard Express · quelque part au nord</SurTitre>
          </Reveler>
          <Reveler delai={140}>
            <TitreScene className="mt-6">Le voyage commence.</TitreScene>
          </Reveler>
          <Reveler delai={280}>
            <p className="mt-7 max-w-lg text-pretty text-lg leading-relaxed text-parchemin/65">
              Les collines défilent derrière la vitre, la pluie trace ses lignes sur le verre, le
              chariot de friandises passe dans le couloir. Mais avant de franchir les portes du
              château, une question reste à résoudre…
            </p>
          </Reveler>
          <Reveler delai={420}>
            <div className="mt-10">
              <BoutonInterne to="/choixpeau" icone="🎩">
                Découvrir ma maison
              </BoutonInterne>
            </div>
          </Reveler>
        </div>
      </Section>

      {/* ------------------------------------------ III — Arrivée au château */}
      <Section className="flex min-h-[100svh] flex-col items-center justify-center py-28 text-center">
        <Reveler>
          <SurTitre>Traversée du lac noir</SurTitre>
        </Reveler>
        <Reveler delai={160}>
          <TitreScene className="mt-6 text-4xl sm:text-6xl lg:text-7xl">
            Bienvenue à Poudlard
          </TitreScene>
        </Reveler>
        <Reveler delai={320}>
          <p className="mt-7 max-w-lg text-balance text-lg italic text-parchemin/70">
            Ton histoire commence maintenant.
          </p>
        </Reveler>

        <ul className="mt-16 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3">
          {lieux.map((l, i) => (
            <Reveler as="li" key={l.nom} delai={i * 90}>
              <Link
                to={l.to}
                className="plaque flex h-full items-center gap-3 px-4 py-4 text-left transition-transform duration-500 hover:-translate-y-1"
              >
                <span className="text-xl" aria-hidden>
                  {l.icone}
                </span>
                <span className="font-display text-[0.72rem] uppercase tracking-[0.16em] text-parchemin/85">
                  {l.nom}
                </span>
              </Link>
            </Reveler>
          ))}
        </ul>
      </Section>

      {/* --------------------------------- Tableau d'honneur des maisons */}
      <Section className="py-20">
        <Reveler className="text-center">
          <SurTitre>Sabliers de la grande salle</SurTitre>
          <TitreScene className="mt-5 text-3xl sm:text-4xl">
            Quelle maison dominera cette année ?
          </TitreScene>
        </Reveler>

        <Reveler delai={180} className="mt-12">
          <div className="parchemin mx-auto max-w-3xl px-6 py-8 sm:px-10">
            <ul className="divide-y divide-[oklch(0.3_0.04_60/_25%)]">
              {classement.map((m, i) => {
                const info = infosMaisons[m];
                return (
                  <li key={m} className="flex items-center gap-4 py-4">
                    <span className="font-display text-sm text-[oklch(0.35_0.05_60)]">
                      {i + 1}
                    </span>
                    <span className="text-2xl" aria-hidden>
                      {emblemes[m]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm uppercase tracking-[0.18em]">
                        {info.nom}
                      </p>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[oklch(0.35_0.05_60/_18%)]">
                        <div
                          className="h-full rounded-full bg-[oklch(0.35_0.07_60)]"
                          style={{ width: `${Math.round((points[m] / maxPoints) * 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="font-display text-sm tabular-nums">{points[m]} pts</span>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-center text-xs italic text-[oklch(0.4_0.04_60)]">
              Chaque victoire, quête et duel remplit le sablier de votre maison.
            </p>
          </div>
        </Reveler>
      </Section>

      <Filet />

      {/* --------------------------------------- IV — Crée ton sorcier */}
      <Section className="py-24">
        <Reveler className="text-center">
          <SurTitre>Registre des élèves</SurTitre>
          <TitreScene className="mt-5">Qui seras-tu ?</TitreScene>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-parchemin/65">
            Chaque sorcier possède une histoire. Découvre ta maison, ton profil, et commence ton
            aventure.
          </p>
        </Reveler>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {fondations.map((f, i) => (
            <Reveler key={f.titre} delai={i * 110}>
              <Plaque icone={f.icone} titre={f.titre} texte={f.texte} />
            </Reveler>
          ))}
        </div>

        {joueur ? (
          <Reveler delai={200} className="mt-12">
            <div className="plaque mx-auto max-w-2xl px-7 py-7 text-center">
              <p className="font-display text-xs uppercase tracking-[0.35em] text-or/70">
                Votre dossier
              </p>
              <p className="mt-4 font-display text-2xl text-parchemin">
                {joueur.nom}
                {joueur.maison ? (
                  <span className="ml-2 text-or">
                    {emblemes[joueur.maison]} {infosMaisons[joueur.maison].nom}
                  </span>
                ) : null}
              </p>
              <p className="mt-2 text-sm text-parchemin/60">
                Niveau {joueur.niveau} · 🪙 {joueur.gallions} Gallions · 🏆 {joueur.pointsMaison}{" "}
                points
              </p>
              <div className="mx-auto mt-5 max-w-sm">
                <XPBar niveau={joueur.niveau} xp={joueur.xp} />
              </div>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <BoutonInterne to="/sorcier" icone="🧙">
                  Mon sorcier
                </BoutonInterne>
                <BoutonInterne to="/quetes" icone="📜" className="border-or/20">
                  Quêtes du jour
                </BoutonInterne>
              </div>
            </div>
          </Reveler>
        ) : (
          <Reveler delai={200} className="mt-12 text-center">
            <BoutonInterne to="/sorcier" icone="🪄">
              Créer mon sorcier
            </BoutonInterne>
          </Reveler>
        )}
      </Section>

      {/* ---------------------------------- V — Les salles du château */}
      <Section className="py-24">
        <Reveler className="text-center">
          <SurTitre>Couloirs du deuxième étage</SurTitre>
          <TitreScene className="mt-5 text-3xl sm:text-5xl">
            Entre dans le monde de Potter Quest
          </TitreScene>
        </Reveler>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {salles.map((s, i) => (
            <Reveler key={s.titre} delai={i * 110}>
              <Plaque
                icone={s.icone}
                titre={s.titre}
                texte={s.texte}
                action={
                  <Link
                    to={s.to}
                    className="inline-flex items-center gap-2 font-display text-[0.66rem] uppercase tracking-[0.3em] text-or transition-colors hover:text-parchemin"
                  >
                    {s.action} <span aria-hidden>→</span>
                  </Link>
                }
              />
            </Reveler>
          ))}
        </div>

        {/* Comment ça marche, gravé dans la pierre */}
        <Reveler delai={150} className="mt-20">
          <ol className="mx-auto max-w-3xl space-y-4">
            {etapes.map((e) => (
              <li
                key={e.n}
                className="flex items-center gap-5 border-b border-or/12 pb-4 last:border-0"
              >
                <span className="font-display text-lg text-or/70 tabular-nums">{e.n}</span>
                <span className="text-xl" aria-hidden>
                  {e.icone}
                </span>
                <span className="text-sm leading-relaxed text-parchemin/70 sm:text-base">
                  {e.texte}
                </span>
              </li>
            ))}
          </ol>
        </Reveler>
      </Section>

      <Filet />

      {/* ------------------------------------- VI — La forêt interdite */}
      <Section className="flex min-h-[95svh] flex-col items-center justify-center py-24 text-center">
        <Reveler>
          <SurTitre>Lisière ouest · après le couvre-feu</SurTitre>
        </Reveler>
        <Reveler delai={160}>
          <TitreScene className="mt-6 max-w-3xl text-3xl sm:text-5xl">
            Certains secrets ne se trouvent pas dans les livres.
          </TitreScene>
        </Reveler>
        <Reveler delai={330}>
          <p className="mt-8 font-display text-sm uppercase tracking-[0.42em] text-or/75">
            Explore · Découvre · Collectionne
          </p>
        </Reveler>
        <Reveler delai={480}>
          <p className="mx-auto mt-7 max-w-lg text-pretty text-parchemin/60">
            Huit lieux de Poudlard s'ouvrent à qui ose s'y aventurer. Chaque première visite laisse
            une trace dans votre grimoire, et les suivantes réservent des trouvailles.
          </p>
        </Reveler>
        <Reveler delai={620}>
          <div className="mt-10">
            <BoutonInterne to="/carte" icone="🗺️">
              Ouvrir la carte
            </BoutonInterne>
          </div>
        </Reveler>
      </Section>

      {/* ---------------------------------------- VII — Pré-au-Lard */}
      <Section className="py-28">
        <Reveler className="text-center">
          <SurTitre>Village magique · fin de l'aventure</SurTitre>
          <TitreScene className="mt-5">Pré-au-Lard</TitreScene>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg italic text-parchemin/70">
            Après l'aventure vient le temps de l'équipement.
          </p>
        </Reveler>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {echoppes.map((e, i) => (
            <Reveler key={e.id} delai={i * 130}>
              <Enseigne
                icone={e.icone}
                nom={e.nom}
                legende={e.enseigne}
                texte={e.description}
                action={
                  e.bientot ? (
                    <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-parchemin/40">
                      Volets bientôt ouverts
                    </span>
                  ) : (
                    <BoutonExterne href={e.url} className="px-4 py-2 text-[0.6rem]">
                      {e.specialite}
                    </BoutonExterne>
                  )
                }
              />
            </Reveler>
          ))}
        </div>

        <Reveler delai={200} className="mt-24 text-center">
          <div className="plaque mx-auto max-w-2xl px-8 py-12">
            <span className="chandelle text-3xl" aria-hidden>
              🕯️
            </span>
            <h3 className="titre-cinema mt-5 text-2xl text-parchemin sm:text-3xl">
              Visiter la boutique
            </h3>
            <p className="mx-auto mt-5 max-w-md text-pretty text-parchemin/60">
              Poussez la porte, la clochette tinte : écharpes de maison, baguettes et souvenirs de
              Potter Quest vous attendent derrière la vitrine givrée.
            </p>
            <div className="mt-9">
              <BoutonExterne href={URL_BOUTIQUE} icone="🛍️">
                Entrer dans la boutique
              </BoutonExterne>
            </div>
            <p className="mt-5 text-[0.68rem] italic text-parchemin/35">
              Ouvre un nouvel onglet — destination configurable.
            </p>
          </div>
        </Reveler>
      </Section>
    </>
  );
}
