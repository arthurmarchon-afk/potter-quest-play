import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactElement, SVGProps } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { objets, progressionQuete, quetesQuotidiennes, type Quete } from "@/lib/progression";
import { Cadre, EnTetePage, Jauge, Salle, Sceau } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import {
  IconeBaguette,
  IconeCarte,
  IconeCoeur,
  IconeCoupe,
  IconeEtoile,
  IconeFiole,
  IconeFlamme,
  IconeGallion,
  IconeLivre,
  IconeMedaille,
  IconeParchemin,
  IconePlume,
  IconeSablier,
  IconeVif,
} from "@/components/immersif/Icones";

export const Route = createFileRoute("/quetes")({
  head: () => ({
    meta: [
      { title: "Quêtes du jour — Missions et récompenses | Potter Quest" },
      {
        name: "description",
        content:
          "Accomplissez les quêtes quotidiennes de Poudlard : jouer, gagner, répondre juste et récolter XP, Gallions et objets magiques.",
      },
      { property: "og:title", content: "Quêtes du jour — Potter Quest" },
      {
        property: "og:description",
        content: "Missions quotidiennes, progression et récompenses magiques.",
      },
    ],
  }),
  component: Quetes,
});

type Glyphe = (p: SVGProps<SVGSVGElement>) => ReactElement;

const glyphesQuetes: Record<string, Glyphe> = {
  "q-parties": IconeSablier,
  "q-victoire": IconeMedaille,
  "q-quiz": IconeLivre,
  "q-xp": IconeEtoile,
};

const glyphesObjets: Record<string, Glyphe> = {
  chocogrenouille: IconeCoeur,
  fiole: IconeFiole,
  plume: IconePlume,
  patacitrouille: IconeFlamme,
  carte: IconeCarte,
  vif: IconeVif,
};

function GlypheQuete({ q }: { q: Quete }) {
  const G = glyphesQuetes[q.id] ?? IconeParchemin;
  return <G className="h-5 w-5" />;
}

function ligneRecompense(q: Quete) {
  const items: { g: Glyphe; texte: string }[] = [];
  if (q.recompense.xp) items.push({ g: IconeEtoile, texte: `${q.recompense.xp} XP` });
  if (q.recompense.gallions) items.push({ g: IconeGallion, texte: `${q.recompense.gallions}` });
  if (q.recompense.points) items.push({ g: IconeCoupe, texte: `${q.recompense.points}` });
  if (q.objet && objets[q.objet]) {
    const G = glyphesObjets[q.objet] ?? IconeParchemin;
    items.push({ g: G, texte: objets[q.objet]!.nom });
  }
  return items;
}

