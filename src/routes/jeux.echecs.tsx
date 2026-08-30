import { createFileRoute, Link } from "@tanstack/react-router";
import { Chess, type Square } from "chess.js";
import { useCallback, useMemo, useState } from "react";

export const Route = createFileRoute("/jeux/echecs")({
  head: () => ({
    meta: [
      { title: "Échecs des Sorciers — Mini-jeu de Poudlard" },
      {
        name: "description",
        content:
          "Affrontez le grand maître dans une partie d'échecs enchantée : règles complètes, pièces lumineuses et duel au tour par tour.",
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

function coupDuMaitre(jeu: Chess) {
  const coups = jeu.moves({ verbose: true });
  if (coups.length === 0) return null;
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

function Echecs() {
  const [fen, setFen] = useState(() => new Chess().fen());
  const [depuis, setDepuis] = useState<Square | null>(null);
  const [journal, setJournal] = useState<string[]>([]);

  const jeu = useMemo(() => new Chess(fen), [fen]);

  const destinations = useMemo(() => {
    if (!depuis) return [] as string[];
    return jeu.moves({ square: depuis, verbose: true }).map((m) => m.to);
  }, [depuis, jeu]);

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
      const lignes = [coup.san];

      if (!partie.isGameOver()) {
        const riposte = coupDuMaitre(partie);
        if (riposte) {
          partie.move(riposte.san);
          lignes.push(riposte.san);
        }
      }
      setFen(partie.fen());
      setJournal((j) => [...j, ...lignes]);
      setDepuis(null);
      return true;
    },
    [jeu],
  );

  function cliquerCase(case_: Square) {
    if (jeu.isGameOver() || jeu.turn() !== "w") return;
    const piece = jeu.get(case_);
    if (depuis && destinations.includes(case_)) {
      jouer(depuis, case_);
      return;
    }
    if (piece && piece.color === "w") setDepuis(case_);
    else setDepuis(null);
  }

  function nouvellePartie() {
    setFen(new Chess().fen());
    setDepuis(null);
    setJournal([]);
  }

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
            <div className="mx-auto grid aspect-square w-full max-w-[560px] grid-cols-8 overflow-hidden rounded-[12px] ring-1 ring-border">
              {rangees.map((rangee) =>
                colonnes.map((colonne, i) => {
                  const case_ = `${colonne}${rangee}` as Square;
                  const piece = jeu.get(case_);
                  const sombre = (i + rangee) % 2 === 0;
                  const selectionnee = depuis === case_;
                  const cible = destinations.includes(case_);
                  return (
                    <button
                      key={case_}
                      onClick={() => cliquerCase(case_)}
                      className={`relative grid place-items-center text-3xl leading-none transition-colors sm:text-4xl ${
                        sombre ? "bg-ink-2" : "bg-vellum/15"
                      } ${selectionnee ? "ring-2 ring-inset ring-primary" : ""}`}
                      aria-label={case_}
                    >
                      <span
                        className={
                          piece?.color === "w"
                            ? "text-vellum drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                            : "text-brass drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                        }
                      >
                        {piece ? glyphes[`${piece.color}${piece.type}`] : ""}
                      </span>
                      {cible && (
                        <span className="pointer-events-none absolute h-3 w-3 rounded-full bg-primary/70" />
                      )}
                    </button>
                  );
                }),
              )}
            </div>
          </div>

          <div className="panel h-fit p-6">
            <p className="text-xs uppercase tracking-[0.25em] text-brass-2">État du duel</p>
            <p className="mt-3 font-display text-lg">{statut}</p>
            <button
              onClick={nouvellePartie}
              className="mt-5 rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2"
            >
              Nouvelle partie
            </button>
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
