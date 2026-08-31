import { xpRequis } from "@/lib/joueur";

export function XPBar({
  niveau,
  xp,
  compact = false,
}: {
  niveau: number;
  xp: number;
  compact?: boolean;
}) {
  const requis = xpRequis(niveau);
  const pct = Math.min(100, Math.round((xp / requis) * 100));
  return (
    <div className="w-full">
      {!compact && (
        <div className="mb-2 flex items-baseline justify-between">
          <span className="font-display text-[0.6rem] uppercase tracking-[0.35em] text-or/80">
            Niveau {niveau}
          </span>
          <span className="chiffre text-xs text-parchemin/60">
            {xp} / {requis} XP
          </span>
        </div>
      )}
      <div className="entaille w-full">
        <div className="entaille-remplie transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
