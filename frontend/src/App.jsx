import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Sons from "./pages/Sons";
import Tocs from "./pages/Tocs";
import Calendari from "./pages/Calendari";
import Configuracio from "./pages/Configuracio";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sons" element={<Sons />} />
          <Route path="/tocs" element={<Tocs />} />
          <Route path="/calendari" element={<Calendari />} />
          <Route path="/configuracio" element={<Configuracio />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}