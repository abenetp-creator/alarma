import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, push, onValue, remove } from "firebase/database";

export default function Sons() {
  const [nomSo, setNomSo] = useState("");
  const [carregant, setCarregant] = useState(false);
  const [llistaSons, setLlistaSons] = useState([]);

  // Configuració de Cloudinary
  const CLOUD_NAME = "jpttonqs";
  const UPLOAD_PRESET = "sons_escola";

  // Carregar la llista de sons en temps real des de Firebase
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

  // Funció per a pujar l'àudio
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

  // Funció per a esborrar un so
  const esborrarSo = async (id) => {
    if (window.confirm("Vols eliminar aquest so de la llista?")) {
      await remove(ref(db, `sons/${id}`));
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", color: "white", padding: "20px", fontFamily: "sans-serif", boxSizing: "border-box" }}>
      
      {/* Botó per a tornar a la Home */}
      <div style={{ marginBottom: "20px" }}>
        <Link to="/" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "bold", backgroundColor: "#1e293b", padding: "8px 16px", borderRadius: "8px", display: "inline-block" }}>
          ⬅️ Tornar a l'Inici
        </Link>
      </div>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", fontSize: "2rem" }}>🎵 Banc de Sons</h1>

        {/* Formulari de Pujada */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", marginBottom: "30px", border: "1px solid #334155" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.3rem", color: "#38bdf8" }}>Afegir nou so</h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Nom del so:</label>
            <input
              type="text"
              value={nomSo}
              onChange={(e) => setNomSo(e.target.value)}
              placeholder="Ex: Entrada, Loquillo, Canvi de classe..."
              disabled={carregant}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #475569", backgroundColor: "#0f172a", color: "white", fontSize: "1rem", boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>Selecciona el fitxer de so (.mp3):</label>
            <input
              type="file"
              accept="audio/*"
              onChange={pujarAudio}
              disabled={carregant}
              style={{ width: "100%", padding: "10px", backgroundColor: "#0f172a", borderRadius: "8px", border: "1px solid #475569", color: "white" }}
            />
          </div>

          {carregant && <p style={{ color: "#38bdf8", fontWeight: "bold", textAlign: "center", margin: "10px 0 0 0" }}>⏳ Pujant fitxer al núvol...</p>}
        </div>

        {/* Llista de Sons Registrats */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", border: "1px solid #334155" }}>
          <h2 style={{ marginTop: 0, fontSize: "1.3rem", color: "#38bdf8", marginBottom: "20px" }}>Sons Disponibles</h2>

          {llistaSons.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center" }}>No hi ha cap so registrat encara.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {llistaSons.map((so) => (
                <div key={so.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#0f172a", padding: "15px", borderRadius: "10px", border: "1px solid #334155" }}>
                  <div>
                    <span style={{ fontWeight: "bold", fontSize: "1.1rem", display: "block" }}>{so.nom}</span>
                    <audio controls src={so.fitxerAudio} style={{ marginTop: "8px", height: "35px" }} />
                  </div>
                  <button onClick={() => esborrarSo(so.id)} style={{ backgroundColor: "#ef4444", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}>
                    🗑️ Esborrar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}