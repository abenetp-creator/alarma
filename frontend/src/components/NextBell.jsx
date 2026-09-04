import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const DIES_MAP = ["dg", "dll", "dm", "dc", "dj", "dv", "ds"];

export default function NextBell() {
  const [proximToc, setProximToc] = useState(null);
  const [audioActivat, setAudioActivat] = useState(false);
  const [esFestiuHui, setEsFestiuHui] = useState(false);
  const [nomFestiu, setNomFestiu] = useState("");
  
  const tocsRefData = useRef([]);
  const ultimsTocsSonats = useRef(new Set());
  const audioPlayerRef = useRef(null);

  const getHoraActual24h = () => {
    const ara = new Date();
    const hores = String(ara.getHours()).padStart(2, "0");
    const minuts = String(ara.getMinutes()).padStart(2, "0");
    return `${hores}:${minuts}`;
  };

  const getDataActualISO = () => {
    const ara = new Date();
    const any = ara.getFullYear();
    const mes = String(ara.getMonth() + 1).padStart(2, "0");
    const dia = String(ara.getDate()).padStart(2, "0");
    return `${any}-${mes}-${dia}`;
  };

  // 1. Comprovar si hui és festiu al calendari
  useEffect(() => {
    const festiusRef = ref(db, "festius");
    const unsubscribe = onValue(festiusRef, (snapshot) => {
      const data = snapshot.val();
      const avuiStr = getDataActualISO();
      
      if (data) {
        const trobat = Object.values(data).find((f) => f.data === avuiStr);
        if (trobat) {
          setEsFestiuHui(true);
          setNomFestiu(trobat.nom || "Festiu / Vacances");
        } else {
          setEsFestiuHui(false);
          setNomFestiu("");
        }
      } else {
        setEsFestiuHui(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Carregar els tocs de l'horari que estiga ACTIU actualment
  useEffect(() => {
    const horariActiuRef = ref(db, "configuracio/horariActiu");
    
    const unsubscribeConfig = onValue(horariActiuRef, (snapshotHorari) => {
      const horariActiu = snapshotHorari.val() || "octubre_maig";

      const tocsRef = ref(db, `tocs/${horariActiu}`);
      onValue(tocsRef, (snapshotTocs) => {
        const data = snapshotTocs.val();
        if (!data) {
          tocsRefData.current = [];
          setProximToc(null);
          return;
        }

        const llistaTocs = Object.values(data);
        tocsRefData.current = llistaTocs;
        comprovarProxim(llistaTocs);
      });
    });

    return () => unsubscribeConfig();
  }, []);

  // 3. Temporitzador de comprovació cada segon
  useEffect(() => {
    const interval = setInterval(() => {
      if (esFestiuHui) return; // Si hui és festiu no es fa res

      const ara = new Date();
      const diaSetmana = DIES_MAP[ara.getDay()];
      const horaMinutActual = getHoraActual24h();
      const segonsActuals = ara.getSeconds();

      comprovarProxim(tocsRefData.current);

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
  }, [esFestiuHui]);

  const comprovarProxim = (tocs) => {
    if (esFestiuHui) {
      setProximToc(null);
      return;
    }

    const ara = new Date();
    const diaSetmana = DIES_MAP[ara.getDay()];
    const horaActual = getHoraActual24h();

    const tocsAvui = tocs
      .filter((t) => t.actiu && t.dies?.includes(diaSetmana) && t.hora > horaActual)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    setProximToc(tocsAvui.length > 0 ? tocsAvui[0] : null);
  };

  const reproduirSo = (toc) => {
    const audioUrl = toc.fitxerAudio || toc.url || toc.urlAudio;
    if (!audioUrl) return;

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
    }

    audioPlayerRef.current.src = audioUrl;
    audioPlayerRef.current.currentTime = 0;
    
    audioPlayerRef.current.play().catch((err) => {
      console.error("❌ Error en reproduir àudio:", err);
    });
  };

  const activarAudioInicial = () => {
    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio();
    }
    
    audioPlayerRef.current.src = "https://res.cloudinary.com/jpttonqs/video/upload/v1/sample.mp3";
    audioPlayerRef.current
      .play()
      .then(() => {
        audioPlayerRef.current.pause();
        audioPlayerRef.current.currentTime = 0;
        setAudioActivat(true);
      })
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
              padding: "12px 24px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            🔊 Activar Àudio de l'iPad / Navegador
          </button>
        </div>
      )}

      <div style={{ fontSize: "1.2rem", color: esFestiuHui ? "#f59e0b" : "#38bdf8", fontWeight: "bold" }}>
        {esFestiuHui ? (
          <span>🌴 Hui és festiu ({nomFestiu}). Tocs desactivats.</span>
        ) : proximToc ? (
          <span>🔔 Pròxim toc: {proximToc.hora} - {proximToc.nom}</span>
        ) : (
          <span>🔕 No hi ha més tocs programats per a hui</span>
        )}
      </div>
    </div>
  );
}