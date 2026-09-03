import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem("isAdminLoggedIn") === "true";
  });

  const login = (usuari, contrasenya) => {
    const credencialsGuardades = JSON.parse(
      localStorage.getItem("configAdmin")
    ) || { usuari: "admin", contrasenya: "admin" };

    if (
      usuari.trim() === credencialsGuardades.usuari &&
      contrasenya.trim() === credencialsGuardades.contrasenya
    ) {
      setIsAdmin(true);
      localStorage.setItem("isAdminLoggedIn", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    localStorage.setItem("isAdminLoggedIn", "false");
  };

  return (
    <AuthContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}