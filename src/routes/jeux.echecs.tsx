import { createFileRoute, Link } from "@tanstack/react-router";
import { Chess, type Move, type Square } from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";

export const Route = createFileRoute("/jeux/echecs")({
  head: () => ({
    meta: [
      { title: "Échecs des Sorciers — Mini-jeu de Poudlard" },
      {
        name: "description",
        content:
          "Affrontez le grand maître dans une partie d'échecs enchantée : trois niveaux de difficulté, règles complètes et duel au tour par tour.",
      },
      { property: "og:title", content: "Échecs des Sorciers" },
      {
        property: "og:description",
        content: "Une partie d'échecs enchantée contre le grand maître de Poudlard.",
      },
    ],
  }),
  component: Echecs,
});

const glyphes: Record<string, string> = {
  wp: "♙",
  wn: "♘",
  wb: "♗",
  wr: "♖",
  wq: "♕",
  wk: "♔",
  bp: "♟",
  bn: "♞",
  bb: "♝",
  br: "♜",
  bq: "♛",
  bk: "♚",
};

const valeurs: Record<string, number> = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const colonnes = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const rangees = [8, 7, 6, 5, 4, 3, 2, 1] as const;

type Niveau = "apprenti" | "sorcier" | "mage";

const niveaux: Record<Niveau, { label: string; texte: string }> = {
  apprenti: { label: "Apprenti", texte: "Le maître joue au hasard, idéal pour apprendre." },
  sorcier: { label: "Sorcier", texte: "Il saisit les pièces mal gardées et cherche l'échec." },
  mage: { label: "Mage", texte: "Il calcule votre riposte avant de bouger. Prudence." },
};

function materiel(jeu: Chess) {
  let score = 0;
  for (const ligne of jeu.board()) {
    for (const c of ligne) {
      if (!c) continue;
      const v = valeurs[c.type] ?? 0;
      score += c.color === "b" ? v : -v;
    }
  }
  return score;
}

function coupAleatoire(coups: Move[]) {
  return coups[Math.floor(Math.random() * coups.length)]!;
}

function coupGourmand(jeu: Chess, coups: Move[]) {
  let meilleur = coups[0]!;
  let meilleurScore = -Infinity;
  for (const coup of coups) {
    let score = Math.random();
    if (coup.captured) score += valeurs[coup.captured] ?? 0;
    if (coup.promotion) score += 8;
    const test = new Chess(jeu.fen());
    test.move(coup.san);
    if (test.isCheckmate()) score += 100;
    else if (test.isCheck()) score += 0.6;
    if (score > meilleurScore) {
      meilleurScore = score;
      meilleur = coup;
    }
  }
  return meilleur;
}

function coupProfond(jeu: Chess, coups: Move[]) {
  let meilleur = coups[0]!;
  let meilleurScore = -Infinity;
  for (const coup of coups) {
    const apres = new Chess(jeu.fen());
    apres.move(coup.san);
    if (apres.isCheckmate()) return coup;
    // pire réponse possible du joueur (blancs)
    const reponses = apres.moves({ verbose: true });
    let pire = materiel(apres);
    for (const rep of reponses) {
      const suite = new Chess(apres.fen());
      suite.move(rep.san);
      const val = suite.isCheckmate() ? -1000 : materiel(suite);
      if (val < pire) pire = val;
    }
    const score = pire + Math.random() * 0.1;
    if (score > meilleurScore) {
      meilleurScore = score;
      meilleur = coup;
    }
  }
  return meilleur;
}

function coupDuMaitre(jeu: Chess, niveau: Niveau) {
  const coups = jeu.moves({ verbose: true });
  if (coups.length === 0) return null;
  if (niveau === "apprenti") return coupAleatoire(coups);
  if (niveau === "sorcier") return coupGourmand(jeu, coups);
  return coupProfond(jeu, coups);
}

