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
  const compte = useRef(false);

  const ecrire = useCallback((l: string) => setJournal((j) => [l, ...j].slice(0, 12)), []);

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
      setJournal([`⚔️ Le duel contre ${a.nom} commence !`]);
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
      setPv((p) => {
        const reste = Math.max(0, p - subis);
        if (reste === 0) setEtat("defaite");
        return reste;
      });
      ecrire(
        absorbe > 0
          ? `${texte} — 🛡️ ${absorbe} absorbés, ${subis} dégâts subis.`
          : `${texte} — ${subis} dégâts subis.`,
      );
      setBouclier(0);
      setTour((t) => t + 1);
      setEnergie((e) => Math.min(energieMax, e + 12));
      setAttente(false);
    },
    [adv, ecrire, energieMax],
  );

  const lancerSort = useCallback(
    (s: SortDuel) => {
      if (!joueur || !adv || etat !== "combat" || attente) return;
      if (energie < s.cout) {
        ecrire("💤 Pas assez d'énergie magique — reprenez votre souffle.");
        return;
      }
      setAttente(true);
      setEnergie((e) => e - s.cout);

      let bouclierActif = 0;
      if (s.bouclier) {
        bouclierActif = s.bouclier + (joueur.stats?.sagesse ?? 0);
        setBouclier(bouclierActif);
        ecrire(`${s.icone} ${s.nom} — bouclier de ${bouclierActif} points dressé.`);
      } else if (s.soin) {
        const soin = soinSort(joueur, s);
        setPv((p) => Math.min(pvMax, p + soin));
        ecrire(`${s.icone} ${s.nom} — ${soin} PV regagnés.`);
      } else if (!reussite(joueur, s)) {
        ecrire(`${s.icone} ${s.nom} — le sort se disperse dans le vide !`);
      } else {
        const d = degatsSort(joueur, s);
        setPvAdv((p) => {
          const reste = Math.max(0, p - d);
          if (reste === 0) setEtat("victoire");
          return reste;
        });
        ecrire(`${s.icone} ${s.nom} — ${d} dégâts infligés à ${adv.nom}.`);
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
    [joueur, adv, etat, attente, energie, ecrire, pvMax, riposte],
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
      gagne ? `⚔️ Duel remporté contre ${adv.nom}` : `🩹 Défaite honorable face à ${adv.nom}`,
    );
  }, [etat, adv, joueur, pv, pvMax, gagner, signalerPartie]);

  const barre = (valeur: number, max: number, couleur: string) => (
    <div className="h-2 w-full overflow-hidden rounded-full bg-border">
      <div
        className={`h-full transition-all ${couleur}`}
        style={{ width: `${Math.max(0, Math.round((valeur / Math.max(1, max)) * 100))}%` }}
      />
    </div>
  );

  return (
    <section>
      <div className="mx-auto max-w-4xl px-6 py-12 lg:py-20">
        <p className="text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Club de duel
        </p>
        <h1 className="mt-3 font-display text-2xl font-semibold sm:text-3xl">
          Baguettes levées, saluez votre adversaire
        </h1>
        <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
          Chaque sortilège coûte de l'énergie magique. Vos statistiques amplifient les dégâts, la
          précision et les soins.
        </p>

        {!joueur && (
          <p className="panel mt-6 p-4 text-sm">
            Créez d'abord votre sorcier sur la page{" "}
            <Link to="/sorcier" className="text-brass-2 hover:underline">
              Mon Sorcier
            </Link>
            .
          </p>
        )}

        {joueur && etat === "choix" && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {adversaires.map((a) => {
              const verrouille = joueur.niveau < a.niveau;
              return (
                <div key={a.id} className="panel p-5">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-display text-lg">
                      {a.icone} {a.nom}
                    </span>
                    <span className="text-sm text-muted-foreground">Niv. {a.niveau}+</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{a.description}</p>
                  <p className="mt-2 text-sm text-brass-2">
                    ❤️ {a.pv} PV · ✨ {a.recompense.xp} XP · 🪙 {a.recompense.gallions} ·
                    🏆 {a.recompense.points}
                  </p>
                  <button
                    onClick={() => lancerDuel(a)}
                    disabled={verrouille}
                    className="mt-4 w-full rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-40"
                  >
                    {verrouille ? `🔒 Niveau ${a.niveau} requis` : "Défier"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {joueur && adv && etat !== "choix" && (
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
            <div className="panel p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="font-display">🧙 {joueur.nom}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ❤️ {pv}/{pvMax}
                  </p>
                  {barre(pv, pvMax, "bg-emeraude")}
                  <p className="mt-2 text-sm text-muted-foreground">
                    ✨ Énergie {energie}/{energieMax}
                  </p>
                  {barre(energie, energieMax, "bg-primary")}
                  {bouclier > 0 && (
                    <p className="mt-2 text-sm text-brass-2">🛡️ Bouclier {bouclier}</p>
                  )}
                </div>
                <div>
                  <p className="font-display">
                    {adv.icone} {adv.nom}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    ❤️ {pvAdv}/{adv.pv}
                  </p>
                  {barre(pvAdv, adv.pv, "bg-destructive")}
                  <p className="mt-2 text-sm text-muted-foreground">Tour {tour}</p>
                </div>
              </div>

              {etat === "combat" ? (
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  {sortsDuel.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => lancerSort(s)}
                      disabled={attente || energie < s.cout}
                      className="rounded-[12px] px-4 py-3 text-left text-sm ring-1 ring-border transition-all hover:-translate-y-0.5 hover:text-foreground disabled:opacity-40"
                    >
                      <span className="font-medium">
                        {s.icone} {s.nom}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        {s.description} — coût {s.cout}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="mt-5 text-center">
                  <p className="font-display text-xl">
                    {etat === "victoire"
                      ? `Victoire ! ${adv.nom} s'incline.`
                      : `Vous êtes désarmé… ${adv.nom} l'emporte.`}
                  </p>
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => lancerDuel(adv)}
                      className="rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                    >
                      Revanche
                    </button>
                    <button
                      onClick={() => setEtat("choix")}
                      className="rounded-[10px] px-4 py-2 text-sm ring-1 ring-border"
                    >
                      Choisir un autre adversaire
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="panel p-5">
              <p className="text-xs uppercase tracking-[0.3em] text-brass-2">Registre du duel</p>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {journal.map((l, i) => (
                  <li key={`${l}-${i}`} className={i === 0 ? "text-foreground" : undefined}>
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
