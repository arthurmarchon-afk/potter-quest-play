import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/jeux/memory")({
  head: () => ({
    meta: [
      { title: "Memory de Sortilèges — Mini-jeu sorcier" },
      {
        name: "description",
        content:
          "Retrouvez les paires de sortilèges et leurs effets en un minimum de coups dans ce memory magique.",
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
];

type Carte = { id: number; sort: string };

function melanger(): Carte[] {
  const paires = [...sorts, ...sorts].map((sort, i) => ({ id: i, sort }));
  for (let i = paires.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [paires[i], paires[j]] = [paires[j]!, paires[i]!];
  }
  return paires;
}

function Memory() {
  const [cartes, setCartes] = useState<Carte[]>([]);
  const [retournees, setRetournees] = useState<number[]>([]);
  const [trouvees, setTrouvees] = useState<string[]>([]);
  const [coups, setCoups] = useState(0);

  useEffect(() => {
    setCartes(melanger());
  }, []);

  useEffect(() => {
    if (retournees.length !== 2) return;
    const [a, b] = retournees;
    const ca = cartes.find((c) => c.id === a);
    const cb = cartes.find((c) => c.id === b);
    const timer = setTimeout(() => {
      if (ca && cb && ca.sort === cb.sort) setTrouvees((t) => [...t, ca.sort]);
      setRetournees([]);
    }, 750);
    return () => clearTimeout(timer);
  }, [retournees, cartes]);

  const gagne = trouvees.length === sorts.length && cartes.length > 0;

  function cliquer(carte: Carte) {
    if (retournees.length === 2) return;
    if (retournees.includes(carte.id) || trouvees.includes(carte.sort)) return;
    setRetournees((r) => [...r, carte.id]);
    if (retournees.length === 1) setCoups((c) => c + 1);
  }

  function rejouer() {
    setCartes(melanger());
    setRetournees([]);
    setTrouvees([]);
    setCoups(0);
  }

  const etoiles = useMemo(() => (coups <= 12 ? 3 : coups <= 18 ? 2 : 1), [coups]);

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
          Retournez les parchemins deux par deux et retrouvez les huit paires d'incantations.
        </p>

        <div className="panel mt-8 p-5 sm:p-7">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm">
            <span className="text-brass-2">
              Paires : {trouvees.length} / {sorts.length}
            </span>
            <span className="text-muted-foreground">Coups : {coups}</span>
            <button
              onClick={rejouer}
              className="rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2"
            >
              Rebattre les cartes
            </button>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {cartes.map((carte) => {
              const visible = retournees.includes(carte.id) || trouvees.includes(carte.sort);
              return (
                <button
                  key={carte.id}
                  onClick={() => cliquer(carte)}
                  className={`grid aspect-[3/4] place-items-center rounded-[12px] px-2 text-center text-xs font-medium ring-1 transition-transform hover:-translate-y-0.5 sm:text-sm ${
                    visible
                      ? "bg-primary/15 text-brass-2 ring-primary/50"
                      : "bg-ink-2/70 text-transparent ring-border"
                  }`}
                >
                  {visible ? carte.sort : "✦"}
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
