import { createContext, useContext, useState, useEffect } from "react";
import AuthService from "@/services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await AuthService.getCurrentUser();

      if (response.success && response.user) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await AuthService.login(credentials);

      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }

      return { success: false, error: response.error || "Greška pri prijavi" };
    } catch (error) {
      return { success: false, error: "Greška pri prijavi" };
    }
  };

  const register = async (userData) => {
    try {
      const response = await AuthService.register(userData);

      if (response.success && response.user) {
        setUser(response.user);
        return { success: true, user: response.user };
      }

      return {
        success: false,
        error: response.error || "Greška pri registraciji",
      };
    } catch (error) {
      return { success: false, error: "Greška pri registraciji" };
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Greška pri odjavi" };
    }
  };

  const refreshToken = async () => {
    try {
      const response = await AuthService.refreshToken();
      return response.success;
    } catch (error) {
      return false;
    }
  };

  const isAdmin = user?.role === "ADMIN";

  const value = {
    user,
    loading,
    isAdmin,
    login,
    register,
    logout,
    checkAuth,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
