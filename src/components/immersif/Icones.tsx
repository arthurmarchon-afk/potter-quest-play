import type { SVGProps } from "react";

/* Petit jeu d'icônes gravées : trait fin, style « gravure sur cuivre ».
   Remplace les emojis utilisés jusqu'ici comme pictogrammes. */

type P = SVGProps<SVGSVGElement>;

function Glyphe({ children, ...p }: P & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...p}
    >
      {children}
    </svg>
  );
}

export const IconeChoixpeau = (p: P) => (
  <Glyphe {...p}>
    <path d="M4 18c2.4 1.3 13.6 1.3 16 0" />
    <path d="M6.5 18C7 12 9 4.5 12.5 3.2c2.2-.8 3 1.6 2.2 4.2-.7 2.3-2.4 4-1.4 5.1 1 1.1 3 .1 4.2-1.1" />
    <path d="M8.4 13.6c1.7.9 4.6 1 6.4.2" />
  </Glyphe>
);

export const IconeBaguette = (p: P) => (
  <Glyphe {...p}>
    <path d="M4 20 15.5 8.5" />
    <path d="M15 9.2 17.3 6.9" />
    <path d="M19 3.2 19.6 5l1.8.6-1.8.6L19 8l-.6-1.8L16.6 5.6l1.8-.6z" />
    <path d="M13.6 3.6v2M21 12.2h-2" />
  </Glyphe>
);

export const IconeChaudron = (p: P) => (
  <Glyphe {...p}>
    <path d="M4 10h16l-1.4 7.2A3 3 0 0 1 15.7 20H8.3a3 3 0 0 1-2.9-2.8z" />
    <path d="M4 10 2.6 8.4M20 10l1.4-1.6" />
    <path d="M9.5 7c-1-1.6.4-2.4 0-4M14 7c-1-1.6.4-2.6 0-4.4" />
  </Glyphe>
);

export const IconeEchiquier = (p: P) => (
  <Glyphe {...p}>
    <path d="M9 20h6l-.6-3.4c1.8-1 2.6-2.6 2.6-4.6h-2.3l1.2-2.4-2-1.3.5-2.2h-2V4h-1.8v2.1h-2l.5 2.2-2 1.3L8.3 12H6c0 2 .8 3.6 2.6 4.6z" />
    <path d="M7.6 20h8.8" />
  </Glyphe>
);

export const IconeBalai = (p: P) => (
  <Glyphe {...p}>
    <path d="M3.5 20.5 13 11" />
    <path d="M13.4 10.6c1.6-1.6 4-2 6.2-1.4.6.2.8 1 .3 1.4l-4.6 4.2c-.5.4-1.2.1-1.3-.5-.2-1.4-.6-2.6-1.4-3.4z" />
    <path d="M15.8 12.2 20 13.4M14.8 14.4l3.4 1.6" />
  </Glyphe>
);

export const IconeParchemin = (p: P) => (
  <Glyphe {...p}>
    <path d="M7 3h11v15a3 3 0 0 1-3 3H6" />
    <path d="M7 3a2.5 2.5 0 0 0 0 5h2" />
    <path d="M6 21a2.5 2.5 0 0 0 0-5h9" />
    <path d="M11 8h4M11 11.5h4" />
  </Glyphe>
);

export const IconeEpees = (p: P) => (
  <Glyphe {...p}>
    <path d="M4 4h3l9.5 9.5-3 3L4 7z" />
    <path d="M20 4h-3l-3.6 3.6M8.6 12.4 4 17v3h3l4.6-4.6" />
    <path d="M14.5 16.5 20 22M9.5 16.5 4 22" />
  </Glyphe>
);

export const IconeLivre = (p: P) => (
  <Glyphe {...p}>
    <path d="M12 6.5C10.5 5 8 4.3 4 4.5v13c4-.2 6.5.5 8 2 1.5-1.5 4-2.2 8-2v-13c-4-.2-6.5.5-8 2z" />
    <path d="M12 6.5V21" />
  </Glyphe>
);

export const IconeCarte = (p: P) => (
  <Glyphe {...p}>
    <path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2z" />
    <path d="M9 4v14M15 6v14" />
  </Glyphe>
);

