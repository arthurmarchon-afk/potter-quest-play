import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { classement, classementMaisons, recompenseRang, saisonCourante } from "@/lib/saison";
import { emblemes } from "@/lib/joueur";

export const Route = createFileRoute("/classement")({
  head: () => ({
    meta: [
      { title: "Saison & Classement — Palmarès de Poudlard" },
      {
        name: "description",
        content:
          "Suivez la saison en cours, votre rang parmi les élèves et le classement des quatre maisons.",
      },
      { property: "og:title", content: "Saison & Classement de Poudlard" },
      {
        property: "og:description",
        content: "Votre rang parmi les élèves et la course des maisons, saison après saison.",
      },
    ],
  }),
  component: Classement,
});

function Classement() {
  const { joueur } = useJoueur();
  const saison = useMemo(() => saisonCourante(), []);
  const eleves = useMemo(() => classement(joueur), [joueur]);
  const maisons = useMemo(() => classementMaisons(joueur), [joueur]);
  const rang = eleves.findIndex((e) => e.joueur) + 1;
  const recompense = recompenseRang(rang || eleves.length);

  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 py-12 lg:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Saison {saison.numero}
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">{saison.nom}</h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          La saison se clôt dans {saison.joursRestants} jour(s). Le palmarès est figé à la fin du
          trimestre : XP totale pour les élèves, points de maison pour la Coupe.
        </p>

        <div className="panel mt-5 p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
            <span className="text-muted-foreground">Progression de la saison</span>
            <span className="text-brass-2">{saison.progression}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-border">
            <div className="h-full bg-primary" style={{ width: `${saison.progression}%` }} />
          </div>
        </div>

        {!joueur && (
          <p className="panel mt-5 p-4 text-sm">
            Créez votre sorcier sur la page{" "}
            <Link to="/sorcier" className="text-brass-2 hover:underline">
              Mon Sorcier
            </Link>{" "}
            pour entrer au classement.
          </p>
        )}

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <div className="panel p-5">
            <h2 className="font-display text-lg">Classement des élèves</h2>
            <ul className="mt-4 space-y-1.5">
              {eleves.map((e, i) => (
                <li
                  key={e.id}
                  className={`flex items-center justify-between gap-3 rounded-[10px] px-3 py-2 text-sm ${
                    e.joueur ? "bg-primary/15 ring-1 ring-primary/40" : ""
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 text-brass-2">{i + 1}</span>
                    <span>{emblemes[e.maison]}</span>
                    <span className={e.joueur ? "font-medium text-foreground" : ""}>{e.nom}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Niv. {e.niveau} · {e.xp} XP
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <div className="panel p-5">
              <h2 className="font-display text-lg">Course des maisons</h2>
              <ul className="mt-4 space-y-2">
                {maisons.map((m, i) => (
                  <li key={m.maison} className="text-sm">
                    <div className="flex items-center justify-between gap-2">
                      <span className={m.vous ? "text-foreground" : "text-muted-foreground"}>
                        {i + 1}. {m.embleme} {m.maison.charAt(0).toUpperCase() + m.maison.slice(1)}
                        {m.vous && <span className="ml-2 text-brass-2">(vous)</span>}
                      </span>
                      <span className="text-brass-2">{m.points}</span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-border">
                      <div
                        className="h-full bg-primary"
                        style={{
                          width: `${Math.round((m.points / (maisons[0]?.points || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <Link to="/coupe" className="mt-4 inline-block text-sm text-brass-2 hover:underline">
                Voir la Coupe des Maisons →
              </Link>
            </div>

            {joueur && (
              <div className="panel p-5">
                <h2 className="font-display text-lg">Votre fin de saison</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Rang actuel : <span className="text-brass-2">#{rang}</span> sur {eleves.length}.
                </p>
                <p className="mt-2 text-sm">
                  Récompense estimée — <span className="text-brass-2">{recompense.titre}</span> :
                  ✨ {recompense.xp} XP et 🪙 {recompense.gallions} Gallions.
                </p>
                <p className="mt-2 text-sm italic text-muted-foreground">
                  Gagnez de l'XP dans les mini-jeux, les duels et l'exploration pour grimper avant
                  la clôture.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
