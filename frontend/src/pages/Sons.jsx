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

  useEffect(() => {
    localStorage.setItem("bancSons", JSON.stringify(sons));
  }, [sons]);

  // Extreu l'ID de Google Drive i genera la URL de reproducció directa
  const extreureUrlDirectaDrive = (link) => {
    if (!link) return "";
    const match = link.match(/\/d\/([a-zA-Z0-9_-]+)/) || link.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://docs.google.com/uc?export=open&id=${match[1]}`;
    }
    return link; // Retorna l'original si ja és un enllaç directe o nom de fitxer local
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
    audio.play().catch((e) => alert("Error en reproduir l'àudio. Revisa els permisos de Drive."));
    setAudioActual(audio);
  };

  const aturarSo = () => {
    if (audioActual) {
      audioActual.pause();
      setAudioActual(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center" }}>🎵 Banc de Sons</h1>

        {/* Formulari d'afegir so (Només visible per a Admin) */}
        {isAdmin ? (
          <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "30px" }}>
            <h3>Afegir nou so des de Google Drive</h3>
            <form onSubmit={afegirSoDrive} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <input
                type="text"
                placeholder="Nom del so (ex: Timbre d'Eixida)"
                value={nomSo}
                onChange={(e) => setNomSo(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#334155", color: "white" }}
                required
              />
              <input
                type="text"
                placeholder="Enllaç de compartir de Google Drive"
                value={urlDrive}
                onChange={(e) => setUrlDrive(e.target.value)}
                style={{ padding: "10px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#334155", color: "white" }}
                required
              />
              <button type="submit" style={{ backgroundColor: "#2563eb", color: "white", padding: "10px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
                ➕ Enllaçar So
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
            <div key={so.id} style={{ backgroundColor: "#1e293b", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              {soEditant?.id === so.id ? (
                <input
                  type="text"
                  value={soEditant.nomVisible}
                  onChange={(e) => setSoEditant({ ...soEditant, nomVisible: e.target.value })}
                  style={{ padding: "5px", borderRadius: "4px" }}
                />
              ) : (
                <span style={{ fontSize: "1.1rem", fontWeight: "bold" }}>{so.nomVisible}</span>
              )}

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => reproduirSo(so.fitxerAudio)} style={{ backgroundColor: "#16a34a", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>
                  ▶️ Escoltar
                </button>
                <button onClick={aturarSo} style={{ backgroundColor: "#d97706", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }}>
                  ⏹️ Aturar
                </button>

                {isAdmin && (
                  <>
                    {soEditant?.id === so.id ? (
                      <button onClick={() => guardarEdicio(so.id)} style={{ backgroundColor: "#2563eb", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px" }}>
                        💾 Guardar
                      </button>
                    ) : (
                      <button onClick={() => setSoEditant(so)} style={{ backgroundColor: "#475569", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px" }}>
                        ✏️ Editar
                      </button>
                    )}
                    <button onClick={() => eliminarSo(so.id)} style={{ backgroundColor: "#dc2626", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px" }}>
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