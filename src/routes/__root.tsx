import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { JoueurProvider, useJoueur } from "../lib/joueur-context";
import { RewardPopup } from "../components/jeu/RewardPopup";
import { XPBar } from "../components/jeu/XPBar";
import { reportLovableError } from "../lib/lovable-error-reporting";

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
      { title: "Parchemin — Grimoire des Maisons" },
      {
        name: "description",
        content:
          "Le Choixpeau, les maisons de Poudlard et une salle de mini-jeux sorciers : échecs, memory de sortilèges et quiz.",
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

const navLinks = [
  { to: "/", label: "🏰 Hub" },
  { to: "/sorcier", label: "🧙 Mon Sorcier" },
  { to: "/choixpeau", label: "🎩 Choixpeau" },
  { to: "/jeux", label: "🎮 Mini-jeux" },
  { to: "/quetes", label: "📜 Quêtes" },
  { to: "/succes", label: "🏅 Succès" },
  { to: "/inventaire", label: "🎒 Sacoche" },
  { to: "/coupe", label: "🏆 Coupe" },
] as const;

function BandeauJoueur() {
  const { joueur } = useJoueur();
  if (!joueur) return null;
  return (
    <div className="mx-auto mt-3 max-w-6xl px-6">
      <div className="panel flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5 text-sm">
        <span className="font-display text-foreground">{joueur.nom}</span>
        <span className="text-brass-2">Niv. {joueur.niveau}</span>
        <span className="text-muted-foreground">🪙 {joueur.gallions}</span>
        <span className="text-muted-foreground">🏆 {joueur.pointsMaison}</span>
        <div className="min-w-[120px] flex-1">
          <XPBar niveau={joueur.niveau} xp={joueur.xp} compact />
        </div>
      </div>
    </div>
  );
}

function SiteNav() {
  return (
    <header className="relative z-10">
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <nav className="panel flex flex-wrap items-center justify-between gap-3 py-3 pl-4 pr-3">
          <Link to="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold tracking-[0.25em] text-foreground sm:text-xl">
              POTTER QUEST
            </span>
            <span className="hidden text-sm italic text-muted-foreground sm:inline">
              Parcours du sorcier
            </span>
          </Link>
          <div className="flex flex-wrap items-center gap-0.5">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                activeOptions={{ exact: l.to === "/" }}
                className="rounded-[10px] px-3 py-2 text-sm font-medium text-muted-foreground transition-transform hover:-translate-y-0.5"
                activeProps={{
                  className:
                    "rounded-[10px] bg-primary/15 px-3 py-2 text-sm font-medium text-primary ring-1 ring-primary/40",
                }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="relative z-10">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-6 sm:flex-row sm:items-center">
          <span className="font-display text-sm font-semibold tracking-[0.25em] text-foreground/70">
            POTTER QUEST
          </span>
          <p className="text-sm italic text-muted-foreground">
            Grimoire de fans — accueil, Choixpeau et mini-jeux. Non affilié aux ayants droit.
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
      <div className="relative min-h-screen overflow-hidden bg-background font-body text-foreground">
        <div className="pointer-events-none absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-candle/10 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-emeraude/10 blur-3xl" />
        <div className="pointer-events-none absolute left-0 top-1/3 h-[380px] w-[380px] rounded-full bg-brass/10 blur-3xl" />
        <SiteNav />
        <BandeauJoueur />
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <main className="relative z-10">
          <Outlet />
        </main>
        <SiteFooter />
        <RewardPopup />
      </div>
      </JoueurProvider>
    </QueryClientProvider>
  );
}

