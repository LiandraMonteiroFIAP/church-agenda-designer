import "./style.css";
import React, { useState, useEffect } from "react";
import type { CapaYoutubeData } from "@/types/capayoutube";
import { FooterPNG } from "../static-ui/Footer";
import { CircularText } from "../static-ui/CircularText";

interface CapaYoutubeTemplateProps {
  data: CapaYoutubeData | null;
  previewSize: { width: number; height: number };
  base64Image?: string | null;
  previewRef: React.RefObject<HTMLDivElement>;
}

const CapaYoutubeTemplate: React.FC<CapaYoutubeTemplateProps> = ({
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
      className="capa-ytb-preview"
      ref={previewRef}
      style={{
        transformOrigin: windowSize.width < 700 ? "top left" : "top center",
        transform: `scale(${windowSize.width < 1800 ? 0.35 : 0.45})`,
        width: previewSize.width,
        height: previewSize.height,
        backgroundImage: base64Image ? `url(${base64Image})` : `url(${data.backgroundImage})`,
      }}
    > 
      <CircularText />
      <div className="overlay" 
        style={{
          background:`radial-gradient(circle, transparent 0%, ${data?.cor || '#005aa9'} 100%)`,
          opacity: data?.opacidade ? data.opacidade : 1 || data?.opacidade === 0 ? 0 : 1,
        }} 
      />

      <div className="big-circle"></div>

      <div className="content-wrapper">
        {data?.ministerio === "geral" && (
              <img className="logo" src="assets/estatico-logo.png" alt="" /> )}         
        {data?.ministerio === "jovens" && (
              <img className="logo" src="assets/logo-capaojovem.png" alt="" /> )}
              
        <div className="titulo-container">
          {data.titulo.map((text, i) => {
            return <p 
              className={`titulo-text ${data.titulo.length === i+1? "bold" : ""}`} 
              key={i}>{text}
            </p>
          })}
          <div className="ministro-container">
            <p>{data?.ministro}</p>
          </div>
        </div>
        <FooterPNG />
      </div>
    </div>
  )
};

export default CapaYoutubeTemplate;
