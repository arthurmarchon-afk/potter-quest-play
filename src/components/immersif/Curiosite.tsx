import { useEffect, useState, type ReactNode } from "react";

import { anecdoteParId } from "@/lib/decouvertes";
import { useDecouvertes } from "@/lib/decouvertes-context";
import { Ornement } from "@/components/immersif/Icones";
import { cn } from "@/lib/utils";

/* Objets du décor sur lesquels on peut s'attarder. La curiosité est récompensée :
   un clic ouvre un parchemin qui livre une anecdote et incrémente le compteur. */

export function Curiosite({
  id,
  icone,
  libelle,
  className,
}: {
  id: string;
  icone: ReactNode;
  /** Ce que le visiteur croit voir : « un livre posé sur la banquette ». */
  libelle: string;
  className?: string;
}) {
  const { connue, trouver } = useDecouvertes();
  const [ouvert, setOuvert] = useState(false);
  const a = anecdoteParId[id];
  const vue = connue(id);

  if (!a) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOuvert(true);
          trouver(id);
        }}
        aria-label={`Observer : ${libelle}`}
        className={cn(
          "group inline-flex items-center gap-3 rounded-[2px] px-2 py-1.5 text-left transition-all duration-500",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-or/70",
          className,
        )}
      >
        <span
          className={cn(
            "relative grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-all duration-500",
            vue
              ? "border-or/45 bg-black/45 text-or/80"
              : "chandelle border-or/25 bg-black/35 text-or/55 group-hover:border-or/70 group-hover:text-or",
            "[&>svg]:h-4 [&>svg]:w-4",
          )}
        >
          {icone}
          {!vue ? (
            <span
              aria-hidden
              className="scintille absolute -inset-1 rounded-full bg-[oklch(0.85_0.1_85/18%)] blur-md"
            />
          ) : null}
        </span>
        <span
          className={cn(
            "annotation text-sm transition-colors",
            vue ? "text-parchemin/45" : "text-parchemin/70 group-hover:text-or",
          )}
        >
          {libelle}
        </span>
      </button>

      {ouvert ? <ParcheminOuvert titre={a.titre} sur={a.objet} onFermer={() => setOuvert(false)}>{a.texte}</ParcheminOuvert> : null}
    </>
  );
}

/** Parchemin déplié par-dessus la scène : ni modale SaaS, ni carte générique. */
export function ParcheminOuvert({
  titre,
  sur,
  children,
  onFermer,
}: {
  titre: string;
  sur?: string;
  children: ReactNode;
  onFermer: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFermer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onFermer]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={titre}
      className="fixed inset-0 z-[70] grid place-items-center bg-[oklch(0.08_0.02_265/78%)] p-5 backdrop-blur-[2px]"
      onClick={onFermer}
    >
      <div
        className="parchemin relative w-full max-w-lg px-8 py-10 sm:px-12"
        style={{ transform: "rotate(-0.5deg)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute inset-2 border border-[oklch(0.4_0.06_60/25%)]" />
        {sur ? (
          <p className="text-center font-display text-[0.55rem] uppercase tracking-[0.4em] text-[oklch(0.42_0.05_50)]">
            {sur}
          </p>
        ) : null}
        <h3 className="mt-3 text-center font-titre text-2xl text-[oklch(0.26_0.04_45)]">{titre}</h3>
        <div className="mt-4 flex items-center justify-center gap-3 text-[oklch(0.45_0.06_55)]">
          <span className="h-px w-12 bg-[oklch(0.45_0.06_55/45%)]" />
          <Ornement className="h-2 w-2" />
          <span className="h-px w-12 bg-[oklch(0.45_0.06_55/45%)]" />
        </div>
        <div className="mt-5 font-manuscrit text-lg italic leading-relaxed text-[oklch(0.3_0.04_45)]">
          {children}
        </div>
        <button
          type="button"
          onClick={onFermer}
          className="mx-auto mt-8 block font-display text-[0.58rem] uppercase tracking-[0.35em] text-[oklch(0.36_0.06_50)] underline-offset-4 hover:underline"
        >
          Replier le parchemin
        </button>
      </div>
    </div>
  );
}

/** « Secrets découverts : 3 / ??? » — le total reste volontairement inconnu. */
export function CompteurTrouvailles({ className }: { className?: string }) {
  const { total } = useDecouvertes();
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-display text-[0.55rem] uppercase tracking-[0.35em] text-or/65",
        className,
      )}
      title="Le nombre total de découvertes n'est pas connu."
    >
      <Ornement className="h-2 w-2" />
      Trouvailles {total} / ???
    </span>
  );
}
