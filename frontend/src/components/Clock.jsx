import { useState, useEffect } from "react";

export default function Clock() {
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const horaFormatejada = horaActual.toLocaleTimeString("ca-ES", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const dataFormatejada = horaActual.toLocaleDateString("ca-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const dataCapitalitzada =
    dataFormatejada.charAt(0).toUpperCase() + dataFormatejada.slice(1);

  return (
    <div style={{ textAlign: "center", marginBottom: "15px" }}>
      <h1
        style={{
          fontSize: "4.5rem",
          fontWeight: "bold",
          color: "#ffffff",
          margin: 0,
          lineHeight: "1.1",
          fontFamily: "monospace",
          letterSpacing: "2px",
        }}
      >
        {horaFormatejada}
      </h1>
      <p
        style={{
          fontSize: "1.25rem",
          color: "#cbd5e1",
          margin: "10px 0 0 0",
          fontWeight: "500",
        }}
      >
        {dataCapitalitzada}
      </p>
    </div>
  );
}