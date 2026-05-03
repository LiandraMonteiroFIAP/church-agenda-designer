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

export const DEFAULT_FAMILIA_ORACAO: EstaticoEvent = {
  tipo: "presencial",
  ministerio: "geral",
  backgroundImage: "../placeholders/estatico-placeholder.JPG",
  diaSemana: "Quarta",
  titulo: "Família em Oração",
  horario: "20:30",
  local: "Na Igreja",
  opacidade: 0.5,
};

export const DEFAULT_PF: EstaticoEvent = {
  tipo: "presencial",
  ministerio: "geral",
  backgroundImage: "../placeholders/estatico-placeholder.JPG",
  diaSemana: "Sexta",
  titulo: "Pequena Família",
  horario: "20:30",
  local: "Nas casas",
  opacidade: 0.2,
};

export const DEFAULT_JOVENS: EstaticoEvent = {
  tipo: "presencial",
  ministerio: "jovens",
  backgroundImage: "../placeholders/estatico-placeholder.JPG",
  diaSemana: "Sábado",
  titulo: "Capão Jovem",
  horario: "18:00",
  local: "Na Igreja",
  opacidade: 0.2,
};

export const TEMPLATES_DEFAULT: EstaticoEvent[] = [DEFAULT_ESTATICO, DEFAULT_FAMILIA_ORACAO, DEFAULT_PF, DEFAULT_JOVENS];
