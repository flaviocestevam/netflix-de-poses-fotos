import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, Mail, Lock, Wand2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Entrar — Netflix de Poses" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/" });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Bem-vinda de volta ✨");
        navigate({ to: "/" });
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin, data: { name } },
        });
        if (error) throw error;
        toast.success("Conta criada! Já pode entrar.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          email, options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Link mágico enviado para o seu e-mail");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Algo deu errado");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600&auto=format&fit=crop" alt="" className="h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/80 to-background" />
      </div>
      <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-rose text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-xl font-bold">Netflix de Poses</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Área da cliente</div>
          </div>
        </div>
        <h1 className="font-display text-4xl font-bold leading-tight text-balance">Acesse sua biblioteca premium de poses</h1>
        <p className="mt-3 text-sm text-muted-foreground text-balance">2.000 poses de casal para suas viagens ficarem lindas, sem briga e sem estresse.</p>
        <div className="mt-8 flex gap-1 rounded-full border border-border/60 bg-card/60 p-1 text-xs">
          {(["signin","signup","magic"] as const).map((k) => (
            <button key={k} type="button" onClick={() => setMode(k)} className={`flex-1 rounded-full px-3 py-2 transition ${mode === k ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
              {k === "signin" ? "Entrar" : k === "signup" ? "Criar conta" : "Link mágico"}
            </button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name" className="text-xs uppercase tracking-wide text-muted-foreground">Nome</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 h-12" />
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-xs uppercase tracking-wide text-muted-foreground">E-mail</Label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="h-12 pl-10" placeholder="voce@email.com" />
            </div>
          </div>
          {mode !== "magic" && (
            <div>
              <Label htmlFor="password" className="text-xs uppercase tracking-wide text-muted-foreground">Senha</Label>
              <div className="relative mt-1">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} className="h-12 pl-10" placeholder="••••••••" />
              </div>
            </div>
          )}
          <Button type="submit" disabled={loading} className="h-12 w-full gradient-rose text-base font-semibold text-primary-foreground hover:opacity-90">
            {loading ? "Aguarde..." : mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : (<span className="inline-flex items-center gap-2"><Wand2 className="h-4 w-4" /> Enviar link mágico</span>)}
          </Button>
        </form>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link to="/auth" className="hover:text-foreground">Preciso de ajuda para acessar</Link>
        </p>
      </div>
    </div>
  );
}