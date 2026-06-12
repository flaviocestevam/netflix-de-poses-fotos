import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/np/AppShell";
import { PoseCard } from "@/components/np/PoseCard";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { DIFFICULTY_LABEL } from "@/lib/np-utils";

export const Route = createFileRoute("/categorias/$slug")({
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const [diff, setDiff] = useState<string | null>(null);
  const [style, setStyle] = useState<string | null>(null);

  const catQ = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).single();
      if (error) throw error;
      return data;
    },
  });

  const posesQ = useQuery({
    queryKey: ["category-poses", catQ.data?.id, diff, style],
    enabled: !!catQ.data?.id,
    queryFn: async () => {
      let q = supabase.from("poses").select("*").eq("category_id", catQ.data!.id);
      if (diff) q = q.eq("difficulty", diff);
      if (style) q = q.eq("style", style);
      const { data, error } = await q.limit(60);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AppShell>
      <div className="space-y-6">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Link>
        {catQ.data && (
          <header className="relative isolate overflow-hidden rounded-3xl border border-border/60">
            <img src={catQ.data.cover_image ?? ""} alt={catQ.data.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/85 to-background/20" />
            <div className="relative space-y-2 p-6 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{catQ.data.tag}</p>
              <h1 className="font-display text-3xl font-bold md:text-5xl">{catQ.data.name}</h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">{catQ.data.description}</p>
              <p className="text-xs text-foreground/70">{catQ.data.pose_count} poses</p>
            </div>
          </header>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Dificuldade:</span>
          {[null, "muito_facil", "facil", "medio", "avancado"].map((k) => (
            <button
              key={k ?? "all"}
              onClick={() => setDiff(k)}
              className={`rounded-full border px-3 py-1 text-xs ${
                diff === k ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {k ? DIFFICULTY_LABEL[k] : "Todas"}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Estilo:</span>
          {[null, "romantica", "divertida", "natural", "elegante", "instagramavel", "espontanea"].map((k) => (
            <button
              key={k ?? "all"}
              onClick={() => setStyle(k)}
              className={`rounded-full border px-3 py-1 text-xs capitalize ${
                style === k ? "border-primary bg-primary/15 text-primary" : "border-border/60 text-muted-foreground hover:text-foreground"
              }`}
            >
              {k ?? "todos"}
            </button>
          ))}
        </div>

        {posesQ.isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-card" />
            ))}
          </div>
        ) : posesQ.data?.length ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {posesQ.data.map((p) => <PoseCard key={p.id} pose={p} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
            Nenhuma pose encontrada com esses filtros.
          </div>
        )}
      </div>
    </AppShell>
  );
}