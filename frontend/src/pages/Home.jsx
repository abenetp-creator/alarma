import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Clock from "../components/Clock";
import NextBell from "../components/NextBell";

const estilBoto = {
  height: "110px",
  borderRadius: "20px",
  border: "none",
  fontSize: "1.2rem",
  fontWeight: "bold",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  gap: "8px",
  width: "100%",
  backgroundColor: "#f8fafc",
  color: "#0f172a",
};

const estilLink = {
  textDecoration: "none",
  color: "inherit",
};

// Mapeig per comprovar el dia de la setmana en el mateix format que Tocs.jsx
const DIES_MAP = ["dg", "dll", "dm", "dc", "dj", "dv", "ds"];

export default function Home() {
  const [alarmesActives, setAlarmesActives] = useState(true);
  const [ultimTocSonat, setUltimTocSonat] = useState("");

  // Comprovar tocs automàtics en temps real
  useEffect(() => {
    if (!alarmesActives) return;

    const comprovarHoraToc = () => {
      const ara = new Date();
      const horaActual = ara.toLocaleTimeString("ca-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Evitar que el mateix toc torne a sonar repetidament en el mateix minut
      if (ultimTocSonat === horaActual) return;

      const diaSetmana = DIES_MAP[ara.getDay()];
      const tocsGuardats = JSON.parse(localStorage.getItem("tocs")) || [];

      // Cerquem un toc que coincidisc en hora, estiga actiu i toque hui
      const tocMatx = tocsGuardats.find(
        (toc) =>
          toc.actiu &&
          toc.hora === horaActual &&
          toc.dies &&
          toc.dies.includes(diaSetmana)
      );

      if (tocMatx) {
        setUltimTocSonat(horaActual);

        // Utilitzem la URL de GitHub (fitxerAudio) guardada en Tocs.jsx
        const fitxerAudio = tocMatx.fitxerAudio || "/sounds/canvi.mp3";
        const reproductor = new Audio(fitxerAudio);

        reproductor.play().catch((err) => {
          console.warn(
            "Cal interacció prèvia de l'usuari en Safari/iPad per permetre l'àudio:",
            err
          );
        });
      }
    };

    const interval = setInterval(comprovarHoraToc, 1000);
    return () => clearInterval(interval);
  }, [alarmesActives, ultimTocSonat]);

  // Funció per a l'evacuació d'emergència
  const activarEvacuacio = () => {
    if (window.confirm("🚨 VOLS ACTIVAR L'ALARMA D'EVACUACIÓ?")) {
      const audioEvacuacio = new Audio("/sounds/evacuacio.mp3");
      audioEvacuacio.play();
    }
  };

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
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* ZONA SUPERIOR: RELLOTGE I PRÒXIM TOC */}
      <div
        style={{
          flex: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Clock />
        <NextBell />

        <div
          style={{
            fontSize: "1.4rem",
            fontWeight: "bold",
            marginTop: "10px",
            marginBottom: "20px",
            color: alarmesActives ? "#4ade80" : "#f87171",
          }}
        >
          {alarmesActives ? "🟢 ALARMES ACTIVADES" : "🔴 ALARMES DESACTIVADES"}
        </div>
      </div>

      {/* BOTONERA INFERIOR */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "15px",
          width: "100%",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <Link to="/sons" style={estilLink}>
          <button style={estilBoto}>
            <span style={{ fontSize: "2rem" }}>🎵</span>
            Banc de Sons
          </button>
        </Link>

        <Link to="/tocs" style={estilLink}>
          <button style={estilBoto}>
            <span style={{ fontSize: "2rem" }}>🔔</span>
            Tocs
          </button>
        </Link>

        <Link to="/calendari" style={estilLink}>
          <button style={estilBoto}>
            <span style={{ fontSize: "2rem" }}>📅</span>
            Calendari
          </button>
        </Link>

        <Link to="/configuracio" style={estilLink}>
          <button style={estilBoto}>
            <span style={{ fontSize: "2rem" }}>⚙️</span>
            Configuració
          </button>
        </Link>

        <button
          style={{
            ...estilBoto,
            backgroundColor: alarmesActives ? "#16a34a" : "#dc2626",
            color: "white",
          }}
          onClick={() => setAlarmesActives(!alarmesActives)}
        >
          <span style={{ fontSize: "2rem" }}>
            {alarmesActives ? "⏸️" : "▶️"}
          </span>
          {alarmesActives ? "Desactivar" : "Activar"}
        </button>

        <button
          style={{
            ...estilBoto,
            backgroundColor: "#dc2626",
            color: "white",
          }}
          onClick={activarEvacuacio}
        >
          <span style={{ fontSize: "2rem" }}>🚨</span>
          Evacuació
        </button>
      </div>
    </div>
  );
}