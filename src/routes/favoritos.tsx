import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/np/AppShell";
import { Heart, FolderHeart } from "lucide-react";

const DEMO_LISTS = [
  { name: "Geral", count: 12, cover: "https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=900" },
  { name: "Paris 2026", count: 8, cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=900" },
  { name: "Praia", count: 5, cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900" },
];

export const Route = createFileRoute("/favoritos")({
  component: FavoritesPage,
});

function FavoritesPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Favoritos</p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Suas poses queridas</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Organize favoritas em listas por viagem, momento ou estilo.
          </p>
        </header>

        <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Pré-visualização:</span> faça login para salvar suas próprias listas.
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_LISTS.map((l) => (
            <div key={l.name} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card">
              <div className="relative aspect-[4/3]">
                <img src={l.cover} alt={l.name} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <div className="flex items-center gap-2">
                    <FolderHeart className="h-4 w-4 text-primary" />
                    <div className="font-display text-lg font-bold">{l.name}</div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{l.count} poses salvas</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-border/60 bg-card/60 p-8 text-center">
          <Heart className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Explore o catálogo e toque no coração para começar.</p>
          <Link to="/dashboard" className="mt-4 inline-flex rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            Ver poses
          </Link>
        </div>
      </div>
    </AppShell>
  );
}