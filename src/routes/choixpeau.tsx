import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { maisons } from "@/lib/choixpeau";
import { scenesCeremonie, verdict, type OptionScene } from "@/lib/ceremonie";
import { useJoueur } from "@/lib/joueur-context";
import { statsInitiales, statsMeta, type Stat } from "@/lib/joueur";
import { Salle, Cadre, SeparateurOrne, Jauge } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { HouseBadge } from "@/components/jeu/HouseBadge";
import { IconeChoixpeau, IconeChandelle, Ornement } from "@/components/immersif/Icones";

export const Route = createFileRoute("/choixpeau")({
  head: () => ({
    meta: [
      { title: "La Cérémonie de Répartition — Le Choixpeau vous écoute" },
      {
        name: "description",
        content:
          "Une cérémonie en huit scènes : le quai, le train, le lac noir, le miroir. Vos gestes parlent pour vous et le Choixpeau tranche.",
      },
      { property: "og:title", content: "La Cérémonie de Répartition" },
      {
        property: "og:description",
        content: "Vivez la répartition comme une soirée à Poudlard, pas comme un questionnaire.",
      },
    ],
  }),
  component: Ceremonie,
});

const murmures = [
  "Hmm…",
  "Difficile. Très difficile.",
  "Du talent, oui… et une soif de te prouver quelque chose…",
  "Alors ce sera…",
];

