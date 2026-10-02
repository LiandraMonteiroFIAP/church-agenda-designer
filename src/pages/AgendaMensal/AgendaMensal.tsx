import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import JsonEditor from "@/components/JsonEditor";
import { MonthlyStory } from "@/components/MonthlyStory/MonthlyStory";
import { DEFAULT_MONTHLY, parseMonthly } from "@/types/monthly";
import "./style.css";

export default function AgendaMensal() {
  const [text, setText] = useState(() => localStorage.getItem("agendaMensalData") || JSON.stringify(DEFAULT_MONTHLY, null, 2));
  const [exporting, setExporting] = useState(false);
  const [scale, setScale] = useState(0.35);
  const previewContainer = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const { data, error } = useMemo(() => parseMonthly(text), [text]);

  useEffect(() => {
    const container = previewContainer.current;
    if (!container) return;
    const update = () => setScale(Math.min(container.clientWidth / 1080, 720 / 1920));
    const observer = new ResizeObserver(update);
    observer.observe(container);
    update();
    return () => observer.disconnect();
  }, []);

  async function exportPng() {
    if (!data || !storyRef.current) return;
    setExporting(true);
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(storyRef.current, {
        width: 1080,
        height: 1920,
        scale: 1,
        backgroundColor: null,
        useCORS: true,
        onclone: document => {
          const wrapper = document.querySelector<HTMLElement>(".monthly-story-scale");
          if (wrapper) wrapper.style.transform = "none";
        },
      });
      const link = document.createElement("a");
      link.download = `agenda-mensal-${data.mes}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Erro ao exportar agenda mensal:", err);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="monthly-page">
      <header className="monthly-page-header">
        <Link to="/" className="monthly-back" aria-label="Voltar à página inicial" title="Voltar à página inicial"><ArrowLeft size={20} /></Link>
        <div><h1>Agenda Mensal</h1><p>Edite o JSON e exporte a imagem.</p></div>
      </header>
      <div className="monthly-workspace">
        <div className="monthly-editor">
          <JsonEditor localStorageKey="agendaMensalData" jsonText={text} onJsonChange={setText} isValid={!!data} error={error} onExport={exportPng} exporting={exporting} />
        </div>
        <div className="monthly-preview-panel">
          <div className="monthly-preview-label">Pré-visualização · 1080 × 1920</div>
          <div className="monthly-preview-container" ref={previewContainer}>
            {data ? (
              <div className="monthly-story-scale" style={{ width: 1080, height: 1920, transform: `scale(${scale})`, transformOrigin: "top left" }}>
                <MonthlyStory data={data} storyRef={storyRef} />
              </div>
            ) : <div className="monthly-invalid">JSON inválido — corrija para ver a agenda.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}