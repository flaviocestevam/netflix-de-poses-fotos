import { Link } from "@tanstack/react-router";
import { diffColor, DIFFICULTY_LABEL, formatSeconds } from "@/lib/np-utils";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { isPoseSaved, subscribeSavedPoses, toggleSavedPose } from "@/lib/saved-poses";

export function PoseCard({ pose, compact = false }: { pose: any; compact?: boolean }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isPoseSaved(pose.id));
    return subscribeSavedPoses(() => setSaved(isPoseSaved(pose.id)));
  }, [pose.id]);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card">
      <Link to="/pose/$id" params={{ id: pose.id }} className="block">
        <div className={`relative ${compact ? "aspect-square" : "aspect-[3/4]"}`}>
          <img
            src={pose.image_url ?? ""}
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
          <div className="absolute inset-x-0 bottom-0 p-3 pr-12">
            <div className="line-clamp-2 text-sm font-semibold leading-tight">{pose.title}</div>
            <div className="mt-1 text-[11px] text-muted-foreground">{formatSeconds(pose.estimated_seconds)}</div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={() => setSaved(toggleSavedPose(pose.id))}
        className={`absolute right-2 top-2 grid h-9 w-9 place-items-center rounded-full border backdrop-blur transition ${
          saved ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-background/75 text-foreground hover:bg-primary hover:text-primary-foreground"
        }`}
        aria-label={saved ? "Remover das poses salvas" : "Salvar pose"}
        title={saved ? "Remover das salvas" : "Salvar pose"}
      >
        <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
      </button>
    </div>
  );
}
