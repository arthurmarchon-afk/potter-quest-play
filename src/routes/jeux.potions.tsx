import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";

export const Route = createFileRoute("/jeux/potions")({
  head: () => ({
    meta: [
      { title: "Laboratoire de Potions — Mini-jeu de préparation" },
      {
        name: "description",
        content:
          "Suivez la recette du professeur : ajoutez les ingrédients dans le bon ordre pour réussir vos potions.",
      },
      { property: "og:title", content: "Laboratoire de Potions" },
      {
        property: "og:description",
        content: "Mémorisez la recette et ajoutez les ingrédients dans le bon ordre.",
      },
    ],
  }),
  component: Potions,
});

type Recette = { nom: string; icone: string; etapes: string[]; effet: string };

const recettes: Recette[] = [
  {
    nom: "Philtre de Paix",
    icone: "🕊️",
    effet: "Apaise l'agitation et l'anxiété.",
    etapes: ["Poudre de pierre de lune", "Sirop d'ellébore", "Poudre de corne de licorne", "Bave de Puffskein"],
  },
  {
    nom: "Amortentia",
    icone: "💗",
    effet: "Le plus puissant des philtres d'amour.",
    etapes: ["Nacre de perle", "Épines de rose", "Essence d'Ashwinder", "Poudre d'Occamy"],
  },
  {
    nom: "Polynectar",
    icone: "🧫",
    effet: "Prend l'apparence d'une autre personne.",
    etapes: ["Sangsues", "Sisymbre", "Peau de Serpencendre", "Corne de Bicorne", "Cheveu de la cible"],
  },
  {
    nom: "Felix Felicis",
    icone: "🍀",
    effet: "La chance liquide, à consommer avec prudence.",
    etapes: ["Baie d'aubépine", "Œuf de Runespoor", "Poudre d'occamy", "Queue d'Ashwinder", "Fleur de tournesol"],
  },
  {
    nom: "Goutte du Mort Vivant",
    icone: "💀",
    effet: "Plonge le buveur dans un sommeil profond.",
    etapes: ["Asphodèle", "Armoise", "Fève sopophorique", "Racine de valériane"],
  },
  {
    nom: "Poussos",
    icone: "🦴",
    effet: "Fait repousser les os brisés.",
    etapes: ["Poudre d'os", "Jus de Mandragore", "Chrysope", "Pincée de sel de Guérisseur"],
  },
  {
    nom: "Veritaserum",
    icone: "💧",
    effet: "Contraint à dire la vérité.",
    etapes: ["Eau de source", "Jusquiame", "Larme de Phénix", "Poudre de Jobarbille"],
  },
  {
    nom: "Solution de Ratatinage",
    icone: "🫧",
    effet: "Rapetisse ce qu'elle touche.",
    etapes: ["Marguerites hachées", "Peau de rat", "Rate de chauve-souris", "Sangsue"],
  },
];

type Niveau = "apprenti" | "sorcier" | "mage";

const niveaux: Record<
  Niveau,
  { label: string; memo: number; recettes: number; texte: string; mult: number }
