import { Sceau } from "@/components/immersif/Page";
import { IconeEtoile } from "@/components/immersif/Icones";
import { useJoueur } from "@/lib/joueur-context";

export function RewardPopup() {
  const { notifs } = useJoueur();
  if (!notifs.length) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex flex-col items-center gap-3 px-4 sm:bottom-6">
      {notifs.map((n) => (
        <div
          key={n.id}
          className="parchemin animate-fade-in relative w-full max-w-sm px-6 py-4 text-center"
        >
          <Sceau className="absolute -top-5 left-1/2 -translate-x-1/2">
            <IconeEtoile />
          </Sceau>
          {n.niveau !== undefined && (
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-or-sombre">
              Niveau supérieur — Niveau {n.niveau}
            </p>
          )}
          {n.lignes.map((l, i) => (
            <p key={i} className="annotation mt-1 text-base">
              {l}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
