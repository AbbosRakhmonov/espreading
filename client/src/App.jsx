import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import ProtectedRoute from ".//ProtectedRoute";
import GlobalErrorDisplay from "./components/GlobalErrorDisplay";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { ErrorProvider } from "./contexts/ErrorContext";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Readings from "./pages/Readings";
import ReadingTest from "./pages/ReadingTest";
import Register from "./pages/Register";
import StudentDashboard from "./pages/StudentDashboard";
import Unauthorized from "./pages/Unauthorized";
import theme from "./theme";

function AppRoutes() {
  const { user } = useAuth();

  return (
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
      <Route path="/unauthorized" element={<Unauthorized />} />
      {/* <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      /> */}
    </Routes>
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
