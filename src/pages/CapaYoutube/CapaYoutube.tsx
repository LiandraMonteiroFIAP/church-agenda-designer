import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import JsonEditor from "@/components/JsonEditor";
import CapaYoutubeTemplate from "@/components/CapaYoutubeTemplate/CapaYoutubeTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_CAPA_YOUTUBE, type CapaYoutubeData } from "@/types/capayoutube";
import { parseYoutube, convertFileToBase64 } from "@/lib/utils";
import "./style.css";

const CapaYoutube = () => {
    const [jsonText, setJsonText] = useState(() => localStorage.getItem("capaYoutubeData") || JSON.stringify(DEFAULT_CAPA_YOUTUBE, null, 2));
    const [jsonOpen, setJsonOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [previewScale, setPreviewScale] = useState(0.35);
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const previewContainerRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const { data, error } = useMemo(() => parseYoutube(jsonText), [jsonText]);
    const backgroundImage = data?.backgroundImage;

    useEffect(() => {
        if (data) localStorage.setItem("capaYoutubeData", JSON.stringify(data, null, 2));
    }, [data]);

    useEffect(() => {
        if (backgroundImage && !backgroundImage.startsWith("data:")) setBackgroundUrl(backgroundImage);
    }, [backgroundImage]);

    useEffect(() => {
        const container = previewContainerRef.current;
        if (!container) return;
        const updateScale = () => {
            const preferredScale = window.innerWidth < 1800 ? 0.35 : 0.45;
            setPreviewScale(Math.min(preferredScale, container.clientWidth / 1920, container.clientHeight / 1080));
        };
        const observer = new ResizeObserver(updateScale);
        observer.observe(container);
        window.addEventListener("resize", updateScale);
        updateScale();
        return () => { observer.disconnect(); window.removeEventListener("resize", updateScale); };
    }, []);

    const handleExport = useCallback(async () => {
        if (!previewRef.current || !data) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(previewRef.current, {
                scale: 4,
                useCORS: true,
                allowTaint: false,
                backgroundColor: "#000000",
                onclone: clonedDocument => {
                    clonedDocument.querySelector(".youtube-preview-container")?.classList.add("youtube-export-capture");
                },
            });
            const link = document.createElement("a");
            link.download = `capa-youtube-${data.ministro.trim().split(/\s+/)[0] || "evento"}.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) { console.error("Export error:", err); }
        finally { setExporting(false); }
    }, [data]);

    function updateField<K extends keyof CapaYoutubeData>(field: K, value: CapaYoutubeData[K]) {
        if (data) setJsonText(JSON.stringify({ ...data, [field]: value }, null, 2));
    }

    const transparency = 1 - (data?.opacidade ?? 1);

    return (
        <main className="youtube-page min-h-screen bg-background text-foreground">
            <header className="youtube-page-header">
                <Link to="/" className="youtube-back" aria-label="Voltar à página inicial" title="Voltar à página inicial"><ArrowLeft size={20} /></Link>
                <div><h1>Capa para YouTube</h1><p>Configure o conteúdo e exporte a imagem.</p></div>
            </header>

            <div className="youtube-workspace">
                <section className="youtube-editor" aria-label="Configuração da capa">
                    {data ? <div className="youtube-form">
                        <div className="youtube-form-field"><Label htmlFor="youtube-background">URL da imagem de fundo</Label><Input id="youtube-background" type="url" placeholder="https://exemplo.com/imagem.jpg" value={backgroundUrl} onChange={event => { const value = event.target.value; setBackgroundUrl(value); if (value.trim()) { setBase64Image(null); updateField("backgroundImage", value); } }} /></div>
                        <div className="youtube-form-field"><Label htmlFor="youtube-background-file">Ou escolha uma imagem local</Label><input id="youtube-background-file" type="file" accept="image/*" onChange={event => convertFileToBase64(event, setBase64Image)} /></div>

                        <div className="youtube-form-field"><Label htmlFor="youtube-minister">Ministro</Label><Input id="youtube-minister" value={data.ministro} placeholder="Nome do ministro" onChange={event => updateField("ministro", event.target.value)} /></div>

                        <div className="youtube-form-field"><Label>Ministério</Label><div className="youtube-ministry-selector" role="group" aria-label="Ministério"><button type="button" aria-pressed={data.ministerio === "geral"} onClick={() => updateField("ministerio", "geral")}>Geral</button><button type="button" aria-pressed={data.ministerio === "jovens"} onClick={() => updateField("ministerio", "jovens")}>Jovens</button></div></div>

                        <div className="youtube-form-field"><Label htmlFor="youtube-overlay-color">Cor do overlay</Label><div className="youtube-color-row"><input id="youtube-overlay-color" type="color" value={data.cor ?? "#005aa9"} onChange={event => updateField("cor", event.target.value)} /><Input aria-label="Código hexadecimal da cor do overlay" value={data.cor ?? "#005aa9"} maxLength={7} onChange={event => { if (/^#[0-9a-fA-F]{6}$/.test(event.target.value)) updateField("cor", event.target.value); }} /></div></div>

                        <div className="youtube-form-field"><Label htmlFor="youtube-title">Título</Label><Textarea id="youtube-title" rows={4} value={data.titulo.join("\n")} placeholder={"Uma linha por vez\npara ajustar o layout"} onChange={event => updateField("titulo", event.target.value.split(/\r?\n/))} /><p className="youtube-field-hint">Cada linha será exibida como uma linha do título.</p></div>

                        <div className="youtube-transparency-field"><Label htmlFor="youtube-transparency">Transparência do overlay: {transparency.toFixed(2)}</Label><input id="youtube-transparency" type="range" min="0" max="1" step="0.01" value={transparency} onChange={event => updateField("opacidade", 1 - Number(event.target.value))} /><div className="youtube-range-labels"><span>0 · Opaco</span><span>1 · Transparente</span></div></div>
                    </div> : <p className="youtube-json-error">Os dados atuais não são válidos. Abra o JSON para corrigir.</p>}

                    <div className="youtube-json-toggle"><Button variant="ghost" size="sm" onClick={() => setJsonOpen(open => !open)}>{jsonOpen ? "Ocultar JSON" : "Ver JSON"}</Button></div>
                    {jsonOpen && <JsonEditor localStorageKey="capaYoutubeData" jsonText={jsonText} onJsonChange={setJsonText} isValid={!!data} error={error} onExport={handleExport} exporting={exporting} />}
                </section>

                <section className="youtube-preview-panel" aria-label="Pré-visualização da capa">
                    <div className="youtube-preview-label">Pré-visualização · 1920 × 1080</div>
                    <div className="youtube-preview-container" ref={previewContainerRef} style={{ "--youtube-preview-scale": previewScale } as CSSProperties}>
                        <CapaYoutubeTemplate data={data} previewSize={{ width: 1920, height: 1080 }} base64Image={base64Image} previewRef={previewRef} />
                    </div>
                    <Button onClick={handleExport} disabled={!data || exporting} className="youtube-export-button"><Download size={18} />{exporting ? "Exportando..." : "Exportar PNG"}</Button>
                </section>
            </div>
        </main>
    );
};

export { CapaYoutube };
export default CapaYoutube;
