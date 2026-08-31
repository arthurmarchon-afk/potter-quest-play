import { maisons, type Maison } from "@/lib/choixpeau";
import { emblemes } from "@/lib/joueur";

export function HouseBadge({
  maison,
  taille = "md",
}: {
  maison: Maison;
  taille?: "sm" | "md" | "lg";
}) {
  const m = maisons[maison];
  const dim = taille === "lg" ? "h-20 w-20 text-3xl" : taille === "sm" ? "h-9 w-9 text-lg" : "h-12 w-12 text-xl";
  return (
    <div
      className={`grid ${dim} shrink-0 place-items-center rounded-full ring-1 ring-brass/50`}
      style={{
        background: `linear-gradient(to bottom right, color-mix(in oklab, ${m.couleur} 70%, transparent), color-mix(in oklab, ${m.couleur} 15%, transparent))`,
      }}
      aria-label={m.nom}
      title={m.nom}
    >
      <span>{emblemes[maison]}</span>
    </div>
  );
}
