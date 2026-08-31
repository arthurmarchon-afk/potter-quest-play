import { maisons } from "@/lib/choixpeau";
import {
  IconeBaguette,
  IconeBalai,
  IconeChandelle,
  IconeChoixpeau,
  IconeEpees,
  IconeGallion,
  IconeCoupe,
  IconeEtoile,
  IconeLivre,
} from "@/components/immersif/Icones";
import { Jauge } from "@/components/immersif/Page";
import { statsMeta, type Joueur, type Stat } from "@/lib/joueur";
import { HouseBadge } from "./HouseBadge";
import { XPBar } from "./XPBar";

const glyphesStats: Record<Stat, (p: React.SVGProps<SVGSVGElement>) => React.ReactElement> = {
  intelligence: IconeLivre,
  courage: IconeEpees,
  magie: IconeBaguette,
  agilite: IconeBalai,
  sagesse: IconeChandelle,
};

export function StatLine({ cle, valeur }: { cle: Stat; valeur: number }) {
  const meta = statsMeta[cle];
  const Glyphe = glyphesStats[cle];
  const pct = Math.min(100, (valeur / 20) * 100);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-2 font-display text-[0.62rem] uppercase tracking-[0.28em] text-parchemin/70">
          <Glyphe className="h-3.5 w-3.5 text-or/70" />
          {meta.nom}
        </span>
        <span className="chiffre text-sm">{valeur}</span>
      </div>
      <Jauge valeur={pct} />
    </div>
  );
}

export function PlayerSummary({ joueur }: { joueur: Joueur }) {
  const m = joueur.maison ? maisons[joueur.maison] : null;
  return (
    <div className="plaque relative overflow-hidden p-6 sm:p-8">
      <span
        className="rai-lumiere pointer-events-none absolute -top-16 left-1/2 h-48 w-80 -translate-x-1/2"
        aria-hidden
      />
      <div className="relative flex items-center gap-5">
        {joueur.maison ? (
          <HouseBadge maison={joueur.maison} taille="lg" />
        ) : (
          <span className="sceau h-20 w-20 shrink-0 [&>svg]:h-8 [&>svg]:w-8">
            <IconeChoixpeau />
          </span>
        )}
        <div className="min-w-0">
          <h2 className="titre-monument truncate text-2xl">{joueur.nom}</h2>
          <p className="annotation mt-1 text-base">
            {m ? m.nom : "Maison non attribuée — passez le Choixpeau"}
          </p>
        </div>
      </div>

      <div className="relative mt-6">
        <XPBar niveau={joueur.niveau} xp={joueur.xp} />
      </div>

      <dl className="relative mt-6 grid grid-cols-3 gap-3 border-t border-or/15 pt-5 text-center">
        <div>
          <dt className="font-display text-[0.55rem] uppercase tracking-[0.25em] text-parchemin/50">
            Gallions
          </dt>
          <dd className="chiffre mt-1.5 flex items-center justify-center gap-1.5 text-xl">
            <IconeGallion className="h-4 w-4 text-or" /> {joueur.gallions}
          </dd>
        </div>
        <div>
          <dt className="font-display text-[0.55rem] uppercase tracking-[0.25em] text-parchemin/50">
            Points
          </dt>
          <dd className="chiffre mt-1.5 flex items-center justify-center gap-1.5 text-xl">
            <IconeCoupe className="h-4 w-4 text-or" /> {joueur.pointsMaison}
          </dd>
        </div>
        <div>
          <dt className="font-display text-[0.55rem] uppercase tracking-[0.25em] text-parchemin/50">
            XP totale
          </dt>
          <dd className="chiffre mt-1.5 flex items-center justify-center gap-1.5 text-xl">
            <IconeEtoile className="h-4 w-4 text-or" /> {joueur.xpTotal}
          </dd>
        </div>
      </dl>
    </div>
  );
}