export const IconeCle = (p: P) => (
  <Glyphe {...p}>
    <circle cx="8" cy="8" r="4" />
    <path d="m11 11 9 9M17 17l2-2M14.5 14.5 16.5 12.5" />
  </Glyphe>
);

export const IconeSablier = (p: P) => (
  <Glyphe {...p}>
    <path d="M6 3h12M6 21h12" />
    <path d="M7 3c0 4 5 5.6 5 9s-5 5-5 9M17 3c0 4-5 5.6-5 9s5 5 5 9" />
  </Glyphe>
);

export const IconeChandelle = (p: P) => (
  <Glyphe {...p}>
    <path d="M12 3c1.8 2 2.6 3.2 2.6 4.4A2.6 2.6 0 0 1 12 10a2.6 2.6 0 0 1-2.6-2.6C9.4 6.2 10.2 5 12 3z" />
    <path d="M9 11h6v9H9z" />
    <path d="M7.5 20h9" />
  </Glyphe>
);

export const IconeSac = (p: P) => (
  <Glyphe {...p}>
    <path d="M6 9h12l1.2 8.6A3 3 0 0 1 16.2 21H7.8a3 3 0 0 1-3-3.4z" />
    <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
  </Glyphe>
);

export const IconeEtoile = (p: P) => (
  <Glyphe {...p}>
    <path d="m12 3 1.9 5.6L19.5 10l-4.5 3.4 1.6 5.6L12 15.6 7.4 19l1.6-5.6L4.5 10l5.6-1.4z" />
  </Glyphe>
);

export const IconeCoupe = (p: P) => (
  <Glyphe {...p}>
    <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
    <path d="M7 5.5H4.5V7A3.5 3.5 0 0 0 8 10.5M17 5.5h2.5V7A3.5 3.5 0 0 1 16 10.5" />
    <path d="M12 13v4M8.5 20h7l-.8-3h-5.4z" />
  </Glyphe>
);

/* ---------------------------------------------------------- ornements */

export function Ornement({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 8 8" className={className} aria-hidden fill="currentColor">
      <path d="M4 0 5 3l3 1-3 1-1 3-1-3-3-1 3-1z" />
    </svg>
  );
}

/* ------------------------------------------------------- blasons maison */

const traits: Record<string, { fond: string; trait: string; forme: React.ReactNode }> = {
  gryffondor: {
    fond: "oklch(0.32 0.11 27)",
    trait: "oklch(0.82 0.11 80)",
    forme: (
      <path d="M12 7.2c1.6 0 2.6 1 2.9 2.3.5-.3 1.2-.3 1.5.2.3.6-.2 1.2-.9 1.4.7.5 1 1.4.7 2.2-.4 1.1-1.6 1.6-2.6 1.2l.6 2.3-2.2-1.2-2.2 1.2.6-2.3c-1 .4-2.2-.1-2.6-1.2-.3-.8 0-1.7.7-2.2-.7-.2-1.2-.8-.9-1.4.3-.5 1-.5 1.5-.2.3-1.3 1.3-2.3 2.9-2.3z" />
    ),
  },
  serpentard: {
    fond: "oklch(0.3 0.08 160)",
    trait: "oklch(0.85 0.06 120)",
    forme: (
      <path d="M8.5 8c2.6-1.4 5.6-.6 6.4 1.3.7 1.7-.6 3.2-2.6 3.6-1.4.3-2.2.7-2.2 1.4 0 .8 1 1.3 2.4 1.3 1.2 0 2.2-.3 3-1" />
    ),
  },
  serdaigle: {
    fond: "oklch(0.28 0.09 250)",
    trait: "oklch(0.86 0.06 90)",
    forme: (
      <path d="M7.5 16.5c0-4 2.6-7.2 6-8.6-1 1.6-1.4 3-1.4 4.4 2 .2 3.6-.6 4.6-2 .2 3.6-2.6 6.6-6 6.6-1.2 0-2.2-.1-3.2-.4z" />
    ),
  },
  poufsouffle: {
    fond: "oklch(0.42 0.1 80)",
    trait: "oklch(0.9 0.11 90)",
    forme: (
      <path d="M12 7.6c1.5 0 2.8 1 3.3 2.4.9.2 1.5 1 1.5 1.9 0 1.1-.9 2-2.1 2H9.3c-1.2 0-2.1-.9-2.1-2 0-.9.6-1.7 1.5-1.9.5-1.4 1.8-2.4 3.3-2.4zM9.6 15.4h4.8M10.4 17.2h3.2" />
    ),
  },
};

