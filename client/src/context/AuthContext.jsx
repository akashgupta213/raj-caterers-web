import { createContext, useState, useEffect } from "react";
import api from "../utils/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const token = localStorage.getItem("rc_token");
  if (!token) { setLoading(false); return; }
  api.get("/auth/me")
    .then((r) => setUser(r.data.data))   // ← change r.data to r.data.data
    .catch(() => localStorage.removeItem("rc_token"))
    .finally(() => setLoading(false));
}, []);

 const login = async (email, password) => {
  const { data } = await api.post("/auth/login", { email, password });
  localStorage.setItem("rc_token", data.data.token);  // ← data.data not data
  setUser(data.data.admin);                            // ← data.data not data
  return data.data.admin;                              // ← data.data not data
};
  const logout = () => { localStorage.removeItem("rc_token"); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
