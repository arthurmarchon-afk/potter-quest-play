import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, ChoixGrave } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeLivre, IconeSablier, Ornement } from "@/components/immersif/Icones";
import {
  categories,
  niveauxQuiz,
  tirerQuestions,
  type Categorie,
  type NiveauQuiz,
  type QuestionQuiz,
} from "@/lib/quiz-banque";

export const Route = createFileRoute("/jeux/quiz")({
  head: () => ({
    meta: [
      { title: "Le Quiz du Professeur — Six matières, quatre niveaux" },
      {
        name: "description",
        content:
          "Sortilèges, créatures, potions, Quidditch, histoire et personnages : choisissez votre matière, votre niveau, ou tentez le défi express en trois questions.",
      },
      { property: "og:title", content: "Le Quiz du Professeur" },
      {
        property: "og:description",
        content: "Des interrogations chronométrées, du niveau Moldu curieux au niveau Maître.",
      },
    ],
  }),
  component: Quiz,
});

const optionsNiveau = (Object.keys(niveauxQuiz) as NiveauQuiz[]).map((n) => ({
  valeur: n,
  libelle: niveauxQuiz[n].label,
}));

const optionsCategorie = [
  { valeur: "toutes", libelle: "Toutes" },
  ...(Object.keys(categories) as Categorie[]).map((c) => ({
    valeur: c,
    libelle: categories[c].nom,
  })),
];

