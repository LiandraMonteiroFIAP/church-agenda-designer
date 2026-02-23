import { AgendaEvent } from "@/types/agenda";
import { getBadgeColor } from "@/lib/utils";

export const EventItem = ({ event }: { event: AgendaEvent }) => {
  return (
    <div style={{marginTop: '-8px'}}>
      <p
        style={{
          margin: 0,
          fontSize: 40,
          fontFamily: "'Nunito Sans', sans-serif",
          fontWeight: 700,
          color: getBadgeColor(event.cor),
          lineHeight: "40px",
          letterSpacing: "-1px",
        }}
      >
        {event.titulo}
      </p>
      <p
        style={{
          margin: "4px 0 0",
          fontSize: 34,
          fontFamily: "'Nunito Sans', sans-serif",
          color: getBadgeColor(event.cor),
          fontWeight: 300,
          lineHeight: "30px",
          letterSpacing: "-1px",
        }}
      >
        {event.data} | {event.horario} | {event.local}
      </p>
    </div>
  );
};
