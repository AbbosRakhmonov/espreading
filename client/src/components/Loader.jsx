import { Box } from "@mui/material";
import React from "react";

const Loader = () => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        textAlign: "center",
        fontSize: "1.8rem",
        color: "#2e7d32",
        fontFamily: "Playwrite AU SA sans-serif",
        display: "flex",
        flexFirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(135deg, #e8f5e9, #c8e6c9)",
        overflow: "hidden",
      }}
    >
      <video autoPlay muted loop playsInline>
        <source src="/loader.webm" type="video/webm" />
      </video>
      <h6>ESPREADING.UZ</h6>
    </Box>
  );
};

export default Loader;
