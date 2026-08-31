import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, ChoixGrave } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeLivre, IconeSablier, Ornement } from "@/components/immersif/Icones";

export const Route = createFileRoute("/jeux/quiz")({
  head: () => ({
    meta: [
      { title: "Le Quiz du Professeur — Testez votre savoir sorcier" },
      {
        name: "description",
        content:
          "Questions sur les sortilèges, les créatures et l'histoire de Poudlard, en trois niveaux de difficulté avec chronomètre.",
      },
      { property: "og:title", content: "Le Quiz du Professeur" },
      {
        property: "og:description",
        content: "Des questions chronométrées pour éprouver votre savoir sorcier.",
      },
    ],
  }),
  component: Quiz,
});

type Question = { q: string; r: string[]; bonne: number; d: 1 | 2 | 3 };

const banque: Question[] = [
  { q: "Quel sortilège permet d'allumer le bout de sa baguette ?", r: ["Lumos", "Nox", "Incendio", "Sonorus"], bonne: 0, d: 1 },
  { q: "Quelle créature garde les coffres de Gringotts dans les profondeurs ?", r: ["Un hippogriffe", "Un dragon", "Un troll", "Un basilic"], bonne: 1, d: 1 },
  { q: "Comment s'appelle le gardien des clés de Poudlard ?", r: ["Argus Rusard", "Rubeus Hagrid", "Horace Slughorn", "Filius Flitwick"], bonne: 1, d: 1 },
  { q: "Quel est le sortilège de désarmement ?", r: ["Stupéfix", "Petrificus Totalus", "Expelliarmus", "Impedimenta"], bonne: 2, d: 1 },
  { q: "Quelle potion procure une chance insolente ?", r: ["Felix Felicis", "Polynectar", "Amortentia", "Veritaserum"], bonne: 0, d: 2 },
  { q: "Que voit-on dans le Miroir du Riséd ?", r: ["Le passé", "L'avenir", "Le désir le plus profond", "Ses peurs"], bonne: 2, d: 1 },
  { q: "Quelle balle vaut cent cinquante points au Quidditch ?", r: ["Le Souafle", "Le Cognard", "Le Vif d'or", "Le Percuteur"], bonne: 2, d: 1 },
  { q: "Quel animal représente la maison Serdaigle ?", r: ["Un aigle", "Un corbeau", "Un blaireau", "Un serpent"], bonne: 0, d: 1 },
  { q: "Contre quoi le sortilège Riddikulus est-il utilisé ?", r: ["Un détraqueur", "Un épouvantard", "Un inferi", "Un strangulot"], bonne: 1, d: 2 },
  { q: "Où se trouve l'entrée de la salle commune de Serpentard ?", r: ["Dans une tour", "Près des cuisines", "Dans les cachots", "Sous le lac gelé"], bonne: 2, d: 2 },
  { q: "Quel est le patronus de Severus Rogue ?", r: ["Une biche", "Un cerf", "Une loutre", "Un phénix"], bonne: 0, d: 2 },
  { q: "Quelle matière compose le cœur de la baguette d'Harry ?", r: ["Ventricule de dragon", "Crin de licorne", "Plume de phénix", "Nerf de troll"], bonne: 2, d: 2 },
  { q: "Comment se nomme le journal intime de Jedusor devenu Horcruxe ?", r: ["Le carnet de Tom Jedusor", "Le grimoire d'Ombrage", "Le registre de Binns", "Le livret de Rogue"], bonne: 0, d: 2 },
  { q: "Quel professeur enseigne la métamorphose en 1991 ?", r: ["Pomona Chourave", "Minerva McGonagall", "Sibylle Trelawney", "Charity Burbage"], bonne: 1, d: 1 },
  { q: "Quel sort révèle les personnes cachées sur la Carte du Maraudeur ?", r: ["Revelio", "Méfait accompli", "Je jure solennellement que mes intentions sont mauvaises", "Lumos Maxima"], bonne: 2, d: 3 },
  { q: "Quelle plante hurle mortellement lorsqu'on la déterre adulte ?", r: ["Le filet du diable", "La mandragore", "Le tentacula vénéneux", "L'asphodèle"], bonne: 1, d: 2 },
  { q: "Qui fonda l'Ordre du Phénix ?", r: ["Albus Dumbledore", "Alastor Maugrey", "Sirius Black", "Kingsley Shacklebolt"], bonne: 0, d: 3 },
  { q: "Combien d'usages du sang de dragon Dumbledore a-t-il découverts ?", r: ["Sept", "Neuf", "Douze", "Trois"], bonne: 2, d: 3 },
  { q: "Quel est le vrai nom du Baron Sanglant ?", r: ["Un ancien élève de Serpentard", "Un professeur de potions", "Un Gobelin", "Un Maraudeur"], bonne: 0, d: 3 },
  { q: "Quelle créature attire les objets brillants dans la banque des sorciers ?", r: ["Le Niffleur", "Le Botruc", "Le Veaudelune", "Le Focifère"], bonne: 0, d: 3 },
];

