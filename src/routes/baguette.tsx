import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { Salle, EnTetePage, Cadre, SeparateurOrne } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeBaguette, IconeEtoile, Ornement } from "@/components/immersif/Icones";
import { useJoueur } from "@/lib/joueur-context";
import {
  bois as listeBois,
  coeurs,
  souplesses,
  verdictOllivander,
  type Bois,
  type Coeur,
} from "@/lib/identite";

export const Route = createFileRoute("/baguette")({
  head: () => ({
    meta: [
      { title: "Chez Ollivander — La baguette choisit le sorcier" },
      {
        name: "description",
        content:
          "Entrez dans l'échoppe d'Ollivander : trois essais, un bois, un cœur magique, et la baguette qui vous revient de droit.",
      },
      { property: "og:title", content: "Chez Ollivander — Potter Quest" },
      {
        property: "og:description",
        content: "Le rituel de la baguette : essais, étincelles et verdict du fabricant.",
      },
    ],
  }),
  component: PageBaguette,
});

type Etape = "seuil" | "essais" | "bois" | "coeur" | "verdict";

/* Trois essais ratés avant la bonne baguette : c'est la tradition de l'échoppe. */
const essais = [
  {
    texte: "Frêne et crin de licorne, vingt-huit centimètres, plutôt souple.",
    reaction: "Un vase de verre explose au fond de la boutique. « Non. Non, décidément non. »",
  },
  {
    texte: "Érable et ventricule de dragon, trente centimètres, rigide.",
    reaction:
      "Les tiroirs claquent tous en même temps. Ollivander sourit : « Intéressant. Mais pas encore. »",
  },
  {
    texte: "Sureau et plume de phénix, trente-quatre centimètres, inflexible.",
    reaction:
      "La lumière baisse d'un coup. Il vous la retire des mains sans un mot et referme la boîte.",
  },
] as const;

