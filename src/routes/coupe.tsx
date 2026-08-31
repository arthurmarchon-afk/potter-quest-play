import { createFileRoute, Link } from "@tanstack/react-router";
import { maisons } from "@/lib/choixpeau";
import { HouseBadge } from "@/components/jeu/HouseBadge";
import { ordreMaisons, pointsCoupe } from "@/lib/joueur";
import { useJoueur } from "@/lib/joueur-context";

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
    <section>
      <div className="mx-auto max-w-4xl px-6 py-14 lg:py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Grande Salle · Saison 1
        </p>
        <h1 className="font-display text-3xl font-semibold">🏆 Coupe des Maisons</h1>
        <p className="mt-4 max-w-[60ch] text-muted-foreground">
          Chaque victoire dans les mini-jeux rapporte des points à votre maison. Objectif de la
          saison : {OBJECTIF} points.
        </p>

        <div className="mt-8 space-y-4">
          {classement.map((cle, i) => {
            const m = maisons[cle];
            const pts = points[cle];
            const pct = Math.round((pts / max) * 100);
            const sienne = joueur?.maison === cle;
            return (
              <div key={cle} className={`panel p-5 ${sienne ? "ring-1 ring-brass/50" : ""}`}>
                <div className="flex items-center gap-4">
                  <span className="font-display text-lg text-muted-foreground">#{i + 1}</span>
                  <HouseBadge maison={cle} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h2 className="font-display text-lg">
                        {m.nom}
                        {sienne && (
                          <span className="ml-2 text-xs uppercase tracking-[0.2em] text-brass-2">
                            votre maison
                          </span>
                        )}
                      </h2>
                      <span className="font-display text-xl text-brass-2">{pts} points</span>
                    </div>
                    <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-foreground/10 ring-1 ring-border">
                      <div
                        className="h-full rounded-full transition-[width] duration-700"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(to right, color-mix(in oklab, ${m.couleur} 80%, transparent), var(--candle))`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="panel mt-8 p-5">
          <h2 className="font-display text-lg">Activités de ta maison</h2>
          {joueur?.maison ? (
            <p className="mt-3 text-sm text-muted-foreground">
              Vous avez apporté <span className="text-brass-2">{joueur.pointsMaison} points</span>{" "}
              à {maisons[joueur.maison].nom}. Continuez : quiz, memory et échecs rapportent tous
              des points.
            </p>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              Passez le Choixpeau pour rejoindre une maison et commencer à marquer.
            </p>
          )}
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/jeux"
              className="inline-flex items-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
            >
              Marquer des points
            </Link>
            <Link
              to="/choixpeau"
              className="inline-flex items-center rounded-[10px] px-5 py-2.5 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
            >
              Le Choixpeau
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
