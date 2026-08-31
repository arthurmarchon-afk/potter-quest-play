import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Révèle son contenu (fondu + montée) lorsqu'il entre dans le cadre. */
export function Reveler({
  children,
  className,
  delai = 0,
  as: Balise = "div",
}: {
  children: ReactNode;
  className?: string;
  delai?: number;
  as?: "div" | "section" | "li" | "span" | "p";
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (e.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        }
      },
      { rootMargin: "-12% 0px -10% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Balise
      ref={ref as never}
      className={cn("reveler", visible && "visible", className)}
      style={delai ? { transitionDelay: `${delai}ms` } : undefined}
    >
      {children}
    </Balise>
  );
}
