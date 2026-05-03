import { AgendaData } from "@/types/agenda";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const BADGE_COLORS: Record<string, string> = {
  primaria: "#1f577d",
  secundaria: "#72624f",
};

export function getBadgeColor(cor: string): string {
  return BADGE_COLORS[cor] || cor;
}

export function parseAgenda(text: string): { data: AgendaData | null; error: string | null } {
  try {
    const parsed = JSON.parse(text);
    if (!parsed.backgroundImage || typeof parsed.backgroundImage !== "string") {
      return { data: null, error: "Campo 'backgroundImage' é obrigatório (string)." };
    }
    if (!Array.isArray(parsed.events) || parsed.events.length === 0) {
      return { data: null, error: "Campo 'events' precisa ser um array com pelo menos 1 evento." };
    }
    for (let i = 0; i < parsed.events.length; i++) {
      const ev = parsed.events[i];
      const fields = ["diaSemana", "titulo", "data", "horario", "local", "cor"];
      for (const f of fields) {
        if (!ev[f] || typeof ev[f] !== "string") {
          return { data: null, error: `Evento ${i + 1}: campo '${f}' ausente ou inválido.` };
        }
      }
    }
    return { data: parsed as AgendaData, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export function parseEstatico(text: string): { data: any | null; error: string | null } {
  try {
    const parsed = JSON.parse(text);
    if (!parsed.backgroundImage || typeof parsed.backgroundImage !== "string") {
      return { data: null, error: "Campo 'backgroundImage' é obrigatório (string)." };
    }
    return { data: parsed, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}

export function convertFileToBase64(e: React.ChangeEvent<HTMLInputElement>, set: React.Dispatch<React.SetStateAction<string | null>>) {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    const base64String = reader.result as string;
    set(base64String);
  };
  reader.readAsDataURL(file);
};

export function parseYoutube(text: string): { data: any | null; error: string | null } {
  try {
    const parsed = JSON.parse(text);
    if (!parsed.backgroundImage || typeof parsed.backgroundImage !== "string") {
      return { data: null, error: "Campo 'backgroundImage' é obrigatório (string)." };
    }
    return { data: parsed, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}