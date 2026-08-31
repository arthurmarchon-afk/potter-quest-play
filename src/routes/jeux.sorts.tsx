import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";

export const Route = createFileRoute("/jeux/sorts")({
  head: () => ({
    meta: [
      { title: "Maître des Sorts — Duel d'incantations rapides" },
      {
        name: "description",
        content:
          "Retrouvez le bon sortilège avant la fin du sablier : un jeu de réflexes magiques à trois niveaux de difficulté.",
      },
      { property: "og:title", content: "Maître des Sorts" },
      {
        property: "og:description",
        content: "Associez chaque effet magique à son incantation, le plus vite possible.",
      },
    ],
  }),
  component: MaitreDesSorts,
});

type Sort = { nom: string; effet: string };

const grimoire: Sort[] = [
  { nom: "Lumos", effet: "Allume le bout de la baguette." },
  { nom: "Alohomora", effet: "Déverrouille portes et serrures." },
  { nom: "Expelliarmus", effet: "Désarme l'adversaire." },
  { nom: "Wingardium Leviosa", effet: "Fait léviter un objet." },
  { nom: "Expecto Patronum", effet: "Invoque un gardien argenté." },
  { nom: "Accio", effet: "Attire un objet à soi." },
  { nom: "Riddikulus", effet: "Ridiculise un épouvantard." },
  { nom: "Protego", effet: "Dresse un bouclier magique." },
  { nom: "Stupéfix", effet: "Assomme la cible." },
  { nom: "Reparo", effet: "Répare un objet brisé." },
  { nom: "Incendio", effet: "Produit une flamme." },
  { nom: "Aguamenti", effet: "Fait jaillir de l'eau." },
  { nom: "Divertimenti", effet: "Détourne l'attention d'un objet." },
  { nom: "Oubliettes", effet: "Efface un souvenir." },
  { nom: "Sonorus", effet: "Amplifie la voix." },
  { nom: "Petrificus Totalus", effet: "Pétrifie entièrement la cible." },
];

type Niveau = "apprenti" | "sorcier" | "mage";

const niveaux: Record<
  Niveau,
  { label: string; temps: number; choix: number; manches: number; texte: string; mult: number }
> = {
  apprenti: {
    label: "Apprenti",
    temps: 9,
    choix: 3,
    manches: 8,
    texte: "3 propositions, 9 secondes par incantation.",
    mult: 1,
  },
  sorcier: {
    label: "Sorcier",
    temps: 6,
    choix: 4,
    manches: 10,
    texte: "4 propositions, 6 secondes de réflexion.",
    mult: 2,
  },
  mage: {
    label: "Mage",
    temps: 4,
    choix: 5,
    manches: 12,
    texte: "5 propositions, 4 secondes : réflexes d'archimage.",
    mult: 3,
  },
};

