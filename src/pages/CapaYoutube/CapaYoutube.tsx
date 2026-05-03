import "./style.css";
import React, { useState, useRef, useCallback, useMemo } from "react";
import JsonEditor from "@/components/JsonEditor";
import { DEFAULT_CAPA_YOUTUBE } from "@/types/capayoutube";
import { parseYoutube, convertFileToBase64 } from "@/lib/utils";
import html2canvas from "html2canvas";
import CapaYoutubeTemplate from "@/components/CapaYoutubeTemplate/CapaYoutubeTemplate";

export const CapaYoutube = () => {
    const [jsonText, setJsonText] = useState(
        () => localStorage.getItem("capaYoutubeData") || JSON.stringify(DEFAULT_CAPA_YOUTUBE, null, 2),
    );
    const [exporting, setExporting] = useState(false);
    const [previewSize] = useState({ width: 1920, height: 1080 });
    const [base64Image, setBase64Image] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);
    const { data, error } = useMemo(() => parseYoutube(jsonText), [jsonText]);

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
            link.download = `capa-youtube-${data?.ministro.split(" ")[0]}.png`;
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
                    Gerador de Capas para YouTube
                </h1>
                <p className="text-sm text-muted-foreground">Edite o JSON e exporte a imagem.</p>
            </header>

            <div className="gerador-container h-full flex sm:justify-center gap-6 max-w-[1600px] mx-auto p-6 border-stone-600 border-2 border-solid rounded-lg relative">
                <div className="editor-container w-[480px] shrink-0 ">

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
                        localStorageKey={"capaYoutubeData"}
                        jsonText={jsonText}
                        onJsonChange={setJsonText}
                        isValid={!!data}
                        error={error}
                        onExport={handleExport}
                        exporting={exporting}
                    />
                </div>

                <div className="preview-container flex-1 flex justify-center border-2 border-stone-600 border-solid rounded-lg overflow-hidden relative">
                    <CapaYoutubeTemplate
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

export default CapaYoutube;
