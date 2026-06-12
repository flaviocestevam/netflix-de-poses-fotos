import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/np/AppShell";
import { PoseCard } from "@/components/np/PoseCard";
import { ChevronLeft, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/roteiros/$id")({
  component: ScriptDetailPage,
});

function ScriptDetailPage() {
  const { id } = Route.useParams();

  const scriptQ = useQuery({
    queryKey: ["script", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("scripts").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const posesQ = useQuery({
    queryKey: ["script-poses", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("script_poses")
        .select("order_number, poses(*)")
        .eq("script_id", id)
        .order("order_number");
      if (error) throw error;
      return (data ?? []).map((r: any) => r.poses).filter(Boolean);
    },
  });

  const s = scriptQ.data;
  return (
    <AppShell>
      <div className="space-y-8">
        <Link to="/roteiros" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Todos os roteiros
        </Link>
        {s && (
          <header className="relative isolate overflow-hidden rounded-3xl border border-border/60">
            <img src={s.cover_image ?? ""} alt={s.title} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/85 to-background/20" />
            <div className="relative space-y-3 p-6 md:p-12">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{s.scenario}</p>
              <h1 className="font-display text-3xl font-bold md:text-5xl">{s.title}</h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">{s.description}</p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button className="gradient-rose text-primary-foreground"><Play className="mr-2 h-4 w-4" /> Iniciar roteiro</Button>
                <span className="text-xs text-foreground/70">{s.total_poses} poses</span>
              </div>
            </div>
          </header>
        )}

        <div className="space-y-3">
          {posesQ.data?.map((p: any, idx: number) => (
            <Link
              key={p.id}
              to="/pose/$id"
              params={{ id: p.id }}
              className="group flex gap-4 rounded-2xl border border-border/60 bg-card/60 p-3 transition hover:border-primary/40"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                {idx + 1}
              </div>
              <img src={p.image_url} alt={p.title} className="h-20 w-20 shrink-0 rounded-xl object-cover md:h-24 md:w-24" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-base font-semibold leading-tight md:text-lg">{p.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground md:text-sm">{p.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AppShell>
  );
}