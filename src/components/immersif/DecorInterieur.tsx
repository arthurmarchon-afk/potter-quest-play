import { useRouterState } from "@tanstack/react-router";

import poudlard from "@/assets/scene-poudlard.jpg";
import foret from "@/assets/scene-foret.jpg";
import village from "@/assets/scene-village.jpg";
import gare from "@/assets/scene-gare.jpg";
import { useMouvementReduit } from "@/hooks/use-recit";

/* Décor fixe des pages intérieures : chaque section du château a son tableau,
   posé derrière le contenu avec un voile d'encre et une poussière de chandelle. */

const tableaux: { prefixe: string; image: string }[] = [
  { prefixe: "/carte", image: foret },
  { prefixe: "/duels", image: foret },
  { prefixe: "/jeux", image: poudlard },
  { prefixe: "/inventaire", image: village },
  { prefixe: "/classement", image: village },
  { prefixe: "/choixpeau", image: gare },
];

function tableauPour(chemin: string) {
  return tableaux.find((t) => chemin.startsWith(t.prefixe))?.image ?? poudlard;
}

export function DecorInterieur() {
  const chemin = useRouterState({ select: (s) => s.location.pathname });
  const reduit = useMouvementReduit();

  if (chemin === "/") return null;
  const image = tableauPour(chemin);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div
        key={image}
        className="absolute inset-0 bg-cover bg-center opacity-[0.32] transition-opacity duration-1000"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,oklch(0.1_0.02_265/55%),oklch(0.07_0.02_265/94%))]" />
      <div className="grain absolute inset-0 opacity-40" />
      {!reduit ? (
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <span
              key={i}
              className="particule absolute h-[2px] w-[2px] rounded-full bg-or/50"
              style={{
                left: `${(i * 37) % 100}%`,
                top: `${20 + ((i * 53) % 75)}%`,
                animationDuration: `${9 + (i % 7) * 2}s`,
                animationDelay: `${(i % 9) * 1.1}s`,
                ["--dx" as string]: `${(i % 5) * 9 - 18}px`,
                ["--o" as string]: 0.45,
              }}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
