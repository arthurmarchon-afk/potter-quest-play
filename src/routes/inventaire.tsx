import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactElement, SVGProps } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { objets } from "@/lib/progression";
import { Cadre, EnTetePage, Salle } from "@/components/immersif/Page";
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
  IconePlume,
  IconeSac,
  IconeVif,
} from "@/components/immersif/Icones";

export const Route = createFileRoute("/inventaire")({
  head: () => ({
    meta: [
      { title: "Inventaire — Sacoche du sorcier | Potter Quest" },
      {
        name: "description",
        content:
          "Consultez et consommez vos objets magiques : Chocogrenouilles, Fiole de Felicis, Plume dorée et reliques de collection.",
      },
      { property: "og:title", content: "Inventaire — Potter Quest" },
      {
        property: "og:description",
        content: "Vos objets magiques, leurs effets et vos reliques de collection.",
      },
    ],
  }),
  component: Inventaire,
});

type Glyphe = (p: SVGProps<SVGSVGElement>) => ReactElement;

const glyphesObjets: Record<string, Glyphe> = {
  chocogrenouille: IconeCoeur,
  fiole: IconeFiole,
  plume: IconePlume,
  patacitrouille: IconeFlamme,
  carte: IconeCarte,
  vif: IconeVif,
};

function Inventaire() {
  const { joueur, pret, utiliserObjet } = useJoueur();
  const inv = joueur?.inventaire ?? {};
  const possedes = Object.keys(inv).filter((id) => (inv[id] ?? 0) > 0 && objets[id]);

  return (
    <Salle>
      <EnTetePage
        surtitre="Sacoche en peau de dragon"
        titre="Inventaire"
        icone={<IconeSac />}
        intro="Les objets s'obtiennent en accomplissant des quêtes et en débloquant des succès. Certains se consomment pour un gain immédiat, d'autres sont de pures reliques."
      />

      {!pret ? (
        <p className="annotation text-base">Ouverture de la sacoche…</p>
      ) : !joueur ? (
        <Cadre ton="parchemin" className="p-7">
          <p className="text-[oklch(0.32_0.03_60)]">
            Créez votre sorcier pour obtenir une sacoche.
          </p>
          <Link to="/sorcier" className="bouton-magique mt-5 px-6 py-3 text-[0.6rem]">
            <IconeBaguette className="mr-2 h-4 w-4" />
            Créer mon sorcier
          </Link>
        </Cadre>
      ) : possedes.length === 0 ? (
        <Cadre className="p-7">
          <p className="annotation text-base">
            Sacoche vide. Accomplissez une quête du jour pour recevoir votre premier objet.
          </p>
          <Link
            to="/quetes"
            className="bouton-magique mt-5 px-6 py-3 text-[0.6rem]"
          >
            Voir les quêtes
          </Link>
        </Cadre>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {possedes.map((id, i) => {
            const o = objets[id]!;
            const n = inv[id] ?? 0;
            const Glyphe = glyphesObjets[id] ?? IconeFiole;
            const effets: { g: Glyphe; texte: string }[] = [];
            if (o.effet?.xp) effets.push({ g: IconeEtoile, texte: `+${o.effet.xp}` });
            if (o.effet?.gallions) effets.push({ g: IconeGallion, texte: `+${o.effet.gallions}` });
            if (o.effet?.points) effets.push({ g: IconeCoupe, texte: `+${o.effet.points}` });

            return (
              <Reveler key={id} delai={i * 60}>
                <Cadre ton="sombre" className="relative flex h-full flex-col p-6">
                  <span
                    className="rai-lumiere pointer-events-none absolute -top-10 left-1/2 h-32 w-52 -translate-x-1/2 opacity-70"
                    aria-hidden
                  />
                  <div className="relative flex items-start gap-4">
                    <span className="sceau h-14 w-14 shrink-0 [&>svg]:h-6 [&>svg]:w-6">
                      <Glyphe />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h2 className="titre-monument flex flex-wrap items-baseline gap-2 text-lg">
                        {o.nom}
                        <span className="chiffre text-sm">×{n}</span>
                      </h2>
                      <p className="annotation mt-1 text-base">{o.description}</p>
                    </div>
                  </div>
                  {o.effet ? (
                    <button
                      onClick={() => utiliserObjet(id)}
                      className="bouton-magique relative mt-5 justify-center px-5 py-2.5 text-[0.58rem]"
                    >
                      Utiliser
                      {effets.map((e, j) => (
                        <span key={j} className="ml-3 inline-flex items-center gap-1">
                          <e.g className="h-3.5 w-3.5" />
                          {e.texte}
                        </span>
                      ))}
                    </button>
                  ) : (
                    <p className="relative mt-5 font-display text-[0.58rem] uppercase tracking-[0.28em] text-or/60">
                      Relique de collection
                    </p>
                  )}
                </Cadre>
              </Reveler>
            );
          })}
        </div>
      )}
    </Salle>
  );
}
