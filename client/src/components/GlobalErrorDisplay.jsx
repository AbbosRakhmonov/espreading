import { Alert, Snackbar } from "@mui/material";
import React from "react";
import { useError } from "../contexts/ErrorContext";

const GlobalErrorDisplay = () => {
  const { error, clearError } = useError();

  return (
    <Snackbar
      open={!!error}
      autoHideDuration={5000}
      onClose={clearError}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert onClose={clearError} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default GlobalErrorDisplay;
