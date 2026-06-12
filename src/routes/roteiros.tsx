import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/np/AppShell";
import { Map } from "lucide-react";

export const Route = createFileRoute("/roteiros")({
  component: ScriptsPage,
});

function ScriptsPage() {
  const q = useQuery({
    queryKey: ["scripts-all"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scripts").select("*").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Roteiros</p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Sequências prontas de poses</h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Roteiros guiados para cenários completos: aeroporto, hotel, jantar romântico, pôr do sol e mais.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {q.data?.map((s) => (
            <Link key={s.id} to="/roteiros/$id" params={{ id: s.id }} className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card">
              <div className="relative aspect-[4/5]">
                <img src={s.cover_image ?? ""} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="text-[10px] uppercase tracking-wide text-primary">{s.scenario}</div>
                  <div className="font-display text-2xl font-bold leading-tight">{s.title}</div>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{s.description}</p>
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] text-foreground/80">
                    <Map className="h-3.5 w-3.5" /> {s.total_poses} poses
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}