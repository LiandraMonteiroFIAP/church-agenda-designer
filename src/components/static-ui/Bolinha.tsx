import { TextoEstatico } from "./TextoEstatico";

interface BolinhaProps  {
    ministerio: string;
    tituloDoEvento: string;
}   

const tamanhoBolinha = "700px";

export const Bolinha = ({ ministerio, tituloDoEvento }: BolinhaProps) => {

    return (
        <div
            style={{
                position: "absolute",
                top: '100%',
                left: '0',
                transform: 'translate(-10%, -73%)',
                width: tamanhoBolinha,
                height: tamanhoBolinha,
                backgroundImage: `url("assets/bolinhas/${ministerio}.png")`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                marginRight: "10px",
                padding: "200px 80px 200px 110px",
                textAlign: "left",
                boxSizing: "border-box",
                display: "flex",
                alignItems: "center",
            }}
        >
            <TextoEstatico type="titulo" text={tituloDoEvento} size="large"/>
        </div>
    );
}