import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AppShell } from "@/components/np/AppShell";
import { PoseCard } from "@/components/np/PoseCard";
import { Sparkles, Zap, Heart, Smile } from "lucide-react";
import { useState } from "react";

const FEELINGS = [
  { key: "impaciente", label: "Ele está sem paciência", icon: Zap },
  { key: "envergonhada", label: "Estou com vergonha", icon: Heart },
  { key: "rapido", label: "Tem 30 segundos", icon: Sparkles },
  { key: "natural", label: "Quero algo natural", icon: Smile },
];

export const Route = createFileRoute("/sos")({
  component: SosPage,
});

function SosPage() {
  const [feeling, setFeeling] = useState<string | null>(null);

  const posesQ = useQuery({
    queryKey: ["sos-poses"],
    queryFn: async () => {
      const { data, error } = await supabase.from("poses").select("*").eq("is_sos", true).order("estimated_seconds").limit(24);
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="relative isolate overflow-hidden rounded-3xl border border-rose-500/30 bg-gradient-to-br from-rose-500/15 via-background to-background p-6 md:p-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-rose-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-200">
            <Sparkles className="h-3.5 w-3.5" /> SOS Foto Agora
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold md:text-5xl">Respira. A pose certa está aqui.</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
            Escolha como você está se sentindo agora. Vamos sugerir poses rápidas e fáceis.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {FEELINGS.map((f) => {
            const I = f.icon;
            const active = feeling === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setFeeling(active ? null : f.key)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  active ? "border-primary bg-primary/10" : "border-border/60 bg-card hover:border-primary/30"
                }`}
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl gradient-rose text-primary-foreground"><I className="h-5 w-5" /></span>
                <span className="text-sm font-medium leading-tight">{f.label}</span>
              </button>
            );
          })}
        </div>

        <div>
          <h2 className="mb-3 font-display text-2xl font-bold">Poses sugeridas para agora</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {posesQ.data?.map((p) => <PoseCard key={p.id} pose={p} />)}
          </div>
        </div>
      </div>
    </AppShell>
  );
}