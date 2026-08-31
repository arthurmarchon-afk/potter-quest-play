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
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Sacoche en peau de dragon
        </p>
        <h1 className="font-display text-3xl font-semibold">🎒 Inventaire</h1>
        <p className="mt-4 max-w-[62ch] text-muted-foreground">
          Les objets s'obtiennent en accomplissant des quêtes et en débloquant des succès.
          Certains se consomment pour un gain immédiat, d'autres sont de pures reliques.
        </p>

        {!pret ? (
          <p className="mt-10 text-sm text-muted-foreground">Ouverture de la sacoche…</p>
        ) : !joueur ? (
          <div className="panel mt-8 p-6">
            <p className="text-muted-foreground">Créez votre sorcier pour obtenir une sacoche.</p>
            <Link
              to="/sorcier"
              className="mt-4 inline-flex items-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
            >
              🪄 Créer mon sorcier
            </Link>
          </div>
        ) : possedes.length === 0 ? (
          <div className="panel mt-8 p-6">
            <p className="text-muted-foreground">
              Sacoche vide. Accomplissez une quête du jour pour recevoir votre premier objet.
            </p>
            <Link
              to="/quetes"
              className="mt-4 inline-flex items-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
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
                        <span className="ml-2 text-sm text-brass-2">×{n}</span>
                      </h2>
                      <p className="mt-1 text-sm text-muted-foreground">{o.description}</p>
                    </div>
                  </div>
                  {o.effet ? (
                    <button
                      onClick={() => utiliserObjet(id)}
                      className="mt-4 inline-flex items-center justify-center rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
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
                    <p className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
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
