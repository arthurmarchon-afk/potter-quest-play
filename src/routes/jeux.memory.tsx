import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";

export const Route = createFileRoute("/jeux/memory")({
  head: () => ({
    meta: [
      { title: "Memory de Sortilèges — Mini-jeu sorcier" },
      {
        name: "description",
        content:
          "Retrouvez les paires de sortilèges et leurs effets en un minimum de coups dans ce memory magique à trois niveaux de difficulté.",
      },
      { property: "og:title", content: "Memory de Sortilèges" },
      {
        property: "og:description",
        content: "Retrouvez les paires d'incantations en un minimum de coups.",
      },
    ],
  }),
  component: Memory,
});

const sorts = [
  "Lumos",
  "Alohomora",
  "Expelliarmus",
  "Wingardium Leviosa",
  "Expecto Patronum",
  "Accio",
  "Riddikulus",
  "Protego",
  "Stupéfix",
  "Reparo",
  "Incendio",
  "Aguamenti",
];

type Niveau = "apprenti" | "sorcier" | "mage";

const niveaux: Record<
  Niveau,
  { label: string; paires: number; delai: number; colonnes: string; texte: string }
> = {
  apprenti: {
    label: "Apprenti",
    paires: 6,
    delai: 900,
    colonnes: "grid-cols-3 sm:grid-cols-4",
    texte: "6 paires, les cartes restent visibles un long moment.",
  },
  sorcier: {
    label: "Sorcier",
    paires: 8,
    delai: 700,
    colonnes: "grid-cols-4",
    texte: "8 paires, rythme classique du memory.",
  },
  mage: {
    label: "Mage",
    paires: 12,
    delai: 450,
    colonnes: "grid-cols-4 sm:grid-cols-6",
    texte: "12 paires et un retournement éclair : mémoire d'archimage requise.",
  },
};

type Carte = { id: number; sort: string };

function melanger(nbPaires: number): Carte[] {
  const choisis = sorts.slice(0, nbPaires);
  const paires = [...choisis, ...choisis].map((sort, i) => ({ id: i, sort }));
  for (let i = paires.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paires[i], paires[j]] = [paires[j]!, paires[i]!];
  }
  return paires;
}

function Memory() {
  const [niveau, setNiveau] = useState<Niveau>("sorcier");
  const config = niveaux[niveau];
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [retournees, setRetournees] = useState<number[]>([]);
  const [trouvees, setTrouvees] = useState<string[]>([]);
  const [coups, setCoups] = useState(0);
  const [rate, setRate] = useState<number[]>([]);

  const rejouer = useCallback(() => {
    setCartes(melanger(niveaux[niveau].paires));
    setRetournees([]);
    setTrouvees([]);
    setRate([]);
    setCoups(0);
  }, [niveau]);

  useEffect(() => {
    rejouer();
  }, [rejouer]);

  useEffect(() => {
    if (retournees.length !== 2) return;
    const [a, b] = retournees;
    const ca = cartes.find((c) => c.id === a);
    const cb = cartes.find((c) => c.id === b);
    const paire = !!ca && !!cb && ca.sort === cb.sort;
    if (paire) {
      const t = setTimeout(() => {
        setTrouvees((prev) => [...prev, ca!.sort]);
        setRetournees([]);
      }, 260);
      return () => clearTimeout(t);
    }
    setRate(retournees);
    const t = setTimeout(() => {
      setRetournees([]);
      setRate([]);
    }, config.delai);
    return () => clearTimeout(t);
  }, [retournees, cartes, config.delai]);

  const gagne = trouvees.length === config.paires && cartes.length > 0;
  const recompense = useRef(false);
  const { joueur, gagner } = useJoueur();

  useEffect(() => {
    if (!gagne) {
      recompense.current = false;
      return;
    }
    if (recompense.current || !joueur) return;
    recompense.current = true;
    const mult = niveau === "mage" ? 3 : niveau === "sorcier" ? 2 : 1;
    const bonus = Math.max(0, config.paires * 2 - coups);
    gagner(
      {
        xp: (40 + bonus * 5) * mult,
        gallions: (15 + bonus * 2) * mult,
        points: 10 * mult,
        stat: { cle: "agilite", valeur: 1 },
      },
      `🧪 Memory réussi en ${coups} coups`,
    );
  }, [gagne, joueur, coups, config.paires, niveau, gagner]);

  function cliquer(carte: Carte) {
    if (retournees.length === 2) return;
    if (retournees.includes(carte.id) || trouvees.includes(carte.sort)) return;
    setRetournees((r) => [...r, carte.id]);
    if (retournees.length === 1) setCoups((c) => c + 1);
  }

  const etoiles = useMemo(() => {
    const parfait = config.paires;
    if (coups <= parfait * 1.5) return 3;
    if (coups <= parfait * 2.2) return 2;
    return 1;
  }, [coups, config.paires]);

  return (
    <section>
      <div className="mx-auto max-w-4xl px-6 py-16">
        <Link to="/jeux" className="text-sm text-muted-foreground hover:text-foreground">
          ← Salle des mini-jeux
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
          Memory de Sortilèges
        </h1>
        <p className="mt-2 text-muted-foreground">
          Retournez les parchemins deux par deux et retrouvez toutes les paires d'incantations.
        </p>

        <div className="panel mt-6 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-brass-2">Niveau</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(Object.keys(niveaux) as Niveau[]).map((n) => (
              <button
                key={n}
                onClick={() => setNiveau(n)}
                className={`rounded-[10px] px-4 py-2 text-sm font-medium ring-1 transition-transform hover:-translate-y-0.5 ${
                  niveau === n
                    ? "bg-primary/20 text-brass-2 ring-primary/50"
                    : "bg-foreground/5 text-foreground/70 ring-border"
                }`}
              >
                {niveaux[n].label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm italic text-muted-foreground">{config.texte}</p>
        </div>

        <div className="panel mt-6 p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-brass-2">
              Paires : {trouvees.length} / {config.paires}
            </span>
            <span className="text-muted-foreground">Coups : {coups}</span>
            <button
              onClick={rejouer}
              className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2"
            >
              Rebattre les cartes
            </button>
          </div>

          <div className={`grid gap-3 ${config.colonnes}`}>
            {cartes.map((carte) => {
              const appariee = trouvees.includes(carte.sort);
              const visible = retournees.includes(carte.id) || appariee;
              const manque = rate.includes(carte.id);
              return (
                <button
                  key={carte.id}
                  onClick={() => cliquer(carte)}
                  className={`grid aspect-[3/4] place-items-center overflow-hidden rounded-[12px] px-2 text-center text-[11px] font-medium leading-tight ring-1 transition-all duration-200 hover:-translate-y-0.5 sm:text-sm ${
                    manque
                      ? "bg-destructive/20 text-foreground/80 ring-destructive/50"
                      : appariee
                        ? "bg-emeraude/20 text-brass-2 ring-emeraude/50 opacity-80"
                        : visible
                          ? "bg-primary/15 text-brass-2 ring-primary/50"
                          : "bg-ink-2/70 text-brass/40 ring-border"
                  }`}
                >
                  {visible || manque ? carte.sort : "✦"}
                </button>
              );
            })}
          </div>

          {gagne && (
            <p className="mt-6 text-center font-display text-lg text-brass-2">
              Sortilèges maîtrisés en {coups} coups — {"✦".repeat(etoiles)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
