import { createFileRoute, Link } from "@tanstack/react-router";
import { useJoueur } from "@/lib/joueur-context";
import { objets } from "@/lib/progression";

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

function Inventaire() {
  const { joueur, pret, utiliserObjet } = useJoueur();
  const inv = joueur?.inventaire ?? {};
  const possedes = Object.keys(inv).filter((id) => (inv[id] ?? 0) > 0 && objets[id]);

  return (
    <section>
      <div className="mx-auto max-w-4xl px-6 py-14 lg:py-20">
        <p className="mb-3 font-display text-[0.62rem] uppercase tracking-[0.5em] text-or/70">
          Sacoche en peau de dragon
        </p>
        <h1 className="titre-cinema text-3xl text-parchemin sm:text-4xl">🎒 Inventaire</h1>
        <p className="mt-4 max-w-[62ch] text-parchemin/60">
          Les objets s'obtiennent en accomplissant des quêtes et en débloquant des succès.
          Certains se consomment pour un gain immédiat, d'autres sont de pures reliques.
        </p>

        {!pret ? (
          <p className="mt-10 text-sm text-parchemin/60">Ouverture de la sacoche…</p>
        ) : !joueur ? (
          <div className="panel mt-8 p-6">
            <p className="text-parchemin/60">Créez votre sorcier pour obtenir une sacoche.</p>
            <Link
              to="/sorcier"
              className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-4"
            >
              🪄 Créer mon sorcier
            </Link>
          </div>
        ) : possedes.length === 0 ? (
          <div className="panel mt-8 p-6">
            <p className="text-parchemin/60">
              Sacoche vide. Accomplissez une quête du jour pour recevoir votre premier objet.
            </p>
            <Link
              to="/quetes"
              className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-4"
            >
              📜 Voir les quêtes
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {possedes.map((id) => {
              const o = objets[id]!;
              const n = inv[id] ?? 0;
              return (
                <div key={id} className="panel flex flex-col p-5">
                  <div className="flex items-start gap-4">
                    <span className="text-2xl">{o.icone}</span>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-display text-lg">
                        {o.nom}
                        <span className="ml-2 text-sm text-or">×{n}</span>
                      </h2>
                      <p className="mt-1 text-sm text-parchemin/60">{o.description}</p>
                    </div>
                  </div>
                  {o.effet ? (
                    <button
                      onClick={() => utiliserObjet(id)}
                      className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-4 justify-center"
                    >
                      Utiliser (
                      {[
                        o.effet.xp ? `✨ +${o.effet.xp}` : null,
                        o.effet.gallions ? `🪙 +${o.effet.gallions}` : null,
                        o.effet.points ? `🏆 +${o.effet.points}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                      )
                    </button>
                  ) : (
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-parchemin/60">
                      Relique de collection
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
