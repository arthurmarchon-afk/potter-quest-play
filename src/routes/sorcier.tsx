import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PlayerSummary, StatLine } from "@/components/jeu/PlayerSummary";
import { Cadre, EnTetePage, Salle, SeparateurOrne } from "@/components/immersif/Page";
import { Reveler } from "@/components/immersif/Reveler";
import { IconeBaguette, IconeChoixpeau, IconeManette, IconeParchemin } from "@/components/immersif/Icones";
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
      <Salle>
        <p className="annotation text-base">Ouverture du registre…</p>
      </Salle>
    );
  }

  if (!joueur) {
    return (
      <Salle>
        <EnTetePage
          surtitre="Registre de Poudlard"
          titre="Créer mon sorcier"
          icone={<IconeParchemin />}
          intro="Inscrivez votre nom sur le registre. Votre progression — niveau, XP, Gallions et points de maison — sera conservée sur cet appareil."
        />

        <Reveler>
          <Cadre ton="parchemin" className="mx-auto max-w-lg p-8 sm:p-10">
            <p className="font-display text-[0.6rem] uppercase tracking-[0.4em] text-[oklch(0.4_0.05_60)]">
              Registre des nouveaux élèves
            </p>
            <form
              className="mt-6 flex flex-col gap-6"
              onSubmit={(e) => {
                e.preventDefault();
                if (nom.trim()) creerSorcier(nom);
              }}
            >
              <label htmlFor="nom" className="block">
                <span className="font-display text-xs uppercase tracking-[0.25em] text-[oklch(0.35_0.05_55)]">
                  Nom du sorcier
                </span>
                <input
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  maxLength={24}
                  placeholder="Écrivez ici à la plume…"
                  autoComplete="off"
                  className="mt-3 w-full border-0 border-b-2 border-[oklch(0.4_0.05_60_/_0.4)] bg-transparent pb-2 font-manuscrit text-2xl italic text-[oklch(0.22_0.02_60)] outline-none transition-colors placeholder:text-[oklch(0.4_0.05_60_/_0.5)] focus:border-[oklch(0.5_0.13_25)]"
                  style={{ fontFamily: "var(--font-manuscrit)" }}
                />
              </label>
              <button
                type="submit"
                disabled={!nom.trim()}
                className="bouton-magique justify-center px-6 py-3 text-[0.6rem] disabled:opacity-40"
              >
                <IconeBaguette className="mr-2 h-4 w-4" />
                Entrer à Poudlard
              </button>
            </form>
          </Cadre>
        </Reveler>
      </Salle>
    );
  }

  const stats = Object.keys(statsMeta) as Stat[];

  return (
    <Salle large>
      <EnTetePage
        surtitre="Mon sorcier"
        titre="Parchemin personnel"
        icone={<IconeParchemin />}
      />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveler>
          <PlayerSummary joueur={joueur} />
        </Reveler>

        <Reveler delai={100}>
          <Cadre className="p-6 sm:p-7">
            <h2 className="titre-monument text-xl">Statistiques</h2>
            <SeparateurOrne className="mt-3" />
            <div className="mt-5 space-y-4">
              {stats.map((s) => (
                <StatLine key={s} cle={s} valeur={joueur.stats[s]} />
              ))}
            </div>
            <p className="annotation mt-6 text-sm leading-relaxed">
              Quiz → Intelligence · Duels → Magie · Quêtes → Courage · Énigmes → Sagesse ·
              Mini-jeux rapides → Agilité
            </p>
          </Cadre>
        </Reveler>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Reveler delai={140}>
          <Cadre className="h-full p-6 sm:p-7">
            <h2 className="titre-monument text-xl">Ma baguette</h2>
            <SeparateurOrne className="mt-3" />
            {joueur.baguette ? (
              <>
                <p className="mt-5 font-titre text-xl text-parchemin">
                  {joueur.baguette.bois}, {joueur.baguette.coeur.toLowerCase()}
                </p>
                <p className="annotation mt-2 text-sm">
                  {joueur.baguette.longueur} centimètres — {joueur.baguette.souplesse}
                </p>
                <p className="annotation mt-4 text-sm leading-relaxed">
                  « {joueur.baguette.verdict} »
                </p>
              </>
            ) : (
              <>
                <p className="annotation mt-5 text-sm leading-relaxed">
                  Aucune baguette enregistrée. L'échoppe d'Ollivander vous attend, poussiéreuse et
                  patiente.
                </p>
                <Link
                  to="/baguette"
                  className="mt-5 inline-flex font-display text-[0.6rem] uppercase tracking-[0.3em] text-or hover:text-parchemin"
                >
                  Aller chez Ollivander
                </Link>
              </>
            )}
          </Cadre>
        </Reveler>

        <Reveler delai={180}>
          <Cadre className="h-full p-6 sm:p-7">
            <h2 className="titre-monument text-xl">Mon Patronus</h2>
            <SeparateurOrne className="mt-3" />
            {joueur.patronus ? (
              <>
                <p className="mt-5 font-titre text-xl text-parchemin">{joueur.patronus.nom}</p>
                <p className="annotation mt-3 text-sm leading-relaxed">{joueur.patronus.texte}</p>
              </>
            ) : (
              <>
                <p className="annotation mt-5 text-sm leading-relaxed">
                  Le sortilège n'a pas encore pris forme. Il faut trois souvenirs — les bons.
                </p>
                <Link
                  to="/patronus"
                  className="mt-5 inline-flex font-display text-[0.6rem] uppercase tracking-[0.3em] text-or hover:text-parchemin"
                >
                  Tenter Spero Patronum
                </Link>
              </>
            )}
          </Cadre>
        </Reveler>
      </div>

      <Reveler className="mt-8 flex flex-wrap gap-3">
        {!joueur.maison && (
          <Link to="/choixpeau" className="bouton-magique px-6 py-3 text-[0.6rem]">
            <IconeChoixpeau className="mr-2 h-4 w-4" />
            Passer le Choixpeau
          </Link>
        )}
        <Link
          to="/jeux"
          className="filet-or inline-flex items-center rounded-[3px] px-6 py-3 font-display text-[0.6rem] uppercase tracking-[0.28em] text-parchemin/80 transition-transform hover:-translate-y-0.5"
        >
          <IconeManette className="mr-2 h-4 w-4 text-or/70" />
          Gagner de l'XP
        </Link>
        <button
          onClick={() => {
            if (confirm("Effacer définitivement votre sorcier et sa progression ?")) {
              reinitialiser();
            }
          }}
          className="inline-flex items-center rounded-[3px] px-6 py-3 font-display text-[0.6rem] uppercase tracking-[0.28em] text-parchemin/45 ring-1 ring-or/15 transition-transform hover:-translate-y-0.5 hover:text-parchemin/70"
        >
          Recommencer à zéro
        </button>
      </Reveler>
    </Salle>
  );
}
