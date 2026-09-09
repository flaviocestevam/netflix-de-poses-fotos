const STORAGE_KEY = "netflix-de-poses:saved-pose-ids";
const CHANGE_EVENT = "netflix-de-poses:saved-poses-changed";

export function getSavedPoseIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function isPoseSaved(id: string): boolean {
  return getSavedPoseIds().includes(id);
}

export function toggleSavedPose(id: string): boolean {
  const current = getSavedPoseIds();
  const saved = current.includes(id);
  const next = saved ? current.filter((poseId) => poseId !== id) : [...current, id];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: next }));
  return !saved;
}

export function subscribeSavedPoses(callback: (ids: string[]) => void) {
  if (typeof window === "undefined") return () => {};

  const onCustom = (event: Event) => {
    const detail = (event as CustomEvent<string[]>).detail;
    callback(Array.isArray(detail) ? detail : getSavedPoseIds());
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) callback(getSavedPoseIds());
  };

  window.addEventListener(CHANGE_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
