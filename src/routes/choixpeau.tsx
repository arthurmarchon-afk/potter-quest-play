import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { calculerMaison, maisons, questionsChoixpeau, type Maison } from "@/lib/choixpeau";
import { HouseBadge } from "@/components/jeu/HouseBadge";
import { StatLine } from "@/components/jeu/PlayerSummary";
import { statsInitiales, statsMeta, type Stat } from "@/lib/joueur";
import { useJoueur } from "@/lib/joueur-context";

export const Route = createFileRoute("/choixpeau")({
  head: () => ({
    meta: [
      { title: "Le Choixpeau — Découvrez votre maison de Poudlard" },
      {
        name: "description",
        content:
          "Huit questions et le Choixpeau rend son verdict : Gryffondor, Serpentard, Serdaigle ou Poufsouffle, puis votre maison est scellée dans votre profil.",
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

const murmures = ["Hmm…", "Je vois en toi…", "Du caractère, oui… mais surtout…"];

function Choixpeau() {
  const { joueur, creerSorcier, definirMaison } = useJoueur();
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<Maison[]>([]);
  const [selection, setSelection] = useState<Maison | null>(null);
  const [etapeReveal, setEtapeReveal] = useState(-1);
  const [nom, setNom] = useState("");
  const scelle = useRef(false);

  const termine = index >= questionsChoixpeau.length;
  const question = questionsChoixpeau[index];
  const maisonCle = termine ? calculerMaison(choix) : null;
  const maison = maisonCle ? maisons[maisonCle] : null;
  const revele = etapeReveal >= murmures.length;

  useEffect(() => {
    if (!termine || etapeReveal < 0 || revele) return;
    const t = setTimeout(() => setEtapeReveal((e) => e + 1), 1100);
    return () => clearTimeout(t);
  }, [termine, etapeReveal, revele]);

  useEffect(() => {
    if (revele && maisonCle && joueur && !scelle.current) {
      scelle.current = true;
      definirMaison(maisonCle);
    }
  }, [revele, maisonCle, joueur, definirMaison]);

  function valider() {
    if (!selection) return;
    const suivant = index + 1;
    setChoix((c) => [...c, selection]);
    setSelection(null);
    setIndex(suivant);
    if (suivant >= questionsChoixpeau.length) setEtapeReveal(0);
  }

  function recommencer() {
    setChoix([]);
    setSelection(null);
    setIndex(0);
    setEtapeReveal(-1);
    scelle.current = false;
  }

  const progression = Math.round((index / questionsChoixpeau.length) * 100);
  const stats = Object.keys(statsMeta) as Stat[];

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <div className="mb-8 max-w-[40ch]">
          <p className="mb-3 font-display text-[0.62rem] uppercase tracking-[0.5em] text-or/70">
            Cérémonie de répartition
          </p>
          <h1 className="text-balance font-display text-2xl font-semibold leading-tight sm:text-3xl">
            La voix du Choixpeau
          </h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="panel p-6 sm:p-8">
            {!termine && question ? (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-[0.25em] text-or">
                    Question {String(index + 1).padStart(2, "0")} /{" "}
                    {String(questionsChoixpeau.length).padStart(2, "0")}
                  </span>
                  <span className="text-xs italic text-parchemin/60">
                    Répondez avec honnêteté
                  </span>
                </div>
                <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                  <div
                    className="h-full rounded-full bg-brass transition-[width] duration-500"
                    style={{ width: `${progression}%` }}
                  />
                </div>
                <h2 className="text-balance font-display text-xl font-medium sm:text-2xl">
                  {question.question}
                </h2>
                <div className="mt-6 grid gap-3">
                  {question.reponses.map((r) => (
                    <label
                      key={r.texte}
                      className={`flex cursor-pointer items-center gap-4 rounded-[12px] px-4 py-3 ring-1 transition-transform hover:-translate-y-0.5 ${
                        selection === r.maison
                          ? "bg-primary/15 ring-primary/50"
                          : "bg-foreground/5 ring-border"
                      }`}
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
                  {revele ? "Le Choixpeau a tranché." : "Le Choixpeau réfléchit…"}
                </h2>
                <div className="mt-4 space-y-2 text-parchemin/60">
                  {murmures.slice(0, Math.max(0, etapeReveal + 1)).map((m) => (
                    <p key={m} className="animate-fade-in italic">
                      « {m} »
                    </p>
                  ))}
                </div>

                {revele && maisonCle && (
                  <div className="mt-6 space-y-4">
                    {!joueur ? (
                      <form
                        className="rounded-[12px] bg-foreground/5 p-4 ring-1 ring-border"
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!nom.trim()) return;
                          creerSorcier(nom);
                          definirMaison(maisonCle);
                          scelle.current = true;
                        }}
                      >
                        <p className="text-sm text-foreground/80">
                          Inscrivez votre nom pour sceller cette maison dans votre profil.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <input
                            value={nom}
                            onChange={(e) => setNom(e.target.value)}
                            maxLength={24}
                            placeholder="Nom du sorcier"
                            className="min-w-[180px] flex-1 rounded-[10px] bg-background/60 px-4 py-2.5 outline-none ring-1 ring-border focus:ring-primary"
                          />
                          <button
                            type="submit"
                            disabled={!nom.trim()}
                            className="bouton-magique px-5 py-2.5 text-[0.6rem] disabled:opacity-40"
                          >
                            Sceller
                          </button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-sm text-or">
                        ✦ Maison enregistrée dans le profil de {joueur.nom}.
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                      <Link
                        to="/sorcier"
                        className="bouton-magique px-5 py-2.5 text-[0.6rem]"
                      >
                        🧙 Voir mon sorcier
                      </Link>
                      <Link
                        to="/jeux"
                        className="inline-flex items-center rounded-[10px] px-4 py-2 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                      >
                        🎮 Aller aux mini-jeux
                      </Link>
                      <button
                        onClick={recommencer}
                        className="inline-flex items-center rounded-[10px] px-4 py-2 text-sm font-medium text-parchemin/60 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                      >
                        Repasser l'épreuve
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="panel p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-or">
              Votre verdict
            </p>
            <h2 className="mt-3 font-display text-2xl font-semibold leading-tight">
              {revele && maison ? `Poudlard · ${maison.nom}` : "Poudlard · en attente"}
            </h2>
            <div className="my-6 grid place-items-center rounded-[12px] bg-ink-2/60 py-10 ring-1 ring-border">
              {revele && maisonCle ? (
                <div className="animate-scale-in text-center">
                  <HouseBadge maison={maisonCle} taille="lg" />
                  <p className="mt-4 font-display text-lg uppercase tracking-[0.25em] text-candle">
                    {maisons[maisonCle].nom}
                  </p>
                </div>
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-full text-2xl ring-1 ring-brass/50">
                  🎩
                </div>
              )}
            </div>
            {revele && maison && maisonCle ? (
              <>
                <p className="mb-3 italic text-parchemin/60">{maison.devise}</p>
                <ul className="space-y-2 text-pretty text-sm text-parchemin/60">
                  {maison.traits.map((t) => (
                    <li key={t} className="flex items-start gap-2">
                      <span className="text-or">✦</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <h3 className="mt-6 font-display text-base">Statistiques initiales</h3>
                <div className="mt-3 space-y-3">
                  {stats.map((s) => (
                    <StatLine key={s} cle={s} valeur={statsInitiales[maisonCle][s]} />
                  ))}
                </div>
              </>
            ) : (
              <p className="text-sm text-parchemin/60">
                Répondez aux {questionsChoixpeau.length} questions pour que le Choixpeau tranche.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
