import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { articles, categoriesMeta, type Categorie } from "@/lib/contenu";
import { Salle, EnTetePage, SeparateurOrne, ChoixGrave, Cadre } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeLivre, IconeCadenas, IconeParchemin } from "@/components/immersif/Icones";

export const Route = createFileRoute("/bibliotheque")({
  head: () => ({
    meta: [
      { title: "Bibliothèque — Encyclopédie sorcière | Potter Quest" },
      {
        name: "description",
        content:
          "Sortilèges, créatures, potions, objets et lieux : lisez les pages du grimoire et gagnez de l'XP à chaque découverte.",
      },
      { property: "og:title", content: "Bibliothèque — Potter Quest" },
      {
        property: "og:description",
        content: "L'encyclopédie de Poudlard : chaque page lue rapporte XP et Gallions.",
      },
    ],
  }),
  component: BibliothequePage,
});

const filtres: (Categorie | "tout")[] = [
  "tout",
  "sortileges",
  "creatures",
  "potions",
  "objets",
  "lieux",
];

function lettrine(titre: string) {
  return titre.charAt(0).toUpperCase();
}

function BibliothequePage() {
  const { joueur, pret, lireArticle } = useJoueur();
  const [filtre, setFiltre] = useState<Categorie | "tout">("tout");
  const [ouvert, setOuvert] = useState<string | null>(null);

  const niveau = joueur?.niveau ?? 1;
  const lues = useMemo(() => joueur?.decouvertes ?? [], [joueur]);

  const liste = articles.filter((a) => filtre === "tout" || a.categorie === filtre);

  function ouvrir(id: string, verrouille: boolean) {
    if (verrouille) return;
    setOuvert((o) => (o === id ? null : id));
    if (joueur && !lues.includes(id)) lireArticle(id);
  }

  return (
    <Salle large>
      <EnTetePage
        surtitre="La Réserve"
        titre="Bibliothèque"
        icone={<IconeLivre />}
        intro={`${lues.length} / ${articles.length} pages découvertes. Chaque première lecture rapporte de l'expérience — certaines pages restent scellées avant un certain niveau.`}
      />

      <Reveler className="mt-2">
        <ChoixGrave
          label="Rayon"
          valeur={filtre}
          onChange={(v) => setFiltre(v as Categorie | "tout")}
          options={filtres.map((f) => ({
            valeur: f,
            libelle: f === "tout" ? "Tout" : categoriesMeta[f].nom,
          }))}
        />
      </Reveler>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {liste.map((a, i) => {
          const lu = lues.includes(a.id);
          const verrouille = !lu && a.niveau > niveau;
          const actif = ouvert === a.id;
          return (
            <Reveler key={a.id} delai={(i % 6) * 60}>
              <article
                className={`relative overflow-hidden rounded-[3px] transition-transform duration-500 ${
                  verrouille ? "" : "cursor-pointer hover:-translate-y-1"
                }`}
                onClick={() => ouvrir(a.id, verrouille)}
              >
                {/* double page de grimoire */}
                <div
                  className={`parchemin relative grid grid-cols-[auto_1fr] gap-4 p-6 ${
                    verrouille ? "opacity-90" : ""
                  }`}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-y-3 left-1/2 w-px -translate-x-1/2 bg-black/15"
                  />
                  {verrouille ? (
                    <div className="absolute inset-0 grid place-items-center bg-black/55 backdrop-blur-[3px]">
                      <div className="sceau h-14 w-14 [&>svg]:h-6 [&>svg]:w-6">
                        <IconeCadenas />
                      </div>
                      <p className="absolute bottom-6 font-display text-[0.55rem] uppercase tracking-[0.4em] text-parchemin/80">
                        Niveau {a.niveau} requis
                      </p>
                    </div>
                  ) : null}

                  <span
                    aria-hidden
                    className="row-span-2 mt-1 flex h-14 w-14 shrink-0 items-center justify-center border border-black/20 bg-black/5 font-display text-3xl text-bordeaux"
                  >
                    {lettrine(a.titre)}
                  </span>

                  <div className="min-w-0">
                    <p className="font-display text-[0.55rem] uppercase tracking-[0.35em] text-bordeaux/70">
                      {categoriesMeta[a.categorie].nom}
                    </p>
                    <h2 className="titre-monument mt-1 text-xl !text-[oklch(0.22_0.02_60)] [text-shadow:none]">
                      {a.titre}
                    </h2>
                  </div>

                  <div className="col-span-2 mt-1">
                    <p className="annotation text-[1.02rem] leading-relaxed text-[oklch(0.22_0.02_60/85%)]">
                      {a.resume}
                    </p>
                    {actif && (
                      <p className="annotation mt-3 border-t border-black/15 pt-3 text-[1.02rem] leading-relaxed text-[oklch(0.22_0.02_60/85%)]">
                        {a.texte}
                      </p>
                    )}
                    <p className="mt-3 font-display text-[0.6rem] uppercase tracking-[0.25em] text-bordeaux/70">
                      {lu
                        ? "Page découverte"
                        : `Première lecture : ${a.recompense.xp ?? 0} XP${
                            a.recompense.gallions ? ` · ${a.recompense.gallions} Gallions` : ""
                          }`}
                    </p>
                  </div>
                </div>
              </article>
            </Reveler>
          );
        })}
      </div>

      {pret && !joueur && (
        <Link to="/sorcier" className="bouton-magique mt-10 px-5 py-2.5 text-[0.6rem]">
          <IconeParchemin className="h-4 w-4" /> Créer mon sorcier pour gagner de l'XP
        </Link>
      )}
    </Salle>
  );
}
