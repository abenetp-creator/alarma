import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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

const estilBotoBloquejat = {
  ...estilBoto,
  backgroundColor: "#1e293b",
  color: "#64748b",
  cursor: "not-allowed",
  border: "1px solid #334155",
};

const estilLink = { textDecoration: "none", color: "inherit" };
const DIES_MAP = ["dg", "dll", "dm", "dc", "dj", "dv", "ds"];

export default function Home() {
  const { isAdmin, logout } = useAuth();
  const [alarmesActives, setAlarmesActives] = useState(true);
  const [ultimTocSonat, setUltimTocSonat] = useState("");

  // Execució automàtica contínua
  useEffect(() => {
    if (!alarmesActives) return;

    const comprovarHoraToc = () => {
      const ara = new Date();
      const horaActual = ara.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });
      if (ultimTocSonat === horaActual) return;

      const diaSetmana = DIES_MAP[ara.getDay()];
      const tocsGuardats = JSON.parse(localStorage.getItem("tocs")) || [];

      const tocMatx = tocsGuardats.find(
        (toc) => toc.actiu && toc.hora === horaActual && toc.dies?.includes(diaSetmana)
      );

      if (tocMatx) {
        setUltimTocSonat(horaActual);
        const reproductor = new Audio(tocMatx.fitxerAudio || "/sounds/canvi.mp3");
        reproductor.play().catch((err) => console.warn("Interacció requerida a Safari:", err));
      }
    };

    const interval = setInterval(comprovarHoraToc, 1000);
    return () => clearInterval(interval);
  }, [alarmesActives, ultimTocSonat]);

  const activarEvacuacio = () => {
    if (window.confirm("🚨 VOLS ACTIVAR L'ALARMA D'EVACUACIÓ?")) {
      const audioEvacuacio = new Audio("/sounds/evacuacio.mp3");
      audioEvacuacio.play();
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "white", display: "flex", flexDirection: "column", padding: "20px", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      
      {/* Botó d'estat de sessió */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        {!isAdmin ? (
          <Link to="/configuracio" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "bold", backgroundColor: "#1e293b", padding: "8px 16px", borderRadius: "8px" }}>
            🔒 Accés Admin
          </Link>
        ) : (
          <button onClick={logout} style={{ backgroundColor: "#ef4444", color: "white", border: "none", borderRadius: "8px", padding: "8px 16px", cursor: "pointer", fontWeight: "bold" }}>
            🔓 Tancar Sessió
          </button>
        )}
      </div>

      {/* Rellotge */}
      <div style={{ flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <Clock />
        <NextBell />
        <div style={{ fontSize: "1.4rem", fontWeight: "bold", marginTop: "10px", color: alarmesActives ? "#4ade80" : "#f87171" }}>
          {alarmesActives ? "🟢 ALARMES ACTIVADES" : "🔴 ALARMES DESACTIVADES"}
        </div>
      </div>

      {/* Botonera de control */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "15px", width: "100%", maxWidth: "900px", margin: "0 auto" }}>
        
        {/* Seccions restringides si no s'és Admin */}
        {isAdmin ? (
          <Link to="/sons" style={estilLink}>
            <button style={estilBoto}>🎵 Banc de Sons</button>
          </Link>
        ) : (
          <button style={estilBotoBloquejat} disabled>🔒 Banc de Sons</button>
        )}

        {isAdmin ? (
          <Link to="/tocs" style={estilLink}>
            <button style={estilBoto}>🔔 Tocs</button>
          </Link>
        ) : (
          <button style={estilBotoBloquejat} disabled>🔒 Tocs</button>
        )}

        {isAdmin ? (
          <Link to="/calendari" style={estilLink}>
            <button style={estilBoto}>📅 Calendari</button>
          </Link>
        ) : (
          <button style={estilBotoBloquejat} disabled>🔒 Calendari</button>
        )}

        {/* Configuració (Sempre visible per permetre el Login) */}
        <Link to="/configuracio" style={estilLink}>
          <button style={estilBoto}>⚙️ Configuració</button>
        </Link>

        {/* Activar/Desactivar global */}
        {isAdmin ? (
          <button style={{ ...estilBoto, backgroundColor: alarmesActives ? "#16a34a" : "#dc2626", color: "white" }} onClick={() => setAlarmesActives(!alarmesActives)}>
            {alarmesActives ? "⏸️ Pausar" : "▶️ Activar"}
          </button>
        ) : (
          <button style={estilBotoBloquejat} disabled>🔒 Pausar/Activar</button>
        )}

        {/* Evacuació (Sempre accessible) */}
        <button style={{ ...estilBoto, backgroundColor: "#dc2626", color: "white" }} onClick={activarEvacuacio}>
          🚨 Evacuació
        </button>

      </div>
    </div>
  );
}