import { useJoueur } from "@/lib/joueur-context";

export function RewardPopup() {
  const { notifs } = useJoueur();
  if (!notifs.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-2 px-4 sm:bottom-6">
      {notifs.map((n) => (
        <div
          key={n.id}
          className="panel animate-fade-in w-full max-w-sm px-4 py-3 text-center shadow-lg"
        >
          {n.niveau !== undefined && (
            <p className="font-display text-base font-semibold text-candle">
              ✨ NIVEAU SUPÉRIEUR — Niveau {n.niveau} !
            </p>
          )}
          {n.lignes.map((l, i) => (
            <p key={i} className="text-sm text-foreground/85">
              {l}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
