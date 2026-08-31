import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useJoueur } from "@/lib/joueur-context";
import { articles, categoriesMeta, type Categorie } from "@/lib/contenu";

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
    <section>
      <div className="mx-auto max-w-5xl px-6 py-14 lg:py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Rayon des connaissances
        </p>
        <h1 className="font-display text-3xl font-semibold">📚 Bibliothèque</h1>
        <p className="mt-4 max-w-[62ch] text-muted-foreground">
          {lues.length} / {articles.length} pages découvertes. Chaque première lecture rapporte
          de l'XP — certaines pages ne s'ouvrent qu'à partir d'un certain niveau.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          {filtres.map((f) => (
            <button
              key={f}
              onClick={() => setFiltre(f)}
              className={`rounded-[10px] px-3 py-2 text-sm font-medium transition-transform hover:-translate-y-0.5 ${
                filtre === f
                  ? "bg-primary/15 text-primary ring-1 ring-primary/40"
                  : "text-muted-foreground ring-1 ring-border"
              }`}
            >
              {f === "tout" ? "📖 Tout" : `${categoriesMeta[f].icone} ${categoriesMeta[f].nom}`}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {liste.map((a) => {
            const lu = lues.includes(a.id);
            const verrouille = !lu && a.niveau > niveau;
            const actif = ouvert === a.id;
            return (
              <article
                key={a.id}
                className={`panel p-5 text-left transition-transform ${
                  verrouille ? "opacity-60" : "cursor-pointer hover:-translate-y-0.5"
                } ${lu ? "ring-1 ring-brass/50" : ""}`}
                onClick={() => ouvrir(a.id, verrouille)}
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl">{verrouille ? "🔒" : a.icone}</span>
                  <div className="min-w-0">
                    <h2 className="font-display text-lg">{a.titre}</h2>
                    <p className="mt-0.5 text-xs uppercase tracking-[0.2em] text-brass-2">
                      {categoriesMeta[a.categorie].nom}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {verrouille ? `Réservé aux sorciers de niveau ${a.niveau}.` : a.resume}
                    </p>
                    {actif && !verrouille && (
                      <p className="mt-3 border-t border-border pt-3 text-sm leading-relaxed">
                        {a.texte}
                      </p>
                    )}
                    {!verrouille && (
                      <p className="mt-2 text-xs text-brass-2">
                        {lu
                          ? "✓ Page découverte"
                          : `Première lecture : ✨ ${a.recompense.xp ?? 0} XP${
                              a.recompense.gallions ? ` · 🪙 ${a.recompense.gallions}` : ""
                            }`}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {pret && !joueur && (
          <Link
            to="/sorcier"
            className="mt-8 inline-flex items-center rounded-[10px] bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
          >
            🪄 Créer mon sorcier pour gagner de l'XP
          </Link>
        )}
      </div>
    </section>
  );
}