function PageBaguette() {
  const { joueur, definirBaguette } = useJoueur();
  const deja = joueur?.baguette ?? null;
  const [etape, setEtape] = useState<Etape>(deja ? "verdict" : "seuil");
  const [essai, setEssai] = useState(0);
  const [choixBois, setChoixBois] = useState<Bois | null>(null);
  const [choixCoeur, setChoixCoeur] = useState<Coeur | null>(null);

  const baguette = useMemo(() => {
    if (deja) return deja;
    if (!choixBois || !choixCoeur) return null;
    const longueur = 22 + ((choixBois.nom.length * 3 + choixCoeur.nom.length) % 14);
    const souplesse = souplesses[(choixBois.nom.length + choixCoeur.nom.length) % souplesses.length]!;
    return {
      bois: choixBois.nom,
      coeur: choixCoeur.nom,
      longueur,
      souplesse,
      verdict: verdictOllivander(choixBois, choixCoeur, joueur?.maison ?? null),
    };
  }, [deja, choixBois, choixCoeur, joueur?.maison]);

  function sceller() {
    if (!baguette) return;
    definirBaguette(baguette);
    setEtape("verdict");
  }

  return (
    <Salle large>
      <EnTetePage
        surtitre="Chemin de Traverse — échoppe n° 375"
        titre="Ollivander"
        icone={<IconeBaguette />}
        intro="Une poussière ancienne, des milliers de boîtes empilées jusqu'au plafond, et une voix derrière vous : « Je me demandais quand je vous verrais. »"
      />

      {etape === "seuil" ? (
        <Reveler>
          <Cadre ton="parchemin" className="mx-auto max-w-2xl text-center">
            <p className="text-base leading-relaxed text-[oklch(0.22_0.03_60)]">
              « Souvenez-vous d'une chose : ce n'est pas le sorcier qui choisit la baguette. C'est la
              baguette qui choisit le sorcier. »
            </p>
            <SeparateurOrne className="my-6" />
            <button
              type="button"
              onClick={() => setEtape("essais")}
              className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-[oklch(0.25_0.05_40)] underline decoration-[oklch(0.55_0.1_70)] underline-offset-8"
            >
              Tendre la main
            </button>
          </Cadre>
        </Reveler>
      ) : null}

      {etape === "essais" ? (
        <Reveler>
          <Cadre className="mx-auto max-w-2xl">
            <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-or/70">
              Essai {essai + 1} / {essais.length}
            </p>
            <h2 className="titre-monument mt-4 text-2xl">{essais[essai]!.texte}</h2>
            <p className="annotation mt-4 text-base">{essais[essai]!.reaction}</p>
            <SeparateurOrne className="my-6" />
            <button
              type="button"
              onClick={() => (essai + 1 < essais.length ? setEssai(essai + 1) : setEtape("bois"))}
              className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-or hover:text-parchemin"
            >
              {essai + 1 < essais.length ? "Essayer une autre boîte" : "Il en reste une, tout au fond"}
            </button>
          </Cadre>
        </Reveler>
      ) : null}

      {etape === "bois" ? (
        <Reveler>
          <p className="annotation mb-6 text-center text-base">
            Il pose huit boîtes devant vous et attend. Une seule vous attire vraiment.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {listeBois.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  setChoixBois(b);
                  setEtape("coeur");
                }}
                className="group text-left"
              >
                <Cadre className="h-full transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <Ornement className="h-2 w-2 text-or/50" />
                    <h3 className="font-titre text-lg text-parchemin">{b.nom}</h3>
                  </div>
                  <p className="annotation mt-3 text-sm leading-relaxed">{b.texte}</p>
                </Cadre>
              </button>
            ))}
          </div>
        </Reveler>
      ) : null}

      {etape === "coeur" ? (
        <Reveler>
          <p className="annotation mb-6 text-center text-base">
            « {choixBois?.nom}. Bien. Reste à savoir ce qui battra à l'intérieur. »
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {coeurs.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setChoixCoeur(c)}
                className="group text-left"
              >
                <Cadre
                  className={`h-full transition-transform duration-500 group-hover:-translate-y-1 ${
                    choixCoeur?.id === c.id ? "shadow-[inset_0_0_0_1px_var(--or)]" : ""
                  }`}
                >
                  <h3 className="font-titre text-lg text-parchemin">{c.nom}</h3>
                  <p className="annotation mt-3 text-sm leading-relaxed">{c.texte}</p>
                </Cadre>
              </button>
            ))}
          </div>
          {choixCoeur ? (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={sceller}
                className="font-display text-[0.65rem] uppercase tracking-[0.35em] text-or hover:text-parchemin"
              >
                Refermer la main sur la baguette
              </button>
            </div>
          ) : null}
        </Reveler>
      ) : null}

      {etape === "verdict" && baguette ? (
        <Reveler>
          <Cadre ton="parchemin" className="mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-4 flex w-fit items-center gap-3 text-[oklch(0.4_0.08_60)]">
              <IconeEtoile className="h-4 w-4" />
              <span className="font-display text-[0.55rem] uppercase tracking-[0.4em]">
                Registre d'Ollivander
              </span>
              <IconeEtoile className="h-4 w-4" />
            </div>
            <h2 className="font-titre text-3xl text-[oklch(0.2_0.04_40)]">
              {baguette.bois}, {baguette.coeur.toLowerCase()}
            </h2>
            <p className="mt-2 text-[oklch(0.3_0.03_50)]">
              {baguette.longueur} centimètres — {baguette.souplesse}
            </p>
            <SeparateurOrne className="my-6" />
            <p className="text-base italic leading-relaxed text-[oklch(0.25_0.03_50)]">
              « {baguette.verdict} »
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <Link
                to="/patronus"
                className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-[oklch(0.25_0.05_40)] underline decoration-[oklch(0.55_0.1_70)] underline-offset-8"
              >
                Apprendre le Patronus
              </Link>
              <Link
                to="/sorcier"
                className="font-display text-[0.62rem] uppercase tracking-[0.3em] text-[oklch(0.35_0.03_50)] underline decoration-transparent underline-offset-8 hover:decoration-[oklch(0.55_0.1_70)]"
              >
                Mon registre
              </Link>
            </div>
          </Cadre>
        </Reveler>
      ) : null}
    </Salle>
  );
}
