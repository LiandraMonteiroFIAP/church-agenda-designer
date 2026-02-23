export interface AgendaEvent {
  diaSemana: string;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  cor: "primaria" | "secundaria" | string;
}

export interface AgendaData {
  backgroundImage: string;
  events: AgendaEvent[];
}

export const DEFAULT_AGENDA: AgendaData = {
  backgroundImage: "https://images.unsplash.com/photo-1507692049790-de58290a4334?w=1080&q=80",
  events: [
    {
      diaSemana: "SEG",
      titulo: "Sala de Oração",
      data: "02 Mar",
      horario: "20:30",
      local: "Via Zoom",
      cor: "primaria"
    },
    {
      diaSemana: "QUA",
      titulo: "Família em Oração",
      data: "04 Mar",
      horario: "20:30",
      local: "Na Igreja",
      cor: "secundaria"
    },
    {
      diaSemana: "QUI",
      titulo: "Pequena Família",
      data: "05 Mar",
      horario: "20:30",
      local: "Nas Casas",
      cor: "primaria"
    },
    {
      diaSemana: "SEX",
      titulo: "Pequena Família",
      data: "06 Mar",
      horario: "20:30",
      local: "Nas Casas",
      cor: "primaria"
    },
    {
      diaSemana: "SAB",
      titulo: "Encontro de Mulheres",
      data: "07 Mar",
      horario: "18:00",
      local: "Na Igreja",
      cor: "secundaria"
    },
    {
      diaSemana: "DOM",
      titulo: "Culto da Família",
      data: "08 Mar",
      horario: "18:00",
      local: "Na Igreja",
      cor: "primaria"
    }
  ]
};