function Ceremonie() {
  const { joueur, creerSorcier, definirMaison } = useJoueur();
  const [nom, setNom] = useState("");
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<OptionScene[]>([]);
  const [echo, setEcho] = useState<OptionScene | null>(null);
  const [murmure, setMurmure] = useState(-1);
  const scelle = useRef(false);

  const scene = scenesCeremonie[index];
  const termine = index >= scenesCeremonie.length;
  const v = termine ? verdict(choix) : null;
  const revele = murmure >= murmures.length;
  const maison = v ? maisons[v.maison] : null;

  useEffect(() => {
    if (!termine || murmure < 0 || revele) return;
    const t = setTimeout(() => setMurmure((m) => m + 1), 1500);
    return () => clearTimeout(t);
  }, [termine, murmure, revele]);

  useEffect(() => {
    if (revele && v && !scelle.current) {
      scelle.current = true;
      definirMaison(v.maison, v.obscur);
    }
  }, [revele, v, definirMaison]);

  function choisir(o: OptionScene) {
    setEcho(o);
    setTimeout(() => {
      setEcho(null);
      const suivant = index + 1;
      setChoix((c) => [...c, o]);
      setIndex(suivant);
      if (suivant >= scenesCeremonie.length) setMurmure(0);
    }, 1700);
  }

  function recommencer() {
    setChoix([]);
    setIndex(0);
    setMurmure(-1);
    setEcho(null);
    scelle.current = false;
  }

  const progression = Math.round((index / scenesCeremonie.length) * 100);
  const stats = Object.keys(statsMeta) as Stat[];

  /* ------------------------------------------------------- pas de sorcier */
  if (!joueur) {
    return (
      <Salle>
        <Reveler>
          <Cadre ton="parchemin" className="mx-auto max-w-xl text-center">
            <p className="font-display text-[0.55rem] uppercase tracking-[0.45em] text-[oklch(0.4_0.08_60)]">
              Registre des élèves
            </p>
            <h1 className="mt-4 font-titre text-3xl text-[oklch(0.2_0.04_40)]">
              « Votre nom, je vous prie. »
            </h1>
            <p className="mt-4 text-[oklch(0.3_0.03_50)]">
              La plume attend au-dessus du parchemin. Rien ne vous oblige à signer : on peut visiter
              le château sans être élève.
            </p>
            <form
              className="mt-8 flex flex-col items-center gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                creerSorcier(nom);
              }}
            >
              <input
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                placeholder="Écrire à la plume…"
                className="w-full max-w-xs border-b border-[oklch(0.45_0.08_60)] bg-transparent pb-2 text-center font-titre text-xl text-[oklch(0.2_0.04_40)] outline-none placeholder:text-[oklch(0.5_0.03_60)]"
              />
              <button
                type="submit"
                className="font-display text-[0.62rem] uppercase tracking-[0.35em] text-[oklch(0.25_0.05_40)] underline decoration-[oklch(0.55_0.1_70)] underline-offset-8"
              >
                Signer le registre
              </button>
            </form>
            <SeparateurOrne className="my-6" />
            <Link
              to="/chateau"
              className="font-display text-[0.58rem] uppercase tracking-[0.3em] text-[oklch(0.35_0.03_50)]"
            >
              Visiter sans signer
            </Link>
          </Cadre>
        </Reveler>
      </Salle>
    );
  }

  /* ------------------------------------------------------------- l'écho */
  if (echo) {
    return (
      <Salle>
        <div className="flex min-h-[46vh] flex-col items-center justify-center text-center">
          <Reveler>
            <p className="annotation max-w-xl text-lg leading-relaxed">« {echo.geste} »</p>
            <SeparateurOrne className="my-8 mx-auto max-w-[12rem]" />
            <p className="titre-monument max-w-2xl text-2xl sm:text-3xl">{echo.murmure}</p>
          </Reveler>
        </div>
      </Salle>
    );
  }

  /* ------------------------------------------------------------ la scène */
  if (!termine && scene) {
    return (
      <Salle large>
        <Reveler>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-display text-[0.55rem] uppercase tracking-[0.45em] text-or/70">
                {scene.lieu}
              </p>
              <p className="annotation mt-2 max-w-[46ch] text-base">{scene.tableau}</p>
            </div>
            <div className="flex items-center gap-3 text-or/60">
              <IconeChandelle className="chandelle h-5 w-5" />
              <span className="font-display text-[0.55rem] uppercase tracking-[0.3em]">
                Scène {index + 1} / {scenesCeremonie.length}
              </span>
            </div>
          </div>
          <Jauge valeur={progression} className="mb-10" />

          <h1 className="titre-monument max-w-[26ch] text-3xl sm:text-4xl">{scene.situation}</h1>
          <SeparateurOrne className="my-8 max-w-sm" />

          <div className="grid gap-3">
            {scene.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => choisir(o)}
                className="group flex items-center gap-4 rounded-[2px] border-l border-or/20 bg-black/25 px-5 py-4 text-left transition-all duration-500 hover:border-or/70 hover:bg-black/40"
              >
                <Ornement className="h-2 w-2 shrink-0 text-or/35 transition-colors group-hover:text-or" />
                <span className="text-base text-parchemin/70 transition-colors group-hover:text-parchemin">
                  {o.geste}
                </span>
              </button>
            ))}
          </div>
          <p className="annotation mt-8 text-sm text-parchemin/40">
            Le Choixpeau ne compte pas de points. Il écoute.
          </p>
        </Reveler>
      </Salle>
    );
  }

  /* --------------------------------------------------------- le verdict */
  return (
    <Salle large>
      {!revele ? (
        <div className="flex min-h-[52vh] flex-col items-center justify-center text-center">
          <IconeChoixpeau className="h-14 w-14 text-or/60" />
          <p className="titre-monument mt-10 text-3xl sm:text-4xl">
            {murmures[Math.max(0, murmure)]}
          </p>
        </div>
      ) : v && maison ? (
        <Reveler>
          <div className="text-center">
            <p className="font-display text-[0.55rem] uppercase tracking-[0.5em] text-or/70">
              Le Choixpeau a tranché
            </p>
            <h1
              className="titre-monument mt-4 text-5xl sm:text-7xl"
              style={{ color: maison.couleur }}
            >
              {maison.nom.toUpperCase()} !
            </h1>
            <p className="annotation mt-4 text-lg">{maison.devise}</p>
            <div className="mt-8 flex justify-center">
              <HouseBadge maison={v.maison} />
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
            <Cadre>
              <h2 className="font-titre text-xl text-parchemin">Ce que le chapeau a vu</h2>
              <SeparateurOrne className="my-4 max-w-[10rem]" />
              <ul className="space-y-3">
                {maison.traits.map((t) => (
                  <li key={t} className="flex items-start gap-3 text-parchemin/70">
                    <Ornement className="mt-2 h-2 w-2 shrink-0 text-or/50" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              {v.hesitation ? (
                <p className="annotation mt-5 text-sm">
                  « J'ai hésité, vous savez. {maisons[v.hesitation].nom} vous aurait très bien
                  convenu. »
                </p>
              ) : null}
              {v.obscur >= 7 ? (
                <p className="annotation mt-3 text-sm text-[oklch(0.6_0.12_20)]">
                  « Et il y a autre chose, en vous. Nous en reparlerons. »
                </p>
              ) : null}
            </Cadre>

            <Cadre>
              <h2 className="font-titre text-xl text-parchemin">Aptitudes de départ</h2>
              <SeparateurOrne className="my-4 max-w-[10rem]" />
              <div className="space-y-3">
                {stats.map((s) => (
                  <div key={s}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-parchemin/70">{statsMeta[s].nom}</span>
                      <span className="tabular-nums text-or/80">
                        {statsInitiales[v.maison][s]}
                      </span>
                    </div>
                    <Jauge valeur={statsInitiales[v.maison][s] * 10} />
                  </div>
                ))}
              </div>
            </Cadre>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            <Link
              to="/baguette"
              className="font-display text-[0.62rem] uppercase tracking-[0.32em] text-or hover:text-parchemin"
            >
              Aller chez Ollivander
            </Link>
            <Link
              to="/chateau"
              className="font-display text-[0.62rem] uppercase tracking-[0.32em] text-parchemin/55 hover:text-or"
            >
              Entrer au château
            </Link>
            <button
              type="button"
              onClick={recommencer}
              className="font-display text-[0.62rem] uppercase tracking-[0.32em] text-parchemin/40 hover:text-or"
            >
              Revivre la cérémonie
            </button>
          </div>
        </Reveler>
      ) : null}
    </Salle>
  );
}
