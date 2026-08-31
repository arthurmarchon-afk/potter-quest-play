import type { ReactNode } from "react";

import { Ornement } from "@/components/immersif/Icones";
import { Reveler } from "@/components/immersif/Reveler";
import { cn } from "@/lib/utils";

/* Kit commun des pages intérieures : chaque écran devient une salle du château.
   Aucun emoji : uniquement des glyphes gravés et des matières. */

/** En-tête monumental : sceau gravé, titre de pierre, annotation manuscrite. */
export function EnTetePage({
  surtitre,
  titre,
  intro,
  icone,
  aside,
}: {
  surtitre: string;
  titre: string;
  intro?: string;
  icone?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="relative mb-10">
      <div
        className="rai-lumiere pointer-events-none absolute -top-24 left-1/2 h-64 w-[42rem] -translate-x-1/2"
        aria-hidden
      />
      <Reveler className="relative flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[46ch]">
          <div className="flex items-center gap-3 text-or/70">
            {icone ? (
              <span className="chandelle grid h-11 w-11 place-items-center rounded-full border border-or/25 bg-black/40 text-or [&>svg]:h-5 [&>svg]:w-5">
                {icone}
              </span>
            ) : null}
            <p className="font-display text-[0.6rem] uppercase tracking-[0.5em]">{surtitre}</p>
          </div>
          <h1 className="titre-monument mt-4 text-3xl sm:text-5xl">{titre}</h1>
          <SeparateurOrne className="mt-5 max-w-xs" />
          {intro ? <p className="annotation mt-4 text-base leading-relaxed">{intro}</p> : null}
        </div>
        {aside ? <div className="shrink-0">{aside}</div> : null}
      </Reveler>
    </header>
  );
}

/** Filet d'or à losange central, en remplacement des traits de séparation nus. */
export function SeparateurOrne({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3 text-or/60", className)} aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-or/45" />
      <Ornement className="h-2.5 w-2.5" />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-or/45" />
    </div>
  );
}

/** Cadre gravé : panneau de pierre à coins de laiton, remplace les cartes génériques. */
export function Cadre({
  children,
  className,
  ton = "pierre",
}: {
  children: ReactNode;
  className?: string;
  ton?: "pierre" | "parchemin" | "sombre";
}) {
  return (
    <div
      className={cn(
        "relative rounded-[3px] p-6",
        ton === "parchemin" && "parchemin",
        ton !== "parchemin" && "plaque backdrop-blur-md",
        ton === "sombre" && "bg-black/40",
        className,
      )}
    >
      {ton !== "parchemin" ? <CoinsLaiton /> : null}
      {children}
    </div>
  );
}

export function CoinsLaiton() {
  return (
    <span aria-hidden className="pointer-events-none absolute inset-0">
      {[
        "left-1 top-1 border-l border-t",
        "right-1 top-1 border-r border-t",
        "left-1 bottom-1 border-l border-b",
        "right-1 bottom-1 border-r border-b",
      ].map((p) => (
        <span key={p} className={cn("absolute h-3 w-3 border-or/40", p)} />
      ))}
    </span>
  );
}

/** Sceau de cire portant un glyphe. */
export function Sceau({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("sceau h-12 w-12 [&>svg]:h-5 [&>svg]:w-5", className)} aria-hidden>
      {children}
    </span>
  );
}

/** Jauge gravée dans la matière. */
export function Jauge({ valeur, className }: { valeur: number; className?: string }) {
  return (
    <div className={cn("entaille w-full", className)} aria-hidden>
      <div
        className="entaille-remplie transition-[width] duration-700"
        style={{ width: `${Math.max(0, Math.min(100, valeur))}%` }}
      />
    </div>
  );
}

/** Rangée de sélection gravée (difficulté, filtres…) sans allure de formulaire. */
export function ChoixGrave({
  options,
  valeur,
  onChange,
  label,
}: {
  options: readonly { valeur: string; libelle: string }[];
  valeur: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {label ? (
        <span className="font-display text-[0.55rem] uppercase tracking-[0.4em] text-or/60">
          {label}
        </span>
      ) : null}
      <div className="flex flex-wrap gap-1 rounded-[2px] border border-or/20 bg-black/40 p-1">
        {options.map((o) => (
          <button
            key={o.valeur}
            type="button"
            onClick={() => onChange(o.valeur)}
            className={cn(
              "px-4 py-2 font-display text-[0.6rem] uppercase tracking-[0.28em] transition-colors",
              valeur === o.valeur
                ? "bg-gradient-to-b from-or/25 to-transparent text-parchemin shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--or)_45%,transparent)]"
                : "text-parchemin/50 hover:text-or",
            )}
          >
            {o.libelle}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Conteneur de page : largeur, respiration, voile de grain. */
export function Salle({
  children,
  className,
  large,
}: {
  children: ReactNode;
  className?: string;
  large?: boolean;
}) {
  return (
    <section className={cn("relative", className)}>
      <div className={cn("mx-auto px-6 py-14 lg:py-20", large ? "max-w-6xl" : "max-w-4xl")}>
        {children}
      </div>
    </section>
  );
}
