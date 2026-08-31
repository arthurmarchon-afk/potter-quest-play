import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { lieux } from "@/lib/contenu";

export const Route = createFileRoute("/carte")({
  head: () => ({
    meta: [
      { title: "Carte de Poudlard — Exploration | Potter Quest" },
      {
        name: "description",
        content:
          "Explorez la Grande Salle, les cachots, la Tour d'Astronomie, la Salle sur Demande et la Forêt interdite pour gagner XP et Gallions.",
      },
      { property: "og:title", content: "Carte de Poudlard — Potter Quest" },
      {
        property: "og:description",
        content: "Huit lieux à explorer, des trouvailles à chaque visite.",
      },
    ],
  }),
  component: CartePage,
});

function CartePage() {
  const { joueur, pret, explorer } = useJoueur();
  const [recits, setRecits] = useState<Record<string, string>>({});

  const niveau = joueur?.niveau ?? 1;
  const visites = joueur?.lieuxVisites ?? [];

  function visiter(id: string) {
    const lieu = lieux.find((l) => l.id === id);
    if (!lieu || !joueur) return;
    const premiere = !visites.includes(id);
    const texte = premiere
      ? `Vous découvrez ${lieu.nom.toLowerCase()} pour la première fois. ${lieu.description}`
      : (lieu.trouvailles[Math.floor(Math.random() * lieu.trouvailles.length)] ?? "");
    explorer(id);
    setRecits((r) => ({ ...r, [id]: texte }));
  }

  return (
    <section>
      <div className="mx-auto max-w-5xl px-6 py-14 lg:py-20">
        <p className="mb-3 font-display text-[0.62rem] uppercase tracking-[0.5em] text-or/70">
          Méfait accompli
        </p>
        <h1 className="titre-cinema text-3xl text-parchemin sm:text-4xl">🗺️ Carte de Poudlard</h1>
        <p className="mt-4 max-w-[62ch] text-parchemin/60">
          {visites.length} / {lieux.length} lieux explorés. La première visite d'un lieu rapporte
          une grosse récompense ; les suivantes réservent de petites trouvailles.
        </p>

        {pret && !joueur && (
          <Link
            to="/sorcier"
            className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-8"
          >
            🪄 Créer mon sorcier pour explorer
          </Link>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {lieux.map((l) => {
            const vu = visites.includes(l.id);
            const verrouille = l.niveau > niveau;
            return (
              <div
                key={l.id}
                className={`panel flex flex-col p-5 ${verrouille ? "opacity-60" : ""} ${
                  vu ? "ring-1 ring-brass/50" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{verrouille ? "🔒" : l.icone}</span>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg">{l.nom}</h2>
                    <p className="mt-1 text-sm text-parchemin/60">{l.description}</p>
                    <p className="mt-2 text-xs text-or">
                      {verrouille
                        ? `Accessible au niveau ${l.niveau}`
                        : vu
                          ? "✓ Lieu exploré · visites suivantes : petite trouvaille"
                          : `Première visite : ✨ ${l.recompense.xp} XP · 🪙 ${l.recompense.gallions}${
                              l.recompense.points ? ` · 🏆 ${l.recompense.points}` : ""
                            }`}
                    </p>
                  </div>
                </div>

                {recits[l.id] && (
                  <p className="mt-3 border-t border-border pt-3 text-sm italic leading-relaxed">
                    {recits[l.id]}
                  </p>
                )}

                <button
                  disabled={verrouille || !joueur}
                  onClick={() => visiter(l.id)}
                  className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-4 disabled:opacity-50"
                >
                  {vu ? "🔎 Explorer encore" : "🚶 Explorer"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
