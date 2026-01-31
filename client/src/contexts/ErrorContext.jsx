import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState("error"); // "error" or "success"

  const showError = (message, type = "error") => {
    setError(message);
    setErrorType(type);
    // Automatically clear the error after 5 seconds
    setTimeout(() => {
      setError(null);
      setErrorType("error");
    }, 5000);
  };

  const clearError = () => {
    setError(null);
    setErrorType("error");
  };

  return (
    <ErrorContext.Provider value={{ error, errorType, showError, clearError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
