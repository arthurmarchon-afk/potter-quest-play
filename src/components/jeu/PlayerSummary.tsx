import { maisons } from "@/lib/choixpeau";
import { statsMeta, type Joueur, type Stat } from "@/lib/joueur";
import { HouseBadge } from "./HouseBadge";
import { XPBar } from "./XPBar";

export function StatLine({ cle, valeur }: { cle: Stat; valeur: number }) {
  const meta = statsMeta[cle];
  const pct = Math.min(100, (valeur / 20) * 100);
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs">
        <span className="text-foreground/80">
          {meta.icone} {meta.nom}
        </span>
        <span className="text-muted-foreground">{valeur}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <div
          className="h-full rounded-full bg-brass/80 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function PlayerSummary({ joueur }: { joueur: Joueur }) {
  const m = joueur.maison ? maisons[joueur.maison] : null;
  return (
    <div className="panel p-5 sm:p-6">
      <div className="flex items-center gap-4">
        {joueur.maison ? (
          <HouseBadge maison={joueur.maison} taille="lg" />
        ) : (
          <div className="grid h-20 w-20 place-items-center rounded-full text-2xl ring-1 ring-border">
            🎩
          </div>
        )}
        <div className="min-w-0">
          <h2 className="truncate font-display text-2xl font-semibold">{joueur.nom}</h2>
          <p className="text-sm italic text-muted-foreground">
            {m ? m.nom : "Maison non attribuée — passez le Choixpeau"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <XPBar niveau={joueur.niveau} xp={joueur.xp} />
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4 text-center">
        <div>
          <dt className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Gallions</dt>
          <dd className="font-display text-xl text-brass-2">🪙 {joueur.gallions}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Points</dt>
          <dd className="font-display text-xl text-brass-2">🏆 {joueur.pointsMaison}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-[0.15em] text-muted-foreground">XP totale</dt>
          <dd className="font-display text-xl text-brass-2">✨ {joueur.xpTotal}</dd>
        </div>
      </dl>
    </div>
  );
}
