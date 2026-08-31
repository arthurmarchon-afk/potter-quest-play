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
        <p className="mb-3 font-display text-[0.62rem] uppercase tracking-[0.5em] text-or/70">
          Tableau d'affichage · Salle commune
        </p>
        <h1 className="titre-cinema text-3xl text-parchemin sm:text-4xl">📜 Quêtes du jour</h1>
        <p className="mt-4 max-w-[62ch] text-parchemin/60">
          Quatre missions sont affichées chaque jour. Elles se réinitialisent à minuit — vos
          récompenses, elles, restent acquises.
        </p>

        {!pret ? (
          <p className="mt-10 text-sm text-parchemin/60">Déroulement du parchemin…</p>
        ) : !joueur ? (
          <div className="panel mt-8 p-6">
            <p className="text-parchemin/60">
              Créez d'abord votre sorcier pour recevoir des quêtes.
            </p>
            <Link
              to="/sorcier"
              className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-4"
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
                  className={`panel p-5 ${reclamee ? "opacity-60" : complete ? "ring-1 ring-or/60" : ""}`}
                >
                  <div className="flex flex-wrap items-start gap-4">
                    <span className="text-2xl">{q.icone}</span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-lg">{q.titre}</h2>
                      <p className="mt-1 text-sm text-parchemin/60">{q.description}</p>
                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-foreground/10 ring-1 ring-border">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-brass to-candle transition-[width] duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-parchemin/60">
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
                      className="bouton-magique px-5 py-2.5 text-[0.6rem] disabled:opacity-40"
                    >
                      {reclamee ? "Réclamée" : complete ? "Réclamer" : "En cours"}
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="panel p-5">
              <p className="text-sm text-parchemin/60">
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