type Niveau = "apprenti" | "sorcier" | "mage";

const niveaux: Record<Niveau, { label: string; max: 1 | 2 | 3; nb: number; chrono: number | null; texte: string }> = {
  apprenti: { label: "Apprenti", max: 1, nb: 8, chrono: null, texte: "Questions de base, aucun chronomètre." },
  sorcier: { label: "Sorcier", max: 2, nb: 10, chrono: 20, texte: "Questions mêlées, 20 secondes par question." },
  mage: { label: "Mage", max: 3, nb: 12, chrono: 10, texte: "Les questions les plus retorses, 10 secondes chrono." },
};

const optionsNiveau = (Object.keys(niveaux) as Niveau[]).map((n) => ({
  valeur: n,
  libelle: niveaux[n].label,
}));

function tirer(niveau: Niveau): Question[] {
  const conf = niveaux[niveau];
  const pool = banque.filter((q) => q.d <= conf.max);
  const melange = [...pool];
  for (let i = melange.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [melange[i], melange[j]] = [melange[j]!, melange[i]!];
  }
  return melange.slice(0, Math.min(conf.nb, melange.length));
}

function Quiz() {
  const { joueur, gagner, signalerPartie } = useJoueur();
  const recompense = useRef(false);
  const [niveau, setNiveau] = useState<Niveau>("sorcier");
  const conf = niveaux[niveau];
  const [liste, setListe] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [fini, setFini] = useState(false);
  const [temps, setTemps] = useState<number>(conf.chrono ?? 0);

  const recommencer = useCallback(() => {
    setListe(tirer(niveau));
    setIndex(0);
    setChoix(null);
    setScore(0);
    setFini(false);
    setTemps(niveaux[niveau].chrono ?? 0);
  }, [niveau]);

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
        setTemps(conf.chrono ?? 0);
      }, 650);
    },
    [question, index, liste.length, conf.chrono],
  );

  useEffect(() => {
    if (fini || choix !== null || conf.chrono === null || !question) return;
    if (temps <= 0) {
      suivant(-1);
      return;
    }
    const t = setTimeout(() => setTemps((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [temps, fini, choix, conf.chrono, question, suivant]);

  useEffect(() => {
    if (!fini) {
      recompense.current = false;
      return;
    }
    if (recompense.current || !joueur || !liste.length) return;
    recompense.current = true;
    const mult = niveau === "mage" ? 3 : niveau === "sorcier" ? 2 : 1;
    gagner(
      {
        xp: score * 10 * mult,
        gallions: score * 4 * mult,
        points: score * 2 * mult,
        stat: { cle: "intelligence", valeur: score >= liste.length * 0.8 ? 1 : 0 },
      },
      `Quiz terminé — ${score}/${liste.length}`,
    );
    signalerPartie({
      victoire: score >= liste.length * 0.6,
      bonnes: score,
      parfait: score === liste.length,
    });
  }, [fini, joueur, liste.length, score, niveau, gagner, signalerPartie]);

  const mention = useMemo(() => {
    const ratio = liste.length ? score / liste.length : 0;
    if (ratio >= 0.9) return "Optimal. Le professeur vous accorde vingt points.";
    if (ratio >= 0.6) return "Effort acceptable. Relisez vos grimoires.";
    return "Troll. Retenue à la bibliothèque.";
  }, [score, liste.length]);

  const fractionTemps = conf.chrono ? temps / conf.chrono : 1;

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
        surtitre="Salle de classe"
        titre="Le Quiz du Professeur"
        intro="Des questions tirées des carnets de cours pour éprouver votre savoir sorcier."
        icone={<IconeLivre />}
      />

      <Reveler className="plaque relative p-6">
        <p className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-or/70">Niveau</p>
        <div className="mt-4">
          <ChoixGrave options={optionsNiveau} valeur={niveau} onChange={(v) => setNiveau(v as Niveau)} />
        </div>
        <p className="annotation mt-4 text-sm leading-relaxed">{conf.texte}</p>
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
                Question {index + 1} / {liste.length}
              </span>
              <span className="chiffre text-lg">{score}</span>
            </div>

            {conf.chrono !== null ? (
              <div className="mb-6 flex items-center justify-center gap-3">
                <IconeSablier
                  className="h-6 w-6 text-[oklch(0.36_0.08_50)]"
                  style={{ transform: `rotate(${(1 - fractionTemps) * 180}deg)`, transition: "transform 1s linear" }}
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
