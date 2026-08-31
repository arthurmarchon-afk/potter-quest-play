import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "@/styles.css?url";
import { JoueurProvider, useJoueur } from "@/lib/joueur-context";
import { DecorInterieur } from "@/components/immersif/DecorInterieur";
import { RewardPopup } from "@/components/jeu/RewardPopup";
import { XPBar } from "@/components/jeu/XPBar";
import { reportLovableError } from "@/lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Potter Quest — Le grimoire vivant de Poudlard" },
      {
        name: "description",
        content:
          "Créez votre sorcier, passez sous le Choixpeau, explorez Poudlard, relevez les quêtes et affrontez les mini-jeux magiques.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=Cinzel+Decorative:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=IM+Fell+English:ital@0,1&display=swap",
      },

      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const liensPrincipaux = [
  { to: "/", label: "Accueil" },
  { to: "/sorcier", label: "Mon Sorcier" },
  { to: "/jeux", label: "Jeux" },
  { to: "/quetes", label: "Quêtes" },
  { to: "/bibliotheque", label: "Encyclopédie" },
] as const;

const liensSecondaires = [
  { to: "/choixpeau", label: "Choixpeau", Icone: IconeChoixpeau },
  { to: "/duels", label: "Duels", Icone: IconeEpees },
  { to: "/carte", label: "Carte", Icone: IconeCarte },
  { to: "/succes", label: "Succès", Icone: IconeEtoile },
  { to: "/inventaire", label: "Sacoche", Icone: IconeSac },
  { to: "/coupe", label: "Coupe", Icone: IconeCoupe },
  { to: "/classement", label: "Saison", Icone: IconeSablier },
] as const;

function BandeauJoueur() {
  const { joueur } = useJoueur();
  if (!joueur) return null;
  return (
    <div className="mx-auto mt-3 max-w-6xl px-6">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-or/12 bg-[oklch(0.1_0.02_265/_55%)] px-4 py-2.5 text-sm">
        <span className="font-display uppercase tracking-[0.14em] text-parchemin">
          {joueur.nom}
        </span>
        <span className="annotation not-italic text-or">Niveau {joueur.niveau}</span>
        <span className="flex items-center gap-1.5 text-parchemin/55">
          <IconeCle className="h-3.5 w-3.5 text-or/70" />
          <span className="tabular-nums">{joueur.gallions}</span>
        </span>
        <span className="flex items-center gap-1.5 text-parchemin/55">
          <IconeSablier className="h-3.5 w-3.5 text-or/70" />
          <span className="tabular-nums">{joueur.pointsMaison}</span>
        </span>
        <div className="min-w-[120px] flex-1">
          <XPBar niveau={joueur.niveau} xp={joueur.xp} compact />
        </div>
      </div>
    </div>
  );
}

function SiteNav() {
  const [defile, setDefile] = useState(false);
  const [ouvert, setOuvert] = useState(false);

  useEffect(() => {
    const surScroll = () => setDefile(window.scrollY > 40);
    surScroll();
    window.addEventListener("scroll", surScroll, { passive: true });
    return () => window.removeEventListener("scroll", surScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40">
      <div
        className={`transition-all duration-700 ${
          defile
            ? "bg-[oklch(0.08_0.02_265/_82%)] backdrop-blur-[2px]"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-6 py-3">
          <Link to="/" className="group flex items-center gap-3">
            <IconeChandelle className="h-5 w-5 text-or/75 transition-colors group-hover:text-or" />
            <span className="font-titre text-[0.78rem] uppercase tracking-[0.38em] text-parchemin">
              Potter <span className="text-or">Quest</span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-y-1">
            {liensPrincipaux.map((l, i) => (
              <span key={l.to} className="flex items-center">
                {i > 0 ? <Ornement className="mx-1 h-2 w-2 text-or/30" /> : null}
                <Link
                  to={l.to}
                  activeOptions={{ exact: l.to === "/" }}
                  className="px-2 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.26em] text-parchemin/55 transition-colors hover:text-or"
                  activeProps={{
                    className:
                      "px-2 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.26em] text-or",
                  }}
                >
                  {l.label}
                </Link>
              </span>
            ))}
            <Ornement className="mx-1 h-2 w-2 text-or/30" />
            <button
              type="button"
              onClick={() => setOuvert((o) => !o)}
              aria-expanded={ouvert}
              className="px-2 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.26em] text-parchemin/55 transition-colors hover:text-or"
            >
              {ouvert ? "Refermer" : "Grimoire"}
            </button>
          </nav>
        </div>

        {ouvert ? (
          <div className="mx-auto max-w-6xl px-6 pb-4">
            <div className="flex flex-wrap gap-x-1 gap-y-1 border-t border-or/12 pt-3">
              {liensSecondaires.map(({ to, label, Icone }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOuvert(false)}
                  className="flex items-center gap-2 px-3 py-2 font-display text-[0.6rem] uppercase tracking-[0.2em] text-parchemin/60 transition-colors hover:text-or"
                  activeProps={{
                    className:
                      "flex items-center gap-2 px-3 py-2 font-display text-[0.6rem] uppercase tracking-[0.2em] text-or",
                  }}
                >
                  <Icone className="h-4 w-4 opacity-80" />
                  {label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="relative z-10">
      <div className="pointer-events-none h-40 bg-gradient-to-b from-transparent to-[oklch(0.06_0.015_265/_92%)]" />
      <div className="bg-[oklch(0.06_0.015_265/_92%)] px-6 pb-14">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3 text-or/45">
            <Ornement className="h-2 w-2" />
            <IconeChandelle className="chandelle h-5 w-5" />
            <Ornement className="h-2 w-2" />
          </div>
          <span className="font-titre text-xs uppercase tracking-[0.4em] text-parchemin/55">
            Potter Quest
          </span>
          <p className="annotation max-w-sm text-sm">
            Ici s'achève la page. Le reste du grimoire attend d'être ouvert — récit de fans, non
            affilié aux ayants droit.
          </p>
        </div>
      </div>
    </footer>
  );
}


function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <JoueurProvider>
        <div className="relative min-h-screen font-body text-foreground">
          <DecorInterieur />
          <SiteNav />
          <BandeauJoueur />
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <main className="relative z-10 min-h-[68vh]">
            <Outlet />
          </main>
          <SiteFooter />
          <RewardPopup />
        </div>
      </JoueurProvider>
    </QueryClientProvider>
  );
}

