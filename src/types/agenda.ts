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
      data: "24 Fev",
      horario: "20:30",
      local: "Via Zoom",
      cor: "primaria"
    },
    {
      diaSemana: "TER",
      titulo: "Culto de Ensino",
      data: "25 Fev",
      horario: "19:30",
      local: "Templo Principal",
      cor: "secundaria"
    },
    {
      diaSemana: "QUA",
      titulo: "Célula em Casa",
      data: "26 Fev",
      horario: "20:00",
      local: "Diversos Lares",
      cor: "primaria"
    },
    {
      diaSemana: "QUI",
      titulo: "Ensaio do Louvor",
      data: "27 Fev",
      horario: "19:30",
      local: "Templo Principal",
      cor: "secundaria"
    },
    {
      diaSemana: "SEX",
      titulo: "Capão Jovem",
      data: "28 Fev",
      horario: "20:00",
      local: "Salão Social",
      cor: "#4A7C59"
    },
    {
      diaSemana: "DOM",
      titulo: "Culto da Família",
      data: "02 Mar",
      horario: "09:00",
      local: "Templo Principal",
      cor: "primaria"
    },
    {
      diaSemana: "DOM",
      titulo: "Culto da Noite",
      data: "02 Mar",
      horario: "18:00",
      local: "Templo Principal",
      cor: "secundaria"
    }
  ]
};
