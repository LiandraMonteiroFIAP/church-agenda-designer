export interface CapaYoutubeData {
  backgroundImage: string;
  ministro: string;
  titulo: string[];
  ministerio: "geral" | "jovens";
  opacidade?: number;
  cor?: string;
}

export const DEFAULT_CAPA_YOUTUBE: CapaYoutubeData = {
  backgroundImage:  "/assets/capa-youtube-placeholder.JPG",
  ministro: "Edson Deveza",
  titulo: ["Não fique fora do", "Descanso", "de Deus"],
  ministerio: "geral",
  opacidade: 0.5,
  cor: "#005aa9"
};
