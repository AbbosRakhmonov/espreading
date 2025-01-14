import FolderIcon from "@mui/icons-material/Folder";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const FolderCard = ({ title, to, subtitle = "", materials = 0 }) => {
  return (
    <Button
      component={Link}
      to={to}
      sx={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "80px",
        padding: "1rem",
        borderRadius: "1rem",
        backgroundColor: "#fff",
        transition: "all 0.3s ease",
        boxShadow: "0 0.5rem 0.5rem rgba(0,0,0,0.1)",
        position: "relative",
        overflow: "hidden",
        gap: "1rem",
        "&:hover": {
          boxShadow: "none",
          "#action-menu": {
            opacity: 1,
            visibility: "visible",
            boxShadow: "0 0.5rem 0.5rem rgba(0,0,0,0.1)",
          },
        },
      }}
    >
      <FolderIcon
        sx={{
          fontSize: "2rem",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant={"button"} mb={0}>
            {title}
          </Typography>
          <Typography variant={"caption"} color="text.secondary">
            {subtitle}
          </Typography>
        </Box>
        <Typography variant={"caption"} color="warning">
          {materials} materials
        </Typography>
      </Box>
    </Button>
  );
};

export default FolderCard;
