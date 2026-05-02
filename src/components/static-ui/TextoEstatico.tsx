interface TextoEstaticoProps {
    type: "corpo" | "titulo" | "descricao";
    text: string;
    outlined?: boolean;
    variant?: "bold" | "regular";
    size?: "large" | "medium" | "small";
}

export const TextoEstatico = ({ type, text, outlined, variant, size }: TextoEstaticoProps) => {
    return (
        <div
            style={{
                textAlign: "left",
                width: "100%",
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                paddingLeft: "20px",
                paddingBottom: type === "corpo" ? "10px" : "0",
                borderLeft: outlined ? "6px solid white" : "none",
            }}
        >
            <p
                style={{
                    color: "white",
                    fontSize: size === "large" ? "100px" : size === "medium" ? "85px" : "38px",
                    fontFamily: "'Nunito Sans', sans-serif",
                    fontWeight: variant === "bold" ? 700 : 300,
                    letterSpacing: type === "descricao" ? "-2px" : "-4px",
                    lineHeight: size === "large" ? "80px" : size === "medium" ? "85px" : "120px",
                    marginTop: type === "corpo"? "-5%" : 0,
                }}
            >
                {type === "titulo" && (
                    <span>
                        {text.split(" ")[0]}
                        <br />
                        <b className="font-bold">{text.split(" ").slice(1).join(" ")}</b>
                    </span>
                )}

                {type !== "titulo" && text}
            </p>
        </div>
    );
};
