import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, Cadre, ChoixGrave } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeBalai, IconeVif, IconeGallion } from "@/components/immersif/Icones";

export const Route = createFileRoute("/jeux/quidditch")({
  head: () => ({
    meta: [
      { title: "Quidditch — Attrapez le Vif d'or" },
      {
        name: "description",
        content:
          "Sur votre balai, attrapez le Vif d'or et évitez les Cognards dans ce mini-jeu de réflexes à trois difficultés.",
      },
      { property: "og:title", content: "Quidditch — Attrapez le Vif d'or" },
      {
        property: "og:description",
        content: "Réflexes d'attrapeur : Vif d'or, Souafles et Cognards.",
      },
    ],
  }),
  component: Quidditch,
});

type Niveau = "apprenti" | "sorcier" | "mage";

const niveaux: Record<
  Niveau,
  { label: string; duree: number; vitesse: number; cognards: number; texte: string; mult: number }
> = {
  apprenti: {
    label: "Apprenti",
    duree: 45,
    vitesse: 1100,
    cognards: 1,
    texte: "45 secondes, cibles lentes, un seul Cognard.",
    mult: 1,
  },
  sorcier: {
    label: "Sorcier",
    duree: 40,
    vitesse: 800,
    cognards: 2,
    texte: "40 secondes, deux Cognards en vol.",
    mult: 2,
  },
  mage: {
    label: "Mage",
    duree: 35,
    vitesse: 550,
    cognards: 3,
    texte: "35 secondes, trois Cognards et un Vif insaisissable.",
    mult: 3,
  },
};

type Type = "vif" | "souafle" | "cognard";
type Cible = { id: number; type: Type; x: number; y: number };

function pos() {
  return { x: 6 + Math.random() * 84, y: 8 + Math.random() * 76 };
}

const optionsNiveau = (Object.keys(niveaux) as Niveau[]).map((n) => ({
  valeur: n,
  libelle: niveaux[n].label,
}));

function Cible({ c, onClick }: { c: Cible; onClick: () => void }) {
  if (c.type === "vif") {
    return (
      <button
        onClick={onClick}
        aria-label="Vif d'or"
        className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-or scintille transition-transform hover:scale-125"
        style={{ left: `${c.x}%`, top: `${c.y}%` }}
      >
        <span className="absolute inset-0 rounded-full bg-or/25 blur-md" aria-hidden />
        <IconeVif className="relative h-6 w-6" />
      </button>
    );
  }
  if (c.type === "cognard") {
    return (
      <button
        onClick={onClick}
        aria-label="Cognard"
        className="absolute h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-or/20 bg-[radial-gradient(circle_at_32%_28%,oklch(0.4_0.01_270),oklch(0.08_0.005_270)_70%)] shadow-[0_6px_14px_-4px_black] transition-transform hover:scale-110"
        style={{ left: `${c.x}%`, top: `${c.y}%` }}
      />
    );
  }
  return (
    <button
      onClick={onClick}
      aria-label="Souafle"
      className="absolute h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bronze/50 bg-[radial-gradient(circle_at_32%_28%,oklch(0.62_0.14_28),oklch(0.32_0.09_24)_75%)] shadow-[0_5px_12px_-4px_black] transition-transform hover:scale-110"
      style={{ left: `${c.x}%`, top: `${c.y}%` }}
    />
  );
}

