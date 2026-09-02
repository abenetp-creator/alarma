import { Link } from "react-router-dom";

export default function Calendari() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>📅 Calendari</h1>

      <p>Dies i períodes exclosos.</p>

      <Link to="/">← Tornar</Link>
    </div>
  );
}