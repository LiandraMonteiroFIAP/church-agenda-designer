
interface TextoEstaticoProps {
    type: "corpo" | "titulo" | "descricao";
    text: string;
    outlined?: boolean;
    variant?: "bold" | "regular";
    size?: number | "large" | "medium" | "small";
}

export const TextoEstatico = ({ type, text, outlined, variant, size }: TextoEstaticoProps) => {

    return (
        <div
            style={{
                position: "relative",
                textAlign: "left",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "start",
            }}
        >
            {outlined && (
                <div
                    style={{
                        position: "absolute",
                        backgroundColor: "white",
                        width: "7px",
                        height: "80px",
                        top: "5px",
                    }}
                >
                    {" "}
                    |{" "}
                </div>
            )}

            <p
                style={{
                    color: "white",
                    fontSize: typeof size === "number" ? `${size}px` :
                        size === "large" ? "max(100px, 5vw)" : size === "medium" ? "85px" : "38px",
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontWeight: variant === "bold" ? 700 : 300,
                    letterSpacing: type === "descricao" ? "-2px" : "-4px",
                    lineHeight: size === "large" ? "110px" : size === "medium" ? "140px" : "110px",
                    paddingLeft: "25px",
                    marginTop: type === "corpo" ? "-18%" : "-10%",
                }}
            >
                {text}
            </p>
        </div>
    );
};
