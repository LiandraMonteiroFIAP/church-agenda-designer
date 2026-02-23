export const FooterPNG = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        padding: "60px",
      }}
    >
      <svg width="153" height="40" viewBox="0 0 600 120" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" stroke="white" strokeWidth="5">
          <circle cx="60" cy="60" r="60" />
          <circle cx="120" cy="60" r="60" />
          <circle cx="180" cy="60" r="60" />
          <circle cx="240" cy="60" r="60" />
          <circle cx="300" cy="60" r="60" />
          <circle cx="360" cy="60" r="60" />
          <circle cx="420" cy="60" r="60" />
        </g>
      </svg>
      <p
        style={{
          margin: 0,
          fontSize: 30,
          fontFamily: "'Quicksand', sans-serif",
          color: "white",
          fontWeight: 300,
        }}
      >
        @icfcapao
      </p>
    </div>
  );
};
