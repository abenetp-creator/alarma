import { useEffect, useState } from "react";

const estilBoto = {
  height: "130px",
  borderRadius: "20px",
  border: "none",
  fontSize: "1.3rem",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "10px",
};

export default function App() {
  const [hora, setHora] = useState(new Date());
  const [alarmesActives, setAlarmesActives] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setHora(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        padding: "20px",
        boxSizing: "border-box",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* ZONA SUPERIOR */}
      <div
        style={{
          flex: "7",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: "9rem",
            fontWeight: "bold",
            color: "#f8fafc",
            lineHeight: 1,
            marginBottom: "30px",
          }}
        >
          {hora.toLocaleTimeString("ca-ES")}
        </div>

        <div
          style={{
            fontSize: "1.6rem",
            color: "#94a3b8",
            letterSpacing: "2px",
            marginBottom: "15px",
          }}
        >
          PRÒXIM TOC
        </div>

        <div
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            color: "white",
            marginBottom: "10px",
          }}
        >
          Entrada alumnat
        </div>

        <div
          style={{
            fontSize: "2.5rem",
            color: "#cbd5e1",
            marginBottom: "30px",
          }}
        >
          09:00
        </div>

        <div
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
          }}
        >
          {alarmesActives
            ? "🟢 ALARMES ACTIVADES"
            : "🔴 ALARMES DESACTIVADES"}
        </div>
      </div>

      {/* BOTONERA */}
      <div
        style={{
          flex: "3",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
        }}
      >
        <button style={estilBoto}>
          <span style={{ fontSize: "2.2rem" }}>🎵</span>
          Banc de Sons
        </button>

        <button style={estilBoto}>
          <span style={{ fontSize: "2.2rem" }}>🔔</span>
          Tocs
        </button>

        <button style={estilBoto}>
          <span style={{ fontSize: "2.2rem" }}>📅</span>
          Calendari
        </button>

        <button style={estilBoto}>
          <span style={{ fontSize: "2.2rem" }}>⚙️</span>
          Configuració
        </button>

        <button
          style={{
            ...estilBoto,
            backgroundColor: alarmesActives
              ? "#16a34a"
              : "#dc2626",
            color: "white",
          }}
          onClick={() =>
            setAlarmesActives(!alarmesActives)
          }
        >
          <span style={{ fontSize: "2.2rem" }}>
            {alarmesActives ? "⏸️" : "▶️"}
          </span>
          Alarmes
        </button>

        <button
          style={{
            ...estilBoto,
            backgroundColor: "#dc2626",
            color: "white",
          }}
        >
          <span style={{ fontSize: "2.2rem" }}>🚨</span>
          Evacuació
        </button>
      </div>
    </div>
  );
}