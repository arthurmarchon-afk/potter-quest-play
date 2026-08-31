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
        <div className="mb-1.5 flex items-baseline justify-between text-xs">
          <span className="font-medium uppercase tracking-[0.2em] text-brass-2">
            Niveau {niveau}
          </span>
          <span className="text-muted-foreground">
            {xp} / {requis} XP
          </span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-foreground/10 ring-1 ring-border">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brass to-candle transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
