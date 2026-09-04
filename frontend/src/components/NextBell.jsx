import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const DIES_MAP = ["dg", "dll", "dm", "dc", "dj", "dv", "ds"];

export default function NextBell() {
  const [proximToc, setProximToc] = useState(null);
  const [audioActivat, setAudioActivat] = useState(false);
  const tocsRefData = useRef([]);
  const ultimsTocsSonats = useRef(new Set());

  // Funció auxiliar per obtindre l'hora actual en format "HH:MM" (24h) de manera 100% fiable
  const getHoraActual24h = () => {
    const ara = new Date();
    const hores = String(ara.getHours()).padStart(2, "0");
    const minuts = String(ara.getMinutes()).padStart(2, "0");
    return `${hores}:${minuts}`;
  };

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

  // 2. Rellotge que comprova cada segon l'hora exacta
  useEffect(() => {
    const interval = setInterval(() => {
      const ara = new Date();
      const diaSetmana = DIES_MAP[ara.getDay()];
      const horaMinutActual = getHoraActual24h();
      const segonsActuals = ara.getSeconds();

      comprovarProxim(tocsRefData.current);

      // Disparar el so als 00 segons del minut corresponent
      if (segonsActuals === 0) {
        const tocsAra = tocsRefData.current.filter(
          (t) => t.actiu && t.dies?.includes(diaSetmana) && t.hora === horaMinutActual
        );

        tocsAra.forEach((toc) => {
          const clauToc = `${toc.hora}-${toc.nom}`;
          if (!ultimsTocsSonats.current.has(clauToc)) {
            reproduirSo(toc);
            ultimsTocsSonats.current.add(clauToc);

            setTimeout(() => {
              ultimsTocsSonats.current.delete(clauToc);
            }, 60000);
          }
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // 3. Comprovar el pròxim toc de hui
  const comprovarProxim = (tocs) => {
    const ara = new Date();
    const diaSetmana = DIES_MAP[ara.getDay()];
    const horaActual = getHoraActual24h();

    const tocsAvui = tocs
      .filter((t) => t.actiu && t.dies?.includes(diaSetmana) && t.hora > horaActual)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    setProximToc(tocsAvui.length > 0 ? tocsAvui[0] : null);
  };

  // 4. Reproducció de l'àudio
  const reproduirSo = (toc) => {
    const audioUrl = toc.fitxerAudio || toc.url || toc.urlAudio;

    if (!audioUrl) {
      console.error("⚠️ No s'ha trobat URL d'àudio per al toc:", toc);
      return;
    }

    const reproductor = new Audio(audioUrl);
    reproductor
      .play()
      .then(() => {
        console.log("🔔 Reproduint so a l'iPad/PC:", toc.nom);
      })
      .catch((err) => {
        console.error("❌ Error en reproduir l'àudio a l'iPad:", err);
      });
  };

  // 5. Activar àudio a l'iPad
  const activarAudioInicial = () => {
    const audioTest = new Audio("https://res.cloudinary.com/jpttonqs/video/upload/v1/sample.mp3");
    audioTest.volume = 0;
    audioTest
      .play()
      .then(() => setAudioActivat(true))
      .catch(() => setAudioActivat(true));
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