function melanger<T>(t: T[]): T[] {
  const a = [...t];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

type Manche = { sort: Sort; options: string[] };

function construire(n: Niveau): Manche[] {
  const cfg = niveaux[n];
  return melanger(grimoire)
    .slice(0, cfg.manches)
    .map((sort) => {
      const leurres = melanger(grimoire.filter((s) => s.nom !== sort.nom))
        .slice(0, cfg.choix - 1)
        .map((s) => s.nom);
      return { sort, options: melanger([sort.nom, ...leurres]) };
    });
}

function MaitreDesSorts() {
  const { joueur, gagner, signalerPartie } = useJoueur();
  const [niveau, setNiveau] = useState<Niveau>("sorcier");
  const [manches, setManches] = useState<Manche[]>(() => construire("sorcier"));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [serie, setSerie] = useState(0);
  const [meilleureSerie, setMeilleureSerie] = useState(0);
  const [reponse, setReponse] = useState<string | null>(null);
  const [reste, setReste] = useState(niveaux["sorcier"].temps);
  const [fini, setFini] = useState(false);
  const compte = useRef(false);

  const cfg = niveaux[niveau];
  const manche = manches[index];

  const rejouer = useCallback(
    (n: Niveau) => {
      setNiveau(n);
      setManches(construire(n));
      setIndex(0);
      setScore(0);
      setSerie(0);
      setMeilleureSerie(0);
      setReponse(null);
      setReste(niveaux[n].temps);
      setFini(false);
      compte.current = false;
    },
    [],
  );

  const suivant = useCallback(() => {
    setReponse(null);
    setIndex((i) => {
      if (i + 1 >= manches.length) {
        setFini(true);
        return i;
      }
      setReste(cfg.temps);
      return i + 1;
    });
  }, [manches.length, cfg.temps]);

  const repondre = useCallback(
    (choix: string | null) => {
      if (reponse !== null || fini || !manche) return;
      const bon = choix === manche.sort.nom;
      setReponse(choix ?? "");
      if (bon) {
        setScore((s) => s + 1);
        setSerie((s) => {
          const n = s + 1;
          setMeilleureSerie((m) => Math.max(m, n));
          return n;
        });
      } else {
        setSerie(0);
      }
      setTimeout(suivant, 850);
    },
    [reponse, fini, manche, suivant],
  );

  useEffect(() => {
    if (fini || reponse !== null) return;
    if (reste <= 0) {
      repondre(null);
      return;
    }
    const t = setTimeout(() => setReste((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [reste, fini, reponse, repondre]);

  useEffect(() => {
    if (!fini || compte.current || !joueur) return;
    compte.current = true;
    const taux = score / manches.length;
    const victoire = taux >= 0.7;
    signalerPartie({ victoire, bonnes: score, parfait: score === manches.length });
    gagner(
      {
        xp: (25 + score * 12 + meilleureSerie * 5) * cfg.mult,
        gallions: (5 + score * 4) * cfg.mult,
        points: victoire ? 5 * cfg.mult : 0,
        ...(score === manches.length ? { stat: { cle: "magie" as const, valeur: 1 } } : {}),
      },
      `🪄 Maître des Sorts — ${score}/${manches.length}`,
    );
  }, [fini, joueur, score, manches.length, meilleureSerie, cfg.mult, gagner, signalerPartie]);

  const progression = useMemo(
    () => Math.round(((index + (fini ? 1 : 0)) / manches.length) * 100),
    [index, fini, manches.length],
  );

  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
        <Link to="/jeux" className="text-sm text-or hover:underline">
          ← Salle des mini-jeux
        </Link>
        <h1 className="mt-4 titre-cinema text-2xl text-parchemin sm:text-4xl">Maître des Sorts</h1>
        <p className="mt-2 text-sm text-parchemin/60">{cfg.texte}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(niveaux) as Niveau[]).map((n) => (
            <button
              key={n}
              onClick={() => rejouer(n)}
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

        {!joueur && (
          <p className="mt-4 text-sm italic text-parchemin/60">
            Créez votre sorcier sur la page{" "}
            <Link to="/sorcier" className="text-or hover:underline">
              Mon Sorcier
            </Link>{" "}
            pour gagner de l'XP.
          </p>
        )}

        <div className="panel mt-6 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-parchemin/60">
              Manche {Math.min(index + 1, manches.length)} / {manches.length}
            </span>
            <span className="text-or">Score {score}</span>
            <span className="text-parchemin/60">🔥 Série {serie}</span>
            {!fini && <span className="text-parchemin/60">⏳ {reste}s</span>}
          </div>
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progression}%` }}
            />
          </div>

          {!fini && manche ? (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.3em] text-or">Effet observé</p>
              <p className="mt-2 font-display text-lg">{manche.sort.effet}</p>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {manche.options.map((o) => {
                  const estBon = o === manche.sort.nom;
                  const choisi = reponse === o;
                  const style =
                    reponse === null
                      ? "ring-border hover:-translate-y-0.5 hover:text-foreground"
                      : estBon
                        ? "bg-emeraude/20 text-foreground ring-emeraude/50"
                        : choisi
                          ? "bg-destructive/15 text-foreground ring-destructive/40"
                          : "ring-border opacity-60";
                  return (
                    <button
                      key={o}
                      onClick={() => repondre(o)}
                      disabled={reponse !== null}
                      className={`rounded-[12px] px-4 py-3 text-left text-sm ring-1 transition-all ${style}`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-6 text-center">
              <p className="font-display text-xl">
                {score === manches.length
                  ? "Sans-faute ! Le grimoire vous salue."
                  : score / manches.length >= 0.7
                    ? "Belle maîtrise des incantations."
                    : "Encore quelques révisions au grimoire…"}
              </p>
              <p className="mt-2 text-sm text-parchemin/60">
                {score} bonnes réponses sur {manches.length} — meilleure série : {meilleureSerie}
              </p>
              <button
                onClick={() => rejouer(niveau)}
                className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-5"
              >
                Rejouer
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
