import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/* ------------------------------------------------------------- boutons */

const styleBouton = "bouton-magique";

export function BoutonInterne({
  to,
  children,
  className,
  icone,
}: {
  to: string;
  children: ReactNode;
  className?: string;
  icone?: string;
}) {
  return (
    <Link to={to} className={cn(styleBouton, className)}>
      {icone ? <span aria-hidden>{icone}</span> : null}
      {children}
    </Link>
  );
}

export function BoutonExterne({
  href,
  children,
  className,
  icone,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  icone?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(styleBouton, className)}
    >
      {icone ? <span aria-hidden>{icone}</span> : null}
      {children}
    </a>
  );
}

/* -------------------------------------------------------------- titres */

export function SurTitre({ children }: { children: ReactNode }) {
  return (
    <p className="font-display text-[0.62rem] uppercase tracking-[0.55em] text-or/70 sm:text-xs">
      {children}
    </p>
  );
}

export function TitreScene({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "titre-cinema text-3xl leading-[1.15] text-parchemin sm:text-5xl lg:text-6xl",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/* -------------------------------------------------------------- pièces */

/** Plaque de laiton gravée : remplace les cartes génériques. */
export function Plaque({
  icone,
  titre,
  texte,
  action,
  className,
}: {
  icone: string;
  titre: string;
  texte: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("plaque group p-6 transition-transform duration-500 hover:-translate-y-1", className)}>
      <div className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-or/50 to-transparent" />
      <div className="flex items-start gap-4">
        <span className="chandelle text-2xl" aria-hidden>
          {icone}
        </span>
        <div>
          <h3 className="font-display text-base uppercase tracking-[0.2em] text-parchemin">
            {titre}
          </h3>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-parchemin/60">{texte}</p>
          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}

/** Enseigne de bois suspendue, pour les échoppes du village. */
export function Enseigne({
  icone,
  nom,
  legende,
  texte,
  action,
}: {
  icone: string;
  nom: string;
  legende: string;
  texte: string;
  action?: ReactNode;
}) {
  return (
    <div className="respire flex flex-col items-center text-center">
      <span className="h-8 w-px bg-gradient-to-b from-transparent to-or/50" aria-hidden />
      <div className="w-full rounded-[3px] border border-or/25 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--bois)_80%,transparent),color-mix(in_oklab,black_75%,transparent))] px-6 py-7 shadow-[0_25px_60px_-30px_black]">
        <span className="text-3xl" aria-hidden>
          {icone}
        </span>
        <h3 className="mt-3 font-display text-lg uppercase tracking-[0.18em] text-or">{nom}</h3>
        <p className="mt-1 text-xs italic text-parchemin/50">{legende}</p>
        <p className="mt-4 text-sm leading-relaxed text-parchemin/65">{texte}</p>
        {action ? <div className="mt-5">{action}</div> : null}
      </div>
    </div>
  );
}
