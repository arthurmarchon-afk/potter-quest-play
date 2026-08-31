import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { classement, classementMaisons, recompenseRang, saisonCourante } from "@/lib/saison";
import { emblemes } from "@/lib/joueur";
import { Salle, EnTetePage, Jauge, Sceau } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { Blason, IconeMedaille, IconeSablier } from "@/components/immersif/Icones";

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
    <Salle large>
      <EnTetePage
        surtitre={`Saison ${saison.numero}`}
        titre={saison.nom}
        icone={<IconeMedaille />}
        intro={`La saison se clôt dans ${saison.joursRestants} jour(s). Le palmarès est figé à la fin du trimestre : XP totale pour les élèves, points de maison pour la Coupe.`}
      />

      <div className="plaque mb-8 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-parchemin/60">
            Progression de la saison
          </span>
          <span className="chiffre">{saison.progression}%</span>
        </div>
        <Jauge valeur={saison.progression} className="mt-3" />
      </div>

      {!joueur && (
        <div className="plaque mb-8 p-4 text-sm">
          Créez votre sorcier sur la page{" "}
          <Link to="/sorcier" className="text-or hover:underline">
            Mon Sorcier
          </Link>{" "}
          pour entrer au classement.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Reveler>
          <div className="plaque p-6">
            <h2 className="titre-monument text-lg">Tableau d'honneur</h2>
            <ul className="mt-5 space-y-1">
              {eleves.map((e, i) => (
                <li
                  key={e.id}
                  className={`flex items-center justify-between gap-3 rounded-[3px] px-3 py-2.5 text-sm ${
                    e.joueur ? "bg-or/10 ring-1 ring-or/40" : "border-b border-border/60"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className="chiffre w-7">{i + 1}</span>
                    <Blason maison={e.maison} className="h-5 w-5" />
                    <span className={e.joueur ? "font-medium text-foreground" : "text-parchemin/70"}>
                      {e.nom}
                    </span>
                  </span>
                  <span className="text-parchemin/50">
                    Niv. {e.niveau} · {e.xp} XP
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveler>

        <div className="space-y-6">
          <Reveler>
            <div className="plaque p-6">
              <h2 className="titre-monument text-lg">Sabliers des maisons</h2>
              <p className="annotation mt-1 text-sm">
                Les colonnes de verre se remplissent de pierres à mesure que la maison marque des
                points.
              </p>
              <div className="mt-6 flex items-end justify-around gap-3">
                {maisons.map((m) => {
                  const max = maisons[0]?.points || 1;
                  const pct = Math.max(4, Math.round((m.points / max) * 100));
                  return (
                    <div key={m.maison} className="flex flex-col items-center gap-2">
                      <div className="relative h-32 w-8 overflow-hidden rounded-b-[3px] rounded-t-[8px] border border-or/25 bg-black/30">
                        <div
                          className="absolute bottom-0 left-0 right-0 transition-[height] duration-700"
                          style={{
                            height: `${pct}%`,
                            background: `linear-gradient(to top, color-mix(in oklab, var(--${m.maison}) 85%, transparent), color-mix(in oklab, var(--${m.maison}) 45%, transparent))`,
                            boxShadow: `inset 0 0 10px color-mix(in oklab, var(--${m.maison}) 70%, black)`,
                          }}
                        />
                        <span
                          aria-hidden
                          className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-white/25 to-transparent"
                        />
                      </div>
                      <span className={`text-lg ${m.vous ? "" : "opacity-70"}`}>{m.embleme}</span>
                      <span className="chiffre text-xs">{m.points}</span>
                    </div>
                  );
                })}
              </div>
              <Link to="/coupe" className="mt-6 inline-block font-display text-[0.6rem] uppercase tracking-[0.3em] text-or hover:underline">
                Voir la Coupe des Maisons
              </Link>
            </div>
          </Reveler>

          {joueur && (
            <Reveler>
              <div className="plaque p-6">
                <h2 className="titre-monument text-lg">Votre fin de saison</h2>
                <p className="mt-2 text-sm text-parchemin/60">
                  Rang actuel : <span className="chiffre">#{rang}</span> sur {eleves.length}.
                </p>
                <p className="mt-2 text-sm">
                  Récompense estimée — <span className="text-or">{recompense.titre}</span> :{" "}
                  {recompense.xp} XP et {recompense.gallions} Gallions.
                </p>
                <p className="annotation mt-2 text-sm">
                  Gagnez de l'expérience dans les mini-jeux, les duels et l'exploration pour grimper
                  avant la clôture.
                </p>
              </div>
            </Reveler>
          )}
        </div>
      </div>
    </Salle>
  );
}