export function Blason({
  maison,
  className = "h-16 w-16",
}: {
  maison: string;
  className?: string;
}) {
  const t = traits[maison] ?? traits["gryffondor"]!;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 1.8 21 4v8.4c0 4.4-3.6 7.8-9 9.8-5.4-2-9-5.4-9-9.8V4z"
        fill={t.fond}
        stroke="var(--or)"
        strokeWidth={0.7}
      />
      <path
        d="M12 3.4 19.4 5.2v7.2c0 3.6-3 6.5-7.4 8.2-4.4-1.7-7.4-4.6-7.4-8.2V5.2z"
        fill="none"
        stroke="var(--or)"
        strokeWidth={0.35}
        opacity={0.6}
      />
      <g
        fill="none"
        stroke={t.trait}
        strokeWidth={0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {t.forme}
      </g>
    </svg>
  );
}

/* ------------------------------------------------- glyphes complémentaires */

export const IconeLoupe = (p: P) => (
  <Glyphe {...p}>
    <circle cx="10.5" cy="10.5" r="6" />
    <path d="m15 15 5 5M8 10.5h5" />
  </Glyphe>
);

export const IconeCadenas = (p: P) => (
  <Glyphe {...p}>
    <rect x="5" y="10" width="14" height="10" rx="1.5" />
    <path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10M12 14v2.5" />
  </Glyphe>
);

export const IconeMedaille = (p: P) => (
  <Glyphe {...p}>
    <path d="m8 2 2.4 5M16 2l-2.4 5" />
    <circle cx="12" cy="14.5" r="6" />
    <path d="m12 11 1.1 2.3 2.4.3-1.8 1.7.5 2.4-2.2-1.2-2.2 1.2.5-2.4L8.5 13.6l2.4-.3z" />
  </Glyphe>
);

export const IconeGallion = (p: P) => (
  <Glyphe {...p}>
    <circle cx="12" cy="12" r="8" />
    <circle cx="12" cy="12" r="4.6" />
    <path d="M12 3.8v2.2M12 18v2.2M3.8 12H6M18 12h2.2" />
  </Glyphe>
);

export const IconeFiole = (p: P) => (
  <Glyphe {...p}>
    <path d="M10 3h4v5.4l3.4 7.1A3 3 0 0 1 14.7 20H9.3a3 3 0 0 1-2.7-4.5L10 8.4z" />
    <path d="M7.7 14.5h8.6" />
  </Glyphe>
);

export const IconeFlamme = (p: P) => (
  <Glyphe {...p}>
    <path d="M12 3c3.4 3.2 5.4 5.8 5.4 8.8A5.4 5.4 0 0 1 12 21a5.4 5.4 0 0 1-5.4-9.2C7.4 10 9 9.4 9.6 7.6c1 .9 1.6 2 1.7 3.2C12.3 9.4 12.6 7 12 3z" />
  </Glyphe>
);

export const IconeVif = (p: P) => (
  <Glyphe {...p}>
    <circle cx="12" cy="12" r="3.2" />
    <path d="M9 10.6C6.6 8 3.8 7.2 2.4 8.4c-1.2 1 .2 3.6 3 5.2M15 10.6c2.4-2.6 5.2-3.4 6.6-2.2 1.2 1-.2 3.6-3 5.2" />
    <path d="M9.6 13.6 8 15.8M14.4 13.6 16 15.8" />
  </Glyphe>
);

