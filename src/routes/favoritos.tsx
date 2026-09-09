import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/np/AppShell";
import { PoseCard } from "@/components/np/PoseCard";
import { supabase } from "@/integrations/supabase/client";
import { getSavedPoseIds, subscribeSavedPoses } from "@/lib/saved-poses";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favoritos")({
  component: SavedPosesPage,
});

function SavedPosesPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);

  useEffect(() => {
    setSavedIds(getSavedPoseIds());
    return subscribeSavedPoses(setSavedIds);
  }, []);

  const posesQ = useQuery({
    queryKey: ["saved-poses", savedIds],
    enabled: savedIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase.from("poses").select("*").in("id", savedIds);
      if (error) throw error;
      const poses = data ?? [];
      return poses.sort((a, b) => savedIds.indexOf(a.id) - savedIds.indexOf(b.id));
    },
  });

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Salvas</p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Suas poses para fazer</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Toque no coração de qualquer pose para guardar aqui. Não precisa criar conta — suas escolhas ficam salvas neste aparelho e navegador.
          </p>
        </header>

        {savedIds.length === 0 ? (
          <div className="rounded-3xl border border-border/60 bg-card/60 p-8 text-center md:p-12">
            <Heart className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 font-display text-2xl font-bold">Você ainda não salvou nenhuma pose</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Explore o catálogo e toque no coração das poses que quer fazer durante a viagem.
            </p>
            <Link to="/dashboard" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground">
              Explorar poses
            </Link>
          </div>
        ) : posesQ.isLoading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: Math.min(savedIds.length, 8) }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-card" />
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{savedIds.length} {savedIds.length === 1 ? "pose salva" : "poses salvas"}</p>
              <Link to="/dashboard" className="text-sm font-medium text-primary hover:underline">Adicionar mais</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {posesQ.data?.map((pose) => <PoseCard key={pose.id} pose={pose} />)}
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
