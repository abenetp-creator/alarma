import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { bancSonsInicial } from "../data/bancSons";

export default function Configuracio() {
  const { isAdmin, login, logout } = useAuth();

  const [loginUsuari, setLoginUsuari] = useState("");
  const [loginContrasenya, setLoginContrasenya] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const [nomCentre, setNomCentre] = useState(
    () => localStorage.getItem("nomCentre") || "Centre Educatiu"
  );
  const [nouUsuari, setNouUsuari] = useState("admin");
  const [novaContrasenya, setNovaContrasenya] = useState("");

  const [llistaSons, setLlistaSons] = useState(() => {
    const guardats = localStorage.getItem("bancSons");
    return guardats ? JSON.parse(guardats) : bancSonsInicial;
  });

  const [soEvacuacio, setSoEvacuacio] = useState(
    () => localStorage.getItem("soEvacuacio") || llistaSons[0]?.nomVisible || ""
  );
  const [confirmarEvacuacio, setConfirmarEvacuacio] = useState(
    () => localStorage.getItem("confirmarEvacuacio") !== "false"
  );
  const [repetirEvacuacio, setRepetirEvacuacio] = useState(
    () => localStorage.getItem("repetirEvacuacio") === "true"
  );

  useEffect(() => {
    const guardats = localStorage.getItem("bancSons");
    if (guardats) setLlistaSons(JSON.parse(guardats));
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const correcte = login(loginUsuari, loginContrasenya);
    if (!correcte) {
      setErrorLogin("Usuari o contrasenya incorrectes.");
    } else {
      setErrorLogin("");
    }
  };

  const guardarConfiguracio = () => {
    if (novaContrasenya.trim() || nouUsuari.trim()) {
      const novesCredencials = {
        usuari: nouUsuari.trim() || "admin",
        contrasenya: novaContrasenya.trim() || "admin",
      };
      localStorage.setItem("configAdmin", JSON.stringify(novesCredencials));
    }

    localStorage.setItem("nomCentre", nomCentre);
    localStorage.setItem("soEvacuacio", soEvacuacio);
    localStorage.setItem("confirmarEvacuacio", confirmarEvacuacio);
    localStorage.setItem("repetirEvacuacio", repetirEvacuacio);

    setNovaContrasenya("");
    alert("Configuració guardada correctament!");
  };

  const estilInput = {
    width: "100%",
    maxWidth: "400px",
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #475569",
    backgroundColor: "#334155",
    color: "#ffffff",
    fontSize: "1rem",
    outline: "none",
    boxSizing: "border-box",
  };

  const estilLlegenda = {
    display: "block",
    color: "#cbd5e1",
    fontSize: "0.95rem",
    fontWeight: "600",
    marginBottom: "8px",
  };

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#0f172a",
          color: "#ffffff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "20px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "35px 25px",
            borderRadius: "16px",
            maxWidth: "400px",
            width: "100%",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
            textAlign: "center",
          }}
        >
          <span style={{ fontSize: "3rem" }}>🔒</span>
          <h2 style={{ color: "#ffffff", margin: "15px 0" }}>Accés Administrador</h2>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginBottom: "25px" }}>
            Inicia sessió per a poder fer modificacions a la configuració del timbre.
          </p>

          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            <div style={{ textAlign: "left" }}>
              <label style={estilLlegenda}>Usuari</label>
              <input
                type="text"
                value={loginUsuari}
                onChange={(e) => setLoginUsuari(e.target.value)}
                placeholder="Ex: admin"
                style={estilInput}
                required
              />
            </div>

            <div style={{ textAlign: "left" }}>
              <label style={estilLlegenda}>Contrasenya</label>
              <input
                type="password"
                value={loginContrasenya}
                onChange={(e) => setLoginContrasenya(e.target.value)}
                placeholder="Contrasenya"
                style={estilInput}
                required
              />
            </div>

            {errorLogin && (
              <p style={{ color: "#f87171", fontSize: "0.9rem", margin: "5px 0 0 0" }}>
                {errorLogin}
              </p>
            )}

            <button
              type="submit"
              style={{
                backgroundColor: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "10px",
                padding: "12px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
                marginTop: "10px",
              }}
            >
              Accedir
            </button>
          </form>

          <div style={{ marginTop: "25px" }}>
            <Link
              to="/"
              style={{
                color: "#38bdf8",
                textDecoration: "none",
                fontWeight: "bold",
                fontSize: "0.95rem",
              }}
            >
              ← Tornar al panell principal
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "2.2rem", fontWeight: "bold", margin: 0 }}>
            ⚙️ Configuració
          </h1>
          <button
            onClick={logout}
            style={{
              backgroundColor: "#ef4444",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              padding: "8px 16px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            🔒 Tancar Sessió
          </button>
        </div>

        {/* CENTRE */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", marginBottom: "25px" }}>
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem", marginBottom: "20px" }}>🏫 Centre</h2>
          <div>
            <label style={estilLlegenda}>Nom del centre</label>
            <input type="text" value={nomCentre} onChange={(e) => setNomCentre(e.target.value)} style={estilInput} />
          </div>
        </div>

        {/* EVACUACIÓ */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", marginBottom: "25px" }}>
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem", marginBottom: "20px" }}>🚨 Emergència / Evacuació</h2>
          <div style={{ marginBottom: "20px" }}>
            <label style={estilLlegenda}>So d'evacuació assignat</label>
            <select value={soEvacuacio} onChange={(e) => setSoEvacuacio(e.target.value)} style={estilInput}>
              {llistaSons.map((so) => (
                <option key={so.id} value={so.nomVisible}>{so.nomVisible}</option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" checked={confirmarEvacuacio} onChange={() => setConfirmarEvacuacio(!confirmarEvacuacio)} style={{ width: "18px", height: "18px", accentColor: "#2563eb" }} />
              Demanar confirmació abans d'activar l'evacuació
            </label>
            <label style={{ color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
              <input type="checkbox" checked={repetirEvacuacio} onChange={() => setRepetirEvacuacio(!repetirEvacuacio)} style={{ width: "18px", height: "18px", accentColor: "#2563eb" }} />
              Reproducció contínua fins a aturar-la manualment
            </label>
          </div>
        </div>

        {/* CREDENCIALS */}
        <div style={{ backgroundColor: "#1e293b", padding: "25px", borderRadius: "16px", marginBottom: "25px" }}>
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem", marginBottom: "20px" }}>👤 Canviar Credencials</h2>
          <div style={{ marginBottom: "15px" }}>
            <label style={estilLlegenda}>Nou nom d'usuari</label>
            <input type="text" value={nouUsuari} onChange={(e) => setNouUsuari(e.target.value)} style={estilInput} />
          </div>
          <div>
            <label style={estilLlegenda}>Nova contrasenya</label>
            <input type="password" placeholder="Deixa en blanc per mantenir l'actual" value={novaContrasenya} onChange={(e) => setNovaContrasenya(e.target.value)} style={estilInput} />
          </div>
        </div>

        <div style={{ backgroundColor: "#1e293b", padding: "20px", borderRadius: "16px", marginBottom: "30px", display: "flex", justifyContent: "center" }}>
          <button onClick={guardarConfiguracio} style={{ backgroundColor: "#2563eb", color: "#ffffff", border: "none", borderRadius: "10px", padding: "14px 28px", cursor: "pointer", fontWeight: "bold", fontSize: "1.05rem", width: "100%", maxWidth: "400px" }}>
            💾 Guardar configuració
          </button>
        </div>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Link to="/" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "bold", fontSize: "1.1rem" }}>
            ← Tornar al panell principal
          </Link>
        </div>
      </div>
    </div>
  );
}