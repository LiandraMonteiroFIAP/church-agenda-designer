import React, { useState, useRef, useCallback, useMemo } from "react";
import html2canvas from "html2canvas";
import JsonEditor from "@/components/JsonEditor";
import StoryPreview from "@/components/StoryPreview";
import { DEFAULT_AGENDA, type AgendaData } from "@/types/agenda";

function parseAgenda(text: string): { data: AgendaData | null; error: string | null } {
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

const Index = () => {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(DEFAULT_AGENDA, null, 2));
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const { data, error } = useMemo(() => parseAgenda(jsonText), [jsonText]);

  const handleExport = useCallback(async () => {
    if (!previewRef.current || !data) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        width: 1080,
        height: 1920,
        scale: 1,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#1a1a2e",
      });
      const link = document.createElement("a");
      link.download = "agenda-semanal.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Export error:", err);
    } finally {
      setExporting(false);
    }
  }, [data]);

  return (
    <div className="min-h-screen bg-muted/40 p-6">

      <header className="mb-6 text-center">
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "'Quicksand', sans-serif" }}
        >
          Gerador de Agenda Semanal
        </h1>
        <p className="text-sm text-muted-foreground">
          Edite o JSON e exporte a imagem para o Instagram Stories
        </p>
      </header>

      <div className="flex gap-6 max-w-[1600px] mx-auto" style={{ minHeight: "calc(100vh - 140px)" }}>
        {/* Left: Editor */}
        <div className="w-[420px] shrink-0">
          <JsonEditor
            jsonText={jsonText}
            onJsonChange={setJsonText}
            isValid={!!data}
            error={error}
            onExport={handleExport}
            exporting={exporting}
          />
        </div>

        {/* Right: Preview (scaled) */}
        <div className="flex-1 flex items-start justify-center overflow-auto">
          <div
            style={{
              width: 1080,
              height: 1920,
              transform: "scale(0.42)",
              transformOrigin: "top center",
            }}
          >
            <StoryPreview data={data} previewRef={previewRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
