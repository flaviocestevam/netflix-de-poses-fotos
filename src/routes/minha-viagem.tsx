import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/np/AppShell";
import { Plane, Plus, CheckCircle2, Circle, SkipForward } from "lucide-react";

const DEMO_TRIPS = [
  {
    id: "paris",
    name: "Paris 2026",
    destination: "Paris, França",
    type: "Romântica",
    cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200",
    sections: ["Aeroporto", "Hotel", "Ruas de Paris", "Restaurante", "Torre Eiffel", "Pôr do sol"],
    progress: { done: 8, total: 24 },
  },
  {
    id: "maldivas",
    name: "Lua de Mel Maldivas",
    destination: "Maldivas",
    type: "Lua de mel",
    cover: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1200",
    sections: ["Chegada", "Praia", "Bangalô", "Jantar romântico", "Pôr do sol"],
    progress: { done: 3, total: 18 },
  },
];

export const Route = createFileRoute("/minha-viagem")({
  component: TripsPage,
});

function TripsPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Minha Viagem</p>
            <h1 className="font-display text-3xl font-bold md:text-5xl">Suas pastas de viagem</h1>
            <p className="max-w-xl text-sm text-muted-foreground">
              Monte um roteiro de poses para cada viagem. Marque o que já fez e o que falta tirar.
            </p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full gradient-rose px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            <Plus className="h-4 w-4" /> Nova viagem
          </button>
        </header>

        <div className="rounded-2xl border border-dashed border-border/60 bg-card/40 p-5 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Pré-visualização:</span> exemplos abaixo. Faça login para criar suas próprias viagens.
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {DEMO_TRIPS.map((t) => (
            <Link key={t.id} to="/minha-viagem/$id" params={{ id: t.id }} className="group block overflow-hidden rounded-3xl border border-border/60 bg-card">
              <div className="relative aspect-[16/9]">
                <img src={t.cover} alt={t.name} className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[10px] uppercase tracking-wide text-primary">{t.type}</div>
                  <div className="font-display text-2xl font-bold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.destination}</div>
                </div>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-semibold text-primary">{t.progress.done}/{t.progress.total} poses</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full gradient-rose" style={{ width: `${(t.progress.done / t.progress.total) * 100}%` }} />
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.sections.map((s) => (
                    <span key={s} className="rounded-full bg-secondary px-2.5 py-1 text-[10px] text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}