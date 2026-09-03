import { useState, useEffect } from "react";

export default function NextBell() {
  const [proximToc, setProximToc] = useState(null);

  useEffect(() => {
    const calcularProximToc = () => {
      // Carregar tocs del localStorage o usar un array buit
      const tocsGuardats = JSON.parse(localStorage.getItem("tocs")) || [];
      
      const ara = new Date();
      const horaActualMinuts = ara.getHours() * 60 + ara.getMinutes();

      // Filtrar els tocs que són més tard que l'hora actual
      const tocsFuturs = tocsGuardats
        .map((toc) => {
          const [hores, minuts] = toc.hora.split(":").map(Number);
          return { ...toc, minutsTotals: hores * 60 + minuts };
        })
        .filter((toc) => toc.minutsTotals > horaActualMinuts)
        .sort((a, b) => a.minutsTotals - b.minutsTotals);

      if (tocsFuturs.length > 0) {
        setProximToc(tocsFuturs[0]);
      } else {
        setProximToc(null);
      }
    };

    calcularProximToc();
    const interval = setInterval(calcularProximToc, 10000); // Recalcular cada 10s

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#1e293b",
        padding: "20px",
        borderRadius: "16px",
        margin: "20px auto",
        maxWidth: "400px",
        border: "1px solid #334155",
      }}
    >
      <span
        style={{
          fontSize: "0.9rem",
          color: "#38bdf8",
          fontWeight: "bold",
          letterSpacing: "1px",
        }}
      >
        PRÒXIM TOC
      </span>

      {proximToc ? (
        <div style={{ marginTop: "8px" }}>
          <h2
            style={{
              fontSize: "2rem",
              color: "#ffffff",
              margin: "5px 0",
              fontWeight: "bold",
            }}
          >
            {proximToc.nom}
          </h2>
          <p
            style={{
              fontSize: "1.5rem",
              color: "#f59e0b",
              margin: 0,
              fontWeight: "bold",
            }}
          >
            🔔 {proximToc.hora}
          </p>
        </div>
      ) : (
        <p style={{ color: "#94a3b8", marginTop: "10px", fontSize: "1.1rem" }}>
          No hi ha més tocs programats per a hui 😴
        </p>
      )}
    </div>
  );
}