import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import html2canvas from "html2canvas";
import { ArrowLeft, Download, Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import JsonEditor from "@/components/JsonEditor";
import AgendaSemanalTemplate from "@/components/AgendaSemanalTemplate/AgendaSemanalTemplate";
import { DEFAULT_AGENDA, type AgendaData, type AgendaEvent } from "@/types/agenda";
import { parseAgenda, convertFileToBase64 } from "@/lib/utils";
import "./style.css";

const blankEvent = (): AgendaEvent => ({ diaSemana: "SEG", titulo: "", data: "", horario: "", local: "", cor: "primaria" });
const dayOptions = [
    { value: "DOM", label: "Dom", name: "Domingo" },
    { value: "SEG", label: "Seg", name: "Segunda-feira" },
    { value: "TER", label: "Ter", name: "Terça-feira" },
    { value: "QUA", label: "Qua", name: "Quarta-feira" },
    { value: "QUI", label: "Qui", name: "Quinta-feira" },
    { value: "SEX", label: "Sex", name: "Sexta-feira" },
    { value: "SAB", label: "Sáb", name: "Sábado" },
];
const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const monthLookup: Record<string, number> = { jan: 0, feb: 1, fev: 1, mar: 2, apr: 3, abr: 3, may: 4, mai: 4, jun: 5, jul: 6, aug: 7, ago: 7, sep: 8, set: 8, oct: 9, out: 9, nov: 10, dec: 11, dez: 11 };

function agendaDateToInput(value: string) {
    const match = /^(\d{1,2})\s+([\p{L}]{3})\.?$/u.exec(value.trim());
    if (!match) return "";
    const month = monthLookup[match[2].toLowerCase()];
    const day = Number(match[1]);
    if (month === undefined || day < 1 || day > 31) return "";
    return `${new Date().getFullYear()}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function inputToAgendaDate(value: string) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return "";
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    if (month < 0 || month > 11 || day < 1 || day > new Date(Number(match[1]), month + 1, 0).getDate()) return "";
    return `${String(day).padStart(2, "0")} ${monthNames[month]}`;
}

const GeradorSemanal = () => {
    const [jsonText, setJsonText] = useState(() => localStorage.getItem("agendaData") || JSON.stringify(DEFAULT_AGENDA, null, 2));
    const [draft, setDraft] = useState<AgendaEvent | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [jsonOpen, setJsonOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [backgroundUrl, setBackgroundUrl] = useState("");
    const [previewSize] = useState({ width: 1080, height: 1920 });
    const [base64Image, setBase64Image] = useState<string | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);
    const { data, error } = useMemo(() => parseAgenda(jsonText), [jsonText]);
    const backgroundImage = data?.backgroundImage;
    const previewData = useMemo(() => {
        if (!data || !draft) return data;
        const events = [...data.events];
        if (editingIndex === null) events.push(draft);
        else events[editingIndex] = draft;
        return { ...data, events };
    }, [data, draft, editingIndex]);

    useEffect(() => {
        if (data) localStorage.setItem("agendaData", JSON.stringify(data, null, 2));
    }, [data]);

    useEffect(() => {
        if (backgroundImage && !backgroundImage.startsWith("data:")) setBackgroundUrl(backgroundImage);
    }, [backgroundImage]);

    const handleExport = useCallback(async () => {
        if (!previewRef.current || !previewData) return;
        setExporting(true);
        try {
            const canvas = await html2canvas(previewRef.current, { scale: 4, useCORS: true, allowTaint: false, backgroundColor: "#000000" });
            const link = document.createElement("a"); link.download = "agenda-semanal.png"; link.href = canvas.toDataURL("image/png"); link.click();
        } catch (err) { console.error("Export error:", err); }
        finally { setExporting(false); }
    }, [previewData]);

    const commitAgenda = (next: AgendaData) => setJsonText(JSON.stringify(next, null, 2));
    const openNew = () => { setEditingIndex(null); setDraft(blankEvent()); };
    const openEdit = (index: number) => { if (!data) return; setEditingIndex(index); setDraft({ ...data.events[index] }); };
    const changeDraft = (field: keyof AgendaEvent, value: string) => setDraft(current => current ? { ...current, [field]: value } : current);
    const saveDraft = () => {
        if (!data || !draft) return;
        const events = [...data.events];
        if (editingIndex === null) events.push(draft); else events[editingIndex] = draft;
        const next = { ...data, events };
        if (parseAgenda(JSON.stringify(next)).data) { commitAgenda(next); setDraft(null); setEditingIndex(null); }
    };
    const deleteEvent = (index: number) => {
        if (!data || data.events.length <= 1) return;
        commitAgenda({ ...data, events: data.events.filter((_, i) => i !== index) }); setDraft(null); setEditingIndex(null);
    };
    return (
        <main className="weekly-page page-index min-h-screen bg-background text-foreground">
            <header className="weekly-page-header">
                <Link to="/" className="weekly-back" aria-label="Voltar à página inicial" title="Voltar à página inicial"><ArrowLeft size={20} /></Link>
                <div><h1>Agenda Semanal</h1><p>Gerencie os eventos e exporte a imagem.</p></div>
            </header>

            <div className="weekly-workspace">
                <div className="editor-container">
                    <section className="weekly-manager">
                        <div className="weekly-manager-header"><h2>Eventos</h2><Button size="sm" onClick={openNew} disabled={!data}><Plus size={16} /> Novo evento</Button></div>
                        <div className="weekly-background-field">
                            <div>    
                                <Label htmlFor="weekly-background">Imagem de fundo (opcional)</Label>
                                <input id="weekly-background" type="file" accept="image/*" onChange={event => convertFileToBase64(event, setBase64Image)} />
                            </div>
                            <div>
                                <Label htmlFor="weekly-background-url">URL da imagem</Label>
                                <Input id="weekly-background-url" type="url" placeholder="https://exemplo.com/imagem.jpg" value={backgroundUrl} onChange={event => { const value = event.target.value; setBackgroundUrl(value); if (data && value.trim()) { setBase64Image(null); commitAgenda({ ...data, backgroundImage: value }); } }} />
                            </div>
                        </div>

                        {draft ? <div className="weekly-event-form">
                            <h3>{editingIndex === null ? "Novo evento" : "Editar evento"}</h3>
                            <div className="weekly-form-field"><Label>Dia da semana</Label><div className="weekly-weekday-selector" role="group" aria-label="Dia da semana">{dayOptions.map(day => <button type="button" key={day.value} aria-label={day.name} aria-pressed={draft.diaSemana === day.value} onClick={() => changeDraft("diaSemana", day.value)}>{day.label}</button>)}</div></div>
                            <div className="weekly-form-field"><Label htmlFor="weekly-title">Título</Label><Input id="weekly-title" autoFocus value={draft.titulo} placeholder="Ex.: Culto da Família" onChange={event => changeDraft("titulo", event.target.value)} /></div>
                            <div className="weekly-form-grid">
                                <div className="weekly-form-field"><Label htmlFor="weekly-date">Data</Label><Input id="weekly-date" type="date" value={agendaDateToInput(draft.data)} onChange={event => changeDraft("data", inputToAgendaDate(event.target.value))} /></div>
                                <div className="weekly-form-field"><Label htmlFor="weekly-time">Horário</Label><Input id="weekly-time" value={draft.horario} placeholder="Ex.: 20:30" onChange={event => changeDraft("horario", event.target.value)} /></div>
                            </div>
                            <div className="weekly-form-field"><Label htmlFor="weekly-location">Local</Label><Input id="weekly-location" value={draft.local} placeholder="Ex.: Na Igreja" onChange={event => changeDraft("local", event.target.value)} /></div>
                            <div className="weekly-form-field"><Label>Cor do evento</Label>
                                <div className="weekly-standard-colors" role="group" aria-label="Cores padrão">
                                    <span>Cores padrão</span>
                                    <button type="button" className={`weekly-color-choice${draft.cor === "primaria" ? " selected" : ""}`} style={{ backgroundColor: "#1f577d" }} aria-label="Cor primária" aria-pressed={draft.cor === "primaria"} onClick={() => changeDraft("cor", "primaria")} />
                                    <button type="button" className={`weekly-color-choice${draft.cor === "secundaria" ? " selected" : ""}`} style={{ backgroundColor: "#72624f" }} aria-label="Cor secundária" aria-pressed={draft.cor === "secundaria"} onClick={() => changeDraft("cor", "secundaria")} />
                                </div>
                                <div className="weekly-custom-color">
                                    <span>Cor personalizada</span>
                                    <div className="weekly-custom-color-inputs">
                                        <input aria-label="Escolher cor personalizada" type="color" value={/^#[0-9a-fA-F]{6}$/.test(draft.cor) ? draft.cor : "#1f577d"} onChange={event => changeDraft("cor", event.target.value)} />
                                        <Input aria-label="Código hexadecimal da cor" value={draft.cor.startsWith("#") ? draft.cor : ""} placeholder="#3095d5" maxLength={7} onFocus={() => { if (!draft.cor.startsWith("#")) changeDraft("cor", "#"); }} onChange={event => {
                                            const value = event.target.value;
                                            const normalized = value && !value.startsWith("#") ? `#${value}` : value;
                                            if (/^#?[0-9a-fA-F]{0,6}$/.test(normalized)) changeDraft("cor", normalized);
                                        }} />
                                    </div>
                                </div>
                            </div>
                            <div className="weekly-form-actions"><Button variant="outline" onClick={() => { setDraft(null); setEditingIndex(null); }}>Cancelar</Button>{editingIndex !== null && <Button variant="destructive" onClick={() => deleteEvent(editingIndex)} disabled={!data || data.events.length <= 1}><Trash2 size={16} /> Excluir</Button>}<Button onClick={saveDraft} disabled={!draft.diaSemana.trim() || !draft.titulo.trim() || !draft.data.trim() || !draft.horario.trim() || !draft.local.trim() || !draft.cor.trim() || (draft.cor.startsWith("#") && !/^#[0-9a-fA-F]{6}$/.test(draft.cor))}>Salvar evento</Button></div>
                        </div> : <div className="weekly-event-list">
                            {data?.events.map((event, index) => <button type="button" className="weekly-event-row" key={`${event.diaSemana}-${index}`} onClick={() => openEdit(index)}>
                                <span className="weekly-event-color" style={{ backgroundColor: event.cor === "primaria" ? "#1f577d" : event.cor === "secundaria" ? "#72624f" : event.cor }} />
                                <span className="weekly-event-copy"><strong>{event.titulo}</strong><small>{event.diaSemana} · {event.data} · {event.horario}</small><small>{event.local}</small></span><Pencil size={15} />
                            </button>)}
                            {!data && <p className="weekly-json-error">Corrija o JSON para editar os eventos pelo formulário.</p>}
                        </div>}
                        <div className="weekly-json-toggle"><Button variant="ghost" size="sm" onClick={() => setJsonOpen(open => !open)}>{jsonOpen ? "Ocultar JSON" : "Ver JSON"}</Button></div>
                        {jsonOpen && <JsonEditor localStorageKey="agendaData" jsonText={jsonText} onJsonChange={setJsonText} isValid={!!data} error={error} onExport={handleExport} exporting={exporting} />}
                    </section>
                </div>

                <section className="weekly-preview-panel" aria-label="Pré-visualização da agenda">
                    <div className="weekly-preview-label">Pré-visualização</div>
                    <div className="preview-container flex-1 border-2 border-sky-900 h-screen border-solid rounded-lg overflow-hidden relative">
                        <AgendaSemanalTemplate data={previewData} previewSize={previewSize} base64Image={base64Image} previewRef={previewRef} />
                    </div>
                    <Button onClick={handleExport} disabled={!data || exporting} className="weekly-export-button">
                        <Download size={18} /> {exporting ? "Exportando..." : "Exportar PNG"}
                    </Button>
                </section>
            </div>
        </main>
    );
};

export default GeradorSemanal;
