import { useMemo } from "react";

import gare from "@/assets/scene-gare.jpg";
import voyage from "@/assets/scene-voyage.jpg";
import poudlard from "@/assets/scene-poudlard.jpg";
import foret from "@/assets/scene-foret.jpg";
import village from "@/assets/scene-village.jpg";
import { useMouvementReduit, useProgressionScroll } from "@/hooks/use-recit";

/* Décor continu : les tableaux se fondent l'un dans l'autre au fil du scroll,
   avec un léger travelling vertical pour donner la sensation d'une caméra. */

type Tableau = {
  id: string;
  image: string;
  /** Fenêtre de présence dans la progression globale (0 → 1). */
  de: number;
  a: number;
  /** Voile coloré posé par-dessus l'image. */
  voile: string;
};

const tableaux: Tableau[] = [
  {
    id: "gare",
    image: gare,
    de: 0,
    a: 0.19,
    voile:
      "linear-gradient(180deg, oklch(0.12 0.02 265 / 55%), oklch(0.1 0.02 265 / 45%) 45%, oklch(0.09 0.02 265 / 92%))",
  },
  {
    id: "voyage",
    image: voyage,
    de: 0.15,
    a: 0.37,
    voile:
      "linear-gradient(180deg, oklch(0.11 0.02 250 / 62%), oklch(0.1 0.03 240 / 55%) 50%, oklch(0.08 0.02 255 / 92%))",
  },
  {
    id: "poudlard",
    image: poudlard,
    de: 0.33,
    a: 0.63,
    voile:
      "linear-gradient(180deg, oklch(0.1 0.03 265 / 45%), oklch(0.08 0.03 265 / 40%) 45%, oklch(0.07 0.02 265 / 92%))",
  },
  {
    id: "foret",
    image: foret,
    de: 0.6,
    a: 0.81,
    voile:
      "linear-gradient(180deg, oklch(0.09 0.03 170 / 60%), oklch(0.08 0.03 165 / 55%) 50%, oklch(0.06 0.02 170 / 94%))",
  },
  {
    id: "village",
    image: village,
    de: 0.78,
    a: 1.01,
    voile:
      "linear-gradient(180deg, oklch(0.1 0.03 260 / 55%), oklch(0.09 0.02 255 / 42%) 50%, oklch(0.08 0.02 258 / 88%))",
  },
];

const FONDU = 0.055;

function opacite(p: number, t: Tableau) {
  if (p <= t.de - FONDU || p >= t.a + FONDU) return 0;
  if (p < t.de) return (p - (t.de - FONDU)) / FONDU;
  if (p > t.a) return 1 - (p - t.a) / FONDU;
  return 1;
}

/** Suite pseudo-aléatoire déterministe (mêmes valeurs serveur et client). */
function suite(n: number, graine: number) {
  let x = graine;
  return Array.from({ length: n }, () => {
    x = (x * 1103515245 + 12345) % 2147483648;
    return x / 2147483648;
  });
}

export function Decor() {
  const progression = useProgressionScroll();
  const reduit = useMouvementReduit();

  const poussieres = useMemo(() => {
    const r = suite(60, 7);
    return Array.from({ length: 20 }, (_, i) => ({
      gauche: r[i * 3]! * 100,
      bas: r[i * 3 + 1]! * 60,
      duree: 11 + r[i * 3 + 2]! * 16,
      delai: r[i * 3]! * 14,
      taille: 1 + r[i * 3 + 1]! * 2.4,
      derive: (r[i * 3 + 2]! - 0.5) * 90,
    }));
  }, []);

  const flocons = useMemo(() => {
    const r = suite(75, 23);
    return Array.from({ length: 25 }, (_, i) => ({
      gauche: r[i * 3]! * 100,
      duree: 9 + r[i * 3 + 1]! * 12,
      delai: r[i * 3 + 2]! * 12,
      taille: 1.5 + r[i * 3]! * 2.5,
      derive: (r[i * 3 + 1]! - 0.5) * 120,
    }));
  }, []);

  const neige = Math.max(0, Math.min(1, (progression - 0.76) / 0.1));
  const brume = Math.max(0, Math.min(1, (progression - 0.55) / 0.12)) * (1 - neige * 0.7);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[oklch(0.08_0.02_265)]">
      {tableaux.map((t) => {
        const o = opacite(progression, t);
        if (o <= 0) return null;
        const local = Math.min(1, Math.max(0, (progression - t.de) / (t.a - t.de || 1)));
        const decalage = reduit ? 0 : (local - 0.5) * 9;
        const echelle = reduit ? 1.04 : 1.14 - local * 0.08;
        return (
          <div key={t.id} className="absolute inset-0" style={{ opacity: o }}>
            <div
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url(${t.image})`,
                transform: `translate3d(0, ${decalage}%, 0) scale(${echelle})`,
              }}
            />
            <div className="absolute inset-0" style={{ background: t.voile }} />
          </div>
        );
      })}

      {/* Brume basse de la forêt */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 transition-opacity duration-700"
        style={{
          opacity: brume * 0.7,
          background:
            "radial-gradient(120% 80% at 50% 100%, oklch(0.8 0.03 170 / 22%), transparent 70%)",
        }}
      />

      {/* Lueur de chandelle en haut de page */}
      <div
        className="absolute left-1/2 top-0 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          opacity: 0.35 * (1 - Math.min(1, progression * 2.2)) + 0.12,
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--or) 28%, transparent), transparent 65%)",
        }}
      />

      {/* Poussière dans la lumière */}
      <div className="absolute inset-0">
        {poussieres.map((p, i) => (
          <span
            key={i}
            className="particule absolute rounded-full bg-[color-mix(in_oklab,var(--or)_70%,white)]"
            style={
              {
                left: `${p.gauche}%`,
                bottom: `${p.bas}%`,
                width: p.taille,
                height: p.taille,
                animationDuration: `${p.duree}s`,
                animationDelay: `-${p.delai}s`,
                "--dx": `${p.derive}px`,
                "--o": 0.5,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* Neige de Pré-au-Lard */}
      <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: neige }}>
        {neige > 0.02 &&
          flocons.map((f, i) => (
            <span
              key={i}
              className="flocon absolute rounded-full bg-white/80"
              style={
                {
                  left: `${f.gauche}%`,
                  top: 0,
                  width: f.taille,
                  height: f.taille,
                  animationDuration: `${f.duree}s`,
                  animationDelay: `-${f.delai}s`,
                  "--dx": `${f.derive}px`,
                  "--o": 0.75,
                } as React.CSSProperties
              }
            />
          ))}
      </div>

      {/* Grain + vignette pour la texture argentique */}
      <div className="grain absolute inset-0 opacity-40" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_45%,transparent_45%,oklch(0_0_0/_70%))]" />
    </div>
  );
}