function Echecs() {
  const [niveau, setNiveau] = useState<Niveau>("sorcier");
  const [fen, setFen] = useState(() => new Chess().fen());
  const [depuis, setDepuis] = useState<Square | null>(null);
  const [journal, setJournal] = useState<string[]>([]);
  const [dernier, setDernier] = useState<{ from: string; to: string } | null>(null);
  const [reflechit, setReflechit] = useState(false);

  const jeu = useMemo(() => new Chess(fen), [fen]);

  const destinations = useMemo(() => {
    if (!depuis) return [] as string[];
    return jeu.moves({ square: depuis, verbose: true }).map((m) => m.to);
  }, [depuis, jeu]);

  // Riposte du maître, jouée après un court délai pour la lisibilité.
  useEffect(() => {
    if (jeu.turn() !== "b" || jeu.isGameOver()) return;
    setReflechit(true);
    const t = setTimeout(() => {
      const partie = new Chess(jeu.fen());
      const riposte = coupDuMaitre(partie, niveau);
      if (riposte) {
        partie.move(riposte.san);
        setFen(partie.fen());
        setJournal((j) => [...j, riposte.san]);
        setDernier({ from: riposte.from, to: riposte.to });
      }
      setReflechit(false);
    }, 320);
    return () => clearTimeout(t);
  }, [jeu, niveau]);

  const jouer = useCallback(
    (from: Square, to: Square) => {
      const partie = new Chess(jeu.fen());
      let coup;
      try {
        coup = partie.move({ from, to, promotion: "q" });
      } catch {
        return false;
      }
      if (!coup) return false;
      setFen(partie.fen());
      setJournal((j) => [...j, coup.san]);
      setDernier({ from, to });
      setDepuis(null);
      return true;
    },
    [jeu],
  );

  function cliquerCase(case_: Square) {
    if (jeu.isGameOver() || jeu.turn() !== "w" || reflechit) return;
    const piece = jeu.get(case_);
    if (depuis && destinations.includes(case_)) {
      jouer(depuis, case_);
      return;
    }
    if (piece && piece.color === "w") setDepuis(case_);
    else setDepuis(null);
  }

  const nouvellePartie = useCallback(() => {
    setFen(new Chess().fen());
    setDepuis(null);
    setJournal([]);
    setDernier(null);
  }, []);

  useEffect(() => {
    nouvellePartie();
  }, [niveau, nouvellePartie]);

  const { joueur, gagner, signalerPartie } = useJoueur();
  const recompense = useRef(false);
  const victoire = jeu.isCheckmate() && jeu.turn() === "b";
  const nulle = jeu.isDraw();

  useEffect(() => {
    if (!victoire && !nulle) {
      recompense.current = false;
      return;
    }
    if (recompense.current || !joueur) return;
    recompense.current = true;
    const mult = niveau === "mage" ? 3 : niveau === "sorcier" ? 2 : 1;
    if (victoire) {
      gagner(
        { xp: 120 * mult, gallions: 40 * mult, points: 25 * mult, stat: { cle: "courage", valeur: 1 } },
        "♟️ Échec et mat — victoire !",
      );
    } else {
      gagner({ xp: 30 * mult, gallions: 10 * mult }, "♟️ Partie nulle");
    }
    signalerPartie({ victoire });
  }, [victoire, nulle, joueur, niveau, gagner, signalerPartie]);

  const statut = jeu.isCheckmate()
    ? jeu.turn() === "w"
      ? "Échec et mat — le grand maître l'emporte."
      : "Échec et mat — la victoire est vôtre !"
    : jeu.isDraw()
      ? "Partie nulle : les pièces retournent au repos."
      : jeu.isCheck()
        ? "Échec au roi !"
        : jeu.turn() === "w"
          ? "À vous de jouer (les blancs)."
          : "Le grand maître réfléchit...";

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Link to="/jeux" className="text-sm text-muted-foreground hover:text-foreground">
          ← Salle des mini-jeux
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
          Échecs des Sorciers
        </h1>
        <p className="mt-2 max-w-[60ch] text-muted-foreground">
          Vous jouez les blancs. Cliquez une pièce, puis sa destination : les règles complètes des
          échecs s'appliquent, promotions et roques compris.
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="panel p-4 sm:p-6">
            <div className="mx-auto grid aspect-square w-full max-w-[560px] grid-cols-8 grid-rows-8 overflow-hidden rounded-[12px] ring-1 ring-border">
              {rangees.map((rangee) =>
                colonnes.map((colonne, i) => {
                  const case_ = `${colonne}${rangee}` as Square;
                  const piece = jeu.get(case_);
                  const sombre = (i + rangee) % 2 === 0;
                  const selectionnee = depuis === case_;
                  const cible = destinations.includes(case_);
                  const joue = dernier?.from === case_ || dernier?.to === case_;
                  return (
                    <button
                      key={case_}
                      onClick={() => cliquerCase(case_)}
                      className={`relative flex h-full w-full min-w-0 items-center justify-center overflow-hidden p-0 transition-colors ${
                        sombre ? "bg-ink-2" : "bg-vellum/15"
                      } ${joue ? "bg-candle/15" : ""} ${
                        selectionnee ? "ring-2 ring-inset ring-primary" : ""
                      }`}
                      aria-label={case_}
                    >
                      <span
                        className={`block select-none leading-none [font-size:min(7vw,2.6rem)] ${
                          piece?.color === "w"
                            ? "text-vellum drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                            : "text-brass drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                        }`}
                      >
                        {piece ? glyphes[`${piece.color}${piece.type}`] : "\u00A0"}
                      </span>
                      {cible && (
                        <span
                          className={`pointer-events-none absolute rounded-full ${
                            piece
                              ? "inset-1 border-2 border-primary/70"
                              : "h-[22%] w-[22%] bg-primary/70"
                          }`}
                        />
                      )}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          <div className="panel h-fit p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-brass-2">Niveau du maître</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(Object.keys(niveaux) as Niveau[]).map((n) => (
                <button
                  key={n}
                  onClick={() => setNiveau(n)}
                  className={`rounded-[10px] px-3 py-2 text-sm font-medium ring-1 transition-transform hover:-translate-y-0.5 ${
                    niveau === n
                      ? "bg-primary/20 text-brass-2 ring-primary/50"
                      : "bg-foreground/5 text-foreground/70 ring-border"
                  }`}
                >
                  {niveaux[n].label}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm italic text-muted-foreground">{niveaux[niveau].texte}</p>

            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-brass-2">État du duel</p>
              <p className="mt-3 font-display text-lg">{statut}</p>
              <button
                onClick={nouvellePartie}
                className="mt-5 rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2"
              >
                Nouvelle partie
              </button>
            </div>
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-brass-2">Registre des coups</p>
              <ol className="mt-3 max-h-64 space-y-1 overflow-auto text-sm text-muted-foreground">
                {journal.length === 0 && <li className="italic">Aucun coup joué.</li>}
                {journal.map((coup, i) => (
                  <li key={`${coup}-${i}`}>
                    {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : "… "}
                    {coup}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
