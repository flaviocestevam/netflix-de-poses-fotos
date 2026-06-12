import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/np/AppShell";
import { User, Mail, Smartphone, LogOut, HelpCircle, FileText } from "lucide-react";

export const Route = createFileRoute("/conta")({
  component: AccountPage,
});

function AccountPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Conta</p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Minha conta</h1>
        </header>

        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card">
          <div className="flex items-center gap-4 p-6">
            <div className="grid h-14 w-14 place-items-center rounded-full gradient-rose text-primary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div>
              <div className="font-display text-xl font-semibold">Visitante</div>
              <div className="text-xs text-muted-foreground">Modo preview ativo</div>
            </div>
          </div>
          <div className="divide-y divide-border/60 text-sm">
            <Row icon={Mail} label="E-mail" value="—" />
            <Row icon={Smartphone} label="Dispositivos" value="0 de 1" />
            <Row icon={FileText} label="Status" value="Acesso preview" />
          </div>
        </div>

        <div className="grid gap-3">
          <Link to="/como-usar" className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-5 py-4 text-sm hover:border-primary/40">
            <span className="inline-flex items-center gap-3"><HelpCircle className="h-4 w-4 text-primary" /> Como usar a plataforma</span>
            <span className="text-muted-foreground">›</span>
          </Link>
          <Link to="/auth" className="flex items-center justify-between rounded-2xl border border-border/60 bg-card px-5 py-4 text-sm hover:border-primary/40">
            <span className="inline-flex items-center gap-3"><LogOut className="h-4 w-4 text-primary" /> Ir para login</span>
            <span className="text-muted-foreground">›</span>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <span className="inline-flex items-center gap-2 text-muted-foreground"><Icon className="h-4 w-4" /> {label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}