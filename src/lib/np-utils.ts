export const DIFFICULTY_LABEL: Record<string, string> = {
  muito_facil: "Muito fácil",
  facil: "Fácil",
  medio: "Médio",
  avancado: "Avançado",
};

export const STYLE_LABEL: Record<string, string> = {
  romantica: "Romântica",
  divertida: "Divertida",
  natural: "Natural",
  elegante: "Elegante",
  instagramavel: "Instagramável",
  espontanea: "Espontânea",
  discreta: "Discreta",
  criativa: "Criativa",
  lifestyle: "Lifestyle",
};

export const FRAMING_LABEL: Record<string, string> = {
  corpo_inteiro: "Corpo inteiro",
  meio_corpo: "Meio corpo",
  close: "Close",
  de_costas: "De costas",
  sentados: "Sentados",
  caminhando: "Caminhando",
  abracados: "Abraçados",
};

export function formatSeconds(s: number) {
  if (s <= 30) return "30 segundos";
  if (s <= 60) return "1 minuto";
  if (s <= 180) return "3 minutos";
  return "Ensaio completo";
}

export function diffColor(diff: string) {
  switch (diff) {
    case "muito_facil": return "bg-emerald-500/20 text-emerald-200 border-emerald-500/30";
    case "facil": return "bg-sky-500/20 text-sky-200 border-sky-500/30";
    case "medio": return "bg-amber-500/20 text-amber-200 border-amber-500/30";
    case "avancado": return "bg-rose-500/20 text-rose-200 border-rose-500/30";
    default: return "bg-muted text-muted-foreground";
  }
}