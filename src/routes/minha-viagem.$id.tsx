import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/np/AppShell";
import { ChevronLeft, Play, Plus, CheckCircle2, Circle, SkipForward } from "lucide-react";
import { useState } from "react";

const DEMO: Record<string, any> = {
  paris: { name: "Paris 2026", destination: "Paris, França", type: "Romântica", cover: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600", sections: ["Aeroporto", "Hotel", "Ruas de Paris", "Restaurante", "Torre Eiffel", "Pôr do sol"] },
  maldivas: { name: "Lua de Mel Maldivas", destination: "Maldivas", type: "Lua de mel", cover: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=1600", sections: ["Chegada", "Praia", "Bangalô", "Jantar romântico", "Pôr do sol"] },
};

export const Route = createFileRoute("/minha-viagem/$id")({
  component: TripDetailPage,
});

function TripDetailPage() {
  const { id } = Route.useParams();
  const trip = DEMO[id] ?? DEMO.paris;
  const [activeSection, setActiveSection] = useState(0);

  const posesQ = useQuery({
    queryKey: ["trip-demo-poses"],
    queryFn: async () => {
      const { data } = await supabase.from("poses").select("*").limit(24);
      return data ?? [];
    },
  });

  const chunk = Math.ceil((posesQ.data?.length ?? 0) / trip.sections.length);
  const sectionPoses = posesQ.data?.slice(activeSection * chunk, (activeSection + 1) * chunk) ?? [];

  return (
    <AppShell>
      <div className="space-y-6">
        <Link to="/minha-viagem" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Minhas viagens
        </Link>

        <header className="relative isolate overflow-hidden rounded-3xl border border-border/60">
          <img src={trip.cover} alt={trip.name} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/80 to-background/20" />
          <div className="relative space-y-3 p-6 md:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{trip.type}</p>
            <h1 className="font-display text-3xl font-bold md:text-5xl">{trip.name}</h1>
            <p className="text-sm text-muted-foreground">{trip.destination}</p>
            <div className="flex flex-wrap gap-2 pt-2">
              <button className="inline-flex items-center gap-2 rounded-full gradient-rose px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                <Play className="h-4 w-4" /> Modo apresentação
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-5 py-2.5 text-sm">
                <Plus className="h-4 w-4" /> Adicionar pose
              </button>
            </div>
          </div>
        </header>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">
          {trip.sections.map((s: string, idx: number) => (
            <button
              key={s}
              onClick={() => setActiveSection(idx)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs transition ${
                activeSection === idx ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {sectionPoses.map((p: any, idx: number) => {
            const status = idx % 3 === 0 ? "feita" : idx % 3 === 1 ? "para_fazer" : "pulada";
            const Icon = status === "feita" ? CheckCircle2 : status === "pulada" ? SkipForward : Circle;
            const color = status === "feita" ? "text-emerald-300" : status === "pulada" ? "text-muted-foreground" : "text-foreground/70";
            return (
              <Link key={p.id} to="/pose/$id" params={{ id: p.id }} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card/60 p-3 hover:border-primary/40">
                <Icon className={`h-5 w-5 shrink-0 ${color}`} />
                <img src={p.image_url} alt={p.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold leading-tight">{p.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground capitalize">{status.replace("_", " ")}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}