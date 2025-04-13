import React, { createContext, useContext, useEffect, useState } from "react";
import { useError } from "../contexts/ErrorContext";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  const register = async (fullName, email, password, university) => {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/auth/register", {
        fullName,
        email,
        password,
        university,
      });
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      showError(
        err.response?.data?.message || "An error occurred during registration"
      );
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await api.post("/api/v1/auth/login", {
        email,
        password,
      });
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      showError(err.response?.data?.message || "Invalid credentials");
      throw err;
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/v1/auth/logout");
      setUser(null);
    } catch (err) {
      console.error(
        "Logout failed:",
        err.response?.data?.message || err.message
      );
      showError(err.response?.data?.message || "Logout failed");
      throw err;
    }
  };

  const getMe = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/auth/me");
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error(
        "getMe failed:",
        err.response?.data?.message || err.message
      );
      setUser(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        getMe,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
