import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, Cadre, ChoixGrave, Jauge, SeparateurOrne } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeBaguette, IconeSablier, IconeEclair } from "@/components/immersif/Icones";

export const Route = createFileRoute("/jeux/sorts")({
  head: () => ({
    meta: [
      { title: "Maître des Sorts — Duel d'incantations rapides" },
      {
        name: "description",
        content:
          "Retrouvez le bon sortilège avant la fin du sablier : un jeu de réflexes magiques à trois niveaux de difficulté.",
      },
      { property: "og:title", content: "Maître des Sorts" },
      {
        property: "og:description",
        content: "Associez chaque effet magique à son incantation, le plus vite possible.",
      },
    ],
  }),
  component: MaitreDesSorts,
});

type Sort = { nom: string; effet: string };

const grimoire: Sort[] = [
  { nom: "Lumos", effet: "Allume le bout de la baguette." },
  { nom: "Alohomora", effet: "Déverrouille portes et serrures." },
  { nom: "Expelliarmus", effet: "Désarme l'adversaire." },
  { nom: "Wingardium Leviosa", effet: "Fait léviter un objet." },
  { nom: "Expecto Patronum", effet: "Invoque un gardien argenté." },
  { nom: "Accio", effet: "Attire un objet à soi." },
  { nom: "Riddikulus", effet: "Ridiculise un épouvantard." },
  { nom: "Protego", effet: "Dresse un bouclier magique." },
  { nom: "Stupéfix", effet: "Assomme la cible." },
  { nom: "Reparo", effet: "Répare un objet brisé." },
  { nom: "Incendio", effet: "Produit une flamme." },
  { nom: "Aguamenti", effet: "Fait jaillir de l'eau." },
  { nom: "Divertimenti", effet: "Détourne l'attention d'un objet." },
  { nom: "Oubliettes", effet: "Efface un souvenir." },
  { nom: "Sonorus", effet: "Amplifie la voix." },
  { nom: "Petrificus Totalus", effet: "Pétrifie entièrement la cible." },
];

type Niveau = "apprenti" | "sorcier" | "mage";

const niveaux: Record<
  Niveau,
  { label: string; temps: number; choix: number; manches: number; texte: string; mult: number }