export const IconeCrane = (p: P) => (
  <Glyphe {...p}>
    <path d="M12 3.2c4 0 6.8 2.8 6.8 6.4 0 2.2-1 3.6-2 4.6v2.4H7.2v-2.4c-1-1-2-2.4-2-4.6C5.2 6 8 3.2 12 3.2z" />
    <circle cx="9.6" cy="10" r="1.4" />
    <circle cx="14.4" cy="10" r="1.4" />
    <path d="M9.5 20.8v-2M14.5 20.8v-2M12 13v2" />
  </Glyphe>
);

export const IconeOs = (p: P) => (
  <Glyphe {...p}>
    <path d="M7.4 16.6 16.6 7.4" />
    <path d="M7.4 16.6a2 2 0 1 0-2.6 2.6 2 2 0 1 0 2.6-2.6zM16.6 7.4a2 2 0 1 0 2.6-2.6 2 2 0 1 0-2.6 2.6z" />
  </Glyphe>
);

export const IconeGoutte = (p: P) => (
  <Glyphe {...p}>
    <path d="M12 3.4c3 3.8 5 6.4 5 8.8a5 5 0 0 1-10 0c0-2.4 2-5 5-8.8z" />
  </Glyphe>
);

export const IconeTrefle = (p: P) => (
  <Glyphe {...p}>
    <path d="M12 12c-1.6-2.2-4.6-2.6-5.6-.8-1 1.8 1 3.8 5.6.8zM12 12c1.6-2.2 4.6-2.6 5.6-.8 1 1.8-1 3.8-5.6.8zM12 12c-2.2-1.6-2.6-4.6-.8-5.6 1.8-1 3.8 1 .8 5.6z" />
    <path d="M12 12c1.4 2.4 1.6 5 1 8" />
  </Glyphe>
);

export const IconeCoeur = (p: P) => (
  <Glyphe {...p}>
    <path d="M12 20s-7-4.4-7-9a3.8 3.8 0 0 1 7-2.1A3.8 3.8 0 0 1 19 11c0 4.6-7 9-7 9z" />
  </Glyphe>
);

export const IconePlume = (p: P) => (
  <Glyphe {...p}>
    <path d="M4 20c1-6 4-10 10-12 3-1 6-1 6-1s-.6 6-3 9.4c-2.4 3.4-6.6 4.4-9.4 3" />
    <path d="M6.5 17.5 15 9" />
  </Glyphe>
);

export const IconeBulle = (p: P) => (
  <Glyphe {...p}>
    <circle cx="10" cy="13.5" r="5" />
    <circle cx="16.5" cy="8" r="2.6" />
    <path d="M7.6 11.6a2.6 2.6 0 0 1 1.8-1.6" />
  </Glyphe>
);

export const IconeChampignon = (p: P) => (
  <Glyphe {...p}>
    <path d="M4.5 11.5a7.5 7.5 0 0 1 15 0z" />
    <path d="M10 11.5v6a2 2 0 0 0 4 0v-6" />
  </Glyphe>
);

export const IconeEclair = (p: P) => (
  <Glyphe {...p}>
    <path d="M13.6 2.5 6.5 13.4h4.3L10 21.5l7.3-11.2H13z" />
  </Glyphe>
);

export const IconeManette = (p: P) => (
  <Glyphe {...p}>
    <path d="M8 8h8a5 5 0 0 1 4.8 6.4l-.7 2.4A2.6 2.6 0 0 1 15.6 18L14 16h-4l-1.6 2a2.6 2.6 0 0 1-4.5-1.2l-.7-2.4A5 5 0 0 1 8 8z" />
    <path d="M8.4 12.5h2.2M9.5 11.4v2.2M15 12h.01M17 13.6h.01" />
  </Glyphe>
);

export const IconeSerpent = (p: P) => (
  <Glyphe {...p}>
    <path d="M5 18c3.6 0 4.4-2.6 3-4.2-1.4-1.6-4.4-1.2-4.4-3.6C3.6 7.4 6.6 6 9.6 6.8" />
    <path d="M9.6 6.8c2.8.8 4.2 3 4.2 5.2 0 3-2.2 4.6-2.2 6" />
    <path d="M18.6 8.6a2.6 2.6 0 1 0 0-2.6" />
  </Glyphe>
);