function Quidditch() {
  const { joueur, gagner, signalerPartie } = useJoueur();
  const [niveau, setNiveau] = useState<Niveau>("sorcier");
  const [enCours, setEnCours] = useState(false);
  const [fini, setFini] = useState(false);
  const [reste, setReste] = useState(niveaux["sorcier"].duree);
  const [score, setScore] = useState(0);
  const [vifs, setVifs] = useState(0);
  const [cibles, setCibles] = useState<Cible[]>([]);
  const compte = useRef(false);
  const cfg = niveaux[niveau];

  const generer = useCallback(() => {
    const n = cfg.cognards;
    const liste: Cible[] = [];
    let id = 0;
    liste.push({ id: id++, type: "souafle", ...pos() });
    liste.push({ id: id++, type: "souafle", ...pos() });
    for (let i = 0; i < n; i++) liste.push({ id: id++, type: "cognard", ...pos() });
    if (Math.random() < 0.35) liste.push({ id: id++, type: "vif", ...pos() });
    setCibles(liste);
  }, [cfg.cognards]);

  const demarrer = useCallback((n: Niveau) => {
    setNiveau(n);
    setScore(0);
    setVifs(0);
    setReste(niveaux[n].duree);
    setFini(false);
    setEnCours(true);
    compte.current = false;
  }, []);

  useEffect(() => {
    if (!enCours) return;
    generer();
    const t = setInterval(generer, cfg.vitesse);
    return () => clearInterval(t);
  }, [enCours, generer, cfg.vitesse]);

  useEffect(() => {
    if (!enCours) return;
    if (reste <= 0) {
      setEnCours(false);
      setFini(true);
      setCibles([]);
      return;
    }
    const t = setTimeout(() => setReste((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [enCours, reste]);

  const toucher = useCallback(
    (c: Cible) => {
      if (!enCours) return;
      if (c.type === "vif") {
        setScore((s) => s + 150);
        setVifs((v) => v + 1);
      } else if (c.type === "souafle") {
        setScore((s) => s + 10);
      } else {
        setScore((s) => Math.max(0, s - 20));
      }
      setCibles((l) => l.filter((x) => x.id !== c.id));
    },
    [enCours],
  );

  useEffect(() => {
    if (!fini || compte.current || !joueur) return;
    compte.current = true;
    const victoire = vifs > 0;
    signalerPartie({ victoire, bonnes: 0, parfait: false });
    gagner(
      {
        xp: (20 + Math.round(score / 3)) * cfg.mult,
        gallions: (5 + Math.round(score / 8)) * cfg.mult,
        points: victoire ? 10 * cfg.mult : 0,
        ...(vifs >= 2 ? { stat: { cle: "agilite" as const, valeur: 1 } } : {}),
      },
      `Quidditch — ${score} points, ${vifs} Vif(s) d'or`,
    );
  }, [fini, joueur, score, vifs, cfg.mult, gagner, signalerPartie]);

  return (
    <Salle large>
      <Link to="/jeux" className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-or/70 hover:text-or">
        Salle des mini-jeux
      </Link>

      <EnTetePage
        surtitre="Stade sous les étoiles"
        titre="Quidditch — Attrapez le Vif d'or"
        intro={`${cfg.texte} Souafle : +10. Vif d'or : +150. Cognard : -20.`}
        icone={<IconeBalai />}
        aside={
          <ChoixGrave label="Rang" options={optionsNiveau} valeur={niveau} onChange={(v) => demarrer(v as Niveau)} />
        }
      />

      <Reveler>
        <Cadre className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="flex items-center gap-2">
              <IconeGallion className="h-4 w-4 text-or" />
              <span className="chiffre text-lg">Score {score}</span>
            </span>
            <span className="flex items-center gap-2 text-or">
              <IconeVif className="h-4 w-4" />
              <span className="chiffre text-base">{vifs}</span>
            </span>
            <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-parchemin/50">
              {reste}s
            </span>
          </div>

          <div className="relative mt-5 h-[380px] w-full overflow-hidden rounded-[3px] border border-or/20 bg-[radial-gradient(ellipse_at_50%_0%,color-mix(in_oklab,var(--pierre)_60%,transparent),var(--nuit)_75%)]">
            {/* ciel nocturne étoilé */}
            <div className="pointer-events-none absolute inset-0" aria-hidden>
              {Array.from({ length: 26 }).map((_, i) => (
                <span
                  key={i}
                  className="absolute h-[2px] w-[2px] rounded-full bg-parchemin/70 scintille"
                  style={{
                    left: `${(i * 37) % 100}%`,
                    top: `${(i * 53) % 90}%`,
                    animationDelay: `${(i % 7) * 0.6}s`,
                  }}
                />
              ))}
              <div className="grain absolute inset-0 opacity-30" />
            </div>

            {!enCours && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
                {fini ? (
                  <>
                    <IconeVif className={`h-9 w-9 ${vifs > 0 ? "text-or scintille" : "text-parchemin/50"}`} />
                    <p className="titre-monument text-2xl">
                      {vifs > 0 ? "Vif d'or attrapé — match remporté !" : "Match terminé."}
                    </p>
                    <p className="annotation text-base">
                      {score} points, {vifs} Vif(s) d'or
                    </p>
                  </>
                ) : (
                  <p className="annotation text-base">
                    Enfourchez votre balai et choisissez un rang pour décoller.
                  </p>
                )}
                <button onClick={() => demarrer(niveau)} className="bouton-magique">
                  {fini ? "Rejouer" : "Décoller"}
                </button>
              </div>
            )}
            {cibles.map((c) => (
              <Cible key={c.id} c={c} onClick={() => toucher(c)} />
            ))}
          </div>
        </Cadre>
      </Reveler>
    </Salle>
  );
}
