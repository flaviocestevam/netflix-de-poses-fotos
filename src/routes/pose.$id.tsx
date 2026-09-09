import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/np/AppShell";
import { ChevronLeft, Heart, Share2, Download, Sparkles, Clock, User as UserIcon, Users } from "lucide-react";
import { diffColor, DIFFICULTY_LABEL, formatSeconds, STYLE_LABEL, FRAMING_LABEL } from "@/lib/np-utils";
import { isPoseSaved, subscribeSavedPoses, toggleSavedPose } from "@/lib/saved-poses";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/pose/$id")({
  component: PoseDetailPage,
});

function PoseDetailPage() {
  const { id } = Route.useParams();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isPoseSaved(id));
    return subscribeSavedPoses(() => setSaved(isPoseSaved(id)));
  }, [id]);

  const poseQ = useQuery({
    queryKey: ["pose", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("poses").select("*").eq("id", id).single();
      if (error) throw error;
      return data;
    },
  });

  const similarQ = useQuery({
    queryKey: ["pose-similar", poseQ.data?.category_id, id],
    enabled: !!poseQ.data?.category_id,
    queryFn: async () => {
      const { data } = await supabase.from("poses").select("*").eq("category_id", poseQ.data!.category_id as string).neq("id", id).limit(8);
      return data ?? [];
    },
  });

  const p = poseQ.data;
  if (poseQ.isLoading) return <AppShell><div className="py-20 text-center text-muted-foreground">Carregando…</div></AppShell>;
  if (!p) return <AppShell><div className="py-20 text-center text-muted-foreground">Pose não encontrada</div></AppShell>;

  async function sharePose() {
    try {
      if (navigator.share) {
        await navigator.share({ title: p.title, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copiado");
      }
    } catch {
      // Usuário pode cancelar o compartilhamento sem erro visível.
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Voltar
        </Link>

        <div className="grid gap-8 md:grid-cols-[1fr_1.1fr]">
          <div className="relative overflow-hidden rounded-3xl border border-border/60">
            <img src={p.image_url ?? ""} alt={p.title} className="aspect-[3/4] w-full object-cover" />
            <div className="pointer-events-none absolute inset-0 flex items-end justify-end p-3">
              <span className="rounded-full bg-background/40 px-2 py-1 text-[9px] uppercase tracking-wider text-foreground/70 backdrop-blur">Netflix de Poses</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-wrap gap-2">
              <span className={`rounded-full border px-3 py-1 text-[10px] ${diffColor(p.difficulty)}`}>{DIFFICULTY_LABEL[p.difficulty]}</span>
              {p.style && <span className="rounded-full border border-border/60 bg-card px-3 py-1 text-[10px]">{STYLE_LABEL[p.style] ?? p.style}</span>}
              {p.framing && <span className="rounded-full border border-border/60 bg-card px-3 py-1 text-[10px]">{FRAMING_LABEL[p.framing] ?? p.framing}</span>}
              {p.is_sos && <span className="rounded-full border border-rose-500/40 bg-rose-500/15 px-3 py-1 text-[10px] text-rose-200">SOS</span>}
              {p.is_30s && <span className="rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-[10px] text-amber-200">30s</span>}
            </div>

            <h1 className="font-display text-3xl font-bold leading-tight md:text-4xl">{p.title}</h1>
            <p className="text-sm text-muted-foreground md:text-base">{p.description}</p>

            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5"><Clock className="h-3.5 w-3.5" /> {formatSeconds(p.estimated_seconds)}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5"><Sparkles className="h-3.5 w-3.5" /> {p.scenario ?? "Geral"}</span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button
                onClick={() => {
                  const next = toggleSavedPose(id);
                  setSaved(next);
                  toast.success(next ? "Pose salva" : "Pose removida das salvas");
                }}
                className={saved ? "gradient-rose text-primary-foreground hover:opacity-90" : ""}
                variant={saved ? "default" : "secondary"}
              >
                <Heart className={`mr-2 h-4 w-4 ${saved ? "fill-current" : ""}`} /> {saved ? "Salva" : "Salvar pose"}
              </Button>
              <Button variant="outline" onClick={sharePose}>
                <Share2 className="mr-2 h-4 w-4" /> Compartilhar
              </Button>
              {p.downloadable && (
                <Button variant="outline" onClick={() => toast("Download em breve")}>
                  <Download className="mr-2 h-4 w-4" /> Baixar
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            { title: "Quando usar", body: p.when_to_use },
            { title: "Como fazer", body: p.how_to_do },
            { title: "O que ela faz", body: p.what_she_does, Icon: UserIcon },
            { title: "O que ele faz", body: p.what_he_does, Icon: Users },
            { title: "Erro comum a evitar", body: p.common_mistake },
            { title: "Dica para ficar natural", body: p.natural_tip },
          ].filter((s) => s.body).map((s) => (
            <div key={s.title} className="rounded-2xl border border-border/60 bg-card/60 p-5">
              <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{s.title}</div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">{s.body}</p>
            </div>
          ))}
        </div>

        {similarQ.data && similarQ.data.length > 0 && (
          <section>
            <h3 className="mb-3 font-display text-xl font-bold">Poses parecidas</h3>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
              {similarQ.data.map((sp) => (
                <Link key={sp.id} to="/pose/$id" params={{ id: sp.id }} className="group relative block w-[160px] shrink-0 overflow-hidden rounded-xl border border-border/60">
                  <div className="relative aspect-[3/4]">
                    <img src={sp.image_url ?? ""} alt={sp.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-2 text-xs font-medium line-clamp-2">{sp.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
