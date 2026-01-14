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
import Universities from "./pages/admin/Universities";
import Analytics from "./pages/admin/Analytics";
import ActivityLogs from "./pages/admin/ActivityLogs";
import Categories from "./pages/Categories";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Readings from "./pages/Readings";
import ReadingTest from "./pages/ReadingTest";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Unauthorized from "./pages/Unauthorized";
import theme from "./theme";

const BgVideoLayout = ({ children, user, showVideo = true }) => {
  if (user && showVideo)
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
    <>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/login"
          element={
            <BgVideoLayout user={user}>
              <Login />
            </BgVideoLayout>
          }
        />
        <Route
          path="/register"
          element={
            <BgVideoLayout user={user}>
              <Register />
            </BgVideoLayout>
          }
        />
        <Route
          path="/student"
          element={
            <BgVideoLayout user={user}>
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            </BgVideoLayout>
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
          <Route path="universities" element={<Universities />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
        </Route>
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/unauthorized" />} />
      </Routes>
    </>
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
