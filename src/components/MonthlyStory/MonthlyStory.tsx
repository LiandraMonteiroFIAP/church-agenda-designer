import type { RefObject } from "react";
import type { MonthlyAgenda } from "@/types/monthly";
import { monthInfo, monthlyDayEvents, monthlyOutlineColor } from "@/types/monthly";
import "./style.css";

type Props = { data: MonthlyAgenda; storyRef: RefObject<HTMLDivElement> };

export function MonthlyStory({ data, storyRef }: Props) {
    const { year, monthNumber, firstWeekday, days, name } = monthInfo(data.mes);
    const rows = Math.ceil((firstWeekday + days) / 7);
    const weekly = data.eventos.filter((ev) => ev.tipo === "semanal");
    const specials = data.eventos.filter((ev) => ev.tipo === "especial");
    const cells = Array.from({ length: rows * 7 }, (_, index) => {
        const day = index - firstWeekday + 1;
        if (day < 1 || day > days) return <div className="monthly-day" key={index} />;
        const weekday = index % 7;
        const date = `${year}-${String(monthNumber).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const active = monthlyDayEvents(data, date, weekday);
        const recurring = active.filter(ev => ev.tipo === "semanal" && !ev.temContorno);
        const special = active.find(ev => ev.tipo === "especial");
        const outlined = active.find(ev => ev.temContorno);
        const observations = active.filter(ev => ev.observacao?.trim());
        return (
            <div
                className={`monthly-day${weekday === 0 || weekday === 6 ? " monthly-day--weekend" : ""}`}
                key={index}
                data-date={date}
            >
                {special && (
                    <div
                        style={{ backgroundColor: special.cor, color: special.corTexto }}
                        className="monthly-day-circle"
                    ></div>
                )}
                {outlined && <div className="monthly-day-outline" style={{ borderColor: monthlyOutlineColor(outlined.cor) }} />}
                <span className="monthly-day-number" style={special?.corTexto ? { color: special.corTexto } : undefined}>{day}</span>
                {observations.length > 0 && <span className="monthly-day-asterisk" title={observations.map(ev => ev.observacao).join("; ")} aria-label="Data com observação">*</span>}
                {recurring.length > 0 && (
                    <div className="monthly-markers">
                        {recurring.map((ev, i) => (
                            <span key={i} style={{ backgroundColor: ev.cor }} />
                        ))}
                    </div>
                )}
            </div>
        );
    });

    return (
        <div className="monthly-story" ref={storyRef}>
            <div className="monthly-arc monthly-arc--left" />
            <div className="monthly-arc monthly-arc--right" />
            <div className="monthly-content">
                <div className="monthly-heading">
                    <img src="/assets/logo-arvore.png" alt="Família Capão" />
                    <div>
                        <span>
                            <strong>{name}</strong>&nbsp;na
                        </span>
                        <span> Família Capão</span>
                    </div>
                </div>

                <div
                    className="monthly-calendar"
                    style={{ gridTemplateRows: `72px repeat(${rows}, 1fr)` }}
                >
                    {Array.from("DSTQQSS").map((label, i) => (
                        <div className="monthly-weekday" key={i}>
                            {label}
                        </div>
                    ))}
                    {cells}
                </div>

                <div className="monthly-legends">
                    <section>
                        <h2>Eventos Semanais</h2>
                        {weekly.map((ev, i) => (
                            <div className="monthly-legend-item" key={i}>
                                <span
                                    className="monthly-legend-line"
                                    style={{ backgroundColor: ev.temContorno ? monthlyOutlineColor(ev.cor) : ev.cor }}
                                />
                                <span>
                                    {
                                        ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
                                            ev.diaSemana ?? 0
                                        ]
                                    }{" "}
                                    – {ev.titulo}
                                </span>
                            </div>
                        ))}
                    </section>

                    <section>
                        <h2>Eventos Especiais</h2>
                        {specials.map((ev, i) => (
                            <div
                                className="monthly-legend-item monthly-legend-item-special"
                                key={i}
                            >
                                <span className="monthly-legend-dates">
                                    {ev.datas?.map((date) => (
                                        <div className="monthly-legend-dates-container" key={date}>
                                            <div
                                                className="monthly-legend-circle"
                                                style={{ backgroundColor: ev.cor, borderColor: ev.temContorno ? monthlyOutlineColor(ev.cor) : undefined }}
                                                data-outlined={ev.temContorno || undefined}
                                            ></div>
                                            <span className="monthly-legend" style={ev.corTexto ? { color: ev.corTexto } : undefined}>
                                                {Number(date.slice(-2))}
                                            </span>
                                        </div>
                                    ))}
                                </span>

                                <span>{ev.titulo}</span>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
            <div className="monthly-arc monthly-arc--bottom" />
            <img
                className="monthly-footer-logo"
                src="/assets/monthly-logo.png"
                alt="Família Capão"
            />
        </div>
    );
}
