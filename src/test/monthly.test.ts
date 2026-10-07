import { describe, expect, it } from "vitest";
import { DEFAULT_MONTHLY, monthlyDayEvents, monthlyOutlineColor, parseMonthly } from "@/types/monthly";

describe("monthly event indicators", () => {
  const agenda = {
    mes: "2026-10",
    eventos: [
      { titulo: "Capão Jovem", tipo: "semanal", diaSemana: 6, cor: "#dba8e8", temContorno: true, excecoes: ["2026-10-17"], observacao: "Horário diferente" },
      { titulo: "Casais", tipo: "especial", datas: ["2026-10-24"], cor: "#dba8e8", temContorno: false },
    ],
  };

  it("preserves new attributes and accepts older JSON", () => {
    expect(parseMonthly(JSON.stringify(agenda)).data).toEqual(agenda);
    expect(parseMonthly(JSON.stringify(DEFAULT_MONTHLY)).error).toBeNull();
  });
  it("removes cancelled weekly occurrences without removing special events", () => {
    const { data } = parseMonthly(JSON.stringify(agenda));
    if (!data) throw new Error("Invalid fixture");
    expect(monthlyDayEvents(data, "2026-10-17", 6)).toHaveLength(0);
    expect(monthlyDayEvents(data, "2026-10-24", 6)).toHaveLength(2);
    expect(monthlyDayEvents(data, "2026-10-10", 6)[0]?.observacao).toBe("Horário diferente");
  });
  it.each([
    { temContorno: "true" }, { observacao: true }, { excecoes: "2026-10-17" },
    { excecoes: ["2026-11-01"] }, { excecoes: ["2026-10-00"] }, { excecoes: ["2026-10-32"] },
  ])("rejects invalid optional fields %j", fields => {
    expect(parseMonthly(JSON.stringify({ ...agenda, eventos: [{ ...agenda.eventos[0], ...fields }] })).data).toBeNull();
  });
  it("rejects impossible special dates", () => {
    expect(parseMonthly(JSON.stringify({ mes: "2026-02", eventos: [{ ...agenda.eventos[1], datas: ["2026-02-29"] }] })).data).toBeNull();
  });
  it("generates a darker purple outline from the fill", () => {
    expect(monthlyOutlineColor("#dba8e8")).toMatch(/^hsl\(285, 42%, 60/);
  });
});