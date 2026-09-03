import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const DIES_MAP = ["dg", "dll", "dm", "dc", "dj", "dv", "ds"];

export default function NextBell() {
  const [proximToc, setProximToc] = useState(null);

  useEffect(() => {
    const tocsRef = ref(db, "tocs");
    const unsubscribe = onValue(tocsRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setProximToc(null);
        return;
      }

      const llistaTocs = Object.values(data);
      comprovarProxim(llistaTocs);
    });

    return () => unsubscribe();
  }, []);

  const comprovarProxim = (tocs) => {
    const ara = new Date();
    const diaSetmana = DIES_MAP[ara.getDay()];
    const horaActual = ara.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" });

    // Filtrar tocs d'avui que estiguen i siguen posteriors a l'hora actual
    const tocsAvui = tocs
      .filter((t) => t.actiu && t.dies?.includes(diaSetmana) && t.hora > horaActual)
      .sort((a, b) => a.hora.localeCompare(b.hora));

    if (tocsAvui.length > 0) {
      setProximToc(tocsAvui[0]);
    } else {
      setProximToc(null);
    }
  };

  return (
    <div style={{ marginTop: "15px", fontSize: "1.2rem", color: "#38bdf8", fontWeight: "bold" }}>
      {proximToc ? (
        <span>🔔 Pròxim toc: {proximToc.hora} - {proximToc.nom}</span>
      ) : (
        <span>🔕 No hi ha més tocs programats per a hui</span>
      )}
    </div>
  );
}