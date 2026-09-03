import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import { ref, onValue, set } from "firebase/database";

export default function Tocs() {
  const { isAdmin } = useAuth();
  const [tocs, setTocs] = useState([]);
  const [sonsDisponibles, setSonsDisponibles] = useState([]);
  
  const [hora, setHora] = useState("");
  const [nom, setNom] = useState("");
  const [soSeleccionat, setSoSeleccionat] = useState("");
  const [diesSeleccionats, setDiesSeleccionats] = useState(["dll", "dm", "dc", "dj", "dv"]);

  // Escuitar els tocs des de Firebase en temps real
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

    // Carregar sons disponibles des de localStorage
    const sonsGuardats = JSON.parse(localStorage.getItem("bancSons")) || [];
    setSonsDisponibles(sonsGuardats);
    if (sonsGuardats.length > 0) setSoSeleccionat(sonsGuardats[0].fitxerAudio);

    return () => unsubscribe();
  }, []);

  // Guardar la llista completa a Firebase
  const guardarADataBase = (nousTocs) => {
    set(ref(db, "tocs"), nousTocs);
  };

  const afegirToc = (e) => {
    e.preventDefault();
    if (!hora || !nom) return;

    const nouToc = {
      id: Date.now().toString(),
      hora,
      nom,
      fitxerAudio: soSeleccionat,
      dies: diesSeleccionats,
      actiu: true,
    };

    const actualitzats = [...tocs, nouToc];
    guardarADataBase(actualitzats);

    setHora("");
    setNom("");
  };

  const toggleActiu = (id) => {
    const actualitzats = tocs.map((t) => (t.id === id ? { ...t, actiu: !t.actiu } : t));
    guardarADataBase(actualitzats);
  };

  const eliminarToc = (id) => {
    if (window.confirm("Vols eliminar aquest toc horari?")) {
      const actualitzats = tocs.filter((t) => t.id !== id);
      guardarADataBase(actualitzats);
    }
  };

  const toggleDia = (dia) => {
    if (diesSeleccionats.includes(dia)) {
      setDiesSeleccionats(diesSeleccionats.filter((d) => d !== dia));
    } else {
      setDiesSeleccionats([...diesSeleccionats, dia]);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "white", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", color: "#ffffff" }}>🔔 Gestió de Tocs Horaris</h1>

        {isAdmin ? (
          <form onSubmit={afegirToc} style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "12px", marginBottom: "30px", display: "flex", flexDirection: "column", gap: "12px" }}>
            <h3>Afegir nou toc horari</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} required style={{ padding: "10px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white" }} />
              <input type="text" placeholder="Nom del toc (ex: Entrada)" value={nom} onChange={(e) => setNom(e.target.value)} required style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white" }} />
            </div>

            <select value={soSeleccionat} onChange={(e) => setSoSeleccionat(e.target.value)} style={{ padding: "10px", borderRadius: "6px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white" }}>
              {sonsDisponibles.map((so) => (
                <option key={so.id} value={so.fitxerAudio}>{so.nomVisible}</option>
              ))}
            </select>

            <div style={{ display: "flex", gap: "10px", justifyContent: "space-between" }}>
              {["dll", "dm", "dc", "dj", "dv"].map((dia) => (
                <label key={dia} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                  <input type="checkbox" checked={diesSeleccionats.includes(dia)} onChange={() => toggleDia(dia)} />
                  {dia.toUpperCase()}
                </label>
              ))}
            </div>

            <button type="submit" style={{ backgroundColor: "#2563eb", color: "white", padding: "10px", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>
              ➕ Programar Toc
            </button>
          </form>
        ) : (
          <div style={{ backgroundColor: "#334155", padding: "12px", borderRadius: "8px", textAlign: "center", marginBottom: "20px" }}>
            🔒 Mode Lectura: Inicia sessió per a modificar els horaris.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {tocs.map((toc) => (
            <div key={toc.id} style={{ backgroundColor: "#1e293b", padding: "15px", borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "1.2rem", fontWeight: "bold", marginRight: "10px" }}>{toc.hora}</span>
                <span>{toc.nom}</span>
                <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "4px" }}>
                  Dies: {toc.dies?.join(", ").toUpperCase()}
                </div>
              </div>

              {isAdmin && (
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={() => toggleActiu(toc.id)} style={{ backgroundColor: toc.actiu ? "#16a34a" : "#64748b", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                    {toc.actiu ? "Actiu" : "Inactiu"}
                  </button>
                  <button onClick={() => eliminarToc(toc.id)} style={{ backgroundColor: "#dc2626", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" }}>
                    🗑️
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <Link to="/" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "bold" }}>← Tornar al panell principal</Link>
        </div>
      </div>
    </div>
  );
}