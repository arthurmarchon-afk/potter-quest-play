import { createFileRoute, Link } from "@tanstack/react-router";
import { Chess, type Move, type Square } from "chess.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, ChoixGrave, CoinsLaiton } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeEchiquier, Ornement } from "@/components/immersif/Icones";

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

const optionsNiveau = (Object.keys(niveaux) as Niveau[]).map((n) => ({
  valeur: n,
  libelle: niveaux[n].label,
}));

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
        "Échec et mat — victoire !",
      );
    } else {
      gagner({ xp: 30 * mult, gallions: 10 * mult }, "Partie nulle");
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
    <Salle large>
      <Link
        to="/jeux"
        className="mb-6 inline-flex items-center gap-2 font-display text-[0.62rem] uppercase tracking-[0.35em] text-or/60 transition-colors hover:text-or"
      >
        <Ornement className="h-2.5 w-2.5 rotate-180" />
        Salle des mini-jeux
      </Link>
      <EnTetePage
        surtitre="Table de la salle commune"
        titre="Échecs des Sorciers"
        intro="Vous jouez les blancs. Cliquez une pièce, puis sa destination : les règles complètes des échecs s'appliquent, promotions et roques compris."
        icone={<IconeEchiquier />}
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Reveler>
          <div className="relative rounded-[6px] bg-bois p-4 shadow-[inset_0_2px_10px_black,0_25px_50px_-25px_black] sm:p-8">
            <div className="relative mx-auto grid aspect-square w-full max-w-[560px] grid-cols-8 grid-rows-8 overflow-hidden rounded-[3px] plaque p-2">
              <CoinsLaiton />
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
                        sombre ? "bg-pierre" : "bg-parchemin/15"
                      } ${joue ? "bg-or/20" : ""} ${
                        selectionnee ? "shadow-[inset_0_0_0_2px_var(--or)]" : ""
                      }`}
                      aria-label={case_}
                    >
                      <span
                        className={`block select-none leading-none [font-size:min(7vw,2.6rem)] ${
                          piece?.color === "w"
                            ? "text-parchemin drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                            : "text-or drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]"
                        }`}
                      >
                        {piece ? glyphes[`${piece.color}${piece.type}`] : "\u00A0"}
                      </span>
                      {cible && (
                        <span
                          className={`pointer-events-none absolute rounded-full ${
                            piece
                              ? "inset-1 border-2 border-or/80"
                              : "h-[22%] w-[22%] bg-or/70"
                          }`}
                        />
                      )}
                    </button>
                  );
                }),
              )}
            </div>
          </div>
        </Reveler>

        <Reveler delai={120} className="h-fit space-y-6">
          <div className="plaque relative p-6">
            <CoinsLaiton />
            <p className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-or/70">
              Niveau du maître
            </p>
            <div className="mt-4">
              <ChoixGrave options={optionsNiveau} valeur={niveau} onChange={(v) => setNiveau(v as Niveau)} />
            </div>
            <p className="annotation mt-4 text-sm leading-relaxed">{niveaux[niveau].texte}</p>
          </div>

          <div className="plaque relative p-6">
            <CoinsLaiton />
            <p className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-or/70">
              État du duel
            </p>
            <p className="mt-3 font-display text-lg text-parchemin">{statut}</p>
            <button onClick={nouvellePartie} className="bouton-magique mt-5 px-5 py-2.5 text-[0.6rem]">
              Nouvelle partie
            </button>
          </div>

          <div className="parchemin relative p-6">
            <p className="text-center font-display text-[0.55rem] uppercase tracking-[0.35em] text-[oklch(0.36_0.06_50)]">
              Registre des coups
            </p>
            <ol className="mt-3 max-h-64 space-y-1 overflow-auto font-manuscrit text-sm italic text-[oklch(0.3_0.05_50)]">
              {journal.length === 0 && <li>Aucun coup joué.</li>}
              {journal.map((coup, i) => (
                <li key={`${coup}-${i}`}>
                  {i % 2 === 0 ? `${Math.floor(i / 2) + 1}. ` : "… "}
                  {coup}
                </li>
              ))}
            </ol>
          </div>
        </Reveler>
      </div>
    </Salle>
  );
}
