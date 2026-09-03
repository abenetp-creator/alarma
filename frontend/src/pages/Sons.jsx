import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { bancSonsInicial } from "../data/bancSons";

export default function Sons() {
  const [audioActual, setAudioActual] = useState(null);
  const [fitxerSeleccionat, setFitxerSeleccionat] = useState(null);
  const [carregant, setCarregant] = useState(false);

  // Configuració del teu repositori de GitHub
  const GITHUB_USER = "abenetp-creator";
  const GITHUB_REPO = "alarma";
  const GITHUB_TOKEN = "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";

  const [sons, setSons] = useState(() => {
    const guardats = localStorage.getItem("bancSons");
    return guardats ? JSON.parse(guardats) : bancSonsInicial;
  });

  useEffect(() => {
    localStorage.setItem("bancSons", JSON.stringify(sons));
  }, [sons]);

  const pujarAGitHub = async () => {
    if (!fitxerSeleccionat) {
      alert("Selecciona primer un fitxer MP3");
      return;
    }

    setCarregant(true);

    const reader = new FileReader();
    reader.readAsDataURL(fitxerSeleccionat);

    reader.onload = async () => {
      const contentBase64 = reader.result.split(",")[1];
      const nomFitxer = fitxerSeleccionat.name.replace(/\s+/g, "_");
      const rutaGit = `public/sons/${nomFitxer}`;

      const endpoint = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${rutaGit}`;

      try {
        const resposta = await fetch(endpoint, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json",
          },
          body: JSON.stringify({
            message: `🤖 Afegit so: ${nomFitxer} des de l'app`,
            content: contentBase64,
          }),
        });

        if (resposta.ok) {
          const dades = await resposta.json();
          alert("✅ So pujat i sincronitzat correctament amb GitHub!");

          const nouSo = {
            id: Date.now(),
            nomVisible: fitxerSeleccionat.name.replace(/\.[^/.]+$/, ""),
            nomFitxer: nomFitxer,
            fitxer: dades.content.download_url,
          };

          setSons((prev) => [...prev, nouSo]);
          setFitxerSeleccionat(null);
        } else {
          const errorDades = await resposta.json();
          alert(`❌ Error de GitHub (${resposta.status}): ${errorDades.message}`);
        }
      } catch (err) {
        alert("❌ Error de xarxa en pujar a GitHub: " + err.message);
      } finally {
        setCarregant(false);
      }
    };
  };

  const eliminarSo = (id) => {
    if (audioActual) audioActual.pause();
    setSons(sons.filter((so) => so.id !== id));
  };

  const reproduirSo = (fitxer) => {
    if (!fitxer) {
      alert("Aquest so no té una URL d'àudio vàlida");
      return;
    }
    if (audioActual) audioActual.pause();

    const audio = new Audio(fitxer);
    audio.play().catch((err) => alert("Error en reproduir: " + err.message));
    setAudioActual(audio);
  };

  const aturarSo = () => {
    if (audioActual) {
      audioActual.pause();
      audioActual.currentTime = 0;
    }
  };

  const editarNom = (id) => {
    const nouNom = prompt("Nou nom visible del so:");
    if (!nouNom) return;

    setSons(
      sons.map((so) => (so.id === id ? { ...so, nomVisible: nouNom } : so))
    );
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
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            fontSize: "2.2rem",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          🎵 Banc de Sons (GitHub Sync)
        </h1>

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "35px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: "1.4rem",
              marginBottom: "15px",
              color: "#ffffff",
            }}
          >
            Pujar nou so al repositori
          </h2>

          <input
            type="file"
            accept=".mp3, .wav, .ogg"
            onChange={(e) => setFitxerSeleccionat(e.target.files[0] || null)}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "10px",
              backgroundColor: "#334155",
              color: "#ffffff",
              border: "1px solid #475569",
              boxSizing: "border-box",
              marginBottom: "15px",
            }}
          />

          <button
            onClick={pujarAGitHub}
            disabled={carregant}
            style={{
              backgroundColor: carregant ? "#64748b" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "12px 20px",
              fontWeight: "bold",
              cursor: carregant ? "not-allowed" : "pointer",
              fontSize: "1rem",
            }}
          >
            {carregant
              ? "⏳ Pujant a GitHub..."
              : "⬆️ Afegir i Sincronitzar amb GitHub"}
          </button>
        </div>

        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "20px",
            color: "#ffffff",
            fontWeight: "bold",
          }}
        >
          Sons disponibles
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          {sons.map((so) => (
            <div
              key={so.id}
              style={{
                backgroundColor: "#1e293b",
                padding: "20px",
                borderRadius: "16px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
              }}
            >
              <h3
                style={{
                  margin: "0 0 5px 0",
                  fontSize: "1.3rem",
                  color: "#ffffff",
                }}
              >
                {so.nomVisible}
              </h3>

              <div
                style={{
                  color: "#cbd5e1",
                  fontSize: "0.95rem",
                  marginBottom: "15px",
                }}
              >
                📁 {so.nomFitxer || "Fitxer del sistema"}
              </div>

              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  style={{ ...estilBotoAccio, backgroundColor: "#16a34a" }}
                  onClick={() => reproduirSo(so.fitxer)}
                >
                  ▶️ Escoltar
                </button>

                <button
                  style={{ ...estilBotoAccio, backgroundColor: "#d97706" }}
                  onClick={aturarSo}
                >
                  ⏹️ Aturar
                </button>

                <button
                  style={{ ...estilBotoAccio, backgroundColor: "#0284c7" }}
                  onClick={() => editarNom(so.id)}
                >
                  ✏️ Editar
                </button>

                <button
                  style={{ ...estilBotoAccio, backgroundColor: "#dc2626" }}
                  onClick={() => eliminarSo(so.id)}
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

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