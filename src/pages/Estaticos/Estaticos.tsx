import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import JsonEditor from "@/components/JsonEditor";
import EstaticosTemplate from "@/components/EstaticosTemplate/EstaticosTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_ESTATICO, MINISTERIOS, TEMPLATES_DEFAULT, type EstaticoEvent } from "@/types/estatico";
import { parseEstatico, convertFileToBase64 } from "@/lib/utils";
import "./style.css";

const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const ministryLabels: Record<(typeof MINISTERIOS)[number], string> = {
    geral: "Geral", casais: "Casais", kids: "Kids", jovens: "Jovens",
    mulheres: "Mulheres", homens: "Homens", oracao: "Oração", alternativo: "Alternativo",
};

const Estaticos = () => {
    const [jsonText, setJsonText] = useState(() => localStorage.getItem("estaticoData") || JSON.stringify(DEFAULT_ESTATICO, null, 2));
    const [jsonOpen, setJsonOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [previewSize] = useState({ width: 1080, height: 1920 });
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const previewRef = useRef<HTMLDivElement>(null);
    const { data, error } = useMemo(() => parseEstatico(jsonText), [jsonText]);
    const backgroundImage = data?.backgroundImage;

    useEffect(() => {
        if (data) localStorage.setItem("estaticoData", JSON.stringify(data, null, 2));
    }, [data]);

    useEffect(() => {
        if (backgroundImage && !backgroundImage.startsWith("data:")) setBackgroundUrl(backgroundImage);
    }, [backgroundImage]);

    const handleExport = useCallback(async () => {
        if (!previewRef.current || !data) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(previewRef.current, { scale: 4, useCORS: true, allowTaint: false, backgroundColor: "#000000" });
            const link = document.createElement("a");
            link.download = "estatico.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        } catch (err) { console.error("Export error:", err); }
        finally { setExporting(false); }
    }, [data]);

    function updateField<K extends keyof EstaticoEvent>(field: K, value: EstaticoEvent[K]) {
        if (!data) return;
        setJsonText(JSON.stringify({ ...data, [field]: value }, null, 2));
    }

    function applyPreset(template: EstaticoEvent) {
        setJsonText(JSON.stringify(template, null, 2));
        setBase64Image(null);
    }

    return (
        <main className="static-page min-h-screen bg-background text-foreground">
            <header className="static-page-header">
                <Link to="/" className="static-back" aria-label="Voltar à página inicial" title="Voltar à página inicial"><ArrowLeft size={20} /></Link>
                <div><h1>Eventos Estáticos</h1><p>Configure os detalhes e exporte a imagem.</p></div>
            </header>

            <div className="static-workspace">
                <section className="static-editor" aria-label="Configuração do evento">
                    <div className="static-presets">
                        <h2>Presets</h2>
                        <div className="static-presets-list">
                            {TEMPLATES_DEFAULT.map((template, index) => <Button key={index} type="button" variant="outline" size="sm" onClick={() => applyPreset(template)}>{template.titulo.join(" ")}</Button>)}
                        </div>
                    </div>

                    {data ? <div className="static-form">
                        <div className="static-form-field">
                            <Label>Tipo</Label>
                            <div className="static-type-selector" role="group" aria-label="Tipo do evento">
                                <button type="button" aria-pressed={data.tipo === "presencial"} onClick={() => updateField("tipo", "presencial")}>Presencial</button>
                                <button type="button" aria-pressed={data.tipo === "online"} onClick={() => updateField("tipo", "online")}>Online</button>
                            </div>
                        </div>

                        <div className="static-form-field"><Label htmlFor="static-ministry">Ministério</Label><select id="static-ministry" value={data.ministerio} onChange={event => updateField("ministerio", event.target.value as EstaticoEvent["ministerio"])}>{MINISTERIOS.map(ministerio => <option key={ministerio} value={ministerio}>{ministryLabels[ministerio]}</option>)}</select></div>

                        <div className="static-form-field">
                            <Label htmlFor="static-background-file">Imagem de fundo (opcional)</Label>
                            <input id="static-background-file" type="file" accept="image/*" onChange={event => convertFileToBase64(event, setBase64Image)} />
                            <Label htmlFor="static-background-url">URL da imagem</Label>
                            <Input id="static-background-url" type="url" placeholder="https://exemplo.com/imagem.jpg" value={backgroundUrl} onChange={event => { const value = event.target.value; setBackgroundUrl(value); if (value.trim()) { setBase64Image(null); updateField("backgroundImage", value); } }} />
                        </div>

                        <div className="static-form-field">
                            <Label>Dia da semana</Label>
                            <div className="static-weekday-selector" role="group" aria-label="Dia da semana">
                                {weekdays.map(day => <button type="button" key={day} aria-pressed={data.diaSemana === day} onClick={() => updateField("diaSemana", day)}>{day}</button>)}
                            </div>
                        </div>

                        <div className="static-form-field"><Label htmlFor="static-title">Título</Label><Textarea id="static-title" rows={3} value={data.titulo.join("\n")} placeholder={"Uma linha por vez\npara ajustar o layout"} onChange={event => updateField("titulo", event.target.value.split(/\r?\n/))} /><p className="static-field-hint">Separe o título em linhas para controlar a disposição no template.</p></div>

                        <div className="static-form-grid">
                            <div className="static-form-field"><Label htmlFor="static-time">Horário</Label><Input id="static-time" type="time" value={/^([01]\d|2[0-3]):[0-5]\d$/.test(data.horario) ? data.horario : ""} onChange={event => updateField("horario", event.target.value)} /></div>
                            <div className="static-form-field"><Label htmlFor="static-location">Local</Label><Input id="static-location" value={data.local} placeholder="Na Igreja" onChange={event => updateField("local", event.target.value)} /></div>
                        </div>

                        <div className="static-transparency-field"><Label htmlFor="static-transparency">Transparência do overlay: {(1 - (data.opacidade ?? 1)).toFixed(2)}</Label><input id="static-transparency" type="range" min="0" max="1" step="0.01" value={1 - (data.opacidade ?? 1)} onChange={event => updateField("opacidade", 1 - Number(event.target.value))} /><div className="static-range-labels"><span>0 · Opaco</span><span>1 · Transparente</span></div></div>
                    </div> : <p className="static-json-error">Os dados atuais não são válidos. Abra o JSON para corrigir.</p>}

                    <div className="static-json-toggle"><Button variant="ghost" size="sm" onClick={() => setJsonOpen(open => !open)}>{jsonOpen ? "Ocultar JSON" : "Ver JSON"}</Button></div>
                    {jsonOpen && <JsonEditor localStorageKey="estaticoData" jsonText={jsonText} onJsonChange={setJsonText} isValid={!!data} error={error} onExport={handleExport} exporting={exporting} />}
                </section>

                <section className="static-preview-panel" aria-label="Pré-visualização">
                    <div className="static-preview-label">Pré-visualização · 1080 × 1920</div>
                    <div className="static-preview-container">
                        <EstaticosTemplate data={data} previewSize={previewSize} base64Image={base64Image} previewRef={previewRef} />
                    </div>
                    <Button onClick={handleExport} disabled={!data || exporting} className="static-export-button"><Download size={18} />{exporting ? "Exportando..." : "Exportar PNG"}</Button>
                </section>
            </div>
        </main>
    );
};

export default Estaticos;
