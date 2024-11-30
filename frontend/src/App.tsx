import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useMemo, useState, useEffect } from "react";
import { Box, CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./scenes/navbar";
import Dashboard from "./scenes/dashboard";
import Predictions from "./scenes/Taru GPU";
import Login from "./scenes/login/Login";
import Signup from "./scenes/Signup/Signup";
import Logout from "./scenes/logout/Logout";
import Cluster from "./scenes/Cluster"

// Function to check session validity
const checkSession = async () => {
  try {
    const response = await fetch("http://localhost:9000/session-check", {
      method: "GET",
      credentials: "include", // Include session cookie
    });
    if (response.ok) {
      const data = await response.json();
      console.log("Session is valid for:", data.username);
      return true;
    }
    return false;
  } catch (error) {
    console.error("Session validation failed:", error);
    return false;
  }
};

// Component to protect routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // null = loading state

  useEffect(() => {
    const validateAuth = async () => {
      const result = await checkSession();
      setIsAuth(result);
    };
    validateAuth();
  }, []);

  if (isAuth === null) {
    // Render a loading spinner or similar while checking authentication
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Layout for Navbar visibility control
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const noNavbarRoutes = ["/signup", "/login"];

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      {children}
    </>
  );
};

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Layout>
          <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Protected Routes */}
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                }
              />
              <Route
                path="/TaruGPU"
                element={
                  <RequireAuth>
                    <Predictions />
                  </RequireAuth>
                }
              />
              <Route
                path="/logout"
                element={
                  <RequireAuth>
                    <Logout />
                  </RequireAuth>
                }
              />
              <Route
                path="/cluster"
                element={
                  <RequireAuth>
                    <Cluster />
                  </RequireAuth>
                }
              />
            </Routes>
          </Box>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
