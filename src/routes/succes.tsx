import { createFileRoute, Link } from "@tanstack/react-router";
import { useJoueur } from "@/lib/joueur-context";
import { objets, succesListe } from "@/lib/progression";

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

function SuccesPage() {
  const { joueur, pret } = useJoueur();
  const debloques = joueur?.succes ?? [];

  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 py-14 lg:py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Salle des trophées
        </p>
        <h1 className="font-display text-3xl font-semibold">🏅 Succès</h1>
        <p className="mt-4 max-w-[62ch] text-muted-foreground">
          {pret && joueur
            ? `${debloques.length} / ${succesListe.length} trophées obtenus. Ils se débloquent tout seuls dès que la condition est remplie.`
            : "Les trophées se débloquent au fil de votre progression."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {succesListe.map((s) => {
            const ok = debloques.includes(s.id);
            return (
              <div key={s.id} className={`panel p-5 ${ok ? "ring-1 ring-brass/60" : "opacity-70"}`}>
                <div className="flex items-start gap-4">
                  <span className={`text-2xl ${ok ? "" : "grayscale"}`}>{ok ? s.icone : "🔒"}</span>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg">{s.titre}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                    <p className="mt-2 text-xs text-brass-2">
                      {[
                        s.recompense.xp ? `✨ ${s.recompense.xp} XP` : null,
                        s.recompense.gallions ? `🪙 ${s.recompense.gallions}` : null,
                        s.recompense.points ? `🏆 ${s.recompense.points}` : null,
                        s.objet ? `${objets[s.objet]?.icone} ${objets[s.objet]?.nom}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {!joueur && pret && (
          <Link
            to="/sorcier"
            className="mt-8 inline-flex items-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
          >
            🪄 Créer mon sorcier
          </Link>
        )}
      </div>
    </section>
  );
}