> = {
  apprenti: {
    label: "Apprenti",
    temps: 9,
    choix: 3,
    manches: 8,
    texte: "3 propositions, 9 secondes par incantation.",
    mult: 1,
  },
  sorcier: {
    label: "Sorcier",
    temps: 6,
    choix: 4,
    manches: 10,
    texte: "4 propositions, 6 secondes de réflexion.",
    mult: 2,
  },
  mage: {
    label: "Mage",
    temps: 4,
    choix: 5,
    manches: 12,
    texte: "5 propositions, 4 secondes : réflexes d'archimage.",
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

type Manche = { sort: Sort; options: string[] };

function construire(n: Niveau): Manche[] {
  const cfg = niveaux[n];
  return melanger(grimoire)
    .slice(0, cfg.manches)
    .map((sort) => {
      const leurres = melanger(grimoire.filter((s) => s.nom !== sort.nom))
        .slice(0, cfg.choix - 1)
        .map((s) => s.nom);
      return { sort, options: melanger([sort.nom, ...leurres]) };
    });
}

const optionsNiveau = (Object.keys(niveaux) as Niveau[]).map((n) => ({
  valeur: n,
  libelle: niveaux[n].label,
}));

function MaitreDesSorts() {
  const { joueur, gagner, signalerPartie } = useJoueur();
  const [niveau, setNiveau] = useState<Niveau>("sorcier");
  const [manches, setManches] = useState<Manche[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [serie, setSerie] = useState(0);
  const [meilleureSerie, setMeilleureSerie] = useState(0);
  const [reponse, setReponse] = useState<string | null>(null);
  const [reste, setReste] = useState(niveaux["sorcier"].temps);
  const [fini, setFini] = useState(false);
  const compte = useRef(false);

  // Tirage aléatoire uniquement après montage : évite tout écart d'hydratation.
  useEffect(() => {
    setManches(construire("sorcier"));
  }, []);

  const cfg = niveaux[niveau];
  const manche = manches[index];

  const rejouer = useCallback((n: Niveau) => {
    setNiveau(n);
    setManches(construire(n));
    setIndex(0);
    setScore(0);
    setSerie(0);
    setMeilleureSerie(0);
    setReponse(null);
    setReste(niveaux[n].temps);
    setFini(false);
    compte.current = false;
  }, []);

  const suivant = useCallback(() => {
    setReponse(null);
    setIndex((i) => {
      if (i + 1 >= manches.length) {
        setFini(true);
        return i;
      }
      setReste(cfg.temps);
      return i + 1;
    });
  }, [manches.length, cfg.temps]);

  const repondre = useCallback(
    (choix: string | null) => {
      if (reponse !== null || fini || !manche) return;
      const bon = choix === manche.sort.nom;
      setReponse(choix ?? "");
      if (bon) {
        setScore((s) => s + 1);
        setSerie((s) => {
          const n = s + 1;
          setMeilleureSerie((m) => Math.max(m, n));
          return n;
        });
      } else {
        setSerie(0);
      }
      setTimeout(suivant, 850);
    },
    [reponse, fini, manche, suivant],
  );

  useEffect(() => {
    if (fini || reponse !== null) return;
    if (reste <= 0) {
      repondre(null);
      return;
    }
    const t = setTimeout(() => setReste((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [reste, fini, reponse, repondre]);

  useEffect(() => {
    if (!fini || compte.current || !joueur) return;
    compte.current = true;
    const taux = score / manches.length;
    const victoire = taux >= 0.7;
    signalerPartie({ victoire, bonnes: score, parfait: score === manches.length });
    gagner(
      {
        xp: (25 + score * 12 + meilleureSerie * 5) * cfg.mult,
        gallions: (5 + score * 4) * cfg.mult,
        points: victoire ? 5 * cfg.mult : 0,
        ...(score === manches.length ? { stat: { cle: "magie" as const, valeur: 1 } } : {}),
      },
      `Maître des Sorts — ${score}/${manches.length}`,
    );
  }, [fini, joueur, score, manches.length, meilleureSerie, cfg.mult, gagner, signalerPartie]);

  const progression = useMemo(
    () => Math.round(((index + (fini ? 1 : 0)) / (manches.length || 1)) * 100),
    [index, fini, manches.length],
  );

  return (
    <Salle>
      <Link to="/jeux" className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-or/70 hover:text-or">
        Salle des mini-jeux
      </Link>

      <EnTetePage
        surtitre="Duel d'incantations"
        titre="Maître des Sorts"
        intro={`${cfg.texte} Foudroyez le bon sortilège avant que le sablier ne se vide.`}
        icone={<IconeBaguette />}
        aside={
          <ChoixGrave label="Rang" options={optionsNiveau} valeur={niveau} onChange={(v) => rejouer(v as Niveau)} />
        }
      />

      {!joueur && (
        <Reveler>
          <p className="annotation mb-6 text-sm">
            Créez votre sorcier sur la page{" "}
            <Link to="/sorcier" className="text-or hover:underline">
              Mon Sorcier
            </Link>{" "}
            pour gagner de l'XP.
          </p>
        </Reveler>
      )}

      <Reveler>
        <Cadre className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-parchemin/50">
              Manche {Math.min(index + 1, manches.length)} / {manches.length}
            </span>
            <span className="chiffre text-lg">Score {score}</span>
            <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-parchemin/50">
              Série {serie}
            </span>
            {!fini && (
              <span className="flex items-center gap-2 text-or">
                <IconeSablier className={`h-4 w-4 ${reste <= 2 ? "scintille" : ""}`} />
                <span className="chiffre text-base">{reste}s</span>
              </span>
            )}
          </div>
          <Jauge valeur={progression} className="mt-4" />

          {!fini && manche ? (
            <div className="mt-8">
              <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-or/70">Effet observé</p>
              <p className="annotation mt-3 text-xl leading-relaxed">{manche.sort.effet}</p>
              <SeparateurOrne className="mt-5" />
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {manche.options.map((o) => {
                  const estBon = o === manche.sort.nom;
                  const choisi = reponse === o;
                  const style =
                    reponse === null
                      ? "border-or/20 text-parchemin/80 hover:-translate-y-0.5 hover:border-or/50 hover:text-parchemin"
                      : estBon
                        ? "border-or/70 bg-or/10 text-parchemin scintille"
                        : choisi
                          ? "border-sang/70 bg-sang/20 text-parchemin"
                          : "border-or/10 text-parchemin/40";
                  return (
                    <button
                      key={o}
                      onClick={() => repondre(o)}
                      disabled={reponse !== null}
                      className={`rounded-[2px] border bg-black/30 px-4 py-3 text-left font-display text-sm uppercase tracking-[0.08em] transition-all ${style}`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center">
              <IconeEclair className="mx-auto h-8 w-8 text-or" />
              <p className="titre-monument mt-3 text-2xl">
                {score === manches.length
                  ? "Sans-faute ! Le grimoire vous salue."
                  : score / manches.length >= 0.7
                    ? "Belle maîtrise des incantations."
                    : "Encore quelques révisions au grimoire…"}
              </p>
              <p className="annotation mt-3 text-base">
                {score} bonnes réponses sur {manches.length} — meilleure série : {meilleureSerie}
              </p>
              <button onClick={() => rejouer(niveau)} className="bouton-magique mt-6">
                Rejouer
              </button>
            </div>
          )}
        </Cadre>
      </Reveler>
    </Salle>
  );
}
