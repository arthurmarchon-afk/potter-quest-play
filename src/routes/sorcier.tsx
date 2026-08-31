import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PlayerSummary, StatLine } from "@/components/jeu/PlayerSummary";
import { useJoueur } from "@/lib/joueur-context";
import { statsMeta, type Stat } from "@/lib/joueur";

export const Route = createFileRoute("/sorcier")({
  head: () => ({
    meta: [
      { title: "Mon Sorcier — Profil, niveau et statistiques | Potter Quest" },
      {
        name: "description",
        content:
          "Créez votre sorcier, suivez votre niveau, votre XP, vos Gallions, vos points de maison et vos statistiques magiques.",
      },
      { property: "og:title", content: "Mon Sorcier — Potter Quest" },
      {
        property: "og:description",
        content: "Profil du sorcier : niveau, XP, Gallions, maison et statistiques.",
      },
    ],
  }),
  component: MonSorcier,
});

function MonSorcier() {
  const { joueur, pret, creerSorcier, reinitialiser } = useJoueur();
  const [nom, setNom] = useState("");

  if (!pret) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-sm text-muted-foreground">
        Ouverture du registre…
      </div>
    );
  }

  if (!joueur) {
    return (
      <section>
        <div className="mx-auto max-w-2xl px-6 py-16 lg:py-24">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
            Registre de Poudlard
          </p>
          <h1 className="font-display text-3xl font-semibold">Créer mon sorcier</h1>
          <p className="mt-4 text-muted-foreground">
            Inscrivez votre nom sur le registre. Votre progression — niveau, XP, Gallions et
            points de maison — sera conservée sur cet appareil.
          </p>
          <form
            className="panel mt-8 flex flex-col gap-4 p-6"
            onSubmit={(e) => {
              e.preventDefault();
              if (nom.trim()) creerSorcier(nom);
            }}
          >
            <label className="text-sm text-foreground/80" htmlFor="nom">
              Nom du sorcier
            </label>
            <input
              id="nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              maxLength={24}
              placeholder="Ex. Arthur"
              className="rounded-[10px] bg-foreground/5 px-4 py-3 text-foreground outline-none ring-1 ring-border focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!nom.trim()}
              className="inline-flex items-center justify-center rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5 disabled:opacity-40"
            >
              🪄 Entrer à Poudlard
            </button>
          </form>
        </div>
      </section>
    );
  }

  const stats = Object.keys(statsMeta) as Stat[];

  return (
    <section>
      <div className="mx-auto max-w-6xl px-6 py-14 lg:py-20">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.35em] text-brass-2">
          Mon Sorcier
        </p>
        <h1 className="font-display text-3xl font-semibold">Parchemin personnel</h1>

        <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <PlayerSummary joueur={joueur} />

          <div className="panel p-5 sm:p-6">
            <h2 className="font-display text-lg">📊 Statistiques</h2>
            <div className="mt-4 space-y-3">
              {stats.map((s) => (
                <StatLine key={s} cle={s} valeur={joueur.stats[s]} />
              ))}
            </div>
            <p className="mt-5 text-xs italic text-muted-foreground">
              Quiz → Intelligence · Duels → Magie · Quêtes → Courage · Énigmes → Sagesse ·
              Mini-jeux rapides → Agilité
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {!joueur.maison && (
            <Link
              to="/choixpeau"
              className="inline-flex items-center rounded-[10px] bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground ring-1 ring-brass-2 transition-transform hover:-translate-y-0.5"
            >
              🎩 Passer le Choixpeau
            </Link>
          )}
          <Link
            to="/jeux"
            className="inline-flex items-center rounded-[10px] px-5 py-3 text-sm font-medium text-foreground/80 ring-1 ring-border transition-transform hover:-translate-y-0.5"
          >
            🎮 Gagner de l'XP
          </Link>
          <button
            onClick={() => {
              if (confirm("Effacer définitivement votre sorcier et sa progression ?")) {
                reinitialiser();
              }
            }}
            className="inline-flex items-center rounded-[10px] px-5 py-3 text-sm font-medium text-muted-foreground ring-1 ring-border transition-transform hover:-translate-y-0.5"
          >
            Recommencer à zéro
          </button>
        </div>
      </div>
    </section>
  );
}
