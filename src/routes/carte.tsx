import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { lieux } from "@/lib/contenu";
import { Salle, EnTetePage, Cadre } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeCarte, IconeCadenas, IconeLoupe, IconePlume } from "@/components/immersif/Icones";

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
    <Salle large>
      <EnTetePage
        surtitre="Méfait accompli"
        titre="Carte du Maraudeur"
        icone={<IconeCarte />}
        intro={`${visites.length} / ${lieux.length} lieux explorés. La première visite d'un lieu rapporte une grosse récompense ; les suivantes réservent de petites trouvailles.`}
      />

      {pret && !joueur && (
        <Link to="/sorcier" className="bouton-magique mb-10 px-5 py-2.5 text-[0.6rem]">
          <IconePlume className="h-4 w-4" /> Créer mon sorcier pour explorer
        </Link>
      )}

      <div
        className="parchemin relative overflow-hidden rounded-[3px] p-6 sm:p-10"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, oklch(0.3 0.05 60 / 25%) 40%, transparent 41%)," +
            "radial-gradient(1px 1px at 70% 60%, oklch(0.3 0.05 60 / 20%) 40%, transparent 41%)",
        }}
      >
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full opacity-40"
          aria-hidden
        >
          <path
            d="M 40 60 C 200 20, 400 140, 620 70 S 900 200, 1100 90"
            stroke="oklch(0.3 0.06 55)"
            strokeWidth="1.4"
            fill="none"
            strokeDasharray="2 7"
          />
          <path
            d="M 60 250 C 260 320, 480 200, 700 300 S 980 260, 1150 340"
            stroke="oklch(0.3 0.06 55)"
            strokeWidth="1.4"
            fill="none"
            strokeDasharray="2 7"
          />
        </svg>

        <p className="relative font-display text-[0.6rem] uppercase tracking-[0.4em] text-bordeaux/70">
          Je jure solennellement que mes intentions sont mauvaises
        </p>

        <div className="relative mt-8 grid gap-6 sm:grid-cols-2">
          {lieux.map((l, i) => {
            const vu = visites.includes(l.id);
            const verrouille = l.niveau > niveau;
            return (
              <Reveler key={l.id} delai={(i % 6) * 60}>
                <div
                  className={`relative rounded-[3px] border border-black/15 bg-black/5 p-5 shadow-[0_10px_24px_-16px_rgba(0,0,0,0.5)] ${
                    verrouille ? "opacity-70" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span
                      aria-hidden
                      className={`sceau h-11 w-11 shrink-0 [&>svg]:h-4 [&>svg]:w-4 ${
                        vu ? "" : "grayscale"
                      }`}
                    >
                      {verrouille ? <IconeCadenas /> : <IconeLoupe />}
                    </span>
                    <div className="min-w-0">
                      <h2 className="titre-monument text-lg !text-[oklch(0.22_0.02_60)] [text-shadow:none]">
                        {l.nom}
                      </h2>
                      <p className="annotation mt-1 text-[1rem] leading-relaxed text-[oklch(0.22_0.02_60/80%)]">
                        {l.description}
                      </p>
                      <p className="mt-2 font-display text-[0.58rem] uppercase tracking-[0.25em] text-bordeaux/80">
                        {verrouille
                          ? `Accessible au niveau ${l.niveau}`
                          : vu
                            ? "Lieu exploré · petite trouvaille à chaque passage"
                            : `Première visite : ${l.recompense.xp} XP · ${l.recompense.gallions} Gallions${
                                l.recompense.points ? ` · ${l.recompense.points} points` : ""
                              }`}
                      </p>
                    </div>
                  </div>

                  {recits[l.id] && (
                    <p className="annotation mt-3 border-t border-black/15 pt-3 text-[1rem] italic leading-relaxed text-[oklch(0.22_0.02_60/85%)]">
                      {recits[l.id]}
                    </p>
                  )}

                  {/* empreintes de pas */}
                  {vu && !verrouille && (
                    <span className="pointer-events-none absolute -right-1 -top-1 text-bordeaux/40">
                      <IconePlume className="h-4 w-4" />
                    </span>
                  )}

                  <button
                    disabled={verrouille || !joueur}
                    onClick={() => visiter(l.id)}
                    className="mt-4 inline-flex items-center gap-2 border border-bordeaux/40 bg-bordeaux/10 px-4 py-2 font-display text-[0.58rem] uppercase tracking-[0.3em] text-bordeaux transition-transform hover:-translate-y-0.5 hover:bg-bordeaux/20 disabled:opacity-40"
                  >
                    {vu ? "Explorer encore" : "Explorer"}
                  </button>
                </div>
              </Reveler>
            );
          })}
        </div>
      </div>
    </Salle>
  );
}
