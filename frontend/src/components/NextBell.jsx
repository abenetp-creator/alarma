import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const DIES_MAP = ["dg", "dll", "dm", "dc", "dj", "dv", "ds"];

export default function NextBell() {
  const [proximToc, setProximToc] = useState(null);
  const [audioActivat, setAudioActivat] = useState(false);
  const tocsRefData = useRef([]);
  const ultimsTocsSonats = useRef(new Set());

  // 1. Carregar tocs des de Firebase
  useEffect(() => {
    const tocsRef = ref(db, "tocs");
    const unsubscribe = onValue(tocsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        tocsRefData.current = [];
        setProximToc(null);
        return;
      }

      const llistaTocs = Object.values(data);
      tocsRefData.current = llistaTocs;
      comprovarProxim(llistaTocs);
    });

    return () => unsubscribe();
  }, []);

  // 2. Rellotge que comprova cada segons si cal reproduir el so
  useEffect(() => {
    const interval = setInterval(() => {
      const ara = new Date();
      const diaSetmana = DIES_MAP[ara.getDay()];
      const horaMinutActual = ara.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });
      const segonsActuals = ara.getSeconds();

      comprovarProxim(tocsRefData.current);

      // Comprovar si hi ha un toc exactament en aquest minut (als 00 segons)
      if (segonsActuals === 0) {
        const tocsAra = tocsRefData.current.filter(
          (t) => t.actiu && t.dies?.includes(diaSetmana) && t.hora === horaMinutActual
        );

        tocsAra.forEach((toc) => {
          const clauToc = `${toc.hora}-${toc.nom}`;
          if (!ultimsTocsSonats.current.has(clauToc)) {
            reproduirSo(toc);
            ultimsTocsSonats.current.add(clauToc);

            // Neteja del registre passat 1 minut
            setTimeout(() => {
              ultimsTocsSonats.current.delete(clauToc);
            }, 60000);
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3. Funció per a trobar el pròxim toc
  const comprovarProxim = (tocs) => {
    const ara = new Date();
    const diaSetmana = DIES_MAP[ara.getDay()];
    const horaActual = ara.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });

    const tocsAvui = tocs
      .filter((t) => t.actiu && t.dies?.includes(diaSetmana) && t.hora > horaActual)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    setProximToc(tocsAvui.length > 0 ? tocsAvui[0] : null);
  };

  // 4. Reproducció de l'àudio compatible amb Cloudinary i iPad
  const reproduirSo = (toc) => {
    // Cerca la ruta en qualsevol dels camps possibles
    const audioUrl = toc.fitxerAudio || toc.url || toc.urlAudio;

    if (!audioUrl) {
      console.error("⚠️ No s'ha trobat cap URL d'àudio vàlida per al toc:", toc);
      return;
    }

    const reproductor = new Audio(audioUrl);
    reproductor
      .play()
      .then(() => {
        console.log("🔔 Reproduint so:", toc.nom);
      })
      .catch((err) => {
        console.error("❌ Error en reproduir l'àudio (bloqueig del navegador?):", err);
      });
  };

  // 5. Permís inicial per a desbloquejar Safari/iOS a l'iPad
  const activarAudioInicial = () => {
    const audioTest = new Audio("https://res.cloudinary.com/jpttonqs/video/upload/v1/sample.mp3");
    audioTest.volume = 0;
    audioTest
      .play()
      .then(() => {
        setAudioActivat(true);
      })
      .catch(() => {
        setAudioActivat(true);
      });
  };

  return (
    <div style={{ marginTop: "15px", textAlign: "center" }}>
      {!audioActivat && (
        <div style={{ marginBottom: "15px" }}>
          <button
            onClick={activarAudioInicial}
            style={{
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
            }}
          >
            🔊 Activar Àudio de l'iPad / Navegador
          </button>
        </div>
      )}

      <div style={{ fontSize: "1.2rem", color: "#38bdf8", fontWeight: "bold" }}>
        {proximToc ? (
          <span>🔔 Pròxim toc: {proximToc.hora} - {proximToc.nom}</span>
        ) : (
          <span>🔕 No hi ha més tocs programats per a hui</span>
        )}
      </div>
    </div>
  );
}