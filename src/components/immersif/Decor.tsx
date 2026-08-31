import { useMemo } from "react";

import gare from "@/assets/scene-gare.jpg";
import voyage from "@/assets/scene-voyage.jpg";
import campagne from "@/assets/scene-campagne.jpg";
import poudlard from "@/assets/scene-poudlard.jpg";
import interieur from "@/assets/scene-interieur.jpg";
import foret from "@/assets/scene-foret.jpg";
import village from "@/assets/scene-village.jpg";
import { useMouvementReduit, useProgressionScroll } from "@/hooks/use-recit";

/* Caméra continue : sept tableaux se relaient au fil du scroll, avec
   travelling, changement de température de couleur et effets d'ambiance
   propres à chaque environnement (pluie, brume, neige, chandelles). */

type Tableau = {
  id: string;
  image: string;
  de: number;
  a: number;
  voile: string;
  /** Décalage de teinte / saturation pour la température de lumière. */
  filtre?: string;
};

const tableaux: Tableau[] = [
  {
    id: "gare",
    image: gare,
    de: 0,
    a: 0.12,
    voile:
      "linear-gradient(180deg, oklch(0.12 0.02 265 / 52%), oklch(0.1 0.02 265 / 42%) 45%, oklch(0.09 0.02 265 / 92%))",
    filtre: "saturate(0.85) contrast(1.05)",
  },
  {
    id: "voyage",
    image: voyage,
    de: 0.1,
    a: 0.25,
    voile:
      "linear-gradient(180deg, oklch(0.11 0.02 250 / 58%), oklch(0.1 0.03 240 / 50%) 50%, oklch(0.08 0.02 255 / 92%))",
    filtre: "saturate(0.8)",
  },
  {
    id: "campagne",
    image: campagne,
    de: 0.23,
    a: 0.39,
    voile:
      "linear-gradient(180deg, oklch(0.14 0.04 80 / 42%), oklch(0.11 0.03 70 / 45%) 50%, oklch(0.08 0.02 260 / 92%))",
    filtre: "saturate(0.95) sepia(0.12)",
  },
  {
    id: "poudlard",
    image: poudlard,
    de: 0.37,
    a: 0.56,
    voile:
      "linear-gradient(180deg, oklch(0.1 0.03 265 / 42%), oklch(0.08 0.03 265 / 38%) 45%, oklch(0.07 0.02 265 / 92%))",
  },
  {
    id: "interieur",
    image: interieur,
    de: 0.54,
    a: 0.71,
    voile:
      "linear-gradient(180deg, oklch(0.1 0.03 60 / 40%), oklch(0.09 0.03 55 / 40%) 50%, oklch(0.07 0.02 260 / 90%))",
    filtre: "saturate(1.05)",
  },
  {
    id: "foret",
    image: foret,
    de: 0.69,
    a: 0.85,
    voile:
      "linear-gradient(180deg, oklch(0.09 0.03 170 / 58%), oklch(0.08 0.03 165 / 52%) 50%, oklch(0.06 0.02 170 / 94%))",
    filtre: "saturate(0.85) contrast(1.08)",
  },
  {
    id: "village",
    image: village,
    de: 0.83,
    a: 1.01,
    voile:
      "linear-gradient(180deg, oklch(0.1 0.03 260 / 52%), oklch(0.09 0.02 255 / 40%) 50%, oklch(0.08 0.02 258 / 88%))",
  },
];

const FONDU = 0.05;

function opacite(p: number, t: Tableau) {
  if (p <= t.de - FONDU || p >= t.a + FONDU) return 0;
  if (p < t.de) return (p - (t.de - FONDU)) / FONDU;
  if (p > t.a) return 1 - (p - t.a) / FONDU;
  return 1;
}

