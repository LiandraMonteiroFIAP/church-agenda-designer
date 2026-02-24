export const CircularText = () => {
  return (
    <div style={{ position: "absolute", right: "-120px", top: "-120px", zIndex: 99999 }}>
      <svg width="400" height="400" viewBox="0 0 400 400">
        <defs>
          <path
            id="circlePath"
            d="
              M 200, 200
              m -150, 0
              a 150,150 0 1,1 300,0
              a 150,150 0 1,1 -300,0
            "
          />
        </defs>

        <text
          fill="#ffffff5f"
          fontSize="18"
          letterSpacing="2"
          fontFamily="Quicksand, sans-serif"
          fontWeight={200}
        >
          <textPath href="#circlePath">
            • FAMÍLIA CAPÃO 2026 • FAMÍLIA CAPÃO 2026 • FAMÍLIA CAPÃO 2026 • FAMÍLIA CAPÃO 2026
          </textPath>
        </text>
      </svg>
    </div>
  );
};