function Quiz() {
  const { joueur, gagner, signalerPartie } = useJoueur();
  const recompense = useRef(false);
  const [niveau, setNiveau] = useState<NiveauQuiz>("apprenti");
  const [categorie, setCategorie] = useState<Categorie | "toutes">("toutes");
  const [express, setExpress] = useState(false);
  const conf = niveauxQuiz[niveau];

  const [liste, setListe] = useState<QuestionQuiz[]>([]);
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [fini, setFini] = useState(false);
  const [temps, setTemps] = useState<number>(conf.chrono ?? 0);

  const chrono = express ? 8 : conf.chrono;

  const recommencer = useCallback(() => {
    setListe(tirerQuestions(niveau, categorie, express));
    setIndex(0);
    setChoix(null);
    setScore(0);
    setFini(false);
    setTemps(express ? 8 : (niveauxQuiz[niveau].chrono ?? 0));
  }, [niveau, categorie, express]);

  useEffect(() => {
    recommencer();
  }, [recommencer]);

  const question = liste[index];

  const suivant = useCallback(
    (reponse: number | null) => {
      if (!question) return;
      const bon = reponse === question.bonne;
      setChoix(reponse);
      setTimeout(() => {
        if (bon) setScore((s) => s + 1);
        if (index >= liste.length - 1) setFini(true);
        else setIndex((i) => i + 1);
        setChoix(null);
        setTemps(chrono ?? 0);
      }, 650);
    },
    [question, index, liste.length, chrono],
  );

  useEffect(() => {
    if (fini || choix !== null || chrono === null || !question) return;
    if (temps <= 0) {
      suivant(-1);
      return;
    }
    const t = setTimeout(() => setTemps((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [temps, fini, choix, chrono, question, suivant]);

  useEffect(() => {
    if (!fini) {
      recompense.current = false;
      return;
    }
    if (recompense.current || !joueur || !liste.length) return;
    recompense.current = true;
    const mult = conf.mult * (express ? 2 : 1);
    gagner(
      {
        xp: score * 10 * mult,
        gallions: score * 4 * mult,
        points: score * 2 * mult,
        stat: { cle: "intelligence", valeur: score >= liste.length * 0.8 ? 1 : 0 },
      },
      `${express ? "Défi express" : "Interrogation"} — ${score}/${liste.length}`,
    );
    signalerPartie({
      victoire: score >= liste.length * 0.6,
      bonnes: score,
      parfait: score === liste.length,
    });
  }, [fini, joueur, liste.length, score, conf.mult, express, gagner, signalerPartie]);

  const mention = useMemo(() => {
    const ratio = liste.length ? score / liste.length : 0;
    if (ratio >= 0.9) return "Optimal. Le professeur vous accorde vingt points.";
    if (ratio >= 0.6) return "Effort acceptable. Relisez vos grimoires.";
    return "Troll. Retenue à la bibliothèque.";
  }, [score, liste.length]);

  const fractionTemps = chrono ? temps / chrono : 1;
  const salle =
    categorie === "toutes" ? "Salle de classe" : categories[categorie].salle;

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
        surtitre={salle}
        titre="Le Quiz du Professeur"
        intro="Choisissez la matière, le niveau — ou lancez un défi express de trois questions avant la cloche."
        icone={<IconeLivre />}
      />

      <Reveler className="plaque relative space-y-5 p-6">
        <ChoixGrave
          label="Matière"
          options={optionsCategorie}
          valeur={categorie}
          onChange={(v) => setCategorie(v as Categorie | "toutes")}
        />
        <ChoixGrave
          label="Niveau"
          options={optionsNiveau}
          valeur={niveau}
          onChange={(v) => setNiveau(v as NiveauQuiz)}
        />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="annotation text-sm leading-relaxed">
            {express
              ? "Défi express : trois questions, huit secondes chacune, récompenses doublées."
              : conf.texte}
          </p>
          <button
            type="button"
            onClick={() => setExpress((e) => !e)}
            className={`shrink-0 rounded-[2px] border px-4 py-2 font-display text-[0.58rem] uppercase tracking-[0.28em] transition-colors ${
              express
                ? "border-or/60 bg-or/15 text-parchemin"
                : "border-or/25 text-parchemin/55 hover:text-or"
            }`}
          >
            Défi express
          </button>
        </div>
      </Reveler>

      <Reveler delai={100} className="parchemin relative mt-6 p-6 sm:p-8">
        {fini || !question ? (
          <div className="text-center">
            <p className="font-display text-[0.62rem] uppercase tracking-[0.35em] text-[oklch(0.36_0.06_50)]">
              Copie corrigée
            </p>
            <p className="chiffre mt-4 text-5xl">
              {score} / {liste.length}
            </p>
            <p className="annotation mt-3 text-base text-[oklch(0.32_0.05_50)]">{mention}</p>
            <button onClick={recommencer} className="bouton-magique mt-6 px-5 py-2.5 text-[0.6rem]">
              Repasser l'examen
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-xs uppercase tracking-[0.25em] text-[oklch(0.36_0.06_50)]">
                {categories[question.cat].nom} — {index + 1} / {liste.length}
              </span>
              <span className="chiffre text-lg">{score}</span>
            </div>

            {chrono !== null ? (
              <div className="mb-6 flex items-center justify-center gap-3">
                <IconeSablier
                  className="h-6 w-6 text-[oklch(0.36_0.08_50)]"
                  style={{
                    transform: `rotate(${(1 - fractionTemps) * 180}deg)`,
                    transition: "transform 1s linear",
                  }}
                />
                <span className="chiffre text-xl">{temps}s</span>
              </div>
            ) : (
              <div className="mb-6 h-1 overflow-hidden rounded-full bg-[oklch(0.4_0.06_60/25%)]">
                <div
                  className="h-full bg-[oklch(0.4_0.09_55)] transition-all duration-300"
                  style={{ width: `${((index + 1) / liste.length) * 100}%` }}
                />
              </div>
            )}

            <h2 className="text-balance text-center font-display text-xl font-medium text-[oklch(0.22_0.02_60)] sm:text-2xl">
              {question.q}
            </h2>
            <div className="mt-6 grid gap-3">
              {question.r.map((r, i) => {
                const repondu = choix !== null;
                const juste = i === question.bonne;
                return (
                  <button
                    key={r}
                    disabled={repondu}
                    onClick={() => suivant(i)}
                    className={`plaque relative px-4 py-3 text-left text-sm text-parchemin transition-all duration-300 hover:-translate-y-0.5 disabled:hover:translate-y-0 ${
                      repondu && juste
                        ? "shadow-[inset_0_0_0_1px_var(--or),0_0_24px_-4px_color-mix(in_oklab,var(--or)_60%,transparent)]"
                        : repondu && choix === i
                          ? "shadow-[inset_0_0_0_1px_var(--sang)]"
                          : ""
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </Reveler>
    </Salle>
  );
}