function fenetre(p: number, de: number, a: number, marge = 0.06) {
  if (p <= de - marge || p >= a + marge) return 0;
  if (p < de) return (p - (de - marge)) / marge;
  if (p > a) return 1 - (p - a) / marge;
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

  const gouttes = useMemo(() => {
    const r = suite(90, 41);
    return Array.from({ length: 30 }, (_, i) => ({
      gauche: r[i * 3]! * 100,
      duree: 1.1 + r[i * 3 + 1]! * 1.3,
      delai: r[i * 3 + 2]! * 3,
      hauteur: 40 + r[i * 3]! * 70,
    }));
  }, []);

  const etincelles = useMemo(() => {
    const r = suite(60, 97);
    return Array.from({ length: 18 }, (_, i) => ({
      gauche: 4 + r[i * 3]! * 92,
      haut: 8 + r[i * 3 + 1]! * 78,
      duree: 3.5 + r[i * 3 + 2]! * 4,
      delai: r[i * 3]! * 6,
      taille: 2 + r[i * 3 + 1]! * 2.5,
    }));
  }, []);

  const pluie = fenetre(progression, 0.12, 0.36);
  const chandelles = fenetre(progression, 0.56, 0.7);
  const brume = fenetre(progression, 0.7, 0.84) * 0.85;
  const neige = fenetre(progression, 0.85, 1.05);
  const quai = Math.max(0, 1 - progression / 0.14);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[oklch(0.08_0.02_265)]">
      {tableaux.map((t) => {
        const o = opacite(progression, t);
        if (o <= 0) return null;
        const local = Math.min(1, Math.max(0, (progression - t.de) / (t.a - t.de || 1)));
        const decalage = reduit ? 0 : (local - 0.5) * 10;
        const echelle = reduit ? 1.05 : 1.16 - local * 0.1;
        return (
          <div key={t.id} className="absolute inset-0" style={{ opacity: o }}>
            <div
              className="absolute inset-0 bg-cover bg-center will-change-transform"
              style={{
                backgroundImage: `url(${t.image})`,
                transform: `translate3d(0, ${decalage}%, 0) scale(${echelle})`,
                filter: t.filtre,
              }}
            />
            <div className="absolute inset-0" style={{ background: t.voile }} />
          </div>
        );
      })}

      {/* Vapeur du quai, au tout début du voyage */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 transition-opacity duration-700"
        style={{
          opacity: quai * 0.55,
          background:
            "radial-gradient(90% 70% at 50% 100%, oklch(0.85 0.02 90 / 26%), transparent 68%)",
        }}
      />

      {/* Pluie sur la vitre du wagon */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: pluie * 0.6 }}
      >
        {pluie > 0.02 &&
          gouttes.map((g, i) => (
            <span
              key={i}
              className="pluie absolute w-px bg-gradient-to-b from-transparent via-[oklch(0.9_0.02_240/_45%)] to-transparent"
              style={{
                left: `${g.gauche}%`,
                height: g.hauteur,
                animationDuration: `${g.duree}s`,
                animationDelay: `-${g.delai}s`,
              }}
            />
          ))}
      </div>

      {/* Chandelles flottantes des couloirs du château */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: chandelles }}
      >
        {chandelles > 0.02 &&
          etincelles.map((e, i) => (
            <span
              key={i}
              className="scintille absolute rounded-full bg-[oklch(0.92_0.12_85)]"
              style={{
                left: `${e.gauche}%`,
                top: `${e.haut}%`,
                width: e.taille,
                height: e.taille,
                boxShadow: "0 0 14px 4px oklch(0.85 0.13 82 / 45%)",
                animationDuration: `${e.duree}s`,
                animationDelay: `-${e.delai}s`,
              }}
            />
          ))}
      </div>

      {/* Brume basse de la forêt */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 transition-opacity duration-700"
        style={{
          opacity: brume * 0.75,
          background:
            "radial-gradient(120% 80% at 50% 100%, oklch(0.8 0.03 170 / 24%), transparent 70%)",
        }}
      />

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

      {/* Lueur de chandelle en haut de page */}
      <div
        className="absolute left-1/2 top-0 h-[60vh] w-[80vw] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          opacity: 0.32 * (1 - Math.min(1, progression * 2.2)) + 0.1,
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

      {/* Premier plan : arche de pierre qui encadre discrètement la caméra */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{
          opacity: 0.55,
          background:
            "radial-gradient(130% 95% at 50% 40%, transparent 52%, oklch(0.05 0.01 265 / 88%) 100%)",
        }}
      />

      <div className="grain absolute inset-0 opacity-40" />
    </div>
  );
}
