export type MonthlyEvent = {
  titulo: string;
  tipo: "semanal" | "especial";
  cor: string;
  diaSemana?: number;
  datas?: string[];
};

export type MonthlyAgenda = {
  mes: string;
  eventos: MonthlyEvent[];
};

export const DEFAULT_MONTHLY: MonthlyAgenda = {
  mes: "2026-10",
  eventos: [
    { titulo: "Culto da Família", tipo: "semanal", diaSemana: 0, cor: "#3095d5" },
    { titulo: "Sala de Oração", tipo: "semanal", diaSemana: 1, cor: "#38aa5b" },
    { titulo: "Família em Oração", tipo: "semanal", diaSemana: 3, cor: "#f05c31" },
    { titulo: "Pequena Família", tipo: "semanal", diaSemana: 5, cor: "#f7b13e" },
    { titulo: "Capão Jovem", tipo: "especial", datas: ["2026-10-03", "2026-10-17"], cor: "#dba8e8" },
    { titulo: "Encontro de Casais", tipo: "especial", datas: ["2026-10-24"], cor: "#dba8e8" },
    { titulo: "Conferência Geral de Mulheres", tipo: "especial", datas: ["2026-10-31"], cor: "#dba8e8" },
  ],
};

const datePattern = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;
const colorPattern = /^#[0-9a-fA-F]{6}$/;

export function parseMonthly(text: string): { data: MonthlyAgenda | null; error: string | null } {
  try {
    const value: unknown = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      return { data: null, error: "O JSON precisa ser um objeto." };
    }
    const agenda = value as Record<string, unknown>;
    if (typeof agenda.mes !== "string" || !/^\d{4}-(0[1-9]|1[0-2])$/.test(agenda.mes)) {
      return { data: null, error: "'mes' deve seguir o formato AAAA-MM (ex.: 2026-10)." };
    }
    if (!Array.isArray(agenda.eventos)) {
      return { data: null, error: "'eventos' precisa ser uma lista." };
    }
    for (let i = 0; i < agenda.eventos.length; i++) {
      const ev = agenda.eventos[i] as Record<string, unknown> | null;
      const prefix = `Evento ${i + 1}: `;
      if (!ev || typeof ev !== "object" || Array.isArray(ev)) return { data: null, error: prefix + "objeto inválido." };
      if (typeof ev.titulo !== "string" || !ev.titulo.trim()) return { data: null, error: prefix + "'titulo' é obrigatório." };
      if (ev.tipo !== "semanal" && ev.tipo !== "especial") return { data: null, error: prefix + "'tipo' deve ser 'semanal' ou 'especial'." };
      if (typeof ev.cor !== "string" || !colorPattern.test(ev.cor)) return { data: null, error: prefix + "'cor' deve ser hexadecimal, como #3095d5." };
      if (ev.tipo === "semanal" && (!Number.isInteger(ev.diaSemana) || (ev.diaSemana as number) < 0 || (ev.diaSemana as number) > 6)) {
        return { data: null, error: prefix + "'diaSemana' deve ser de 0 (domingo) a 6 (sábado)." };
      }
      if (ev.tipo === "especial") {
        if (!Array.isArray(ev.datas) || ev.datas.length === 0 || ev.datas.some((d: unknown) => {
          if (typeof d !== "string" || !datePattern.test(d) || !d.startsWith(agenda.mes as string)) return true;
          const [year, month, day] = d.split("-").map(Number);
          return new Date(year, month - 1, day).getDate() !== day;
        })) return { data: null, error: prefix + "'datas' deve conter datas válidas do mês, no formato AAAA-MM-DD." };
      }
    }
    return { data: agenda as MonthlyAgenda, error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error.message : "JSON inválido." };
  }
}

export function monthInfo(month: string) {
  const [year, monthNumber] = month.split("-").map(Number);
  const firstWeekday = new Date(year, monthNumber - 1, 1).getDay();
  const days = new Date(year, monthNumber, 0).getDate();
  const name = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(year, monthNumber - 1, 1));
  return { year, monthNumber, firstWeekday, days, name: name.charAt(0).toUpperCase() + name.slice(1) };
}