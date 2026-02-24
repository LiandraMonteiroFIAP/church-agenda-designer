import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import html2canvas from "html2canvas";
import JsonEditor from "@/components/JsonEditor";
import StoryPreview from "@/components/StoryPreview/StoryPreview";
import { DEFAULT_AGENDA } from "@/types/agenda";
import { parseAgenda } from "@/lib/utils";

const Index = () => {
  const [jsonText, setJsonText] = useState(() =>  localStorage.getItem("agendaData") || JSON.stringify(DEFAULT_AGENDA, null, 2));
  const [exporting, setExporting] = useState(false);
  const [previewSize] = useState({ width: 1080, height: 1920 });
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const { data, error } = useMemo(() => parseAgenda(jsonText), [jsonText]);

  const handleExport = useCallback(async () => {
    if (!previewRef.current || !data) return;
    setExporting(true);
    try {
      const canvas = await html2canvas(previewRef.current, {
        scale: 4,
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#000000", // transparente
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
  }, [data, previewSize]);

  const convertFileToBase64 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setBase64Image(base64String);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="dark h-screen bg-slate-900 bg-muted/40">
      <header className="text-center p-8">
        <h1
          className="text-3xl sm:text-2xl font-bold text-foreground"
          style={{ fontFamily: "'Nunito Sans', sans-serif" }}
        >
          Gerador de Agenda Semanal
        </h1>
        <p className="text-sm text-muted-foreground">Edite o JSON e exporte a imagem.</p>
      </header>

      <div className="flex gap-6 max-w-[1600px] mx-auto p-6 border-sky-900 border-2 border-solid rounded-lg overflow-hidden relative">
        <div className="w-[480px] shrink-0">
          <form>
            <h2 className="text-lg font-semibold font-[Quicksand] text-foreground">
              Local background image (opcional):
            </h2>
            <input
              type="file"
              onChange={convertFileToBase64}
              className="flex-1 mb-4 w-full rounded-lgborder-input bg-card text-foreground px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </form>

          <JsonEditor
            jsonText={jsonText}
            onJsonChange={setJsonText}
            isValid={!!data}
            error={error}
            onExport={handleExport}
            exporting={exporting}
          />
        </div>

        <div
          className="flex-1 border-2 border-sky-900 border-solid rounded-lg overflow-hidden relative"
        >
          <StoryPreview
            data={data}
            previewSize={previewSize}
            base64Image={base64Image}
            previewRef={previewRef}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
