import { useEffect, useMemo, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { Link } from "react-router-dom";
import { ArrowLeft, ChevronLeft, Pencil, Plus, Trash2 } from "lucide-react";
import JsonEditor from "@/components/JsonEditor";
import { MonthlyStory } from "@/components/MonthlyStory/MonthlyStory";
import { DEFAULT_MONTHLY, monthlyDefaultOutlineHex, parseMonthly, type MonthlyAgenda, type MonthlyEvent } from "@/types/monthly";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import "./style.css";

const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
const shortWeekdays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const freshEvent = (month: string): MonthlyEvent => ({ titulo: "", tipo: "semanal", cor: "#3095d5", corTexto: "#000000", diaSemana: 0, excecoes: [], observacao: "", temContorno: false, datas: [`${month}-01`] });

function migrateMonth(events: MonthlyEvent[], oldMonth: string, newMonth: string): MonthlyEvent[] {
  const days = new Date(Number(newMonth.slice(0, 4)), Number(newMonth.slice(5, 7)), 0).getDate();
  const moveDate = (date: string) => `${newMonth}-${String(Math.min(Number(date.slice(-2)), days)).padStart(2, "0")}`;
  return events.map(event => ({ ...event, datas: event.datas?.map(moveDate), excecoes: event.excecoes?.map(moveDate) }));
}

export default function AgendaMensal() {
  const [agenda, setAgenda] = useState<MonthlyAgenda>(() => {
    try {
      const stored = localStorage.getItem("agendaMensalData");
      if (stored) { const parsed = parseMonthly(stored); if (parsed.data) return parsed.data; }
    } catch { /* use the default agenda */ }
    return DEFAULT_MONTHLY;
  });
  const [selected, setSelected] = useState<number | null>(null);
  const [draft, setDraft] = useState<MonthlyEvent | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [jsonOpen, setJsonOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [scale, setScale] = useState(0.35);
  const previewContainer = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const text = useMemo(() => JSON.stringify(agenda, null, 2), [agenda]);
  const { data } = useMemo(() => parseMonthly(text), [text]);
  const previewData = useMemo(() => {
    if (!data || !draft) return data;
    const events = [...data.eventos];
    if (selected === null) events.push(draft);
    else events[selected] = draft;
    return parseMonthly(JSON.stringify({ ...data, eventos: events })).data ?? data;
  }, [data, draft, selected]);

  useEffect(() => {
    localStorage.setItem("agendaMensalData", text);
  }, [text]);

  useEffect(() => {
    const container = previewContainer.current;
    if (!container) return;
    const update = () => setScale(Math.min(container.clientWidth / 1080, 720 / 1920));
    const observer = new ResizeObserver(update);
    observer.observe(container); update();
    return () => observer.disconnect();
  }, []);

  async function exportPng() {
    if (!previewData || !storyRef.current) return;
    setExporting(true);
    try {
      await document.fonts.ready;
      const canvas = await html2canvas(storyRef.current, { width: 1080, height: 1920, scale: 1, backgroundColor: null, useCORS: true,
        onclone: document => { const wrapper = document.querySelector<HTMLElement>(".monthly-story-scale"); if (wrapper) wrapper.style.transform = "none"; },
      });
      const link = document.createElement("a"); link.download = `agenda-mensal-${previewData.mes}.png`; link.href = canvas.toDataURL("image/png"); link.click();
    } catch (err) { console.error("Erro ao exportar agenda mensal:", err); }
    finally { setExporting(false); }
  }

  function beginNew() { setSelected(null); setSaveError(null); setDraft(freshEvent(agenda.mes)); }
  function editEvent(index: number) {
    const event: MonthlyEvent = { ...agenda.eventos[index] };
    if (event.tipo === "semanal") event.excecoes = [...(event.excecoes ?? [])];
    else delete event.excecoes;
    if (event.datas) event.datas = [...event.datas];
    setSelected(index);
    setSaveError(null);
    setDraft(event);
  }
  function updateDraft(change: Partial<MonthlyEvent>) { setSaveError(null); setDraft(current => current ? { ...current, ...change } : current); }
  function changeEventType(tipo: MonthlyEvent["tipo"]) {
    setSaveError(null);
    setDraft(current => {
      if (!current) return current;
      if (tipo === "especial") {
        const event = { ...current, tipo, datas: current.datas?.length ? current.datas : [`${agenda.mes}-01`] };
        delete event.excecoes;
        delete event.diaSemana;
        return event;
      }
      const event = { ...current, tipo, diaSemana: current.diaSemana ?? 0, excecoes: current.excecoes ?? [] };
      delete event.datas;
      return event;
    });
  }
  function saveEvent() {
    if (!draft) return;
    const next = [...agenda.eventos];
    if (selected === null) next.push(draft); else next[selected] = draft;
    const parsed = parseMonthly(JSON.stringify({ ...agenda, eventos: next }));
    if (parsed.data) { setAgenda(parsed.data); setDraft(null); setSelected(null); setSaveError(null); }
    else setSaveError(parsed.error);
  }
  function deleteEvent(index: number) { setAgenda(current => ({ ...current, eventos: current.eventos.filter((_, i) => i !== index) })); setDraft(null); setSelected(null); }
  function changeMonth(month: string) {
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return;
    setAgenda(current => ({ mes: month, eventos: migrateMonth(current.eventos, current.mes, month) }));
    if (draft) setDraft(current => current ? { ...current, datas: current.datas?.map(date => `${month}-${date.slice(-2)}`), excecoes: current.excecoes?.map(date => `${month}-${date.slice(-2)}`) } : current);
  }
  function changeDate(field: "datas" | "excecoes", index: number, value: string) {
    if (!draft) return;
    const values = [...(draft[field] ?? [])]; values[index] = value;
    updateDraft({ [field]: values });
  }

  const dateFields = (field: "datas" | "excecoes", label: string) => (
    <div className="monthly-form-field">
      <Label>{label}</Label>
      {(draft?.[field] ?? []).map((date, index) => <div className="monthly-date-row" key={`${field}-${index}`}>
        <Input type="date" min={`${agenda.mes}-01`} max={`${agenda.mes}-${String(new Date(Number(agenda.mes.slice(0, 4)), Number(agenda.mes.slice(5, 7)), 0).getDate()).padStart(2, "0")}`} value={date} onChange={event => changeDate(field, index, event.target.value)} />
        <Button type="button" variant="ghost" size="icon" aria-label="Remover data" onClick={() => updateDraft({ [field]: (draft?.[field] ?? []).filter((_, i) => i !== index) })}><Trash2 size={16} /></Button>
      </div>)}
      <Button type="button" variant="outline" size="sm" onClick={() => updateDraft({ [field]: [...(draft?.[field] ?? []), `${agenda.mes}-01`] })}>+ Adicionar {field === "excecoes" ? "exceções" : "data"}</Button>
    </div>
  );

  return (
    <main className="monthly-page">
      <header className="monthly-page-header">
        <Link to="/" className="monthly-back" aria-label="Voltar à página inicial" title="Voltar à página inicial"><ArrowLeft size={20} /></Link>
        <div><h1>Agenda Mensal</h1><p>Gerencie eventos e exporte a imagem.</p></div>
      </header>
      <div className="monthly-workspace">
        <section className="monthly-editor" aria-label="Eventos da agenda mensal">
          <div className="monthly-events-toolbar">
            <h2>Eventos</h2>
            <Button onClick={beginNew} size="sm"><Plus size={16} /> Novo evento</Button>
          </div>
          <div className="monthly-month-field"><Label htmlFor="monthly-month">Mês dos eventos</Label><Input id="monthly-month" type="month" value={agenda.mes} onChange={event => changeMonth(event.target.value)} /></div>
          {draft ? <div className="monthly-event-form">
            <div className="monthly-event-form-header">
              <Button variant="ghost" size="sm" className="monthly-form-back" onClick={() => { setDraft(null); setSelected(null); }}><ChevronLeft size={16} /></Button>
              <h3>{selected === null ? "Novo evento" : "Editar evento"}</h3>
            </div>
            <div className="monthly-form-field"><Label htmlFor="monthly-title">Título</Label><Input id="monthly-title" value={draft.titulo} autoFocus placeholder="Ex.: Culto da Família" onChange={event => updateDraft({ titulo: event.target.value })} /></div>
            <div className="monthly-form-field"><Label>Tipo</Label><div className="monthly-type-switch"><Button type="button" variant={draft.tipo === "semanal" ? "default" : "outline"} onClick={() => changeEventType("semanal")}>Semanal</Button><Button type="button" variant={draft.tipo === "especial" ? "default" : "outline"} onClick={() => changeEventType("especial")}>Especial</Button></div></div>
            {draft.tipo === "semanal" ? <>
              <div className="monthly-form-field"><Label>Dia da semana</Label><div className="monthly-weekday-selector" role="group" aria-label="Dia da semana">{shortWeekdays.map((day, i) => <button type="button" key={day} aria-label={weekdays[i]} aria-pressed={draft.diaSemana === i} onClick={() => updateDraft({ diaSemana: i })}>{day}</button>)}</div></div>
              {dateFields("excecoes", "Exceções")}
            </> : dateFields("datas", "Datas do evento")}
            <div className="monthly-form-field"><Label htmlFor="monthly-color">Cor</Label><div className="monthly-color-row"><input id="monthly-color" type="color" value={draft.cor} onChange={event => updateDraft({ cor: event.target.value })} /><Input value={draft.cor} maxLength={7} aria-label="Código hexadecimal da cor" onChange={event => { if (/^#[0-9a-fA-F]{6}$/.test(event.target.value)) updateDraft({ cor: event.target.value }); }} /></div></div>
            <div className="monthly-transparency-field"><Label htmlFor="monthly-transparency">Transparência: {draft.transparencia ?? 0}%</Label><input id="monthly-transparency" type="range" min="0" max="100" step="1" value={draft.transparencia ?? 0} onChange={event => updateDraft({ transparencia: Number(event.target.value) })} /><div className="monthly-transparency-labels"><span>Opaca</span><span>Transparente</span></div></div>
            <div className="monthly-contour-row"><div><Label htmlFor="monthly-contour">Contorno</Label><p>Destaca o evento com uma borda colorida.</p></div><Switch id="monthly-contour" checked={!!draft.temContorno} onCheckedChange={checked => updateDraft({ temContorno: checked })} /></div>
            {draft.temContorno && <div className="monthly-form-field"><Label htmlFor="monthly-outline-color">Cor do contorno</Label><div className="monthly-color-row"><input id="monthly-outline-color" type="color" value={draft.corContorno ?? monthlyDefaultOutlineHex(draft.cor)} onChange={event => updateDraft({ corContorno: event.target.value })} /><Input aria-label="Código hexadecimal da cor do contorno" value={draft.corContorno ?? monthlyDefaultOutlineHex(draft.cor)} maxLength={7} onChange={event => { if (/^#[0-9a-fA-F]{6}$/.test(event.target.value)) updateDraft({ corContorno: event.target.value }); }} /></div></div>}
            <div className="monthly-form-field"><Label htmlFor="monthly-observation">Observação</Label><Textarea id="monthly-observation" value={draft.observacao ?? ""} placeholder="Opcional" onChange={event => updateDraft({ observacao: event.target.value })} /></div>
            {saveError && <p className="monthly-save-error" role="alert">{saveError}</p>}
            <div className="monthly-form-actions"><Button type="button" variant="outline" onClick={() => { setDraft(null); setSelected(null); setSaveError(null); }}>Cancelar</Button>{selected !== null && <Button type="button" variant="destructive" onClick={() => deleteEvent(selected)}><Trash2 size={16} /> Excluir</Button>}<Button type="button" onClick={saveEvent} disabled={!draft.titulo.trim() || (draft.tipo === "especial" && !(draft.datas?.length))}>Salvar evento</Button></div>
          </div> : <div className="monthly-event-list">
            {agenda.eventos.length === 0 && <p className="monthly-list-empty">Nenhum evento neste mês. Adicione o primeiro evento.</p>}
            {agenda.eventos.map((event, index) => <button className="monthly-event-row" key={`${event.titulo}-${index}`} onClick={() => editEvent(index)}>
              <span className="monthly-event-color" style={{ borderColor: event.cor, backgroundColor: event.tipo === "especial" ? event.cor : "transparent" }} />
              <span className="monthly-event-copy"><strong>{event.titulo}</strong><small>{event.tipo === "semanal" ? shortWeekdays[event.diaSemana ?? 0] : (event.datas ?? []).map(date => Number(date.slice(-2))).join(", ") + " de " + agenda.mes.slice(5, 7)}</small><span className="monthly-event-tags"><span>{event.tipo === "semanal" ? "Semanal" : "Especial"}</span>{event.temContorno && <span>Contorno</span>}</span></span><Pencil size={15} className="monthly-event-edit" />
            </button>)}
          </div>}
          <div className="monthly-json-toggle"><Button variant="ghost" size="sm" onClick={() => setJsonOpen(open => !open)}>{jsonOpen ? "Ocultar JSON" : "Ver JSON"}</Button></div>
          {jsonOpen && <JsonEditor localStorageKey="agendaMensalData" jsonText={text} onJsonChange={value => { const parsed = parseMonthly(value); if (parsed.data) setAgenda(parsed.data); }} isValid={!!data} error={null} onExport={exportPng} exporting={exporting} />}
        </section>
        <div className="monthly-preview-panel">
          <div className="monthly-preview-label">Pré-visualização · 1080 × 1920</div>
          <div className="monthly-preview-container" ref={previewContainer}>
            {previewData ? <div className="monthly-story-scale" style={{ width: 1080, height: 1920, transform: `scale(${scale})`, transformOrigin: "top left" }}><MonthlyStory data={previewData} storyRef={storyRef} /></div> : <div className="monthly-invalid">Não foi possível validar os eventos.</div>}
          </div>
          <Button onClick={exportPng} disabled={!data || exporting} className="monthly-export-button">{exporting ? "Exportando..." : "Exportar PNG"}</Button>
        </div>
      </div>
    </main>
  );
}
