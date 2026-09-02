import { Link } from "react-router-dom";

export default function Tocs() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>🔔 Tocs</h1>

      <p>Ací gestionarem els tocs programats.</p>

      <Link to="/">← Tornar</Link>
    </div>
  );
}