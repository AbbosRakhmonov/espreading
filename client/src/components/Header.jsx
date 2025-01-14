import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isMobile ? "flex-start" : "center",
        mb: 4,
      }}
    >
      <Typography
        variant={isMobile ? "h5" : "h4"}
        component="h1"
        color="primary.main"
        gutterBottom
        sx={{
          flexGrow: 1,
          textAlign: isMobile ? "center" : "left",
          mb: isMobile ? 2 : 0,
          mt: isMobile ? 2 : 0,
          fontWeight: "bold",
        }}
      >
        Welcome, {user.fullName}
      </Typography>
      <Button
        variant="contained"
        color="error"
        onClick={handleLogout}
        sx={{
          mt: isMobile ? 2 : 0,
          mb: isMobile ? 2 : 0,
          width: isMobile ? "100%" : "auto",
          ml: isMobile ? 0 : 2,
          mr: isMobile ? 0 : 2,
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default Header;
