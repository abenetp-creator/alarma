import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { bancSonsInicial } from "../data/bancSons";

export default function Sons() {
  const { isAdmin } = useAuth();
  const [sons, setSons] = useState(() => {
    const guardats = localStorage.getItem("bancSons");
    return guardats ? JSON.parse(guardats) : bancSonsInicial;
  });

  const [nomSo, setNomSo] = useState("");
  const [urlDrive, setUrlDrive] = useState("");
  const [audioActual, setAudioActual] = useState(null);
  const [soEditant, setSoEditant] = useState(null);

  const URL_CARPETA_DRIVE = "https://drive.google.com/drive/folders/1R8oUWwL8oIImN3XjAjtc9nRNwuzk3SAu?usp=sharing";

  useEffect(() => {
    localStorage.setItem("bancSons", JSON.stringify(sons));
  }, [sons]);

  const extreureUrlDirectaDrive = (link) => {
    if (!link) return "";
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/) || link.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/uc?export=open&id=${match[1]}`;
    }
    return link;
  };

  const afegirSoDrive = (e) => {
    e.preventDefault();
    if (!nomSo.trim() || !urlDrive.trim()) return;

    const urlDirecta = extreureUrlDirectaDrive(urlDrive);

    const nouElement = {
      id: Date.now().toString(),
      nomVisible: nomSo.trim(),
      fitxerAudio: urlDirecta,
    };

    setSons([...sons, nouElement]);
    setNomSo("");
    setUrlDrive("");
  };

  const eliminarSo = (id) => {
    if (window.confirm("Vols eliminar aquest so del banc?")) {
      setSons(sons.filter((so) => so.id !== id));
    }
  };

  const guardarEdicio = (id) => {
    setSons(
      sons.map((so) =>
        so.id === id ? { ...so, nomVisible: soEditant.nomVisible } : so
      )
    );
    setSoEditant(null);
  };

  const reproduirSo = (fitxer) => {
    if (audioActual) audioActual.pause();
    const audio = new Audio(fitxer);
    audio.play().catch(() => alert("Error en reproduir l'àudio. Revisa que l'enllaç de Drive siga públic."));
    setAudioActual(audio);
  };

  const aturarSo = () => {
    if (audioActual) {
      audioActual.pause();
      setAudioActual(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Títol millorat */}
        <h1 style={{ textAlign: "center", color: "#ffffff", fontSize: "2.5rem", fontWeight: "bold", marginBottom: "25px" }}>
          🎵 Banc de Sons
        </h1>

        {isAdmin ? (
          <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "30px", border: "1px solid #334155" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
              <h3 style={{ margin: 0, color: "#f8fafc" }}>Afegir nou so</h3>
              
              {/* Botó directe per obrir la carpeta de Google Drive */}
              <a
                href={URL_CARPETA_DRIVE}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: "#059669",
                  color: "white",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  fontSize: "0.9rem",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                📁 Pujar cançó a Drive ↗
              </a>
            </div>

            <form onSubmit={afegirSoDrive} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                placeholder="Nom del so (ex: Timbre d'Eixida)"
                value={nomSo}
                onChange={(e) => setNomSo(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white" }}
                required
              />
              <input
                type="text"
                placeholder="Enganxa ací l'enllaç de compartir de Google Drive"
                value={urlDrive}
                onChange={(e) => setUrlDrive(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white" }}
                required
              />
              <button type="submit" style={{ backgroundColor: "#2563eb", color: "white", padding: "10px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                ➕ Enllaçar So a l'App
              </button>
            </form>
          </div>
        ) : (
          <div style={{ backgroundColor: "#334155", padding: "12px", borderRadius: "8px", textAlign: "center", marginBottom: "20px", color: "#cbd5e1" }}>
            🔒 Mode Lectura: Inicia sessió en Configuració per afegir o modificar sons.
          </div>
        )}

        {/* Llista de sons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {sons.map((so) => (
            <div key={so.id} style={{ backgroundColor: "#1e293b", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #334155" }}>
              {soEditant?.id === so.id ? (
                <input
                  type="text"
                  value={soEditant.nomVisible}
                  onChange={(e) => setSoEditant({ ...soEditant, nomVisible: e.target.value })}
                  style={{ padding: "5px", borderRadius: "4px", backgroundColor: "#0f172a", color: "white", border: "1px solid #475569" }}
                />
              ) : (
                <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#f8fafc" }}>{so.nomVisible}</span>
              )}

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => reproduirSo(so.fitxerAudio)} style={{ backgroundColor: "#16a34a", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                  ▶️ Escoltar
                </button>
                <button onClick={aturarSo} style={{ backgroundColor: "#d97706", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                  ⏹️ Aturar
                </button>

                {isAdmin && (
                  <>
                    {soEditant?.id === so.id ? (
                      <button onClick={() => guardarEdicio(so.id)} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", fontWeight: "bold" }}>
                        💾 Guardar
                      </button>
                    ) : (
                      <button onClick={() => setSoEditant(so)} style={{ backgroundColor: "#475569", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", fontWeight: "bold" }}>
                        ✏️ Editar
                      </button>
                    )}
                    <button onClick={() => eliminarSo(so.id)} style={{ backgroundColor: "#dc2626", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>
                      🗑️
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <Link to="/" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "bold" }}>
            ← Tornar al panell principal
          </Link>
        </div>
      </div>
    </div>
  );
}