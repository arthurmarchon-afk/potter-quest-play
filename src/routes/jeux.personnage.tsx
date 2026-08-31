import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";

export const Route = createFileRoute("/jeux/personnage")({
  head: () => ({
    meta: [
      { title: "Devine le Personnage — Énigmes de Poudlard" },
      {
        name: "description",
        content:
          "Trois indices, une identité : devinez le personnage du monde des sorciers le plus vite possible.",
      },
      { property: "og:title", content: "Devine le Personnage" },
      {
        property: "og:description",
        content: "Trouvez le sorcier caché derrière les indices du grimoire.",
      },
    ],
  }),
  component: DevinePersonnage,
});

type Perso = { nom: string; indices: [string, string, string] };

const persos: Perso[] = [
  {
    nom: "Rubeus Hagrid",
    indices: [
      "Cette personne aime beaucoup les créatures que les autres jugent dangereuses.",
      "Elle habite une cabane en lisière de la Forêt interdite.",
      "Elle est garde-chasse de Poudlard et possède un parapluie rose.",
    ],
  },
  {
    nom: "Minerva McGonagall",
    indices: [
      "Elle est stricte mais profondément juste.",
      "C'est une Animagus qui se transforme en chat tigré.",
      "Elle dirige la maison Gryffondor et enseigne la métamorphose.",
    ],
  },
  {
    nom: "Severus Rogue",
    indices: [
      "Peu de personnes connaissent ses véritables loyautés.",
      "Il maîtrise l'Occlumancie et déteste les cours de potions bâclés.",
      "Il est le directeur de la maison Serpentard.",
    ],
  },
  {
    nom: "Luna Lovegood",
    indices: [
      "Elle croit à des créatures que personne d'autre ne voit.",
      "Elle lit le journal Le Chicaneur à l'envers.",
      "Élève de Serdaigle, elle porte des boucles d'oreilles en radis.",
    ],
  },
  {
    nom: "Dobby",
    indices: [
      "Il ferait tout pour protéger un certain élève.",
      "Il adore les chaussettes.",
      "C'est un elfe de maison libéré par une chaussette dans un carnet.",
    ],
  },
  {
    nom: "Sirius Black",
    indices: [
      "Il a passé douze ans injustement emprisonné.",
      "Son Animagus est un grand chien noir.",
      "Il est le parrain de Harry Potter.",
    ],
  },
  {
    nom: "Hermione Granger",
    indices: [
      "Cette personne passe le plus clair de son temps à la bibliothèque.",
      "Elle a utilisé un Retourneur de Temps en troisième année.",
      "Elle est née de parents moldus et fonde la S.A.L.E.",
    ],
  },
  {
    nom: "Albus Dumbledore",
    indices: [
      "On lui prête la plus grande sagesse de son époque.",
      "Son phénix se nomme Fumseck.",
      "Il est directeur de Poudlard et détenteur de la Baguette de Sureau.",
    ],
  },
  {
    nom: "Bellatrix Lestrange",
    indices: [
      "Elle rit lorsqu'elle jette des sorts terribles.",
      "Elle s'est évadée d'Azkaban avec fierté.",
      "C'est la plus fidèle partisane de Voldemort et la cousine de Sirius.",
    ],
  },
  {
    nom: "Ron Weasley",
    indices: [
      "Cette personne vient d'une grande famille de sorciers roux.",
      "Elle est excellente aux échecs version sorcier.",
      "Elle a longtemps possédé un rat nommé Croûtard.",
    ],
  },
  {
    nom: "Drago Malefoy",
    indices: [
      "Cette personne se vante souvent de son nom de famille.",
      "Son père siège au conseil d'administration de Poudlard.",
      "Attrapeur de Serpentard, il déteste Harry Potter.",
    ],
  },
  {
    nom: "Neville Londubat",
    indices: [
      "Cette personne était réputée maladroite à ses débuts.",
      "Elle excelle en botanique.",
      "Elle a tranché la tête de Nagini avec l'épée de Gryffondor.",
    ],
  },
];

type Niveau = "apprenti" | "sorcier" | "mage";

const niveaux: Record<
  Niveau,
  { label: string; manches: number; choix: number; texte: string; mult: number }
> = {
  apprenti: { label: "Apprenti", manches: 5, choix: 3, texte: "3 propositions, 5 énigmes.", mult: 1 },
  sorcier: { label: "Sorcier", manches: 6, choix: 4, texte: "4 propositions, 6 énigmes.", mult: 2 },
  mage: { label: "Mage", manches: 8, choix: 6, texte: "6 propositions, 8 énigmes.", mult: 3 },
};

