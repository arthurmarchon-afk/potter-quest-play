import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { calculerMaison, maisons, questionsChoixpeau, type Maison } from "@/lib/choixpeau";
import { HouseBadge } from "@/components/jeu/HouseBadge";
import { StatLine } from "@/components/jeu/PlayerSummary";
import { statsInitiales, statsMeta, type Stat } from "@/lib/joueur";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, Jauge, Sceau } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeChoixpeau, IconeEtoile } from "@/components/immersif/Icones";

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
    const t = setTimeout(() => setEtapeReveal((e) => e + 1), 1300);
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
    <Salle large>
      <EnTetePage
        surtitre="Cérémonie de répartition"
        titre="La voix du Choixpeau"
        icone={<IconeChoixpeau />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="plaque p-6 sm:p-8">
          {!termine && question ? (
            <>
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-or">
                  Question {String(index + 1).padStart(2, "0")} /{" "}
                  {String(questionsChoixpeau.length).padStart(2, "0")}
                </span>
                <span className="annotation text-xs">Répondez avec honnêteté</span>
              </div>
              <Jauge valeur={progression} className="mb-6" />
              <h2 className="titre-monument text-xl">{question.question}</h2>
              <div className="mt-6 grid gap-3">
                {question.reponses.map((r) => (
                  <label
                    key={r.texte}
                    className={`flex cursor-pointer items-center gap-4 rounded-[3px] px-4 py-3 ring-1 transition-transform hover:-translate-y-0.5 ${
                      selection === r.maison
                        ? "bg-or/15 ring-or/50"
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
                className="bouton-magique mt-6 px-5 py-2.5 text-[0.6rem] disabled:opacity-40"
              >
                {index === questionsChoixpeau.length - 1 ? "Rendre le verdict" : "Continuer"}
              </button>
            </>
          ) : (
            <>
              <h2 className="titre-monument text-xl">
                {revele ? "Le Choixpeau a tranché." : "Le Choixpeau réfléchit…"}
              </h2>

              {!revele && (
                <div className="relative mt-8 grid place-items-center">
                  <span
                    aria-hidden
                    className="chandelle absolute h-40 w-40 rounded-full bg-[oklch(0.85_0.1_85/25%)] blur-3xl"
                  />
                  <span className="relative sceau h-16 w-16 [&>svg]:h-6 [&>svg]:w-6">
                    <IconeChoixpeau />
                  </span>
                </div>
              )}

              <div className="mt-6 space-y-3">
                {murmures.slice(0, Math.max(0, etapeReveal + 1)).map((m) => (
                  <Reveler key={m} as="p">
                    <p className="annotation text-lg">« {m} »</p>
                  </Reveler>
                ))}
              </div>

              {revele && maisonCle && (
                <div className="mt-8 space-y-4">
                  {!joueur ? (
                    <form
                      className="rounded-[3px] bg-foreground/5 p-4 ring-1 ring-border"
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
                          className="min-w-[180px] flex-1 rounded-[3px] bg-background/60 px-4 py-2.5 outline-none ring-1 ring-border focus:ring-primary"
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
                      Maison scellée dans le profil de {joueur.nom}.
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <Link to="/sorcier" className="bouton-magique px-5 py-2.5 text-[0.6rem]">
                      Voir mon sorcier
                    </Link>
                    <Link
                      to="/jeux"
                      className="inline-flex items-center rounded-[3px] px-4 py-2 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                    >
                      Aller aux mini-jeux
                    </Link>
                    <button
                      onClick={recommencer}
                      className="inline-flex items-center rounded-[3px] px-4 py-2 text-sm font-medium text-parchemin/60 ring-1 ring-border transition-transform hover:-translate-y-0.5"
                    >
                      Repasser l'épreuve
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="plaque p-6 sm:p-8">
          <p className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-or">
            Votre verdict
          </p>
          <h2 className="titre-monument mt-3 text-2xl">
            {revele && maison ? `Poudlard · ${maison.nom}` : "Poudlard · en attente"}
          </h2>
          <div className="my-6 grid place-items-center rounded-[3px] bg-black/40 py-10 ring-1 ring-border">
            {revele && maisonCle ? (
              <div className="relative text-center">
                <span
                  aria-hidden
                  className="scintille absolute -inset-6 rounded-full bg-[oklch(0.82_0.1_82/35%)] blur-2xl"
                />
                <div className="relative">
                  <HouseBadge maison={maisonCle} taille="lg" />
                  <p className="mt-4 font-display text-lg uppercase tracking-[0.25em] text-candle">
                    {maisons[maisonCle].nom}
                  </p>
                </div>
                <span className="sceau absolute -bottom-3 -right-3 h-9 w-9 [&>svg]:h-3.5 [&>svg]:w-3.5">
                  <IconeEtoile />
                </span>
              </div>
            ) : (
              <span className="sceau h-20 w-20 [&>svg]:h-8 [&>svg]:w-8">
                <IconeChoixpeau />
              </span>
            )}
          </div>
          {revele && maison && maisonCle ? (
            <>
              <p className="annotation mb-3 text-base">{maison.devise}</p>
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
    </Salle>
  );
}
