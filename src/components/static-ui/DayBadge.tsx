import { AgendaEvent } from "@/types/agenda";
import { getBadgeColor } from "@/lib/utils";

interface DayBadgeProps extends AgendaEvent {
  showBadge: boolean;
}

export const DayBadge = ({ eventBadge }: { eventBadge: DayBadgeProps }) => {
  return (
    <div
      style={{
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        backgroundColor: eventBadge.showBadge ? getBadgeColor(eventBadge.cor) : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      {eventBadge.showBadge && (
        <p
          style={{
            width: "84px",
            height: "84px",
            color: "white",
            fontSize: "20px",
            fontFamily: "'Nunito Sans', sans-serif",
            fontWeight: 700,
            letterSpacing: 1,
            margin: 0,
            textAlign: "center",
            lineHeight: "65px",
          }}
        >
          {eventBadge.diaSemana}
        </p>
      )}
    </div>
  );
};
