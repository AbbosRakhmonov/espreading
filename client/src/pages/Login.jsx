import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  useMediaQuery,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import SchoolIcon from "@mui/icons-material/School";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Auth.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(user.role === "admin" ? "/admin" : "/student");
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!email || !password) {
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      // Only navigate on success - form state is preserved on error
      navigate(email.includes("admin") ? "/admin" : "/student");
    } catch (error) {
      console.error("Failed to log in", error);
      // Form state is preserved - email and password remain in inputs
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="auth-page">
      <Box className="auth-background">
        <Box className="auth-background-overlay" />
        <Box className="auth-background-pattern" />
      </Box>
      
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Fade in={true} timeout={800}>
          <Box className="auth-card">
            <Box className="auth-header">
              <Box className="auth-logo">
                <SchoolIcon sx={{ fontSize: 40, color: "#4db6ac" }} />
                <Typography variant="h4" className="auth-logo-text">
                  ESPREADING
                </Typography>
              </Box>
              <Typography variant="h5" className="auth-title">
                Welcome Back
              </Typography>
              <Typography variant="body2" className="auth-subtitle">
                Sign in to continue your learning journey
              </Typography>
            </Box>

            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              autoComplete="off"
              sx={{ width: "100%", mt: 3 }}
            >
              <TextField
                fullWidth
                required
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#4db6ac" }} />
                    </InputAdornment>
                  ),
                }}
                className="auth-input"
              />
              
              <TextField
                fullWidth
                required
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#4db6ac" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "#4db6ac" }}
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                className="auth-input"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="auth-button"
                disabled={loading}
                sx={{
                  mb: 2,
                  py: 1.5,
                  fontSize: "1rem",
                  fontWeight: 600,
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "Sign In"
                )}
              </Button>

              <Box className="auth-links">
                <Link
                  component={RouterLink}
                  to="/register"
                  className="auth-link"
                >
                  Don't have an account? <strong>Sign Up</strong>
                </Link>
              </Box>

              <Box className="auth-links" sx={{ mt: 1 }}>
                <Link
                  component={RouterLink}
                  to="/"
                  className="auth-link-secondary"
                >
                  <ArrowBackIcon sx={{ fontSize: 16, mr: 0.5 }} />
                  Back to Home
                </Link>
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
}

export default Login;
