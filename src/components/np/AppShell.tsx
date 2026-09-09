import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Grid3x3, Map, Sparkles, Download, Heart } from "lucide-react";
import type { ReactNode } from "react";

const desktopNav = [
  { to: "/dashboard", label: "Início", icon: Home },
  { to: "/sos", label: "SOS", icon: Sparkles },
  { to: "/modo-30s", label: "Modo 30s", icon: Grid3x3 },
  { to: "/roteiros", label: "Roteiros", icon: Map },
  { to: "/favoritos", label: "Salvas", icon: Heart },
  { to: "/downloads", label: "Downloads", icon: Download },
] as const;

const mobileNav = [
  { to: "/dashboard", label: "Início", icon: Home, hero: false },
  { to: "/roteiros", label: "Roteiros", icon: Map, hero: false },
  { to: "/sos", label: "SOS", icon: Sparkles, hero: true },
  { to: "/modo-30s", label: "30s", icon: Grid3x3, hero: false },
  { to: "/favoritos", label: "Salvas", icon: Heart, hero: false },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = (to: string) => to === pathname || (to !== "/" && pathname.startsWith(to));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-rose text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-lg font-bold tracking-tight">Netflix de Poses</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Catálogo de poses</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {desktopNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors ${
                    active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-32 pt-4 lg:px-8 lg:pb-12">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-xl lg:hidden">
        <ul className="mx-auto flex max-w-md items-end justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            if (item.hero) {
              return (
                <li key={item.to} className="-mt-7">
                  <Link to={item.to} className="flex flex-col items-center gap-1">
                    <span className="grid h-14 w-14 place-items-center rounded-full gradient-rose text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-wide">{item.label}</span>
                  </Link>
                </li>
              );
            }
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={`flex min-w-[56px] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[10px]">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
