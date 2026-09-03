import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Clock from "../components/Clock";
import NextBell from "../components/NextBell";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

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

// Funció optimitzada per a Google Drive i fitxers grans (MP3)
const convertirUrlAudio = (url) => {
  if (!url) return "/sounds/canvi.mp3";
  if (url.includes("drive.google.com")) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      // Enllaç directe que se salta la vista prèvia i l'avís de virus de Drive
      return `https://drive.usercontent.google.com/download?id=${match[1]}&export=download`;
    }
  }
  return url;
};

export default function Home() {
  const { isAdmin, logout } = useAuth();
  const [alarmesActives, setAlarmesActives] = useState(true);
  const [ultimTocSonat, setUltimTocSonat] = useState("");
  const [tocs, setTocs] = useState([]);

  // 1. Carregar els tocs en temps real des de Firebase
  useEffect(() => {
    const tocsRef = ref(db, "tocs");
    const unsubscribe = onValue(tocsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTocs(Object.values(data));
      } else {
        setTocs([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Execució automàtica contínua segons l'hora
  useEffect(() => {
    if (!alarmesActives) return;

    const comprovarHoraToc = () => {
      const ara = new Date();
      const horaActual = ara.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });
      if (ultimTocSonat === horaActual) return;

      const diaSetmana = DIES_MAP[ara.getDay()];

      const tocMatx = tocs.find(
        (toc) => toc.actiu && toc.hora === horaActual && toc.dies?.includes(diaSetmana)
      );

      if (tocMatx) {
        setUltimTocSonat(horaActual);
        const urlDirecta = convertirUrlAudio(tocMatx.fitxerAudio);
        const reproductor = new Audio(urlDirecta);
        reproductor.play().catch((err) => console.warn("Interacció requerida a Safari/Chrome:", err));
      }
    };

    const interval = setInterval(comprovarHoraToc, 1000);
    return () => clearInterval(interval);
  }, [alarmesActives, ultimTocSonat, tocs]);

  // Funció d'evacuació
  const activarEvacuacio = () => {
    if (window.confirm("🚨 VOLS ACTIVAR L'ALARMA D'EVACUACIÓ?")) {
      const configGuardada = JSON.parse(localStorage.getItem("configuracioAlarma")) || {};
      const urlDirecta = convertirUrlAudio(configGuardada.soEvacuacio || "/sounds/evacuacio.mp3");

      const audioEvacuacio = new Audio(urlDirecta);
      audioEvacuacio.play().catch((err) => {
        alert("Error en reproduir l'àudio d'evacuació. Revisa l'enllaç o la connexió.");
        console.error(err);
      });
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

        <Link to="/configuracio" style={estilLink}>
          <button style={estilBoto}>⚙️ Configuració</button>
        </Link>

        {isAdmin ? (
          <button style={{ ...estilBoto, backgroundColor: alarmesActives ? "#16a34a" : "#dc2626", color: "white" }} onClick={() => setAlarmesActives(!alarmesActives)}>
            {alarmesActives ? "⏸️ Pausar" : "▶️ Activar"}
          </button>
        ) : (
          <button style={estilBotoBloquejat} disabled>🔒 Pausar/Activar</button>
        )}

        <button style={{ ...estilBoto, backgroundColor: "#dc2626", color: "white" }} onClick={activarEvacuacio}>
          🚨 Evacuació
        </button>

      </div>
    </div>
  );
}