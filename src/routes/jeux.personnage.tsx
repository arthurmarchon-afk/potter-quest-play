import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { Salle, EnTetePage, Cadre, ChoixGrave, SeparateurOrne } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeLoupe, IconeMedaille } from "@/components/immersif/Icones";

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

const optionsNiveau = (Object.keys(niveaux) as Niveau[]).map((n) => ({
  valeur: n,
  libelle: niveaux[n].label,
}));

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
      `Devine le Personnage — ${trouves}/${manches.length}`,
    );
  }, [fini, joueur, trouves, points, manches.length, cfg.mult, gagner, signalerPartie]);

  return (
    <Salle>
      <Link to="/jeux" className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-or/70 hover:text-or">
        Salle des mini-jeux
      </Link>

      <EnTetePage
        surtitre="Galerie des portraits"
        titre="Devine le Personnage"
        intro={`${cfg.texte} Moins vous demandez d'indices, plus vous marquez de points.`}
        icone={<IconeLoupe />}
        aside={
          <ChoixGrave label="Rang" options={optionsNiveau} valeur={niveau} onChange={(v) => rejouer(v as Niveau)} />
        }
      />

      <Reveler>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,17rem)_1fr]">
          {/* Cadre de portrait voilé de brume */}
          <div className="relative mx-auto aspect-[3/4] w-full max-w-[17rem] overflow-hidden rounded-[3px] border-[6px] border-double border-or/35 bg-gradient-to-b from-nuit via-pierre to-nuit shadow-[0_20px_50px_-25px_black]">
            <div
              className="pointer-events-none absolute inset-0 respire"
              style={{
                background:
                  "radial-gradient(60% 50% at 50% 40%, color-mix(in oklab, var(--parchemin) 18%, transparent), transparent 70%)",
              }}
              aria-hidden
            />
            <div className="absolute inset-0 grain opacity-40" aria-hidden />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
              <span className="sceau h-14 w-14 [&>svg]:h-6 [&>svg]:w-6">
                <IconeMedaille />
              </span>
              <p className="font-display text-[0.55rem] uppercase tracking-[0.35em] text-or/60">
                Portrait voilé
              </p>
              <p className="annotation text-sm text-parchemin/60">
                Percez le brouillard grâce aux indices révélés au parchemin.
              </p>
            </div>
            <div className="fondu-bas absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          <Cadre className="p-6 sm:p-8">
            {!fini && manche ? (
              <>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-display text-[0.6rem] uppercase tracking-[0.3em] text-parchemin/50">
                    Énigme {index + 1} / {manches.length}
                  </span>
                  <span className="chiffre text-base">
                    {trouves} trouvé(s) · {points} pts
                  </span>
                </div>

                <ul className="mt-5 space-y-3">
                  {manche.perso.indices.slice(0, indices).map((ind, i) => (
                    <li
                      key={ind}
                      className="reveler visible annotation rounded-[2px] border border-or/15 bg-black/25 px-4 py-3 text-base leading-relaxed"
                    >
                      <span className="mr-2 font-display text-[0.55rem] uppercase tracking-[0.3em] text-or/70 not-italic">
                        Indice {i + 1}
                      </span>
                      {ind}
                    </li>
                  ))}
                </ul>

                {indices < 3 && !reponse && (
                  <button
                    onClick={() => setIndices((i) => i + 1)}
                    className="mt-4 font-display text-[0.6rem] uppercase tracking-[0.3em] text-or/70 underline decoration-or/30 underline-offset-4 hover:text-or"
                  >
                    Demander un indice de plus (moins un point)
                  </button>
                )}

                <SeparateurOrne className="mt-5" />

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {manche.options.map((o) => {
                    const estBon = o === manche.perso.nom;
                    const choisi = reponse === o;
                    const style = !reponse
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
                        disabled={!!reponse}
                        className={`rounded-[2px] border bg-black/30 px-4 py-3 text-left text-sm transition-all ${style}`}
                      >
                        {o}
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="titre-monument text-2xl">
                  {trouves === manches.length
                    ? "Aucune identité ne vous échappe !"
                    : "Le grimoire garde encore quelques secrets."}
                </p>
                <p className="annotation mt-3 text-base">
                  {trouves} / {manches.length} personnages trouvés — {points} points d'énigme
                </p>
                <button onClick={() => rejouer(niveau)} className="bouton-magique mt-6">
                  Rejouer
                </button>
              </div>
            )}
          </Cadre>
        </div>
      </Reveler>
    </Salle>
  );
}
