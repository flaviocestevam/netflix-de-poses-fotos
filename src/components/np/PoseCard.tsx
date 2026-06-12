import { Link } from "@tanstack/react-router";
import { diffColor, DIFFICULTY_LABEL, formatSeconds } from "@/lib/np-utils";
import { Heart, Plus } from "lucide-react";

export function PoseCard({ pose, compact = false }: { pose: any; compact?: boolean }) {
  return (
    <Link
      to="/pose/$id"
      params={{ id: pose.id }}
      className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-card"
    >
      <div className={`relative ${compact ? "aspect-square" : "aspect-[3/4]"}`}>
        <img
          src={pose.image_url}
          alt={pose.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          <span className={`rounded-full border px-2 py-0.5 text-[10px] backdrop-blur ${diffColor(pose.difficulty)}`}>
            {DIFFICULTY_LABEL[pose.difficulty]}
          </span>
          {pose.is_sos && (
            <span className="rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[10px] text-rose-200 backdrop-blur">
              SOS
            </span>
          )}
        </div>
        <div className="absolute right-2 top-2 flex gap-1">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-background/70 text-foreground/80 backdrop-blur transition group-hover:bg-primary group-hover:text-primary-foreground">
            <Heart className="h-3.5 w-3.5" />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="line-clamp-2 text-sm font-semibold leading-tight">{pose.title}</div>
          <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>{formatSeconds(pose.estimated_seconds)}</span>
            <span className="inline-flex items-center gap-1 text-primary">
              <Plus className="h-3 w-3" /> Viagem
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}