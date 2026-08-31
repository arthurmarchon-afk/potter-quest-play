import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";

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

const icones: Record<Type, string> = { vif: "🥇", souafle: "🔴", cognard: "⚫" };

function pos() {
  return { x: 6 + Math.random() * 84, y: 8 + Math.random() * 76 };
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

  const demarrer = useCallback(
    (n: Niveau) => {
      setNiveau(n);
      setScore(0);
      setVifs(0);
      setReste(niveaux[n].duree);
      setFini(false);
      setEnCours(true);
      compte.current = false;
    },
    [],
  );

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
      `🧹 Quidditch — ${score} points, ${vifs} Vif(s) d'or`,
    );
  }, [fini, joueur, score, vifs, cfg.mult, gagner, signalerPartie]);

  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
        <Link to="/jeux" className="text-sm text-or hover:underline">
          ← Salle des mini-jeux
        </Link>
        <h1 className="mt-4 titre-cinema text-2xl text-parchemin sm:text-4xl">
          Quidditch — Attrapez le Vif d'or
        </h1>
        <p className="mt-2 text-sm text-parchemin/60">
          {cfg.texte} Souafle 🔴 +10, Vif d'or 🥇 +150, Cognard ⚫ −20.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(niveaux) as Niveau[]).map((n) => (
            <button
              key={n}
              onClick={() => demarrer(n)}
              className={`rounded-[10px] px-3 py-2 text-sm font-medium ring-1 transition-colors ${
                n === niveau
                  ? "bg-primary/15 text-primary ring-primary/40"
                  : "text-parchemin/60 ring-border hover:text-foreground"
              }`}
            >
              {niveaux[n].label}
            </button>
          ))}
        </div>

        <div className="panel mt-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-or">Score {score}</span>
            <span className="text-parchemin/60">🥇 {vifs}</span>
            <span className="text-parchemin/60">⏳ {reste}s</span>
          </div>

          <div className="relative mt-4 h-[340px] w-full overflow-hidden rounded-[14px] bg-primary/5 ring-1 ring-border">
            {!enCours && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                {fini ? (
                  <>
                    <p className="font-display text-xl">
                      {vifs > 0 ? "Vif d'or attrapé — match remporté !" : "Match terminé."}
                    </p>
                    <p className="text-sm text-parchemin/60">
                      {score} points, {vifs} Vif(s) d'or
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-parchemin/60">
                    Enfourchez votre balai et choisissez un niveau pour décoller.
                  </p>
                )}
                <button
                  onClick={() => demarrer(niveau)}
                  className="bouton-magique px-5 py-2.5 text-[0.6rem]"
                >
                  {fini ? "Rejouer" : "Décoller"}
                </button>
              </div>
            )}
            {cibles.map((c) => (
              <button
                key={c.id}
                onClick={() => toucher(c)}
                aria-label={c.type}
                className="absolute text-3xl transition-transform hover:scale-110"
                style={{ left: `${c.x}%`, top: `${c.y}%` }}
              >
                {icones[c.type]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
