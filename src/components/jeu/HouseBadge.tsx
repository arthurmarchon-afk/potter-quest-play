import { Blason } from "@/components/immersif/Icones";
import { maisons, type Maison } from "@/lib/choixpeau";

export function HouseBadge({
  maison,
  taille = "md",
}: {
  maison: Maison;
  taille?: "sm" | "md" | "lg";
}) {
  const m = maisons[maison];
  const dim = taille === "lg" ? "h-24 w-24" : taille === "sm" ? "h-9 w-9" : "h-14 w-14";
  return (
    <span
      className="oscille inline-grid shrink-0 place-items-center"
      aria-label={m.nom}
      title={m.nom}
    >
      <Blason maison={maison} className={dim} />
    </span>
  );
}
