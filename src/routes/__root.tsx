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
        href: "https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700&family=EB+Garamond:ital,wght@0,400;0,500;1,400&display=swap",
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
  { to: "/choixpeau", label: "🎩 Choixpeau" },
  { to: "/duels", label: "⚔️ Duels" },
  { to: "/carte", label: "🗺️ Carte" },
  { to: "/succes", label: "🏅 Succès" },
  { to: "/inventaire", label: "🎒 Sacoche" },
  { to: "/coupe", label: "🏆 Coupe" },
  { to: "/classement", label: "📈 Saison" },
] as const;

function BandeauJoueur() {
  const { joueur } = useJoueur();
  if (!joueur) return null;
  return (
    <div className="mx-auto mt-3 max-w-6xl px-6">
      <div className="plaque flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 text-sm">
        <span className="font-display uppercase tracking-[0.14em] text-parchemin">
          {joueur.nom}
        </span>
        <span className="text-or">Niv. {joueur.niveau}</span>
        <span className="text-parchemin/55">🪙 {joueur.gallions}</span>
        <span className="text-parchemin/55">🏆 {joueur.pointsMaison}</span>
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
            ? "border-b border-or/15 bg-[oklch(0.09_0.02_265/_78%)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-6 py-3">
          <Link to="/" className="flex items-baseline gap-3">
            <span className="font-display text-sm font-semibold uppercase tracking-[0.4em] text-parchemin">
              Potter Quest
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-1 gap-y-1">
            {liensPrincipaux.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="px-2.5 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.26em] text-parchemin/55 transition-colors hover:text-or"
                activeProps={{
                  className:
                    "px-2.5 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.26em] text-or",
                }}
              >
                {l.label}
              </Link>
            ))}
            <button
              type="button"
              onClick={() => setOuvert((o) => !o)}
              aria-expanded={ouvert}
              className="ml-1 px-2.5 py-1.5 font-display text-[0.62rem] uppercase tracking-[0.26em] text-parchemin/55 transition-colors hover:text-or"
            >
              {ouvert ? "Fermer" : "Grimoire ▾"}
            </button>
          </nav>
        </div>

        {ouvert ? (
          <div className="mx-auto max-w-6xl px-6 pb-4">
            <div className="plaque flex flex-wrap gap-1 p-2">
              {liensSecondaires.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setOuvert(false)}
                  className="rounded-[3px] px-3 py-2 text-sm text-parchemin/65 transition-colors hover:bg-or/10 hover:text-or"
                  activeProps={{
                    className: "rounded-[3px] bg-or/10 px-3 py-2 text-sm text-or",
                  }}
                >
                  {l.label}
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
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-3 border-t border-or/15 pt-6 sm:flex-row sm:items-center">
          <span className="font-display text-sm font-semibold uppercase tracking-[0.35em] text-parchemin/60">
            Potter Quest
          </span>
          <p className="text-sm italic text-parchemin/40">
            Grimoire de fans — non affilié aux ayants droit.
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

