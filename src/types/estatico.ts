type Ministerio = "geral" | "casais" | "kids" | "jovens" | "mulheres" | "homens" | "oracao" | "alternativo";

export interface EstaticoEvent {
  tipo: "online" | "presencial";
  backgroundImage: string;
  ministerio: Ministerio;
  diaSemana: string;
  titulo: string;
  horario: string;
  local: string;
  descricao?: string;
  opacidade?: number;
}

export const DEFAULT_ESTATICO: EstaticoEvent = {
  tipo: "presencial",
  ministerio: "geral",
  backgroundImage: "../placeholders/estatico-placeholder.JPG",
  diaSemana: "Sexta",
  titulo: "Sala de Oração",
  horario: "20:30",
  local: "Via Zoom",
  descricao: "Um culto de oração.",
  opacidade: 0.5,
};