function melanger<T>(t: T[]): T[] {
  const a = [...t];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

type Manche = { perso: Perso; options: string[] };

function construire(n: Niveau): Manche[] {
  const cfg = niveaux[n];
  return melanger(persos)
    .slice(0, cfg.manches)
    .map((perso) => {
      const leurres = melanger(persos.filter((p) => p.nom !== perso.nom))
        .slice(0, cfg.choix - 1)
        .map((p) => p.nom);
      return { perso, options: melanger([perso.nom, ...leurres]) };
    });
}

function DevinePersonnage() {
  const { joueur, gagner, signalerPartie } = useJoueur();
  const [niveau, setNiveau] = useState<Niveau>("sorcier");
  const [manches, setManches] = useState<Manche[]>(() => construire("sorcier"));
  const [index, setIndex] = useState(0);
  const [indices, setIndices] = useState(1);
  const [points, setPoints] = useState(0);
  const [trouves, setTrouves] = useState(0);
  const [reponse, setReponse] = useState<string | null>(null);
  const [fini, setFini] = useState(false);
  const compte = useRef(false);

  const cfg = niveaux[niveau];
  const manche = manches[index];

  const rejouer = useCallback((n: Niveau) => {
    setNiveau(n);
    setManches(construire(n));
    setIndex(0);
    setIndices(1);
    setPoints(0);
    setTrouves(0);
    setReponse(null);
    setFini(false);
    compte.current = false;
  }, []);

  const repondre = useCallback(
    (choix: string) => {
      if (reponse || !manche) return;
      setReponse(choix);
      if (choix === manche.perso.nom) {
        setTrouves((t) => t + 1);
        setPoints((p) => p + (4 - indices));
      }
      setTimeout(() => {
        setReponse(null);
        setIndices(1);
        setIndex((i) => {
          if (i + 1 >= manches.length) {
            setFini(true);
            return i;
          }
          return i + 1;
        });
      }, 1200);
    },
    [reponse, manche, indices, manches.length],
  );

  useEffect(() => {
    if (!fini || compte.current || !joueur) return;
    compte.current = true;
    const parfait = trouves === manches.length;
    signalerPartie({ victoire: trouves > manches.length / 2, bonnes: trouves, parfait });
    gagner(
      {
        xp: (20 + points * 15) * cfg.mult,
        gallions: (8 + trouves * 8) * cfg.mult,
        points: parfait ? 10 * cfg.mult : 0,
        ...(parfait ? { stat: { cle: "intelligence" as const, valeur: 1 } } : {}),
      },
      `🔍 Devine le Personnage — ${trouves}/${manches.length}`,
    );
  }, [fini, joueur, trouves, points, manches.length, cfg.mult, gagner, signalerPartie]);

  return (
    <section>
      <div className="mx-auto max-w-3xl px-6 py-12 lg:py-20">
        <Link to="/jeux" className="text-sm text-or hover:underline">
          ← Salle des mini-jeux
        </Link>
        <h1 className="mt-4 titre-cinema text-2xl text-parchemin sm:text-4xl">
          Devine le Personnage
        </h1>
        <p className="mt-2 text-sm text-parchemin/60">
          {cfg.texte} Moins vous demandez d'indices, plus vous marquez de points.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          {(Object.keys(niveaux) as Niveau[]).map((n) => (
            <button
              key={n}
              onClick={() => rejouer(n)}
              className={`rounded-[10px] px-3 py-2 text-sm font-medium ring-1 transition-colors ${
                n === niveau
                  ? "bg-primary/15 text-primary ring-primary/40"
                  : "text-parchemin/60 ring-border hover:text-foreground"
              }`}
            >
              {niveaux[n].label}
            </button>
          ))}
        </div>

        <div className="panel mt-6 p-5">
          {!fini && manche ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
                <span className="text-parchemin/60">
                  Énigme {index + 1} / {manches.length}
                </span>
                <span className="text-or">
                  {trouves} trouvé(s) · {points} pts
                </span>
              </div>

              <ul className="mt-4 space-y-2">
                {manche.perso.indices.slice(0, indices).map((ind, i) => (
                  <li key={ind} className="rounded-[12px] bg-primary/10 px-4 py-3 text-sm">
                    <span className="mr-2 text-or">Indice {i + 1}</span>
                    {ind}
                  </li>
                ))}
              </ul>

              {indices < 3 && !reponse && (
                <button
                  onClick={() => setIndices((i) => i + 1)}
                  className="mt-3 rounded-[10px] px-3 py-2 text-sm text-or ring-1 ring-border hover:text-foreground"
                >
                  Demander un indice de plus (−1 pt)
                </button>
              )}

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {manche.options.map((o) => {
                  const estBon = o === manche.perso.nom;
                  const choisi = reponse === o;
                  const style = !reponse
                    ? "ring-border hover:-translate-y-0.5 hover:text-foreground"
                    : estBon
                      ? "bg-emeraude/20 text-foreground ring-emeraude/50"
                      : choisi
                        ? "bg-destructive/15 text-foreground ring-destructive/40"
                        : "ring-border opacity-60";
                  return (
                    <button
                      key={o}
                      onClick={() => repondre(o)}
                      disabled={!!reponse}
                      className={`rounded-[12px] px-4 py-3 text-left text-sm ring-1 transition-all ${style}`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center">
              <p className="font-display text-xl">
                {trouves === manches.length
                  ? "Aucune identité ne vous échappe !"
                  : "Le grimoire garde encore quelques secrets."}
              </p>
              <p className="mt-2 text-sm text-parchemin/60">
                {trouves} / {manches.length} personnages trouvés — {points} points d'énigme
              </p>
              <button
                onClick={() => rejouer(niveau)}
                className="bouton-magique px-5 py-2.5 text-[0.6rem] mt-5"
              >
                Rejouer
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