function Quetes() {
  const { joueur, pret, reclamerQuete } = useJoueur();

  return (
    <Salle>
      <EnTetePage
        surtitre="Tableau d'affichage · Salle commune"
        titre="Quêtes du jour"
        icone={<IconeParchemin />}
        intro="Quatre missions sont épinglées chaque jour. Elles se réinitialisent à minuit — vos récompenses, elles, restent acquises."
      />

      {!pret ? (
        <p className="annotation text-base">Déroulement du parchemin…</p>
      ) : !joueur ? (
        <Cadre ton="parchemin" className="p-7">
          <p className="text-[oklch(0.32_0.03_60)]">
            Créez d'abord votre sorcier pour recevoir des quêtes.
          </p>
          <Link to="/sorcier" className="bouton-magique mt-5 px-6 py-3 text-[0.6rem]">
            <IconeBaguette className="mr-2 h-4 w-4" />
            Créer mon sorcier
          </Link>
        </Cadre>
      ) : (
        <div className="space-y-5">
          {quetesQuotidiennes.map((q, i) => {
            const { valeur, complete, reclamee } = progressionQuete(joueur, q);
            const pct = Math.round((valeur / q.cible) * 100);
            const recompenses = ligneRecompense(q);
            return (
              <Reveler key={q.id} delai={i * 60}>
                <Cadre
                  className={`p-6 transition-opacity ${
                    reclamee ? "opacity-50" : complete ? "filet-or" : ""
                  }`}
                >
                  <div className="flex flex-wrap items-start gap-5">
                    <Sceau className={reclamee ? "grayscale" : ""}>
                      <GlypheQuete q={q} />
                    </Sceau>
                    <div className="min-w-0 flex-1">
                      <h2 className="titre-monument text-lg">{q.titre}</h2>
                      <p className="annotation mt-1 text-base">{q.description}</p>
                      <div className="mt-4">
                        <Jauge valeur={pct} />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <span className="chiffre text-xs text-parchemin/55">
                          {valeur} / {q.cible}
                        </span>
                        {recompenses.map((r, j) => (
                          <span
                            key={j}
                            className="flex items-center gap-1.5 font-display text-[0.62rem] uppercase tracking-[0.2em] text-or/80"
                          >
                            <r.g className="h-3.5 w-3.5" /> {r.texte}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => reclamerQuete(q.id)}
                      disabled={!complete || reclamee}
                      className="bouton-magique shrink-0 px-5 py-2.5 text-[0.58rem] disabled:opacity-40"
                    >
                      {reclamee ? "Réclamée" : complete ? "Réclamer" : "En cours"}
                    </button>
                  </div>
                </Cadre>
              </Reveler>
            );
          })}

          <LettreSansSignature />

          <Cadre className="p-6">
            <p className="annotation text-base">
              Les compteurs avancent en jouant dans la salle des mini-jeux.
            </p>
            <Link
              to="/jeux"
              className="filet-or mt-4 inline-flex items-center rounded-[3px] px-5 py-2.5 font-display text-[0.6rem] uppercase tracking-[0.25em] text-parchemin/80 transition-transform hover:-translate-y-0.5"
            >
              Aller jouer
            </Link>
          </Cadre>
        </div>
      )}
    </Salle>
  );
}

/* Secret « côté obscur » : une lettre scellée de cire noire glissée sous les
   parchemins du tableau. Elle n'apparaît que pour ceux dont la cérémonie a
   laissé une ombre — et personne n'est prévenu de son existence. */
function LettreSansSignature() {
  const { joueur } = useJoueur();
  const { secretTrouve, revelerSecret } = useDecouvertes();
  const [ouverte, setOuverte] = useState(false);
  const ombre = (joueur?.obscur ?? 0) >= 6;
  const deja = secretTrouve("obscur");

  if (!ombre && !deja) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOuverte(true);
          revelerSecret("obscur");
        }}
        aria-label="Une lettre scellée de cire noire, glissée sous les parchemins"
        className="group flex w-full items-center gap-4 rounded-[2px] border border-[oklch(0.35_0.09_20/45%)] bg-black/50 px-5 py-4 text-left transition-colors hover:border-[oklch(0.5_0.14_20)]"
      >
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[oklch(0.2_0.06_20)] text-[oklch(0.62_0.14_20)]">
          <IconeParchemin className="h-4 w-4" />
        </span>
        <span className="annotation text-sm text-parchemin/55 group-hover:text-[oklch(0.7_0.1_25)]">
          {deja
            ? "La lettre à la cire noire, relue une fois de plus."
            : "Quelque chose dépasse sous le dernier parchemin. La cire est noire."}
        </span>
      </button>

      {ouverte ? (
        <ParcheminOuvert
          titre="Une invitation sans signature"
          sur="Cire noire, aucun sceau reconnaissable"
          onFermer={() => setOuverte(false)}
        >
          Vous avez été remarqué. Ce que le Choixpeau a tu, d'autres l'ont entendu. Descendez au
          troisième cachot après le couvre-feu ; frappez trois fois, puis une. On ne vous demandera
          rien que vous n'ayez déjà envisagé.
        </ParcheminOuvert>
      ) : null}
    </>
  );
}
