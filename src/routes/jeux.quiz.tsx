import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/jeux/quiz")({
  head: () => ({
    meta: [
      { title: "Le Quiz du Professeur — Testez votre savoir sorcier" },
      {
        name: "description",
        content:
          "Dix questions sur les sortilèges, les créatures et l'histoire de Poudlard pour éprouver votre savoir.",
      },
      { property: "og:title", content: "Le Quiz du Professeur" },
      {
        property: "og:description",
        content: "Dix questions pour éprouver votre savoir sorcier.",
      },
    ],
  }),
  component: Quiz,
});

const questions = [
  {
    q: "Quel sortilège permet d'allumer le bout de sa baguette ?",
    r: ["Lumos", "Nox", "Incendio", "Sonorus"],
    bonne: 0,
  },
  {
    q: "Quelle créature garde les coffres de Gringotts dans les profondeurs ?",
    r: ["Un hippogriffe", "Un dragon", "Un troll", "Un basilic"],
    bonne: 1,
  },
  {
    q: "Comment s'appelle le gardien des clés de Poudlard ?",
    r: ["Argus Rusard", "Rubeus Hagrid", "Horace Slughorn", "Filius Flitwick"],
    bonne: 1,
  },
  {
    q: "Quel est le sortilège de désarmement ?",
    r: ["Stupéfix", "Petrificus Totalus", "Expelliarmus", "Impedimenta"],
    bonne: 2,
  },
  {
    q: "Quelle potion procure une chance insolente ?",
    r: ["Felix Felicis", "Polynectar", "Amortentia", "Veritaserum"],
    bonne: 0,
  },
  {
    q: "Que voit-on dans le Miroir du Riséd ?",
    r: ["Le passé", "L'avenir", "Le désir le plus profond", "Ses peurs"],
    bonne: 2,
  },
  {
    q: "Quelle balle vaut cent cinquante points au Quidditch ?",
    r: ["Le Souafle", "Le Cognard", "Le Vif d'or", "Le Percuteur"],
    bonne: 2,
  },
  {
    q: "Quel animal représente la maison Serdaigle ?",
    r: ["Un aigle", "Un corbeau", "Un blaireau", "Un serpent"],
    bonne: 0,
  },
  {
    q: "Contre quoi le sortilège Riddikulus est-il utilisé ?",
    r: ["Un détraqueur", "Un épouvantard", "Un inferi", "Un strangulot"],
    bonne: 1,
  },
  {
    q: "Où se trouve l'entrée de la salle commune de Serpentard ?",
    r: ["Dans une tour", "Près des cuisines", "Dans les cachots", "Sous le lac gelé"],
    bonne: 2,
  },
];

function Quiz() {
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [fini, setFini] = useState(false);

  const question = questions[index]!;

  function suivant() {
    if (choix === null) return;
    const bon = choix === question.bonne;
    const nouveauScore = score + (bon ? 1 : 0);
    setScore(nouveauScore);
    setChoix(null);
    if (index === questions.length - 1) setFini(true);
    else setIndex(index + 1);
  }

  function recommencer() {
    setIndex(0);
    setChoix(null);
    setScore(0);
    setFini(false);
  }

  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Link to="/jeux" className="text-sm text-muted-foreground hover:text-foreground">
          ← Salle des mini-jeux
        </Link>
        <h1 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
          Le Quiz du Professeur
        </h1>

        <div className="panel mt-8 p-6 sm:p-8">
          {fini ? (
            <div className="text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-brass-2">Copie corrigée</p>
              <p className="mt-4 font-display text-4xl font-semibold">
                {score} / {questions.length}
              </p>
              <p className="mt-3 text-muted-foreground">
                {score >= 9
                  ? "Optimal. Le professeur vous accorde vingt points."
                  : score >= 6
                    ? "Effort acceptable. Relisez vos grimoires."
                    : "Troll. Retenue à la bibliothèque."}
              </p>
              <button
                onClick={recommencer}
                className="mt-6 rounded-[10px] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2"
              >
                Repasser l'examen
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6 flex items-center justify-between text-xs">
                <span className="uppercase tracking-[0.25em] text-brass-2">
                  Question {index + 1} / {questions.length}
                </span>
                <span className="italic text-muted-foreground">Score : {score}</span>
              </div>
              <h2 className="text-balance font-display text-xl font-medium sm:text-2xl">
                {question.q}
              </h2>
              <div className="mt-6 grid gap-3">
                {question.r.map((r, i) => (
                  <button
                    key={r}
                    onClick={() => setChoix(i)}
                    className={`rounded-[12px] px-4 py-3 text-left text-sm ring-1 transition-transform hover:-translate-y-0.5 ${
                      choix === i
                        ? "bg-primary/15 text-brass-2 ring-primary/50"
                        : "bg-foreground/5 text-foreground/80 ring-border"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <button
                onClick={suivant}
                disabled={choix === null}
                className="mt-6 rounded-[10px] bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 disabled:opacity-40"
              >
                {index === questions.length - 1 ? "Rendre la copie" : "Question suivante"}
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
