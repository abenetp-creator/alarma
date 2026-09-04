import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, push, remove, update } from "firebase/database";

export default function Tocs() {
  const [hora, setHora] = useState("");
  const [nom, setNom] = useState("");
  const [soSeleccionat, setSoSeleccionat] = useState("");
  const [dies, setDies] = useState({
    dll: true,
    dm: true,
    dc: true,
    dj: true,
    dv: true,
  });

  const [idEnEdicio, setIdEnEdicio] = useState(null);
  const [opcionsSons, setOpcionsSons] = useState([]);
  const [llistaTocs, setLlistaTocs] = useState([]);
  const [audioEnReproduccio, setAudioEnReproduccio] = useState(null);

  // 1. Carregar els sons des del Banc de Sons en temps real
  useEffect(() => {
    const sonsRef = ref(db, "sons");
    const unsubscribe = onValue(sonsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const llista = Object.entries(data).map(([id, valor]) => ({
          id,
          nom: valor.nom,
          url: valor.fitxerAudio || valor.url || valor.urlAudio,
        }));
        setOpcionsSons(llista);
        if (llista.length > 0 && !soSeleccionat) {
          setSoSeleccionat(llista[0].url);
        }
      } else {
        setOpcionsSons([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Carregar els tocs programats
  useEffect(() => {
    const tocsRef = ref(db, "tocs");
    const unsubscribe = onValue(tocsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const llista = Object.entries(data).map(([id, valor]) => ({
          id,
          ...valor,
        }));
        setLlistaTocs(llista);
      } else {
        setLlistaTocs([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCheckboxChange = (dia) => {
    setDies((prev) => ({ ...prev, [dia]: !prev[dia] }));
  };

  const netejarFormulari = () => {
    setHora("");
    setNom("");
    setIdEnEdicio(null);
    setDies({ dll: true, dm: true, dc: true, dj: true, dv: true });
    if (opcionsSons.length > 0) {
      setSoSeleccionat(opcionsSons[0].url);
    }
  };

  const guardarToc = async (e) => {
    e.preventDefault();
    if (!hora || !nom || !soSeleccionat) {
      alert("⚠️ Si us plau, omple tots els camps.");
      return;
    }

    const diesTriats = Object.keys(dies).filter((d) => dies[d]);

    try {
      if (idEnEdicio) {
        // Mode Actualització
        const tocRef = ref(db, `tocs/${idEnEdicio}`);
        await update(tocRef, {
          hora,
          nom,
          fitxerAudio: soSeleccionat,
          dies: diesTriats,
        });
        alert("✏️ Toc actualitzat correctament!");
      } else {
        // Mode Nou Toc
        const tocsRef = ref(db, "tocs");
        await push(tocsRef, {
          hora,
          nom,
          fitxerAudio: soSeleccionat,
          dies: diesTriats,
          actiu: true,
        });
        alert("🎉 Toc programat correctament!");
      }

      netejarFormulari();
    } catch (err) {
      console.error(err);
      alert("❌ Error en guardar el toc.");
    }
  };

  const carregarTocPerAEditar = (toc) => {
    setIdEnEdicio(toc.id);
    setHora(toc.hora || "");
    setNom(toc.nom || "");
    setSoSeleccionat(toc.fitxerAudio || toc.url || toc.urlAudio || "");

    const nousDies = { dll: false, dm: false, dc: false, dj: false, dv: false };
    if (toc.dies) {
      toc.dies.forEach((d) => {
        if (nousDies.hasOwnProperty(d)) nousDies[d] = true;
      });
    }
    setDies(nousDies);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const esborrarToc = async (id) => {
    if (window.confirm("Vols eliminar aquest toc horari?")) {
      await remove(ref(db, `tocs/${id}`));
      if (idEnEdicio === id) {
        netejarFormulari();
      }
    }
  };

  const provarSo = (urlAudio) => {
    if (!urlAudio) {
      alert("⚠️ Aquest toc no té cap àudio vàlid associat.");
      return;
    }

    if (audioEnReproduccio) {
      audioEnReproduccio.pause();
      audioEnReproduccio.currentTime = 0;
    }

    const audio = new Audio(urlAudio);
    setAudioEnReproduccio(audio);

    audio.play().catch((err) => {
      console.error("Error reproduint el so:", err);
      alert("❌ Error en reproduir el so.");
    });
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", padding: "30px 20px", fontFamily: "sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2.2rem", fontWeight: "800" }}>
          🔔 Gestió de Tocs Horaris
        </h1>

        {/* Formulari d'afegir / editar toc */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", marginBottom: "30px", border: idEnEdicio ? "2px solid #eab308" : "1px solid #334155" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.25rem", color: idEnEdicio ? "#eab308" : "#38bdf8", marginBottom: "20px", textAlign: "center" }}>
            {idEnEdicio ? "✏️ Editar Toc Horari" : "Afegir nou toc horari"}
          </h2>

          <form onSubmit={guardarToc}>
            <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <input
                type="time"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                style={{ padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white", fontSize: "1rem" }}
              />
              <input
                type="text"
                placeholder="Nom del toc (ex: Entrada)"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                style={{ flex: 1, padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white", fontSize: "1rem" }}
              />
            </div>

            {/* Desplegable de Sons */}
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "8px", color: "#94a3b8" }}>Selecciona el so:</label>
              <select
                value={soSeleccionat}
                onChange={(e) => setSoSeleccionat(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white", fontSize: "1rem" }}
              >
                {opcionsSons.length === 0 ? (
                  <option value="">No hi ha sons al Banc de Sons</option>
                ) : (
                  opcionsSons.map((so) => (
                    <option key={so.id} value={so.url}>
                      {so.nom}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Selecció de dies */}
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
              {["dll", "dm", "dc", "dj", "dv"].map((dia) => (
                <label key={dia} style={{ display: "flex", alignItems: "center", gap: "5px", textTransform: "uppercase", fontWeight: "bold" }}>
                  <input
                    type="checkbox"
                    checked={dies[dia]}
                    onChange={() => handleCheckboxChange(dia)}
                  />
                  {dia}
                </label>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                style={{ flex: 1, padding: "12px", backgroundColor: idEnEdicio ? "#eab308" : "#2563eb", color: idEnEdicio ? "black" : "white", border: "none", borderRadius: "8px", fontWeight: "bold", fontSize: "1rem", cursor: "pointer" }}
              >
                {idEnEdicio ? "💾 Guardar Canvis" : "➕ Programar Toc"}
              </button>

              {idEnEdicio && (
                <button
                  type="button"
                  onClick={netejarFormulari}
                  style={{ padding: "12px 20px", backgroundColor: "#64748b", color: "white", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
                >
                  Cancel·lar
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Llista de Tocs Programats */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", border: "1px solid #334155", marginBottom: "30px" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.25rem", color: "#38bdf8", marginBottom: "20px" }}>Tocs Programats</h2>

          {llistaTocs.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center" }}>No hi ha cap toc programat.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {llistaTocs.map((t) => (
                <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0f172a", padding: "15px", borderRadius: "10px", border: "1px solid #334155" }}>
                  <div>
                    <span style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#38bdf8", marginRight: "10px" }}>{t.hora}</span>
                    <span style={{ fontWeight: "bold", color: "#f8fafc" }}>{t.nom}</span>
                    <div style={{ fontSize: "0.85rem", color: "#94a3b8", marginTop: "4px" }}>
                      Dies: {t.dies?.join(", ").toUpperCase()}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => provarSo(t.fitxerAudio || t.url || t.urlAudio)}
                      style={{ backgroundColor: "#0284c7", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                      title="Provar so"
                    >
                      ▶️ Provar
                    </button>
                    <button
                      onClick={() => carregarTocPerAEditar(t)}
                      style={{ backgroundColor: "#eab308", color: "black", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                      title="Editar toc"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => esborrarToc(t.id)}
                      style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
                      title="Esborrar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/" style={{ color: "#f8fafc", textDecoration: "none", fontWeight: "600", backgroundColor: "#334155", padding: "10px 20px", borderRadius: "10px", display: "inline-block" }}>
            ⬅️ Tornar al panell principal
          </Link>
        </div>

      </div>
    </div>
  );
}