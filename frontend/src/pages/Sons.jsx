import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, push, onValue, remove } from "firebase/database";

export default function Sons() {
  const [nomSo, setNomSo] = useState("");
  const [carregant, setCarregant] = useState(false);
  const [llistaSons, setLlistaSons] = useState([]);

  const CLOUD_NAME = "jpttonqs";
  const UPLOAD_PRESET = "sons_escola";

  useEffect(() => {
    const sonsRef = ref(db, "sons");
    const unsubscribe = onValue(sonsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const llistaFormatada = Object.entries(data).map(([id, valor]) => ({
          id,
          ...valor,
        }));
        setLlistaSons(llistaFormatada);
      } else {
        setLlistaSons([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const pujarAudio = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!nomSo.trim()) {
      alert("⚠️ Escriu un nom per al so abans de seleccionar el fitxer.");
      e.target.value = "";
      return;
    }

    setCarregant(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "auto");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        const sonsRef = ref(db, "sons");
        await push(sonsRef, {
          nom: nomSo,
          fitxerAudio: data.secure_url,
          dataCreacio: new Date().toLocaleDateString("ca-ES"),
        });

        alert("🎉 Fitxer d'àudio pujat i guardat amb èxit!");
        setNomSo("");
      } else {
        throw new Error("No s'ha pogut obtindre la URL de l'àudio");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error en pujar l'àudio a Cloudinary.");
    } finally {
      setCarregant(false);
      e.target.value = "";
    }
  };

  const esborrarSo = async (id) => {
    if (window.confirm("Vols eliminar aquest so de la llista?")) {
      await remove(ref(db, `sons/${id}`));
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "#f8fafc", padding: "30px 20px", fontFamily: "sans-serif", boxSizing: "border-box" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2.2rem", color: "#f8fafc", fontWeight: "800" }}>
          🎵 Banc de Sons
        </h1>

        {/* Formulari de Pujada */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", marginBottom: "30px", border: "1px solid #334155" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.25rem", color: "#38bdf8", marginBottom: "15px" }}>Afegir nou so</h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#e2e8f0" }}>Nom del so:</label>
            <input
              type="text"
              value={nomSo}
              onChange={(e) => setNomSo(e.target.value)}
              placeholder="Ex: Entrada, Loquillo, Canvi de classe..."
              disabled={carregant}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "#ffffff", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "10px" }}>
            <label style={{ display: "block", marginBottom: "6px", fontWeight: "600", color: "#e2e8f0" }}>Selecciona el fitxer de so (.mp3):</label>
            <input
              type="file"
              accept="audio/*"
              onChange={pujarAudio}
              disabled={carregant}
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #475569", color: "#ffffff" }}
            />
          </div>

          {carregant && <p style={{ color: "#38bdf8", fontWeight: "bold", textAlign: "center", marginTop: "15px" }}>⏳ Pujant fitxer al núvol...</p>}
        </div>

        {/* Llista de Sons Registrats */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", border: "1px solid #334155", marginBottom: "30px" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.25rem", color: "#38bdf8", marginBottom: "20px" }}>Sons Disponibles</h2>

          {llistaSons.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center" }}>No hi ha cap so registrat encara.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {llistaSons.map((so) => (
                <div key={so.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0f172a", padding: "15px", borderRadius: "10px", border: "1px solid #334155" }}>
                  <div>
                    <span style={{ fontWeight: "bold", fontSize: "1.1rem", display: "block", color: "#f8fafc" }}>{so.nom}</span>
                    <audio controls src={so.fitxerAudio} style={{ marginTop: "8px", height: "35px" }} />
                  </div>
                  <button onClick={() => esborrarSo(so.id)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "8px 14px", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}>
                    🗑️ Esborrar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botó Tornar a l'Inici */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/" style={{ color: "#f8fafc", textDecoration: "none", fontWeight: "600", backgroundColor: "#334155", padding: "10px 20px", borderRadius: "10px", display: "inline-block" }}>
            ⬅️ Tornar a l'Inici
          </Link>
        </div>

      </div>
    </div>
  );
}