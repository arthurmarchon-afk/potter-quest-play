import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ComponentType } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, Cadre, ChoixGrave, SeparateurOrne } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import {
  IconeChaudron,
  IconeGoutte,
  IconeOs,
  IconeCrane,
  IconeTrefle,
  IconeCoeur,
  IconePlume,
  IconeBulle,
  IconeChampignon,
  IconeFiole,
} from "@/components/immersif/Icones";
import type { SVGProps } from "react";

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

type Recette = { nom: string; icone: ComponentType<SVGProps<SVGSVGElement>>; etapes: string[]; effet: string };

const recettes: Recette[] = [
  {
    nom: "Philtre de Paix",
    icone: IconePlume,
    effet: "Apaise l'agitation et l'anxiété.",
    etapes: ["Poudre de pierre de lune", "Sirop d'ellébore", "Poudre de corne de licorne", "Bave de Puffskein"],
  },
  {
    nom: "Amortentia",
    icone: IconeCoeur,
    effet: "Le plus puissant des philtres d'amour.",
    etapes: ["Nacre de perle", "Épines de rose", "Essence d'Ashwinder", "Poudre d'Occamy"],
  },
  {
    nom: "Polynectar",
    icone: IconeBulle,
    effet: "Prend l'apparence d'une autre personne.",
    etapes: ["Sangsues", "Sisymbre", "Peau de Serpencendre", "Corne de Bicorne", "Cheveu de la cible"],
  },
  {
    nom: "Felix Felicis",
    icone: IconeTrefle,
    effet: "La chance liquide, à consommer avec prudence.",
    etapes: ["Baie d'aubépine", "Œuf de Runespoor", "Poudre d'occamy", "Queue d'Ashwinder", "Fleur de tournesol"],
  },
  {
    nom: "Goutte du Mort Vivant",
    icone: IconeCrane,
    effet: "Plonge le buveur dans un sommeil profond.",
    etapes: ["Asphodèle", "Armoise", "Fève sopophorique", "Racine de valériane"],
  },
  {
    nom: "Poussos",
    icone: IconeOs,
    effet: "Fait repousser les os brisés.",
    etapes: ["Poudre d'os", "Jus de Mandragore", "Chrysope", "Pincée de sel de Guérisseur"],
  },
  {
    nom: "Veritaserum",
    icone: IconeGoutte,
    effet: "Contraint à dire la vérité.",
    etapes: ["Eau de source", "Jusquiame", "Larme de Phénix", "Poudre de Jobarbille"],
  },
  {
    nom: "Solution de Ratatinage",
    icone: IconeChampignon,
    effet: "Rapetisse ce qu'elle touche.",
    etapes: ["Marguerites hachées", "Peau de rat", "Rate de chauve-souris", "Sangsue"],
  },
];

const ICONES_INGREDIENT = [IconeGoutte, IconeFiole, IconeTrefle, IconeCoeur, IconePlume, IconeBulle, IconeChampignon, IconeOs];
function iconeIngredient(nom: string) {
  let h = 0;
  for (let i = 0; i < nom.length; i++) h = (h * 31 + nom.charCodeAt(i)) >>> 0;
  return ICONES_INGREDIENT[h % ICONES_INGREDIENT.length]!;
}

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

