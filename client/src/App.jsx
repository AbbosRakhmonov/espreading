import { Box, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import ProtectedRoute from ".//ProtectedRoute";
import GlobalErrorDisplay from "./components/GlobalErrorDisplay";
import Loader from "./components/Loader";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import Dashboard from "./pages/admin/Dashboard";
import Layout from "./pages/admin/Layout";
import Students from "./pages/admin/Students";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Readings from "./pages/Readings";
import ReadingTest from "./pages/ReadingTest";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Unauthorized from "./pages/Unauthorized";
import theme from "./theme";

const BgVideoLayout = ({ children, user }) => {
  if (user)
    return (
      <>
        <video
          autoPlay
          muted
          loop
          style={{
            position: "fixed",
            width: "100%",
            height: "100%",
            objectFit: "cover",
            top: 0,
            left: 0,
            zIndex: -1,
            opacity: 0.5,
          }}
        >
          <source src="/bg.mp4" type="video/mp4" />
        </video>
        <Box
          component="header"
          sx={{
            height: "50px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(to right,rgba(232, 242, 245, 0.58),rgba(200, 229, 230, 0.58))",
          }}
        >
          <Typography
            component="h6"
            variant="h6"
            sx={{
              letterSpacing: "2px",
              textTransform: "uppercase",
              fontWeight: "bold",
              fontSize: "1.5rem",
              color: "#2e7d32",
            }}
          >
            - ESPREADING.UZ -
          </Typography>
        </Box>
        {children}
      </>
    );

  return children;
};

function AppRoutes() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    const startElement = document.getElementById("start");
    if (startElement) {
      startElement.remove();
    }
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <BgVideoLayout user={user}>
      <Routes>
        <Route
          path="/"
          element={
            user ? (
              <Navigate to={user.role === "admin" ? "/admin" : "/student"} />
            ) : (
              <Login />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:id"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:id/category/:categoryId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Readings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lesson/:id/category/:categoryId/reading/:readingId"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ReadingTest />
            </ProtectedRoute>
          }
        />
        {/* admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/unauthorized" />} />
      </Routes>
    </BgVideoLayout>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorProvider>
        <AuthProvider>
          <Router>
            <GlobalErrorDisplay />
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ErrorProvider>
    </ThemeProvider>
  );
}

export default App;
