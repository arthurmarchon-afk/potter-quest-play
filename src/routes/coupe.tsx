import { createFileRoute, Link } from "@tanstack/react-router";
import { maisons } from "@/lib/choixpeau";
import { HouseBadge } from "@/components/jeu/HouseBadge";
import { ordreMaisons, pointsCoupe } from "@/lib/joueur";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, Jauge } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeCoupe } from "@/components/immersif/Icones";

export const Route = createFileRoute("/coupe")({
  head: () => ({
    meta: [
      { title: "Coupe des Maisons — Classement de Poudlard | Potter Quest" },
      {
        name: "description",
        content:
          "Suivez le classement des quatre maisons de Poudlard et voyez comment vos parties font gagner des points à votre maison.",
      },
      { property: "og:title", content: "Coupe des Maisons — Potter Quest" },
      {
        property: "og:description",
        content: "Classement des maisons et contribution de vos parties.",
      },
    ],
  }),
  component: Coupe,
});

const OBJECTIF = 1000;

function Coupe() {
  const { joueur } = useJoueur();
  const points = pointsCoupe(joueur);
  const classement = [...ordreMaisons].sort((a, b) => points[b] - points[a]);
  const max = Math.max(OBJECTIF, ...ordreMaisons.map((m) => points[m]));

  return (
    <Salle>
      <EnTetePage
        surtitre="Grande Salle · Saison 1"
        titre="Coupe des Maisons"
        icone={<IconeCoupe />}
        intro={`Chaque victoire dans les mini-jeux rapporte des points à votre maison. Objectif de la saison : ${OBJECTIF} points.`}
      />

      <div className="plaque p-6 sm:p-8">
        <div className="flex items-end justify-around gap-4 sm:gap-8">
          {classement.map((cle) => {
            const m = maisons[cle];
            const pts = points[cle];
            const pct = Math.max(4, Math.round((pts / max) * 100));
            const sienne = joueur?.maison === cle;
            return (
              <Reveler key={cle} className="flex flex-col items-center gap-2">
                <div
                  className={`relative h-40 w-11 overflow-hidden rounded-b-[4px] rounded-t-[10px] border bg-black/30 ${
                    sienne ? "border-or/60" : "border-or/20"
                  }`}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-[height] duration-700"
                    style={{
                      height: `${pct}%`,
                      background: `linear-gradient(to top, color-mix(in oklab, ${m.couleur} 88%, transparent), color-mix(in oklab, ${m.couleur} 50%, transparent))`,
                      boxShadow: `inset 0 0 12px color-mix(in oklab, ${m.couleur} 70%, black)`,
                    }}
                  />
                  <span
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-2.5 bg-gradient-to-b from-white/25 to-transparent"
                  />
                </div>
                <HouseBadge maison={cle} taille="sm" />
                <p className="chiffre text-sm">{pts}</p>
                <p className="font-display text-[0.55rem] uppercase tracking-[0.25em] text-parchemin/60">
                  {m.nom}
                  {sienne && <span className="ml-1 text-or">· vous</span>}
                </p>
              </Reveler>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {classement.map((cle, i) => {
          const m = maisons[cle];
          const pts = points[cle];
          const pct = Math.round((pts / max) * 100);
          const sienne = joueur?.maison === cle;
          return (
            <Reveler key={cle} delai={i * 60}>
              <div className={`plaque p-5 ${sienne ? "ring-1 ring-or/50" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="chiffre w-8 text-lg">#{i + 1}</span>
                  <HouseBadge maison={cle} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="titre-monument text-lg">{m.nom}</h2>
                      <span className="chiffre text-xl">{pts} points</span>
                    </div>
                    <Jauge valeur={pct} className="mt-2" />
                  </div>
                </div>
              </div>
            </Reveler>
          );
        })}
      </div>

      <div className="plaque mt-8 p-6">
        <h2 className="titre-monument text-lg">Activités de ta maison</h2>
        {joueur?.maison ? (
          <p className="mt-3 text-sm text-parchemin/60">
            Vous avez apporté <span className="text-or">{joueur.pointsMaison} points</span> à{" "}
            {maisons[joueur.maison].nom}. Continuez : quiz, memory et échecs rapportent tous des
            points.
          </p>
        ) : (
          <p className="mt-3 text-sm text-parchemin/60">
            Passez le Choixpeau pour rejoindre une maison et commencer à marquer.
          </p>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/jeux" className="bouton-magique px-5 py-2.5 text-[0.6rem]">
            Marquer des points
          </Link>
          <Link
            to="/choixpeau"
            className="inline-flex items-center rounded-[3px] px-5 py-2.5 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
          >
            Le Choixpeau
          </Link>
        </div>
      </div>
    </Salle>
  );
}