> = {
  apprenti: {
    label: "Apprenti",
    memo: 7000,
    recettes: 2,
    texte: "La recette reste affichée 7 secondes, 2 potions à préparer.",
    mult: 1,
  },
  sorcier: {
    label: "Sorcier",
    memo: 4500,
    recettes: 3,
    texte: "4,5 secondes de mémorisation, 3 potions.",
    mult: 2,
  },
  mage: {
    label: "Mage",
    memo: 2500,
    recettes: 4,
    texte: "2,5 secondes seulement, 4 potions : rigueur du maître de potions.",
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

function Potions() {
  const { joueur, gagner, signalerPartie } = useJoueur();
  const [niveau, setNiveau] = useState<Niveau>("sorcier");
  const [liste, setListe] = useState<Recette[]>(() => melanger(recettes).slice(0, 3));
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"memo" | "jeu" | "rate" | "fini">("memo");
  const [ajoutes, setAjoutes] = useState<string[]>([]);
  const [melange, setMelange] = useState<string[]>([]);
  const [reussies, setReussies] = useState(0);
  const [erreurs, setErreurs] = useState(0);
  const compte = useRef(false);

  const cfg = niveaux[niveau];
  const recette = liste[index];

  const demarrer = useCallback((n: Niveau) => {
    const l = melanger(recettes).slice(0, niveaux[n].recettes);
    setNiveau(n);
    setListe(l);
    setIndex(0);
    setAjoutes([]);
    setMelange(melanger(l[0]?.etapes ?? []));
    setReussies(0);
    setErreurs(0);
    setPhase("memo");
    compte.current = false;
  }, []);

  useEffect(() => {
    if (phase !== "memo") return;
    const t = setTimeout(() => setPhase("jeu"), cfg.memo);
    return () => clearTimeout(t);
  }, [phase, cfg.memo, index]);

  const passerSuivante = useCallback(
    (succes: boolean) => {
      if (succes) setReussies((r) => r + 1);
      setIndex((i) => {
        const suivant = i + 1;
        if (suivant >= liste.length) {
          setPhase("fini");
          return i;
        }
        setAjoutes([]);
        setMelange(melanger(liste[suivant]!.etapes));
        setPhase("memo");
        return suivant;
      });
    },
    [liste],
  );

  const ajouter = useCallback(
    (ing: string) => {
      if (phase !== "jeu" || !recette) return;
      const attendu = recette.etapes[ajoutes.length];
      if (ing === attendu) {
        const nouveaux = [...ajoutes, ing];
        setAjoutes(nouveaux);
        if (nouveaux.length === recette.etapes.length) {
          setTimeout(() => passerSuivante(true), 700);
        }
      } else {
        setErreurs((e) => e + 1);
        setPhase("rate");
        setTimeout(() => passerSuivante(false), 1400);
      }
    },
    [phase, recette, ajoutes, passerSuivante],
  );

  useEffect(() => {
    if (phase !== "fini" || compte.current || !joueur) return;
    compte.current = true;
    const parfait = reussies === liste.length && erreurs === 0;
    signalerPartie({ victoire: reussies > liste.length / 2, bonnes: reussies, parfait });
    gagner(
      {
        xp: (30 + reussies * 35) * cfg.mult,
        gallions: (10 + reussies * 12) * cfg.mult,
        points: reussies === liste.length ? 8 * cfg.mult : 0,
        ...(parfait ? { stat: { cle: "sagesse" as const, valeur: 1 } } : {}),
      },
      `⚗️ Potions — ${reussies}/${liste.length} réussies`,
    );
  }, [phase, joueur, reussies, erreurs, liste.length, cfg.mult, gagner, signalerPartie]);

  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
        <Link to="/jeux" className="text-sm text-brass-2 hover:underline">
          ← Salle des mini-jeux
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
          Laboratoire de Potions
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{cfg.texte}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(niveaux) as Niveau[]).map((n) => (
            <button
              key={n}
              onClick={() => demarrer(n)}
              className={`rounded-[10px] px-3 py-2 text-sm font-medium ring-1 transition-colors ${
                n === niveau
                  ? "bg-primary/15 text-primary ring-primary/40"
                  : "text-muted-foreground ring-border hover:text-foreground"
              }`}
            >
              {niveaux[n].label}
            </button>
          ))}
        </div>

        <div className="panel mt-6 p-5">
          {phase !== "fini" && recette ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-display text-lg">
                  {recette.icone} {recette.nom}
                </span>
                <span className="text-muted-foreground">
                  Potion {index + 1} / {liste.length}
                </span>
              </div>
              <p className="mt-1 text-sm italic text-muted-foreground">{recette.effet}</p>

              {phase === "memo" && (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-brass-2">
                    Mémorisez la recette
                  </p>
                  <ol className="mt-3 space-y-2">
                    {recette.etapes.map((e, i) => (
                      <li key={e} className="rounded-[10px] bg-primary/10 px-4 py-2 text-sm">
                        <span className="mr-2 text-brass-2">{i + 1}.</span>
                        {e}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {phase === "jeu" && (
                <div className="mt-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-brass-2">
                    Ajoutez dans l'ordre
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {melange.map((ing) => {
                      const place = ajoutes.indexOf(ing);
                      return (
                        <button
                          key={ing}
                          onClick={() => ajouter(ing)}
                          disabled={place >= 0}
                          className={`rounded-[12px] px-4 py-3 text-left text-sm ring-1 transition-all ${
                            place >= 0
                              ? "bg-emeraude/20 text-foreground ring-emeraude/50"
                              : "ring-border hover:-translate-y-0.5 hover:text-foreground"
                          }`}
                        >
                          {place >= 0 && <span className="mr-2 text-brass-2">{place + 1}.</span>}
                          {ing}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground">
                    Chaudron : {ajoutes.length} / {recette.etapes.length} ingrédients
                  </p>
                </div>
              )}

              {phase === "rate" && (
                <p className="mt-5 rounded-[12px] bg-destructive/15 px-4 py-3 text-sm">
                  💥 Le chaudron déborde ! Ordre correct :{" "}
                  {recette.etapes.join(" → ")}
                </p>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="font-display text-xl">
                {reussies === liste.length
                  ? "Potions parfaites — le professeur est impressionné."
                  : reussies > 0
                    ? "Quelques fioles utilisables, mais peut mieux faire."
                    : "Le laboratoire sent le brûlé…"}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                {reussies} potion(s) réussie(s) sur {liste.length} — {erreurs} erreur(s)
              </p>
              <button
                onClick={() => demarrer(niveau)}
                className="mt-5 rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                Nouvelle séance
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
