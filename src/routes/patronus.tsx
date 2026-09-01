import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Salle, EnTetePage, Cadre, SeparateurOrne } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeEtoile, IconeChandelle, Ornement } from "@/components/immersif/Icones";
import { useJoueur } from "@/lib/joueur-context";
import { formeDepuisSouvenirs, souvenirs } from "@/lib/identite";

export const Route = createFileRoute("/patronus")({
  head: () => ({
    meta: [
      { title: "Spero Patronum — Révélez la forme de votre Patronus" },
      {
        name: "description",
        content:
          "Choisissez trois souvenirs heureux, tenez le sortilège, et découvrez la forme argentée qui se dresse entre vous et le froid.",
      },
      { property: "og:title", content: "Spero Patronum — Potter Quest" },
      {
        property: "og:description",
        content: "Le sortilège du Patronus : trois souvenirs, une forme, une lumière.",
      },
    ],
  }),
  component: PagePatronus,
});

type Etape = "salle" | "souvenirs" | "incantation" | "forme";

function PagePatronus() {
  const { joueur, definirPatronus } = useJoueur();
  const deja = joueur?.patronus ?? null;
  const [etape, setEtape] = useState<Etape>(deja ? "forme" : "salle");
  const [choisis, setChoisis] = useState<string[]>([]);
  const [charge, setCharge] = useState(0);

  const forme = deja
    ? { id: deja.forme, nom: deja.nom, texte: deja.texte }
    : formeDepuisSouvenirs(choisis);

  function basculer(cle: string) {
    setChoisis((c) =>
      c.includes(cle) ? c.filter((x) => x !== cle) : c.length >= 3 ? c : [...c, cle],
    );
  }

  function tenir() {
    setCharge((c) => {
      const suivant = Math.min(100, c + 9 + Math.floor(Math.random() * 8));
      if (suivant >= 100) {
        const f = formeDepuisSouvenirs(choisis);
        definirPatronus({ forme: f.id, nom: f.nom, texte: f.texte });
        setTimeout(() => setEtape("forme"), 500);
      }
      return suivant;
    });
  }

  return (
    <Salle large>
      <EnTetePage
        surtitre="Salle de Défense — leçon particulière"
        titre="Spero Patronum"
        icone={<IconeChandelle />}
        intro="« Le Patronus est un vœu rendu visible. Concentrez-vous sur un souvenir. Pas n'importe lequel : le plus heureux dont vous soyez capable. »"
      />

      {etape === "salle" ? (
        <Reveler>
          <Cadre className="mx-auto max-w-2xl text-center">
            <p className="annotation text-base leading-relaxed">
              La malle au fond de la salle tremble. Le froid gagne les vitres, l'or des chandelles
              vire au gris. Vous avez trois souvenirs à convoquer — pas un de plus.
            </p>
            <SeparateurOrne className="my-6" />
            <button
              type="button"
              onClick={() => setEtape("souvenirs")}
              className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-or hover:text-parchemin"
            >
              Fermer les yeux
            </button>
          </Cadre>
        </Reveler>
      ) : null}

      {etape === "souvenirs" ? (
        <Reveler>
          <p className="annotation mb-6 text-center text-base">
            Trois souvenirs, choisis dans l'ordre où ils vous reviennent. ({choisis.length} / 3)
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {souvenirs.map((s) => {
              const actif = choisis.includes(s.cle);
              return (
                <button key={s.id} type="button" onClick={() => basculer(s.cle)} className="text-left">
                  <Cadre
                    className={`h-full transition-all duration-500 ${
                      actif ? "shadow-[inset_0_0_0_1px_var(--or)]" : "opacity-80 hover:opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Ornement className={`h-2 w-2 ${actif ? "text-or" : "text-or/35"}`} />
                      <h3 className="font-titre text-lg text-parchemin">{s.titre}</h3>
                    </div>
                    <p className="annotation mt-3 text-sm leading-relaxed">{s.texte}</p>
                  </Cadre>
                </button>
              );
            })}
          </div>
          {choisis.length === 3 ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setEtape("incantation")}
                className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-or hover:text-parchemin"
              >
                Lever la baguette
              </button>
            </div>
          ) : null}
        </Reveler>
      ) : null}

      {etape === "incantation" ? (
        <Reveler>
          <Cadre className="mx-auto max-w-2xl text-center">
            <p className="font-display text-[0.6rem] uppercase tracking-[0.45em] text-or/70">
              Tenez le sortilège
            </p>
            <h2 className="titre-monument mt-4 text-3xl">Spero Patronum</h2>
            <div className="relative mx-auto mt-8 grid h-40 w-40 place-items-center">
              <span
                aria-hidden
                className="absolute inset-0 rounded-full blur-2xl transition-all duration-300"
                style={{
                  background: "oklch(0.9 0.06 220)",
                  opacity: charge / 260,
                  transform: `scale(${0.5 + charge / 120})`,
                }}
              />
              <button
                type="button"
                onClick={tenir}
                className="relative grid h-28 w-28 place-items-center rounded-full border border-or/40 bg-black/40 font-display text-[0.55rem] uppercase tracking-[0.3em] text-parchemin/80 transition-transform active:scale-95"
              >
                Concentrer
              </button>
            </div>
            <p className="annotation mt-6 text-sm">
              {charge < 35
                ? "Une vapeur pâle sort de la baguette. Ce n'est pas encore cela."
                : charge < 75
                  ? "La lumière prend de la densité. Le froid recule d'un pas."
                  : "Quelque chose se forme. Ne lâchez pas."}
            </p>
          </Cadre>
        </Reveler>
      ) : null}

      {etape === "forme" ? (
        <Reveler>
          <Cadre className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-or/30 bg-[oklch(0.85_0.08_220/12%)] text-or">
              <IconeEtoile className="h-6 w-6" />
            </div>
            <p className="font-display text-[0.55rem] uppercase tracking-[0.45em] text-or/70">
              Forme corporelle
            </p>
            <h2 className="titre-monument mt-3 text-4xl">{forme.nom}</h2>
            <SeparateurOrne className="my-6" />
            <p className="annotation text-base leading-relaxed">{forme.texte}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <Link
                to="/sorcier"
                className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-or hover:text-parchemin"
              >
                Mon registre
              </Link>
              <Link
                to="/duels"
                className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-parchemin/55 hover:text-or"
              >
                Club de duel
              </Link>
            </div>
          </Cadre>
        </Reveler>
      ) : null}
    </Salle>
  );
}
