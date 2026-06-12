import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/np/AppShell";
import { Smartphone, Search, Heart, Plane, Play, Sparkles } from "lucide-react";

const STEPS = [
  { icon: Smartphone, title: "Abra pelo celular", body: "A Netflix de Poses funciona melhor pelo seu celular durante a viagem." },
  { icon: Search, title: "Procure pelo momento", body: "Use a busca ou os cenários — aeroporto, hotel, praia, restaurante…" },
  { icon: Sparkles, title: "Mostre a pose para ele", body: "Aponte para a imagem. Ele só precisa copiar — sem precisar de criatividade." },
  { icon: Heart, title: "Favorite o que amou", body: "Toque no coração para guardar para depois." },
  { icon: Plane, title: "Monte sua viagem", body: "Crie pastas por viagem e marque o que já fez no Modo Apresentação." },
  { icon: Play, title: "Use o SOS no aperto", body: "Sem paciência? Toque em SOS e tire uma foto linda em 30 segundos." },
];

export const Route = createFileRoute("/como-usar")({
  component: HowToPage,
});

function HowToPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Como usar</p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">Sua biblioteca, no seu ritmo</h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Em 60 segundos você entende como tirar foto linda em viagem sem briga e sem estresse.
          </p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((s, i) => {
            const I = s.icon;
            return (
              <div key={s.title} className="relative overflow-hidden rounded-2xl border border-border/60 bg-card p-6">
                <div className="absolute right-4 top-3 font-display text-5xl font-bold text-primary/15">{i + 1}</div>
                <span className="grid h-10 w-10 place-items-center rounded-xl gradient-rose text-primary-foreground"><I className="h-5 w-5" /></span>
                <h3 className="mt-4 font-display text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}