import { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database";

export default function GestorSons() {
  const [nomSo, setNomSo] = useState("");
  const [carregant, setCarregant] = useState(false);

  // Configuració de Cloudinary
  const CLOUD_NAME = "jpttonqs";
  const UPLOAD_PRESET = "sons_escola";

  const pujarAudio = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!nomSo.trim()) {
      alert("Si us plau, escriu un nom per al so abans de seleccionar el fitxer.");
      e.target.value = ""; // Neteja la selecció
      return;
    }

    setCarregant(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("resource_type", "auto");

    try {
      // 1. Pujar el fitxer a Cloudinary
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();

      if (data.secure_url) {
        // 2. Guardar la URL neta a Firebase Realtime Database
        const sonsRef = ref(db, "sons");
        await push(sonsRef, {
          nom: nomSo,
          url: data.secure_url,
          creat: new Date().toISOString(),
        });

        alert("🎉 Fitxer d'àudio pujat i guardat correctament!");
        setNomSo("");
      } else {
        throw new Error("No s'ha obtingut la URL de l'àudio");
      }
    } catch (err) {
      console.error(err);
      alert("Error en pujar l'àudio a Cloudinary.");
    } finally {
      setCarregant(false);
      e.target.value = "";
    }
  };

  return (
    <div style={{ padding: "20px", color: "white", maxWidth: "500px" }}>
      <h2>🎵 Afegir nou so</h2>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Nom del so:</label>
        <input
          type="text"
          value={nomSo}
          onChange={(e) => setNomSo(e.target.value)}
          placeholder="Ex: So d'Entrada, Loquillo, Evacuació..."
          style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
          disabled={carregant}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px" }}>Selecciona el fitxer .mp3:</label>
        <input
          type="file"
          accept="audio/*"
          onChange={pujarAudio}
          disabled={carregant}
          style={{ color: "white" }}
        />
      </div>

      {carregant && <p style={{ color: "#38bdf8" }}>⏳ Pujant fitxer al núvol...</p>}
    </div>
  );
}