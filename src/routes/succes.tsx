import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactElement, SVGProps } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { objets, succesListe } from "@/lib/progression";
import { Cadre, EnTetePage, Salle } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import {
  IconeBaguette,
  IconeCadenas,
  IconeCarte,
  IconeChandelle,
  IconeChoixpeau,
  IconeCoeur,
  IconeCoupe,
  IconeEclair,
  IconeEpees,
  IconeEtoile,
  IconeFiole,
  IconeFlamme,
  IconeGallion,
  IconeMedaille,
  IconePlume,
  IconeVif,
} from "@/components/immersif/Icones";

export const Route = createFileRoute("/succes")({
  head: () => ({
    meta: [
      { title: "Succès — Trophées du sorcier | Potter Quest" },
      {
        name: "description",
        content:
          "Débloquez les trophées de Poudlard : répartition, niveaux, victoires en duel, quiz parfait et coffres de Gringotts.",
      },
      { property: "og:title", content: "Succès — Potter Quest" },
      {
        property: "og:description",
        content: "La galerie des trophées et des exploits de votre sorcier.",
      },
    ],
  }),
  component: SuccesPage,
});

type Glyphe = (p: SVGProps<SVGSVGElement>) => ReactElement;

const glyphesSucces: Record<string, Glyphe> = {
  "s-choixpeau": IconeChoixpeau,
  "s-niv3": IconeChandelle,
  "s-niv5": IconeMedaille,
  "s-niv10": IconeEtoile,
  "s-victoires": IconeEpees,
  "s-parfait": IconeEclair,
  "s-gallions": IconeGallion,
  "s-points": IconeCoupe,
};

const glyphesObjets: Record<string, Glyphe> = {
  chocogrenouille: IconeCoeur,
  fiole: IconeFiole,
  plume: IconePlume,
  patacitrouille: IconeFlamme,
  carte: IconeCarte,
  vif: IconeVif,
};

function SuccesPage() {
  const { joueur, pret } = useJoueur();
  const debloques = joueur?.succes ?? [];

  return (
    <Salle large>
      <EnTetePage
        surtitre="Salle des trophées"
        titre="Vitrine des succès"
        icone={<IconeMedaille />}
        intro={
          pret && joueur
            ? `${debloques.length} / ${succesListe.length} médaillons gravés. Ils se scellent d'eux-mêmes dès que la condition est remplie.`
            : "Les médaillons se gravent au fil de votre progression."
        }
      />

      <div className="grid gap-5 sm:grid-cols-2">
        {succesListe.map((s, i) => {
          const ok = debloques.includes(s.id);
          const Glyphe = glyphesSucces[s.id] ?? IconeMedaille;
          const recompenses: { g: Glyphe; texte: string }[] = [];
          if (s.recompense.xp) recompenses.push({ g: IconeEtoile, texte: `${s.recompense.xp} XP` });
          if (s.recompense.gallions)
            recompenses.push({ g: IconeGallion, texte: `${s.recompense.gallions}` });
          if (s.recompense.points)
            recompenses.push({ g: IconeCoupe, texte: `${s.recompense.points}` });
          if (s.objet && objets[s.objet]) {
            recompenses.push({
              g: glyphesObjets[s.objet] ?? IconeCarte,
              texte: objets[s.objet]!.nom,
            });
          }

          return (
            <Reveler key={s.id} delai={i * 50}>
              <Cadre className={`p-6 ${ok ? "filet-or" : "opacity-70"}`}>
                <div className="flex items-start gap-5">
                  <span
                    className={`sceau relative h-16 w-16 shrink-0 [&>svg]:h-6 [&>svg]:w-6 ${
                      ok ? "scintille" : "grayscale opacity-60"
                    }`}
                  >
                    {ok ? <Glyphe /> : <IconeCadenas />}
                  </span>
                  <div className="min-w-0">
                    <h2 className="titre-monument text-lg">{s.titre}</h2>
                    <p className="annotation mt-1 text-base">{s.description}</p>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                      {recompenses.map((r, j) => (
                        <span
                          key={j}
                          className="flex items-center gap-1.5 font-display text-[0.6rem] uppercase tracking-[0.2em] text-or/80"
                        >
                          <r.g className="h-3.5 w-3.5" /> {r.texte}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Cadre>
            </Reveler>
          );
        })}
      </div>

      {!joueur && pret && (
        <Link to="/sorcier" className="bouton-magique mt-8 px-6 py-3 text-[0.6rem]">
          <IconeBaguette className="mr-2 h-4 w-4" />
          Créer mon sorcier
        </Link>
      )}
    </Salle>
  );
}
