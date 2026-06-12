import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/np/AppShell";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/downloads")({
  component: DownloadsPage,
});

function DownloadsPage() {
  const q = useQuery({
    queryKey: ["downloads"],
    queryFn: async () => {
      const { data, error } = await supabase.from("downloads").select("*").order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bônus</p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Packs para download</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            A melhor experiência é online — esses packs são extras para emergências sem internet.
          </p>
        </header>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {q.data?.map((d) => (
            <div key={d.id} className="group flex gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card p-4">
              <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl">
                <img src={d.cover_image ?? ""} alt={d.title} className="absolute inset-0 h-full w-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="text-[10px] uppercase tracking-wide text-primary">{d.type}</div>
                <div className="font-display text-lg font-bold leading-tight">{d.title}</div>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{d.description}</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <span className="text-[11px] text-foreground/70">{d.total_items ?? "—"} itens</span>
                  <Button size="sm" variant="secondary" onClick={() => toast("Faça login para baixar")}>
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Baixar
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}