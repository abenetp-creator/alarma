import { Link } from "react-router-dom";

export default function Sons() {
  return (
    <div style={{ padding: "30px" }}>
      <h1>🎵 Banc de Sons</h1>

      <p>Ací gestionarem els MP3.</p>

      <Link to="/">← Tornar</Link>
    </div>
  );
}