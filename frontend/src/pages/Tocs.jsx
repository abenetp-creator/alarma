import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { bancSonsInicial } from "../data/bancSons";

export default function Tocs() {
  const [nom, setNom] = useState("");
  const [hora, setHora] = useState("");
  const [horari, setHorari] = useState("Setembre-Juny");

  // 1. Carreguem dinàmicament la llista de sons actualitzada (dels guardats a GitHub/localStorage)
  const [llistaSons, setLlistaSons] = useState(() => {
    const guardats = localStorage.getItem("bancSons");
    return guardats ? JSON.parse(guardats) : bancSonsInicial;
  });

  const [so, setSo] = useState(llistaSons[0]?.nomVisible || "");

  const [dies, setDies] = useState({
    dll: true,
    dm: true,
    dc: true,
    dj: true,
    dv: true,
  });

  const [editantId, setEditantId] = useState(null);

  const [tocs, setTocs] = useState(() => {
    const guardats = localStorage.getItem("tocs");
    return guardats ? JSON.parse(guardats) : [];
  });

  // Re-carregar sons si canvia l'emmagatzematge local
  useEffect(() => {
    const guardats = localStorage.getItem("bancSons");
    if (guardats) {
      setLlistaSons(JSON.parse(guardats));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tocs", JSON.stringify(tocs));
  }, [tocs]);

  const canviarDia = (dia) => {
    setDies({
      ...dies,
      [dia]: !dies[dia],
    });
  };

  const reiniciarFormulari = () => {
    setNom("");
    setHora("");
    setHorari("Setembre-Juny");
    setSo(llistaSons[0]?.nomVisible || "");
    setDies({
      dll: true,
      dm: true,
      dc: true,
      dj: true,
      dv: true,
    });
    setEditantId(null);
  };

  const guardarToc = () => {
    if (!nom || !hora) {
      alert("Cal indicar nom i hora");
      return;
    }

    // Busquem l'objecte so per guardar-ne la URL completa de GitHub
    const soTrobat = llistaSons.find((item) => item.nomVisible === so);

    const nouToc = {
      id: editantId || Date.now(),
      nom,
      hora,
      horari,
      so,
      fitxerAudio: soTrobat ? soTrobat.fitxer : "", // URL per a reproduir
      dies: Object.keys(dies).filter((dia) => dies[dia]),
      actiu: true,
    };

    if (editantId) {
      setTocs(
        tocs.map((toc) =>
          toc.id === editantId
            ? {
                ...nouToc,
                actiu: toc.actiu,
              }
            : toc
        )
      );
    } else {
      setTocs([...tocs, nouToc]);
    }

    reiniciarFormulari();
  };

  const editarToc = (toc) => {
    setEditantId(toc.id);
    setNom(toc.nom);
    setHora(toc.hora);
    setHorari(toc.horari);
    setSo(toc.so);

    setDies({
      dll: toc.dies.includes("dll"),
      dm: toc.dies.includes("dm"),
      dc: toc.dies.includes("dc"),
      dj: toc.dies.includes("dj"),
      dv: toc.dies.includes("dv"),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const eliminarToc = (id) => {
    if (window.confirm("Vols eliminar aquest toc?")) {
      setTocs(tocs.filter((toc) => toc.id !== id));
    }
  };

  const canviarEstat = (id) => {
    setTocs(
      tocs.map((toc) =>
        toc.id === id
          ? {
              ...toc,
              actiu: !toc.actiu,
            }
          : toc
      )
    );
  };

  // Estils comuns
  const estilInput = {
    width: "100%",
    maxWidth: "400px",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #475569",
    backgroundColor: "#334155",
    color: "#ffffff",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const estilLlegenda = {
    display: "block",
    color: "#cbd5e1",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "6px",
  };

  const estilBotoAccio = {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "none",
    color: "#ffffff",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "30px 20px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* ENCAPÇALAT */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#ffffff",
            fontSize: "2.2rem",
            fontWeight: "bold",
          }}
        >
          🔔 Gestió de Tocs
        </h1>

        {/* FORMULARI */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "35px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem", marginBottom: "20px" }}>
            {editantId ? "✏️ Editar toc" : "➕ Nou toc"}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label style={estilLlegenda}>Nom del toc</label>
              <input
                type="text"
                placeholder="Ex: Entrada matí, Pati, Canvi de classe..."
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                style={estilInput}
              />
            </div>

            <div>
              <label style={estilLlegenda}>Hora</label>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                style={estilInput}
              />
            </div>

            <div>
              <label style={estilLlegenda}>Dies de la setmana</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", marginTop: "8px" }}>
                {[
                  ["dll", "Dilluns"],
                  ["dm", "Dimarts"],
                  ["dc", "Dimecres"],
                  ["dj", "Dijous"],
                  ["dv", "Divendres"],
                ].map(([clau, text]) => (
                  <label
                    key={clau}
                    style={{
                      color: "#ffffff",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "#334155",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      border: "1px solid #475569",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={dies[clau]}
                      onChange={() => canviarDia(clau)}
                      style={{ width: "16px", height: "16px", accentColor: "#2563eb" }}
                    />
                    {text}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={estilLlegenda}>Horari</label>
              <select
                value={horari}
                onChange={(e) => setHorari(e.target.value)}
                style={estilInput}
              >
                <option>Setembre-Juny</option>
                <option>Octubre-Maig</option>
              </select>
            </div>

            <div>
              <label style={estilLlegenda}>So associat</label>
              <select
                value={so}
                onChange={(e) => setSo(e.target.value)}
                style={estilInput}
              >
                {llistaSons.map((soItem) => (
                  <option key={soItem.id} value={soItem.nomVisible}>
                    {soItem.nomVisible}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button
                onClick={guardarToc}
                style={{
                  backgroundColor: "#2563eb",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "12px 24px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
              >
                💾 Guardar Toc
              </button>

              {editantId && (
                <button
                  onClick={reiniciarFormulari}
                  style={{
                    backgroundColor: "#64748b",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 20px",
                    cursor: "pointer",
                    fontWeight: "bold",
                    fontSize: "1rem",
                  }}
                >
                  Cancel·lar
                </button>
              )}
            </div>
          </div>
        </div>

        {/* LLISTA DE TOCS */}
        <h2 style={{ color: "#ffffff", fontSize: "1.5rem", marginBottom: "20px" }}>
          📋 Tocs programats
        </h2>

        {tocs.length === 0 ? (
          <p style={{ color: "#94a3b8", backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", textAlign: "center" }}>
            Encara no hi ha tocs programats.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {tocs
              .sort((a, b) => a.hora.localeCompare(b.hora))
              .map((toc) => (
                <div
                  key={toc.id}
                  style={{
                    backgroundColor: "#1e293b",
                    padding: "20px",
                    borderRadius: "16px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
                    borderLeft: `6px solid ${toc.actiu ? "#22c55e" : "#ef4444"}`,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 10px 0", color: "#ffffff", fontSize: "1.3rem" }}>
                        {toc.nom}
                      </h3>

                      <div style={{ color: "#f59e0b", fontWeight: "bold", fontSize: "1.1rem", marginBottom: "6px" }}>
                        🕒 Hora: {toc.hora}
                      </div>

                      <div style={{ color: "#cbd5e1", fontSize: "0.95rem", marginBottom: "4px" }}>
                        📅 Horari: {toc.horari} | 🎵 So: {toc.so}
                      </div>

                      <div style={{ color: "#cbd5e1", fontSize: "0.95rem" }}>
                        📆 Dies: {toc.dies.join(", ")}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: "6px 12px",
                        borderRadius: "20px",
                        backgroundColor: toc.actiu ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: toc.actiu ? "#4ade80" : "#f87171",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                      }}
                    >
                      {toc.actiu ? "🟢 Actiu" : "🔴 Inactiu"}
                    </div>
                  </div>

                  <hr style={{ borderColor: "#334155", margin: "15px 0" }} />

                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <button
                      style={{ ...estilBotoAccio, backgroundColor: "#0284c7" }}
                      onClick={() => editarToc(toc)}
                    >
                      ✏️ Editar
                    </button>

                    <button
                      style={{ ...estilBotoAccio, backgroundColor: toc.actiu ? "#d97706" : "#16a34a" }}
                      onClick={() => canviarEstat(toc.id)}
                    >
                      {toc.actiu ? "⏸️ Desactivar" : "▶️ Activar"}
                    </button>

                    <button
                      style={{ ...estilBotoAccio, backgroundColor: "#dc2626" }}
                      onClick={() => eliminarToc(toc.id)}
                    >
                      🗑 Eliminar
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* ENLLAÇ TORNAR */}
        <div style={{ textAlign: "center", marginTop: "35px" }}>
          <Link
            to="/"
            style={{
              color: "#38bdf8",
              textDecoration: "none",
              fontWeight: "bold",
              fontSize: "1.1rem",
            }}
          >
            ← Tornar al panell principal
          </Link>
        </div>

      </div>
    </div>
  );
}