const optionsNiveau = (Object.keys(niveaux) as Niveau[]).map((n) => ({
  valeur: n,
  libelle: niveaux[n].label,
}));

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
      `Potions — ${reussies}/${liste.length} réussies`,
    );
  }, [phase, joueur, reussies, erreurs, liste.length, cfg.mult, gagner, signalerPartie]);

  const RecetteIcone = recette?.icone ?? IconeFiole;

  return (
    <Salle>
      <Link to="/jeux" className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-or/70 hover:text-or">
        Salle des mini-jeux
      </Link>

      <EnTetePage
        surtitre="Établi d'alchimiste"
        titre="Laboratoire de Potions"
        intro={cfg.texte}
        icone={<IconeChaudron />}
        aside={
          <ChoixGrave label="Rang" options={optionsNiveau} valeur={niveau} onChange={(v) => demarrer(v as Niveau)} />
        }
      />

      <Reveler>
        <Cadre className="p-6 sm:p-8">
          {phase !== "fini" && recette ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="flex items-center gap-3">
                  <span className="chandelle grid h-10 w-10 place-items-center rounded-full border border-or/25 bg-black/40 text-or [&>svg]:h-5 [&>svg]:w-5">
                    <RecetteIcone />
                  </span>
                  <span className="titre-monument text-xl">{recette.nom}</span>
                </span>
                <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-parchemin/50">
                  Potion {index + 1} / {liste.length}
                </span>
              </div>
              <p className="annotation mt-2 text-base">{recette.effet}</p>
              <SeparateurOrne className="mt-5" />

              {/* Chaudron animé */}
              <div className="mt-6 flex justify-center" aria-hidden>
                <div className="relative">
                  <div className="chandelle grid h-24 w-24 place-items-center rounded-full border border-or/25 bg-gradient-to-b from-sylve/40 to-black/60 text-or">
                    <IconeChaudron className="h-12 w-12" />
                  </div>
                  <span className="absolute -top-1 left-3 h-1.5 w-1.5 rounded-full bg-or/70 scintille" />
                  <span className="absolute -top-3 left-9 h-1 w-1 rounded-full bg-or/60 scintille" style={{ animationDelay: "1.2s" }} />
                  <span className="absolute -top-2 right-2 h-1.5 w-1.5 rounded-full bg-or/70 scintille" style={{ animationDelay: "2.4s" }} />
                </div>
              </div>

              {phase === "memo" && (
                <div className="mt-6">
                  <p className="text-center font-display text-[0.6rem] uppercase tracking-[0.4em] text-or/70">
                    Mémorisez la recette
                  </p>
                  <ol className="mt-4 space-y-2">
                    {recette.etapes.map((e, i) => {
                      const Icone = iconeIngredient(e);
                      return (
                        <li
                          key={e}
                          className="flex items-center gap-3 rounded-[2px] border border-or/15 bg-black/30 px-4 py-2 text-sm text-parchemin/85"
                        >
                          <span className="chiffre text-sm">{i + 1}</span>
                          <Icone className="h-4 w-4 text-or/80" />
                          {e}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              )}

              {phase === "jeu" && (
                <div className="mt-6">
                  <p className="text-center font-display text-[0.6rem] uppercase tracking-[0.4em] text-or/70">
                    Ajoutez dans l'ordre
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {melange.map((ing) => {
                      const place = ajoutes.indexOf(ing);
                      const Icone = iconeIngredient(ing);
                      return (
                        <button
                          key={ing}
                          onClick={() => ajouter(ing)}
                          disabled={place >= 0}
                          className={`relative flex items-center gap-3 rounded-[2px] border bg-black/30 px-4 py-3 text-left text-sm transition-all ${
                            place >= 0
                              ? "border-or/60 bg-or/10 text-parchemin"
                              : "border-or/15 text-parchemin/80 hover:-translate-y-0.5 hover:border-or/45"
                          }`}
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[2px] border border-or/25 bg-black/40 text-or">
                            <Icone className="h-4 w-4" />
                          </span>
                          {place >= 0 && <span className="chiffre text-sm">{place + 1}.</span>}
                          {ing}
                        </button>
                      );
                    })}
                  </div>
                  <p className="annotation mt-4 text-center text-sm">
                    Chaudron : {ajoutes.length} / {recette.etapes.length} ingrédients
                  </p>
                </div>
              )}

              {phase === "rate" && (
                <p className="mt-6 rounded-[2px] border border-sang/50 bg-sang/15 px-4 py-3 text-center text-sm text-parchemin/85">
                  Le chaudron déborde ! Ordre correct : {recette.etapes.join(", ")}
                </p>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="titre-monument text-2xl">
                {reussies === liste.length
                  ? "Potions parfaites — le professeur est impressionné."
                  : reussies > 0
                    ? "Quelques fioles utilisables, mais peut mieux faire."
                    : "Le laboratoire sent le brûlé…"}
              </p>
              <p className="annotation mt-3 text-base">
                {reussies} potion(s) réussie(s) sur {liste.length} — {erreurs} erreur(s)
              </p>
              <button onClick={() => demarrer(niveau)} className="bouton-magique mt-6">
                Nouvelle séance
              </button>
            </div>
          )}
        </Cadre>
      </Reveler>
    </Salle>
  );
}
