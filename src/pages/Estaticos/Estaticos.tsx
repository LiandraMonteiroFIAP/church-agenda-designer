import "./style.css";
import React, { useState, useRef, useCallback, useMemo } from "react";
import html2canvas from "html2canvas";
import JsonEditor from "@/components/JsonEditor";
import { DEFAULT_ESTATICO, TEMPLATES_DEFAULT } from "@/types/estatico";
import { parseEstatico, convertFileToBase64 } from "@/lib/utils";
import EstaticosTemplate from "@/components/EstaticosTemplate/EstaticosTemplate";


const Estaticos = () => {
    const [jsonText, setJsonText] = useState(
        () => localStorage.getItem("estaticoData") || JSON.stringify(DEFAULT_ESTATICO, null, 2),
    );
    const [exporting, setExporting] = useState(false);
    const [previewSize] = useState({ width: 1080, height: 1920 });
    const [base64Image, setBase64Image] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);
    const { data, error } = useMemo(() => parseEstatico(jsonText), [jsonText]);

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
            link.download = "estatico.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) {
            console.error("Export error:", err);
        } finally {
            setExporting(false);
        }
    }, [data, previewSize]);

    return (
        <div className="page-index min-h-screen dark bg-stone-900 bg-muted/40">
            <header className="text-center p-8">
                <h1
                    className="text-3xl sm:text-2xl font-bold text-foreground"
                    style={{ fontFamily: "'Nunito Sans', sans-serif" }}
                >
                    Gerador de Estático de Eventos
                </h1>
                <p className="text-sm text-muted-foreground">Edite o JSON e exporte a imagem.</p>
            </header>

            <div className="gerador-container h-full flex sm:justify-center gap-6 max-w-[1600px] mx-auto p-6 border-stone-600 border-2 border-solid rounded-lg relative">
                <div className="editor-container w-[480px] shrink-0 ">
                    <div>
                        <h2 className="text-lg font-semibold font-[Quicksand] text-foreground mb-2">
                            Presets:
                        </h2>
                        <div className="flex gap-2 mb-6">
                            {TEMPLATES_DEFAULT.map((template, index) => {
                                const isSelected = jsonText === JSON.stringify(template, null, 2);
                                return (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setJsonText(JSON.stringify(template, null, 2))
                                        }
                                        className={`block text-size text-center px-2 py-2 mb-2 rounded-lg border text-foreground border-stone-400 ${isSelected ? "bg-stone-700" : "hover:bg-stone-700"}`}
                                    >
                                        {template.titulo}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <form>
                        <h2 className="text-lg font-semibold font-[Quicksand] text-foreground">
                            Local background image (opcional):
                        </h2>
                        <input
                            type="file"
                            onChange={(e) => {convertFileToBase64(e, setBase64Image)}} 
                            className="flex-1 mb-4 w-full rounded-lgborder-input bg-card text-foreground px-4 py-3 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                    </form>

                    <JsonEditor
                        localStorageKey={"estaticoData"}
                        jsonText={jsonText}
                        onJsonChange={setJsonText}
                        isValid={!!data}
                        error={error}
                        onExport={handleExport}
                        exporting={exporting}
                    />
                </div>

                <div className="preview-container flex-1 border-2 border-stone-600 border-solid rounded-lg overflow-hidden relative">
                    <EstaticosTemplate
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

export default Estaticos;
