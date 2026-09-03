import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { bancSonsInicial } from "../data/bancSons";

export default function Configuracio() {
  // Carregarem les credencials des de localStorage o utilitzarem 'admin' / 'admin' per defecte
  const [adminConfig, setAdminConfig] = useState(() => {
    const guardat = localStorage.getItem("configAdmin");
    return guardat ? JSON.parse(guardat) : { usuari: "admin", contrasenya: "admin" };
  });

  // Estat d'autenticació
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginUsuari, setLoginUsuari] = useState("");
  const [loginContrasenya, setLoginContrasenya] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  // Estats de configuració
  const [nomCentre, setNomCentre] = useState(() => localStorage.getItem("nomCentre") || "Centre Educatiu");
  const [nouUsuari, setNouUsuari] = useState(adminConfig.usuari);
  const [novaContrasenya, setNovaContrasenya] = useState("");

  // Càrrega dinàmica de sons des de localStorage
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
    if (guardats) {
      setLlistaSons(JSON.parse(guardats));
    }
  }, []);

  // Validació de Login
  const handleLogin = (e) => {
    e.preventDefault();
    if (
      loginUsuari.trim() === adminConfig.usuari &&
      loginContrasenya.trim() === adminConfig.contrasenya
    ) {
      setIsAdmin(true);
      setErrorLogin("");
    } else {
      setErrorLogin("Usuari o contrasenya incorrectes.");
    }
  };

  const guardarConfiguracio = () => {
    // Actualitzar credencials si s'ha definit una nova contrasenya o usuari
    const novesCredencials = {
      usuari: nouUsuari.trim() || adminConfig.usuari,
      contrasenya: novaContrasenya.trim() ? novaContrasenya.trim() : adminConfig.contrasenya,
    };

    setAdminConfig(novesCredencials);
    localStorage.setItem("configAdmin", JSON.stringify(novesCredencials));
    localStorage.setItem("nomCentre", nomCentre);
    localStorage.setItem("soEvacuacio", soEvacuacio);
    localStorage.setItem("confirmarEvacuacio", confirmarEvacuacio);
    localStorage.setItem("repetirEvacuacio", repetirEvacuacio);

    setNovaContrasenya("");
    alert("Configuració i credencials guardades correctament!");
  };

  // Estils comuns
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

  // PANTALLA D'INICI DE SESSIÓ (Si no és administrador)
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
            Cal iniciar sessió per a poder modificar la configuració del sistema.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
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

  // PANTALLA DE CONFIGURACIÓ (I d'administració)
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
        {/* ENCAPÇALAT */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={{ color: "#ffffff", fontSize: "2.2rem", fontWeight: "bold", margin: 0 }}>
            ⚙️ Configuració
          </h1>
          <button
            onClick={() => setIsAdmin(false)}
            style={{
              backgroundColor: "#475569",
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
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem", marginBottom: "20px" }}>
            🏫 Centre
          </h2>

          <div>
            <label style={estilLlegenda}>Nom del centre</label>
            <input
              type="text"
              value={nomCentre}
              onChange={(e) => setNomCentre(e.target.value)}
              style={estilInput}
            />
          </div>
        </div>

        {/* EVACUACIÓ */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem", marginBottom: "20px" }}>
            🚨 Emergència / Evacuació
          </h2>

          <div style={{ marginBottom: "20px" }}>
            <label style={estilLlegenda}>So d'evacuació assignat</label>
            <select
              value={soEvacuacio}
              onChange={(e) => setSoEvacuacio(e.target.value)}
              style={estilInput}
            >
              {llistaSons.map((so) => (
                <option key={so.id} value={so.nomVisible}>
                  {so.nomVisible}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <label style={{ color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={confirmarEvacuacio}
                onChange={() => setConfirmarEvacuacio(!confirmarEvacuacio)}
                style={{ width: "18px", height: "18px", accentColor: "#2563eb" }}
              />
              Demanar confirmació abans d'activar l'evacuació
            </label>

            <label style={{ color: "#ffffff", cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
              <input
                type="checkbox"
                checked={repetirEvacuacio}
                onChange={() => setRepetirEvacuacio(!repetirEvacuacio)}
                style={{ width: "18px", height: "18px", accentColor: "#2563eb" }}
              />
              Reproducció contínua fins a aturar-la manualment
            </label>
          </div>
        </div>

        {/* ADMINISTRACIÓ */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "16px",
            marginBottom: "25px",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h2 style={{ color: "#ffffff", marginTop: 0, fontSize: "1.4rem", marginBottom: "20px" }}>
            👤 Canviar Credencials d'Accés
          </h2>

          <div style={{ marginBottom: "15px" }}>
            <label style={estilLlegenda}>Nom d'usuari d'admin</label>
            <input
              type="text"
              value={nouUsuari}
              onChange={(e) => setNouUsuari(e.target.value)}
              style={estilInput}
            />
          </div>

          <div>
            <label style={estilLlegenda}>Nova contrasenya</label>
            <input
              type="password"
              placeholder="Deixa en blanc si no vols canviar-la"
              value={novaContrasenya}
              onChange={(e) => setNovaContrasenya(e.target.value)}
              style={estilInput}
            />
          </div>
        </div>

        {/* BOTÓ D'ACCIÓ */}
        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "20px",
            borderRadius: "16px",
            marginBottom: "30px",
            display: "flex",
            justifyContent: "center",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
          }}
        >
          <button
            onClick={guardarConfiguracio}
            style={{
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "10px",
              padding: "14px 28px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1.05rem",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            💾 Guardar configuració
          </button>
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