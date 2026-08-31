import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, ChoixGrave, Sceau } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeParchemin, IconeEtoile, Ornement } from "@/components/immersif/Icones";

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

const optionsNiveau = (Object.keys(niveaux) as Niveau[]).map((n) => ({
  valeur: n,
  libelle: niveaux[n].label,
}));

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
  const { joueur, gagner, signalerPartie } = useJoueur();

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
      `Memory réussi en ${coups} coups`,
    );
    signalerPartie({ victoire: true });
  }, [gagne, joueur, coups, config.paires, niveau, gagner, signalerPartie]);

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
    <Salle>
      <Link
        to="/jeux"
        className="mb-6 inline-flex items-center gap-2 font-display text-[0.62rem] uppercase tracking-[0.35em] text-or/60 transition-colors hover:text-or"
      >
        <Ornement className="h-2.5 w-2.5 rotate-180" />
        Salle des mini-jeux
      </Link>
      <EnTetePage
        surtitre="Cabinet des incantations"
        titre="Memory de Sortilèges"
        intro="Retournez les parchemins deux par deux et retrouvez toutes les paires d'incantations."
        icone={<IconeParchemin />}
      />

      <Reveler className="plaque relative p-6">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-or/70">Niveau</p>
        <div className="mt-4">
          <ChoixGrave options={optionsNiveau} valeur={niveau} onChange={(v) => setNiveau(v as Niveau)} />
        </div>
        <p className="annotation mt-4 text-sm leading-relaxed">{config.texte}</p>
      </Reveler>

      <Reveler delai={100} className="plaque relative mt-6 p-5 sm:p-7">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-sm">
          <span className="font-display text-xs uppercase tracking-[0.25em] text-or">
            Paires : {trouvees.length} / {config.paires}
          </span>
          <span className="annotation">Coups : {coups}</span>
          <button onClick={rejouer} className="bouton-magique px-5 py-2.5 text-[0.6rem]">
            Rebattre les cartes
          </button>
        </div>

        <div className={`grid gap-3 ${config.colonnes}`} style={{ perspective: "1200px" }}>
          {cartes.map((carte) => {
            const appariee = trouvees.includes(carte.sort);
            const visible = retournees.includes(carte.id) || appariee;
            const manque = rate.includes(carte.id);
            return (
              <button
                key={carte.id}
                onClick={() => cliquer(carte)}
                aria-label={visible ? carte.sort : "Carte cachée"}
                className="relative aspect-[3/4] [transform-style:preserve-3d] transition-transform duration-500"
                style={{ transform: visible ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                {/* Dos de grimoire */}
                <span
                  className="absolute inset-0 grid place-items-center rounded-[8px] bg-pierre text-or/40 ring-1 ring-or/25 [backface-visibility:hidden]"
                >
                  <Ornement className="h-4 w-4" />
                  <span className="pointer-events-none absolute inset-2 rounded-[5px] ring-1 ring-or/15" />
                </span>
                {/* Face révélée */}
                <span
                  className={`absolute inset-0 grid place-items-center overflow-hidden rounded-[8px] px-2 text-center text-[11px] font-medium leading-tight ring-1 [backface-visibility:hidden] sm:text-sm ${
                    manque
                      ? "bg-sang/40 text-parchemin ring-sang/60"
                      : appariee
                        ? "bg-sylve/40 text-or ring-or/50"
                        : "bg-or/15 text-or ring-or/50"
                  }`}
                  style={{ transform: "rotateY(180deg)" }}
                >
                  {appariee ? (
                    <Sceau className="absolute -right-1 -top-1 h-8 w-8">
                      <Ornement className="h-3 w-3" />
                    </Sceau>
                  ) : null}
                  {carte.sort}
                </span>
              </button>
            );
          })}
        </div>

        {gagne && (
          <div className="mt-8 flex flex-col items-center gap-2 text-center">
            <p className="font-display text-lg text-parchemin">
              Sortilèges maîtrisés en {coups} coups
            </p>
            <div className="flex gap-1 text-or">
              {Array.from({ length: etoiles }).map((_, i) => (
                <IconeEtoile key={i} className="h-5 w-5" />
              ))}
            </div>
          </div>
        )}
      </Reveler>
    </Salle>
  );
}
