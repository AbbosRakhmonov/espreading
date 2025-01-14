import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Register() {
  const [fullName, setFullName] = useState("");
  const [university, setUniversity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(fullName, email, password, university);
      navigate("/student");
    } catch (error) {
      console.error("Failed to register", error);
    }
  };

  return (
    <Box
      sx={{
        background: 'url("/images/education-background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container
        component="main"
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography
            component="h1"
            variant={isMobile ? "h5" : "h4"}
            gutterBottom
            sx={{
              color: "primary.main",
            }}
          >
            ESP Reading Platform
          </Typography>
          <Typography
            component="h2"
            variant={isMobile ? "h6" : "h5"}
            gutterBottom
          >
            Register New Account
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              name="fullName"
              autoComplete="name"
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="university">University</InputLabel>
              <Select
                labelId="university"
                id="university"
                value={university}
                label="University"
                onChange={(e) => setUniversity(e.target.value)}
                fullWidth
              >
                <MenuItem value={"Navoiy Davlat Universiteti"}>
                  Navoiy Davlat Universiteti
                </MenuItem>
                <MenuItem value={"Qarshi Davlat Universiteti"}>
                  Qarshi Davlat Universiteti
                </MenuItem>
                <MenuItem value={"Guliston Davlat Universiteti"}>
                  Guliston Davlat Universiteti
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
            </Button>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Link component={RouterLink} to="/" variant="body2">
                {"Already have an account? Sign In"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Register;
