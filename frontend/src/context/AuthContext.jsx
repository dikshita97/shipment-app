import { createContext, useContext, useState, useEffect } from "react";
import { api, setAuthToken } from "../lib/api";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // On load, set token in axios headers
  useEffect(() => {
    if (token) {
      setAuthToken(token);
      fetchUserProfile();
    }
  }, [token]);

  async function fetchUserProfile() {
    try {
      const { data } = await api.get("/me");
      setUser(data);
    } catch (err) {
      console.error("Failed to fetch user profile", err);
      logout();
    }
  }

  async function login(username, password) {
    try {
      const { data } = await api.post("/login", { username, password });
      handleAuthSuccess(data);
    } catch (err) {
      if (err.response && err.response.data?.error === "Invalid credentials") {
        alert("Invalid username or password.");
      } else if (err.response && err.response.status === 404) {
        // Auto-register if user doesn't exist
        await register(username, password);
      } else {
        console.error("Login failed", err);
      }
    }
  }

  async function register(username, password) {
    try {
      await api.post("/register", { username, password });
      // After registration, auto-login
      await login(username, password);
    } catch (err) {
      console.error("Registration failed", err);
    }
  }

  function handleAuthSuccess(data) {
    setUser(data.user || null);
    setToken(data.token);
    localStorage.setItem("token", data.token);
    setAuthToken(data.token);
  }

  function logout() {
    setUser(null);
    setToken("");
    localStorage.removeItem("token");
    setAuthToken();
  }

  return (
    <AuthCtx.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}
