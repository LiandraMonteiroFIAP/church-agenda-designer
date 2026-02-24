import React, { useState, useEffect } from "react";
import "./story-preview.style.css";
import type { AgendaData } from "@/types/agenda";
import { TopVerse } from "../static-ui/TopVerse";
import { ImageTitle } from "../static-ui/ImageTitle";
import { FooterPNG } from "../static-ui/Footer";
import { DayBadge } from "../static-ui/DayBadge";
import { EventItem } from "../static-ui/EventItem";

interface StoryPreviewProps {
  data: AgendaData | null;
  previewSize: { width: number; height: number };
  base64Image?: string | null;
  previewRef: React.RefObject<HTMLDivElement>;
}

const StoryPreview: React.FC<StoryPreviewProps> = ({
  data,
  previewSize,
  base64Image,
  previewRef,
}) => {

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

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

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="story-preview"
      ref={previewRef}
      style={{
        transformOrigin: "top center",
        transform: `scale(${windowSize.width < 1800 ? 0.35 : 0.45})`,
        width: previewSize.width,
        height: previewSize.height,
        backgroundImage: base64Image ? `url(${base64Image})` : `url(${data.backgroundImage})`,
      }}
    >
      <div className="overlay" />

      <div className="content-wrapper">
        <TopVerse />
        <ImageTitle />

        <div className="events-section">
          {eventsWithBadge.map((ev, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20 }}>
              <DayBadge eventBadge={ev} />
              <EventItem event={ev} />
            </div>
          ))}
        </div>

        <FooterPNG />
      </div>
    </div>
  );
};

export default StoryPreview;
