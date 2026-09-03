import { Link } from "react-router-dom";
import { useState } from "react";

export default function Calendari() {
  const [timbresActius, setTimbresActius] = useState(true);
  const [dataDia, setDataDia] = useState("");
  const [motiuDia, setMotiuDia] = useState("");
  const [diesExclosos, setDiesExclosos] = useState([]);

  const [nomPeriode, setNomPeriode] = useState("");
  const [dataInici, setDataInici] = useState("");
  const [dataFinal, setDataFinal] = useState("");
  const [periodes, setPeriodes] = useState([]);

  // Estils millorats per a alt contrast i llegibilitat
  const estilInput = {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #475569",
    backgroundColor: "#334155",
    color: "#ffffff",
    width: "100%",
    maxWidth: "350px",
    fontSize: "1rem",
    outline: "none",
  };

  const estilBoto = {
    backgroundColor: "#2563eb",
    color: "#ffffff",
    border: "none",
    borderRadius: "10px",
    padding: "12px 24px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
    marginTop: "10px",
    display: "inline-block",
  };

  const estilLlistaItem = {
    backgroundColor: "#334155",
    padding: "12px 18px",
    borderRadius: "10px",
    marginTop: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#ffffff",
    borderLeft: "4px solid #38bdf8",
  };

  const afegirDiaExclos = () => {
    if (!dataDia || !motiuDia) return;
    setDiesExclosos([
      ...diesExclosos,
      { id: Date.now(), data: dataDia, motiu: motiuDia },
    ]);
    setDataDia("");
    setMotiuDia("");
  };

  const afegirPeriode = () => {
    if (!nomPeriode || !dataInici || !dataFinal) return;
    setPeriodes([
      ...periodes,
      { id: Date.now(), nom: nomPeriode, inici: dataInici, final: dataFinal },
    ]);
    setNomPeriode("");
    setDataInici("");
    setDataFinal("");
  };

  const eliminarDia = (id) => {
    setDiesExclosos(diesExclosos.filter((dia) => dia.id !== id));
  };

  const eliminarPeriode = (id) => {
    setPeriodes(periodes.filter((periode) => periode.id !== id));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        padding: "30px 20px",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        
        {/* ENCAPÇALAT */}
        <h1
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#ffffff",
            fontSize: "2.2rem",
            fontWeight: "bold",
          }}
        >
          📅 Calendari Escolar
        </h1>

        {/* ESTAT GENERAL */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem" }}>
            Estat general
          </h2>

          <h3
            style={{
              color: timbresActius ? "#4ade80" : "#f87171",
              fontSize: "1.3rem",
              margin: "15px 0",
            }}
          >
            {timbresActius ? "🟢 Timbres activats" : "🔴 Timbres desactivats"}
          </h3>

          <button
            style={{
              ...estilBoto,
              backgroundColor: timbresActius ? "#dc2626" : "#16a34a",
            }}
            onClick={() => setTimbresActius(!timbresActius)}
          >
            {timbresActius ? "Desactivar timbres" : "Activar timbres"}
          </button>
        </div>

        {/* DIES EXCLOSOS */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem" }}>
            Dies exclosos (Festius)
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", color: "#94a3b8", marginBottom: "5px" }}>
                Data del dia festiu:
              </label>
              <input
                type="date"
                value={dataDia}
                onChange={(e) => setDataDia(e.target.value)}
                style={estilInput}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#94a3b8", marginBottom: "5px" }}>
                Motiu:
              </label>
              <input
                type="text"
                placeholder="Ex: Festa Local, Dia del Docent..."
                value={motiuDia}
                onChange={(e) => setMotiuDia(e.target.value)}
                style={estilInput}
              />
            </div>

            <div>
              <button style={estilBoto} onClick={afegirDiaExclos}>
                ➕ Afegir dia exclòs
              </button>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            {diesExclosos.map((dia) => (
              <div key={dia.id} style={estilLlistaItem}>
                <span>
                  <strong>📅 {dia.data}</strong> — {dia.motiu}
                </span>
                <button
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                  onClick={() => eliminarDia(dia.id)}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* PERÍODES EXCLOSOS */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "30px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem" }}>
            Períodes exclosos (Vacances)
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div>
              <label style={{ display: "block", color: "#94a3b8", marginBottom: "5px" }}>
                Nom del període:
              </label>
              <input
                type="text"
                placeholder="Ex: Vacances de Nadal"
                value={nomPeriode}
                onChange={(e) => setNomPeriode(e.target.value)}
                style={estilInput}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#94a3b8", marginBottom: "5px" }}>
                Data d'inici:
              </label>
              <input
                type="date"
                value={dataInici}
                onChange={(e) => setDataInici(e.target.value)}
                style={estilInput}
              />
            </div>

            <div>
              <label style={{ display: "block", color: "#94a3b8", marginBottom: "5px" }}>
                Data de fi:
              </label>
              <input
                type="date"
                value={dataFinal}
                onChange={(e) => setDataFinal(e.target.value)}
                style={estilInput}
              />
            </div>

            <div>
              <button style={estilBoto} onClick={afegirPeriode}>
                ➕ Afegir període
              </button>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            {periodes.map((periode) => (
              <div key={periode.id} style={estilLlistaItem}>
                <div>
                  <strong style={{ fontSize: "1.1rem", display: "block", color: "#ffffff" }}>
                    {periode.nom}
                  </strong>
                  <span style={{ color: "#cbd5e1", fontSize: "0.9rem" }}>
                    {periode.inici} ➔ {periode.final}
                  </span>
                </div>
                <button
                  style={{
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    cursor: "pointer",
                  }}
                  onClick={() => eliminarPeriode(periode.id)}
                >
                  🗑 Eliminar
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* ENLLAÇ TORNAR */}
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
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