import { Link } from "react-router-dom";

export default function Configuracio() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>⚙️ Configuració</h1>

      <p>Configuració general del sistema.</p>

      <Link to="/">← Tornar</Link>
    </div>
  );
}