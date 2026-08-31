import { createFileRoute, Link } from "@tanstack/react-router";
import { useJoueur } from "@/lib/joueur-context";
import { objets, progressionQuete, quetesQuotidiennes } from "@/lib/progression";

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

function Quetes() {
  const { joueur, pret, reclamerQuete } = useJoueur();

  return (
    <section>
      <div className="mx-auto max-w-4xl px-6 py-14 lg:py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Tableau d'affichage · Salle commune
        </p>
        <h1 className="font-display text-3xl font-semibold">📜 Quêtes du jour</h1>
        <p className="mt-4 max-w-[62ch] text-muted-foreground">
          Quatre missions sont affichées chaque jour. Elles se réinitialisent à minuit — vos
          récompenses, elles, restent acquises.
        </p>

        {!pret ? (
          <p className="mt-10 text-sm text-muted-foreground">Déroulement du parchemin…</p>
        ) : !joueur ? (
          <div className="panel mt-8 p-6">
            <p className="text-muted-foreground">
              Créez d'abord votre sorcier pour recevoir des quêtes.
            </p>
            <Link
              to="/sorcier"
              className="mt-4 inline-flex items-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
            >
              🪄 Créer mon sorcier
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {quetesQuotidiennes.map((q) => {
              const { valeur, complete, reclamee } = progressionQuete(joueur, q);
              const pct = Math.round((valeur / q.cible) * 100);
              return (
                <div
                  key={q.id}
                  className={`panel p-5 ${reclamee ? "opacity-60" : complete ? "ring-1 ring-brass/60" : ""}`}
                >
                  <div className="flex flex-wrap items-start gap-4">
                    <span className="text-2xl">{q.icone}</span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-lg">{q.titre}</h2>
                      <p className="mt-1 text-sm text-muted-foreground">{q.description}</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10 ring-1 ring-border">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brass to-candle transition-[width] duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {valeur} / {q.cible} · Récompense :{" "}
                        {[
                          q.recompense.xp ? `✨ ${q.recompense.xp} XP` : null,
                          q.recompense.gallions ? `🪙 ${q.recompense.gallions}` : null,
                          q.recompense.points ? `🏆 ${q.recompense.points}` : null,
                          q.objet ? `${objets[q.objet]?.icone} ${objets[q.objet]?.nom}` : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    </div>
                    <button
                      onClick={() => reclamerQuete(q.id)}
                      disabled={!complete || reclamee}
                      className="inline-flex items-center rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                    >
                      {reclamee ? "Réclamée" : complete ? "Réclamer" : "En cours"}
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="panel p-5">
              <p className="text-sm text-muted-foreground">
                Les compteurs avancent en jouant dans la salle des mini-jeux.
              </p>
              <Link
                to="/jeux"
                className="mt-4 inline-flex items-center rounded-[10px] px-5 py-2.5 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
              >
                🎮 Aller jouer
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
