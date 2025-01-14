import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
  },
});

export const globalStyles = {
  "@global": {
    body: {
      backgroundImage: 'url("/images/education-background.jpg")',
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      backgroundRepeat: "no-repeat",
    },
  },
};

export const formContainerStyles = {
  backgroundColor: "rgba(255, 255, 255, 0.9)",
  borderRadius: "15px",
  padding: "30px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "400px",
  margin: "0 auto",
};

export const decorativeElementStyles = {
  position: "absolute",
  width: "100px",
  height: "100px",
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  zIndex: 1,
  display: { xs: "none", sm: "block" }, // Hide on mobile, show on larger screens
};
