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
        <p className="mb-3 font-display text-[0.62rem] uppercase tracking-[0.5em] text-or/70">
          Salle des trophées
        </p>
        <h1 className="titre-cinema text-3xl text-parchemin sm:text-4xl">🏅 Succès</h1>
        <p className="mt-4 max-w-[62ch] text-parchemin/60">
          {pret && joueur
            ? `${debloques.length} / ${succesListe.length} trophées obtenus. Ils se débloquent tout seuls dès que la condition est remplie.`
            : "Les trophées se débloquent au fil de votre progression."}
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {succesListe.map((s) => {
            const ok = debloques.includes(s.id);
            return (
              <div key={s.id} className={`panel p-5 ${ok ? "ring-1 ring-or/60" : "opacity-70"}`}>
                <div className="flex items-start gap-4">
                  <span className={`text-2xl ${ok ? "" : "grayscale"}`}>{ok ? s.icone : "🔒"}</span>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg">{s.titre}</h2>
                    <p className="mt-1 text-sm text-parchemin/60">{s.description}</p>
                    <p className="mt-2 text-xs text-or">
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
            className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-8"
          >
            🪄 Créer mon sorcier
          </Link>
        )}
      </div>
    </section>
  );
}
