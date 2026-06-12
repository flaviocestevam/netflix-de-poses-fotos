import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/np/AppShell";
import { PoseCard } from "@/components/np/PoseCard";
import { Zap } from "lucide-react";

export const Route = createFileRoute("/modo-30s")({
  component: Mode30sPage,
});

function Mode30sPage() {
  const q = useQuery({
    queryKey: ["30s-poses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("poses").select("*").eq("is_30s", true).order("estimated_seconds").limit(48);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/15 via-background to-background p-6 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-200">
            <Zap className="h-3.5 w-3.5" /> Modo 30 segundos
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-5xl">Foto linda sem complicar</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
            Poses simples que você executa em menos de 30 segundos. Tudo pelo celular.
          </p>
        </header>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {q.data?.map((p) => <PoseCard key={p.id} pose={p} />)}
        </div>
      </div>
    </AppShell>
  );
}