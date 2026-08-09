import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = localStorage.getItem("jobboard_token");
      const cachedUser = localStorage.getItem("jobboard_user");
      if (token && cachedUser) {
        setUser(JSON.parse(cachedUser));
        try {
          const { data } = await api.get("/auth/me");
          setUser(data.user);
          localStorage.setItem("jobboard_user", JSON.stringify(data.user));
        } catch {
          localStorage.removeItem("jobboard_token");
          localStorage.removeItem("jobboard_user");
          setUser(null);
        }
      }
      setLoading(false);
    };
    bootstrap();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("jobboard_token", data.token);
    localStorage.setItem("jobboard_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("jobboard_token", data.token);
    localStorage.setItem("jobboard_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("jobboard_token");
    localStorage.removeItem("jobboard_user");
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("jobboard_user", JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
