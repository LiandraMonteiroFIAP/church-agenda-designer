import { AgendaData } from "@/types/agenda";
import { MINISTERIOS, type EstaticoEvent } from "@/types/estatico";
import type { CapaYoutubeData } from "@/types/capayoutube";
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

export function parseEstatico(text: string): { data: EstaticoEvent | null; error: string | null } {
  try {
    const parsed = JSON.parse(text);
    if (!parsed.backgroundImage || typeof parsed.backgroundImage !== "string") {
      return { data: null, error: "Campo 'backgroundImage' é obrigatório (string)." };
    }
    if (parsed.tipo !== "online" && parsed.tipo !== "presencial") return { data: null, error: "Campo 'tipo' deve ser 'online' ou 'presencial'." };
    if (!MINISTERIOS.includes(parsed.ministerio)) return { data: null, error: "Campo 'ministerio' inválido." };
    const weekday = typeof parsed.diaSemana === "string" ? parsed.diaSemana.replace(/-feira$/, "") : "";
    if (!["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"].includes(weekday)) return { data: null, error: "Campo 'diaSemana' deve conter um dia da semana válido." };
    if (!Array.isArray(parsed.titulo) || parsed.titulo.some((line: unknown) => typeof line !== "string")) return { data: null, error: "Campo 'titulo' deve ser uma lista de linhas de texto." };
    if (typeof parsed.horario !== "string" || (parsed.horario !== "" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(parsed.horario))) return { data: null, error: "Campo 'horario' deve seguir o formato HH:MM." };
    if (typeof parsed.local !== "string") return { data: null, error: "Campo 'local' deve ser um texto." };
    if (parsed.opacidade !== undefined && (typeof parsed.opacidade !== "number" || !Number.isFinite(parsed.opacidade) || parsed.opacidade < 0 || parsed.opacidade > 1)) return { data: null, error: "Campo 'opacidade' deve ser um número entre 0 e 1." };
    return { data: { ...parsed, diaSemana: weekday } as EstaticoEvent, error: null };
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

export function parseYoutube(text: string): { data: CapaYoutubeData | null; error: string | null } {
  try {
    const parsed = JSON.parse(text);
    if (!parsed.backgroundImage || typeof parsed.backgroundImage !== "string") {
      return { data: null, error: "Campo 'backgroundImage' é obrigatório (string)." };
    }
    if (typeof parsed.ministro !== "string") return { data: null, error: "Campo 'ministro' deve ser um texto." };
    if (!Array.isArray(parsed.titulo) || parsed.titulo.some((line: unknown) => typeof line !== "string")) return { data: null, error: "Campo 'titulo' deve ser uma lista de linhas de texto." };
    if (parsed.ministerio !== "geral" && parsed.ministerio !== "jovens") return { data: null, error: "Campo 'ministerio' deve ser 'geral' ou 'jovens'." };
    if (parsed.opacidade !== undefined && (typeof parsed.opacidade !== "number" || !Number.isFinite(parsed.opacidade) || parsed.opacidade < 0 || parsed.opacidade > 1)) return { data: null, error: "Campo 'opacidade' deve ser um número entre 0 e 1." };
    if (parsed.cor !== undefined && (typeof parsed.cor !== "string" || !/^#[0-9a-fA-F]{6}$/.test(parsed.cor))) return { data: null, error: "Campo 'cor' deve ser hexadecimal, como #005aa9." };
    return { data: parsed as CapaYoutubeData, error: null };
  } catch (e: any) {
    return { data: null, error: e.message };
  }
}
