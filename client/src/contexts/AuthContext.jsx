import React, { createContext, useContext, useEffect, useState } from "react";
import { useError } from "../contexts/ErrorContext";
import api from "../utils/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showError } = useError();

  useEffect(() => {
    // Check if user is logged in on initial load
    getMe();
  }, []);

  const register = async (fullName, email, password, university) => {
    try {
      setLoading(true);
      const response = await api.post("/auth/register", {
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
      const response = await api.post("/auth/login", { email, password });
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
      await api.post("/auth/logout");
      setUser(null);
    } catch (err) {
      showError("Logout failed");
      console.error("Logout failed", err);
    }
  };

  const getMe = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      setUser(response.data);
      setLoading(false);
      return response.data;
    } catch (err) {
      setUser(null);
      setLoading(false);
      // showError(err.response?.data?.message || "Failed to get user data");
    }
  };

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
