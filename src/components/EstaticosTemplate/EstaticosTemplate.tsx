import "./style.css";
import React, { useState, useEffect } from "react";
import type { EstaticoEvent } from "@/types/estatico";
import { TopVerse } from "../static-ui/TopVerse";
import { FooterPNG } from "../static-ui/Footer";
import { CircularText } from "../static-ui/CircularText";
import { TextoEstatico } from "../static-ui/TextoEstatico";
import { Bolinha } from "../static-ui/Bolinha";
import { backgroundImage } from "html2canvas/dist/types/css/property-descriptors/background-image";

interface EstaticosTemplateProps {
  data: EstaticoEvent | null;
  previewSize: { width: number; height: number };
  base64Image?: string | null;
  previewRef: React.RefObject<HTMLDivElement>;
}

const EstaticosTemplate: React.FC<EstaticosTemplateProps> = ({
  data,
  previewSize,
  base64Image,
  previewRef,
}) => {

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
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

  if (data === null || !data) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        JSON inválido — corrija para ver o preview
      </div>
    );
  }

  return (
    <div
      className="estatico-preview"
      ref={previewRef}
      style={{
        transformOrigin: windowSize.width < 700 ? "top left" : "top center",
        transform: `scale(${windowSize.width < 1800 ? 0.35 : 0.45})`,
        width: previewSize.width,
        height: previewSize.height,
        backgroundImage: base64Image ? `url(${base64Image})` : `url(/src/placeholders/estatico-placeholder.JPG)`,
      }}
    > 
      <CircularText />
      <div className="overlay" 
        style={{ 
          backgroundImage: `url("/src/placeholders/paredes/${data?.ministerio}.png")`,
          opacity: data?.opacidade ? data.opacidade : 1 || data?.opacidade === 0 ? 0 : 1,
        }} 
      />

      <div className="content-wrapper">
        <TopVerse />

        <div className="rounded-border">
          <div className="estatico-header">
            <div className="estatico-header-infos">
              <TextoEstatico type="corpo" size="medium" text={data?.diaSemana }  variant="bold" outlined />
              <TextoEstatico type="corpo" size="medium" text={data?.horario } outlined />
              <TextoEstatico type="corpo" size="medium" text={data?.local} />
              <TextoEstatico type="descricao" size="small" text={data?.descricao} />
            </div>            
            <img className="logo" src="src\placeholders\estatico-logo.png" alt="" />
          </div>

          <div className="bolinha-container">
              <Bolinha 
                ministerio={data?.ministerio || "geral"} 
                tituloDoEvento={data?.titulo || ""} />
              {
                data?.tipo === "presencial" && (
                  <div className="estatico-endereco">
                    <TextoEstatico type="descricao" size="small" text="Rua Anum Dourado, 75"/>
                  </div>
                )
              }
          </div>
        </div>
        <FooterPNG />
      </div>
    </div>
  )
};

export default EstaticosTemplate;
