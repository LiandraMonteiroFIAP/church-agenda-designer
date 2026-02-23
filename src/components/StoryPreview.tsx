import React from "react";
import type { AgendaData } from "@/types/agenda";

const BADGE_COLORS: Record<string, string> = {
  primaria: "#4A6FA5",
  secundaria: "#8B7D3C",
};

function getBadgeColor(cor: string): string {
  return BADGE_COLORS[cor] || cor;
}

interface StoryPreviewProps {
  data: AgendaData | null;
  previewRef: React.RefObject<HTMLDivElement>;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({ data, previewRef }) => {
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        JSON inválido — corrija para ver o preview
      </div>
    );
  }

  // Group events: show badge only for first event of each day
  const seenDays = new Set<string>();
  const eventsWithBadge = data.events.map((ev) => {
    const showBadge = !seenDays.has(ev.diaSemana);
    seenDays.add(ev.diaSemana);
    return { ...ev, showBadge };
  });

  return (
    <div
      ref={previewRef}
      style={{
        width: 1080,
        height: 1920,
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Nunito Sans', sans-serif",
        background: "#1a1a2e",
      }}
    >
      {/* Background image */}
      <img
        src={data.backgroundImage}
        alt=""
        crossOrigin="anonymous"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      {/* Dark overlay for readability */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.5) 100%)",
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 48px",
        }}
      >
        {/* Top: verse */}
        <div
          style={{
            textAlign: "center",
            color: "white",
            fontSize: 28,
            fontFamily: "'Nunito Sans', sans-serif",
            fontWeight: 600,
            letterSpacing: 2,
            opacity: 0.9,
          }}
        >
          {">> At 2.42"}
        </div>

        {/* Middle: title */}
        <div style={{ textAlign: "center", marginTop: -120 }}>
          <p
            style={{
              color: "white",
              fontSize: 36,
              fontFamily: "'Nunito Sans', sans-serif",
              fontWeight: 300,
              letterSpacing: 3,
              textTransform: "uppercase",
              marginBottom: 8,
              opacity: 0.9,
            }}
          >
            Essa semana na
          </p>
          <h1
            style={{
              color: "white",
              fontSize: 72,
              fontFamily: "'Quicksand', sans-serif",
              fontWeight: 700,
              lineHeight: 1.1,
              margin: 0,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            Família
            <br />
            Capão
          </h1>
        </div>

        {/* Bottom: events card */}
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 32,
            padding: "40px 36px 32px",
            backdropFilter: "blur(10px)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {eventsWithBadge.map((ev, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
                {/* Badge */}
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    backgroundColor: ev.showBadge ? getBadgeColor(ev.cor) : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {ev.showBadge && (
                    <span
                      style={{
                        color: "white",
                        fontSize: 20,
                        fontFamily: "'Quicksand', sans-serif",
                        fontWeight: 700,
                        letterSpacing: 1,
                      }}
                    >
                      {ev.diaSemana}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: 28,
                      fontFamily: "'Quicksand', sans-serif",
                      fontWeight: 700,
                      color: "#1a1a2e",
                      lineHeight: 1.2,
                    }}
                  >
                    {ev.titulo}
                  </p>
                  <p
                    style={{
                      margin: "4px 0 0",
                      fontSize: 20,
                      fontFamily: "'Nunito Sans', sans-serif",
                      color: "#666",
                      fontWeight: 400,
                    }}
                  >
                    {ev.data} &nbsp;|&nbsp; {ev.horario} &nbsp;|&nbsp; {ev.local}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid #e0e0e0",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 22,
                fontFamily: "'Nunito Sans', sans-serif",
                color: "#999",
                fontWeight: 600,
              }}
            >
              @familiacapao
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoryPreview;
