import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import {
  adversaires,
  attaqueAdversaire,
  degatsSort,
  energieJoueur,
  pvJoueur,
  reussite,
  soinSort,
  sortsDuel,
  type Adversaire,
  type SortDuel,
} from "@/lib/duel";
import { Salle, EnTetePage, Jauge } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeEpees, IconeCrane } from "@/components/immersif/Icones";

export const Route = createFileRoute("/duels")({
  head: () => ({
    meta: [
      { title: "Club de Duel — Affrontements de sorciers" },
      {
        name: "description",
        content:
          "Défiez épouvantards, mangemorts et détraqueurs au tour par tour : sortilèges, boucliers et énergie magique.",
      },
      { property: "og:title", content: "Club de Duel de Poudlard" },
      {
        property: "og:description",
        content: "Duels au tour par tour contre cinq adversaires, du plus faible au plus terrible.",
      },
    ],
  }),
  component: Duels,
});

type Etat = "choix" | "combat" | "victoire" | "defaite";

function Duels() {
  const { joueur, gagner, signalerPartie } = useJoueur();
  const [etat, setEtat] = useState<Etat>("choix");
  const [adv, setAdv] = useState<Adversaire | null>(null);
  const [pv, setPv] = useState(0);
  const [pvMax, setPvMax] = useState(0);
  const [pvAdv, setPvAdv] = useState(0);
  const [energie, setEnergie] = useState(0);
  const [energieMax, setEnergieMax] = useState(0);
  const [bouclier, setBouclier] = useState(0);
  const [tour, setTour] = useState(1);
  const [journal, setJournal] = useState<string[]>([]);
  const [attente, setAttente] = useState(false);
  const [eclair, setEclair] = useState<"joueur" | "adv" | null>(null);
  const compte = useRef(false);

  const ecrire = useCallback((l: string) => setJournal((j) => [l, ...j].slice(0, 12)), []);

  const declencherEclair = useCallback((cible: "joueur" | "adv") => {
    setEclair(cible);
    setTimeout(() => setEclair(null), 550);
  }, []);

  const lancerDuel = useCallback(
    (a: Adversaire) => {
      if (!joueur) return;
      const max = pvJoueur(joueur);
      const en = energieJoueur(joueur);
      setAdv(a);
      setPvMax(max);
      setPv(max);
      setEnergieMax(en);
      setEnergie(en);
      setPvAdv(a.pv);
      setBouclier(0);
      setTour(1);
      setJournal([`Le duel contre ${a.nom} commence.`]);
      setEtat("combat");
      setAttente(false);
      compte.current = false;
    },
    [joueur],
  );

  const riposte = useCallback(
    (bouclierActif: number) => {
      if (!adv) return;
      const { degats, texte } = attaqueAdversaire(adv);
      const absorbe = Math.min(bouclierActif, degats);
      const subis = degats - absorbe;
      declencherEclair("joueur");
      setPv((p) => {
        const reste = Math.max(0, p - subis);
        if (reste === 0) setEtat("defaite");
        return reste;
      });
      ecrire(
        absorbe > 0
          ? `${texte} — ${absorbe} absorbés par le bouclier, ${subis} dégâts subis.`
          : `${texte} — ${subis} dégâts subis.`,
      );
      setBouclier(0);
      setTour((t) => t + 1);
      setEnergie((e) => Math.min(energieMax, e + 12));
      setAttente(false);
    },
    [adv, ecrire, energieMax, declencherEclair],
  );

  const lancerSort = useCallback(
    (s: SortDuel) => {
      if (!joueur || !adv || etat !== "combat" || attente) return;
      if (energie < s.cout) {
        ecrire("Pas assez d'énergie magique — reprenez votre souffle.");
        return;
      }
      setAttente(true);
      setEnergie((e) => e - s.cout);

      let bouclierActif = 0;
      if (s.bouclier) {
        bouclierActif = s.bouclier + (joueur.stats?.sagesse ?? 0);
        setBouclier(bouclierActif);
        ecrire(`${s.nom} — bouclier de ${bouclierActif} points dressé.`);
      } else if (s.soin) {
        const soin = soinSort(joueur, s);
        setPv((p) => Math.min(pvMax, p + soin));
        ecrire(`${s.nom} — ${soin} PV regagnés.`);
      } else if (!reussite(joueur, s)) {
        ecrire(`${s.nom} — le sort se disperse dans le vide.`);
      } else {
        const d = degatsSort(joueur, s);
        declencherEclair("adv");
        setPvAdv((p) => {
          const reste = Math.max(0, p - d);
          if (reste === 0) setEtat("victoire");
          return reste;
        });
        ecrire(`${s.nom} — ${d} dégâts infligés à ${adv.nom}.`);
      }

      setTimeout(() => {
        setPvAdv((p) => {
          if (p <= 0) {
            setAttente(false);
            return p;
          }
          riposte(bouclierActif);
          return p;
        });
      }, 750);
    },
    [joueur, adv, etat, attente, energie, ecrire, pvMax, riposte, declencherEclair],
  );

  useEffect(() => {
    if (!adv || compte.current || !joueur) return;
    if (etat !== "victoire" && etat !== "defaite") return;
    compte.current = true;
    const gagne = etat === "victoire";
    signalerPartie({ victoire: gagne, bonnes: 0, parfait: gagne && pv === pvMax });
    gagner(
      gagne
        ? {
            xp: adv.recompense.xp,
            gallions: adv.recompense.gallions,
            points: adv.recompense.points,
            stat: { cle: "courage", valeur: 1 },
          }
        : { xp: Math.round(adv.recompense.xp * 0.2), gallions: 5 },
      gagne ? `Duel remporté contre ${adv.nom}` : `Défaite honorable face à ${adv.nom}`,
    );
  }, [etat, adv, joueur, pv, pvMax, gagner, signalerPartie]);

  return (
    <Salle>
      <EnTetePage
        surtitre="Club de duel"
        titre="Baguettes levées"
        icone={<IconeEpees />}
        intro="Chaque sortilège coûte de l'énergie magique. Vos statistiques amplifient les dégâts, la précision et les soins."
      />

      {!joueur && (
        <div className="plaque p-5 text-sm">
          Créez d'abord votre sorcier sur la page{" "}
          <Link to="/sorcier" className="text-or hover:underline">
            Mon Sorcier
          </Link>
          .
        </div>
      )}

      {joueur && etat === "choix" && (
        <div className="grid gap-5 sm:grid-cols-2">
          {adversaires.map((a, i) => {
            const verrouille = joueur.niveau < a.niveau;
            return (
              <Reveler key={a.id} delai={i * 70}>
                <div className="plaque relative overflow-hidden p-5">
                  {/* portrait sombre */}
                  <div className="mb-4 flex h-28 items-center justify-center rounded-[3px] bg-gradient-to-b from-black/60 to-black/20">
                    <span className="grid h-16 w-16 place-items-center rounded-full border border-or/25 bg-black/50 text-or [&>svg]:h-7 [&>svg]:w-7">
                      <IconeCrane />
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg text-parchemin">{a.nom}</span>
                    <span className="font-display text-[0.6rem] uppercase tracking-[0.25em] text-or/70">
                      Niv. {a.niveau}+
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-parchemin/60">{a.description}</p>
                  <p className="chiffre mt-3 text-sm">
                    {a.pv} PV · {a.recompense.xp} XP · {a.recompense.gallions} Gallions ·{" "}
                    {a.recompense.points} points
                  </p>
                  <button
                    onClick={() => lancerDuel(a)}
                    disabled={verrouille}
                    className="bouton-magique mt-4 w-full justify-center px-5 py-2.5 text-[0.6rem] disabled:opacity-40"
                  >
                    {verrouille ? `Niveau ${a.niveau} requis` : "Défier"}
                  </button>
                </div>
              </Reveler>
            );
          })}
        </div>
      )}

      {joueur && adv && etat !== "choix" && (
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="plaque relative overflow-hidden p-6">
            {eclair && (
              <span
                aria-hidden
                className={`scintille pointer-events-none absolute h-24 w-24 rounded-full bg-[oklch(0.85_0.1_85/60%)] blur-2xl ${
                  eclair === "joueur" ? "left-6 top-6" : "right-6 top-6"
                }`}
              />
            )}
            {/* pupitres face à face */}
            <div className="relative grid gap-8 sm:grid-cols-2">
              <div className="border-b-2 border-bronze/40 pb-4 text-center sm:border-b-0 sm:border-r-2 sm:pr-6">
                <p className="font-display text-sm uppercase tracking-[0.25em] text-parchemin">
                  {joueur.nom}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-parchemin/50">
                  Points de vie · {pv}/{pvMax}
                </p>
                <Jauge valeur={(pv / Math.max(1, pvMax)) * 100} className="mt-1.5" />
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-parchemin/50">
                  Énergie · {energie}/{energieMax}
                </p>
                <Jauge valeur={(energie / Math.max(1, energieMax)) * 100} className="mt-1.5" />
                {bouclier > 0 && (
                  <p className="mt-2 font-display text-[0.6rem] uppercase tracking-[0.25em] text-or">
                    Bouclier {bouclier}
                  </p>
                )}
              </div>
              <div className="pt-4 text-center sm:pl-6 sm:pt-0">
                <p className="font-display text-sm uppercase tracking-[0.25em] text-parchemin">
                  {adv.nom}
                </p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-parchemin/50">
                  Points de vie · {pvAdv}/{adv.pv}
                </p>
                <Jauge valeur={(pvAdv / Math.max(1, adv.pv)) * 100} className="mt-1.5" />
                <p className="mt-6 chiffre text-sm">Tour {tour}</p>
              </div>
            </div>

            {etat === "combat" ? (
              <div className="relative mt-6 grid gap-3 sm:grid-cols-2">
                {sortsDuel.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => lancerSort(s)}
                    disabled={attente || energie < s.cout}
                    className="filet-or rounded-[3px] bg-black/30 px-4 py-3 text-left text-sm transition-transform hover:-translate-y-0.5 hover:bg-black/40 disabled:opacity-40"
                  >
                    <span className="font-display text-sm text-parchemin">{s.nom}</span>
                    <span className="mt-1 block text-xs text-parchemin/55">
                      {s.description} — coût {s.cout}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative mt-6 text-center">
                <p className="titre-monument text-xl">
                  {etat === "victoire"
                    ? `Victoire ! ${adv.nom} s'incline.`
                    : `Vous êtes désarmé… ${adv.nom} l'emporte.`}
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <button onClick={() => lancerDuel(adv)} className="bouton-magique px-5 py-2.5 text-[0.6rem]">
                    Revanche
                  </button>
                  <button
                    onClick={() => setEtat("choix")}
                    className="rounded-[3px] px-4 py-2 text-sm ring-1 ring-border"
                  >
                    Choisir un autre adversaire
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="plaque p-5">
            <p className="font-display text-xs uppercase tracking-[0.3em] text-or">Registre du duel</p>
            <ul className="mt-3 space-y-2 text-sm text-parchemin/60">
              {journal.map((l, i) => (
                <li key={`${l}-${i}`} className={i === 0 ? "text-foreground" : undefined}>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Salle>
  );
}
