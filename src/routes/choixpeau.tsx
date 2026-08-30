import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  calculerMaison,
  maisons,
  questionsChoixpeau,
  type Maison,
} from "@/lib/choixpeau";

export const Route = createFileRoute("/choixpeau")({
  head: () => ({
    meta: [
      { title: "Le Choixpeau — Découvrez votre maison de Poudlard" },
      {
        name: "description",
        content:
          "Huit questions et le Choixpeau rend son verdict : Gryffondor, Serpentard, Serdaigle ou Poufsouffle.",
      },
      { property: "og:title", content: "Le Choixpeau — Découvrez votre maison" },
      {
        property: "og:description",
        content: "Répondez à l'interrogatoire du Choixpeau et recevez votre blason.",
      },
    ],
  }),
  component: Choixpeau,
});

function Choixpeau() {
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<Maison[]>([]);
  const [selection, setSelection] = useState<Maison | null>(null);

  const termine = index >= questionsChoixpeau.length;
  const question = questionsChoixpeau[index];

  function valider() {
    if (!selection) return;
    setChoix((c) => [...c, selection]);
    setSelection(null);
    setIndex((i) => i + 1);
  }

  function recommencer() {
    setChoix([]);
    setSelection(null);
    setIndex(0);
  }

  const maison = termine ? maisons[calculerMaison(choix)] : null;

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="mb-8 max-w-[40ch]">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
            Interrogatoire
          </p>
          <h1 className="text-balance font-display text-2xl font-semibold leading-tight sm:text-3xl">
            La voix du Choixpeau
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-6 sm:p-8">
            {!termine && question ? (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-brass-2">
                    Question {String(index + 1).padStart(2, "0")} /{" "}
                    {String(questionsChoixpeau.length).padStart(2, "0")}
                  </span>
                  <span className="text-xs italic text-muted-foreground">
                    Répondez avec honnêteté
                  </span>
                </div>
                <h2 className="text-balance font-display text-xl font-medium sm:text-2xl">
                  {question.question}
                </h2>
                <div className="mt-6 grid gap-3">
                  {question.reponses.map((r) => (
                    <label
                      key={r.texte}
                      className="flex cursor-pointer items-center gap-4 rounded-[12px] bg-foreground/5 px-4 py-3 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                    >
                      <input
                        type="radio"
                        name={`q${index}`}
                        checked={selection === r.maison}
                        onChange={() => setSelection(r.maison)}
                        className="size-4 shrink-0 accent-primary"
                      />
                      <span className="text-sm text-foreground/80">{r.texte}</span>
                    </label>
                  ))}
                </div>
                <button
                  onClick={valider}
                  disabled={!selection}
                  className="mt-6 inline-flex items-center rounded-[10px] bg-primary py-2 pl-3 pr-4 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  <span className="mr-2">✦</span>
                  {index === questionsChoixpeau.length - 1 ? "Rendre le verdict" : "Continuer"}
                </button>
              </>
            ) : (
              <>
                <h2 className="font-display text-xl font-medium sm:text-2xl">
                  L'interrogatoire est clos.
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Le Choixpeau a parlé. Votre blason est scellé sur le parchemin voisin.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    onClick={recommencer}
                    className="inline-flex items-center rounded-[10px] bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
                  >
                    Repasser l'épreuve
                  </button>
                  <Link
                    to="/jeux"
                    className="inline-flex items-center rounded-[10px] px-4 py-2 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                  >
                    Aller aux mini-jeux
                  </Link>
                </div>
              </>
            )}
          </div>

          <div className="panel p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-brass-2">
              Votre verdict
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              {maison ? `Poudlard · ${maison.nom}` : "Poudlard · en attente"}
            </h2>
            <div className="my-6 grid place-items-center rounded-[12px] bg-ink-2/60 py-10 ring-1 ring-border">
              <div
                className="grid h-20 w-20 place-items-center rounded-full ring-1 ring-brass/50"
                style={{
                  background: maison
                    ? `linear-gradient(to bottom right, color-mix(in oklab, ${maison.couleur} 70%, transparent), color-mix(in oklab, ${maison.couleur} 15%, transparent))`
                    : "linear-gradient(to bottom right, color-mix(in oklab, var(--brass) 40%, transparent), transparent)",
                }}
              >
                <span className="font-display text-2xl font-semibold text-brass-2">
                  {maison ? maison.initiale : "?"}
                </span>
              </div>
            </div>
            {maison ? (
              <>
                <p className="mb-3 italic text-muted-foreground">{maison.devise}</p>
                <ul className="space-y-2 text-pretty text-sm text-muted-foreground">
                  {maison.traits.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="text-brass-2">✦</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Répondez aux {questionsChoixpeau.length} questions pour que le Choixpeau tranche.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
