import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Search, Sparkles, ArrowRight, Zap, Heart, Map, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { diffColor, DIFFICULTY_LABEL, formatSeconds } from "@/lib/np-utils";
import { useState } from "react";
import { AppShell } from "@/components/np/AppShell";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const [q, setQ] = useState("");

  const categoriesQ = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
  const sosQ = useQuery({
    queryKey: ["poses", "sos"],
    queryFn: async () => {
      const { data, error } = await supabase.from("poses").select("*").eq("is_sos", true).limit(12);
      if (error) throw error;
      return data ?? [];
    },
  });
  const fastQ = useQuery({
    queryKey: ["poses", "30s"],
    queryFn: async () => {
      const { data, error } = await supabase.from("poses").select("*").eq("is_30s", true).limit(12);
      if (error) throw error;
      return data ?? [];
    },
  });
  const scriptsQ = useQuery({
    queryKey: ["scripts"],
    queryFn: async () => {
      const { data, error } = await supabase.from("scripts").select("*").limit(8);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="space-y-10">
      <section className="space-y-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Bem-vinda</p>
        <h1 className="font-display text-3xl font-bold leading-tight text-balance md:text-5xl">
          Esta é a sua <span className="italic">Netflix de Poses</span>.
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
          Escolha a pose. Mostre para ele. Tire a foto. Tudo pelo celular, em menos de 30 segundos.
        </p>
        <form onSubmit={(e) => e.preventDefault()} className="relative mt-4 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pose para praia, hotel, aeroporto..." className="h-14 rounded-full border-border/60 bg-card/80 pl-12 pr-4 text-base shadow-lg shadow-black/20" />
        </form>
      </section>

      <section id="sos-hero" className="group relative isolate overflow-hidden rounded-3xl border border-border/60">
        <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1600&auto=format&fit=crop" alt="Casal em viagem" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-tr from-background via-background/85 to-background/10" />
        <div className="relative grid gap-4 p-6 md:grid-cols-2 md:p-12">
          <div className="space-y-4 md:max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Em destaque
            </span>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">SOS Foto Agora</h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Ele está sem paciência? Escolha uma pose rápida e tire uma foto linda em menos de 30 segundos.
            </p>
            <Link to="/sos" className="inline-flex items-center gap-2 rounded-full gradient-rose px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30">
              Usar SOS agora <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "SOS Foto", icon: Sparkles, sub: "Resgate rápido", to: "/sos" },
          { label: "Modo 30s", icon: Zap, sub: "Poses fáceis", to: "/modo-30s" },
          { label: "Roteiros", icon: Map, sub: "Sequências prontas", to: "/roteiros" },
          { label: "Poses Salvas", icon: Heart, sub: "Quero fazer", to: "/favoritos" },
        ].map((t) => {
          const I = t.icon;
          return (
            <Link key={t.label} to={t.to} className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition hover:border-primary/40">
              <span className="grid h-10 w-10 place-items-center rounded-xl gradient-rose text-primary-foreground"><I className="h-5 w-5" /></span>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{t.label}</div>
                <div className="truncate text-xs text-muted-foreground">{t.sub}</div>
              </div>
            </Link>
          );
        })}
      </section>

      <Shelf title="SOS Foto Agora" subtitle="Quando ele está sem paciência" loading={sosQ.isLoading}>
        {sosQ.data?.map((p) => <PoseTile key={p.id} pose={p} />)}
      </Shelf>
      <Shelf title="Poses rápidas de 30 segundos" subtitle="Cenários do dia a dia" loading={fastQ.isLoading}>
        {fastQ.data?.map((p) => <PoseTile key={p.id} pose={p} />)}
      </Shelf>
      <Shelf title="Onde vocês estão agora?" subtitle="Escolha o cenário" loading={categoriesQ.isLoading}>
        {categoriesQ.data?.filter((c) => c.category_type === "cenario").map((c) => <CategoryTile key={c.id} cat={c} />)}
      </Shelf>
      <Shelf title="Categorias mais usadas" subtitle="As favoritas das clientes" loading={categoriesQ.isLoading}>
        {categoriesQ.data?.filter((c) => c.category_type === "emocional").map((c) => <CategoryTile key={c.id} cat={c} />)}
      </Shelf>
      <Shelf title="Roteiros de viagem" subtitle="Sequências prontas de poses" loading={scriptsQ.isLoading}>
        {scriptsQ.data?.map((s) => (
          <Link to="/roteiros/$id" params={{ id: s.id }} key={s.id} className="group relative block w-[260px] shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card">
            <div className="relative aspect-[4/5]">
              <img src={s.cover_image ?? ""} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="text-[10px] uppercase tracking-wide text-primary">{s.scenario}</div>
                <div className="font-display text-lg font-semibold leading-tight">{s.title}</div>
                <div className="mt-1 text-xs text-muted-foreground">{s.total_poses} poses</div>
              </div>
            </div>
          </Link>
        ))}
      </Shelf>

      <section className="rounded-3xl border border-border/60 bg-card/60 p-6 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="text-xs uppercase tracking-[0.2em] text-primary">Downloads bônus</div>
            <h3 className="mt-2 font-display text-2xl font-bold md:text-3xl">A melhor experiência é online</h3>
            <p className="mt-2 text-sm text-muted-foreground">Use a Netflix de Poses pelo celular escolhendo a pose certa no momento certo. Os packs são bônus.</p>
          </div>
          <Link to="/downloads" className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-secondary px-5 py-3 text-sm font-medium hover:bg-secondary/70">
            <Download className="h-4 w-4" /> Ver packs bônus
          </Link>
        </div>
      </section>
    </div>
  );
}

function Shelf({ id, title, subtitle, loading, children }: { id?: string; title: string; subtitle?: string; loading?: boolean; children: React.ReactNode }) {
  return (
    <section id={id}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-bold md:text-2xl">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground md:text-sm">{subtitle}</p>}
        </div>
      </div>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 scrollbar-none md:mx-0 md:px-0">
        {loading ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] w-[180px] shrink-0 animate-pulse rounded-2xl bg-card" />) : children}
      </div>
    </section>
  );
}

function PoseTile({ pose }: { pose: any }) {
  return (
    <Link to="/pose/$id" params={{ id: pose.id }} className="group relative block w-[180px] shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-card md:w-[220px]">
      <div className="relative aspect-[3/4]">
        <img src={pose.image_url} alt={pose.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute left-2 top-2 flex gap-1">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] backdrop-blur ${diffColor(pose.difficulty)}`}>{DIFFICULTY_LABEL[pose.difficulty]}</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="line-clamp-2 text-sm font-semibold leading-tight">{pose.title}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">{formatSeconds(pose.estimated_seconds)}</div>
        </div>
      </div>
    </Link>
  );
}

function CategoryTile({ cat }: { cat: any }) {
  return (
    <Link to="/categorias/$slug" params={{ slug: cat.slug }} className="group relative block w-[220px] shrink-0 overflow-hidden rounded-2xl border border-border/60 md:w-[260px]">
      <div className="relative aspect-[4/5]">
        <img src={cat.cover_image} alt={cat.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <div className="text-[10px] uppercase tracking-wide text-primary">{cat.tag}</div>
          <div className="font-display text-xl font-bold">{cat.name}</div>
          <div className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{cat.description}</div>
          <div className="mt-2 text-[11px] text-foreground/80">{cat.pose_count} poses</div>
        </div>
      </div>
    </Link>
  );
}
