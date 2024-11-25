import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useMemo } from "react";
import { Box, CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Navbar from "./scenes/navbar";
import Dashboard from "./scenes/dashboard";
import Predictions from "./scenes/predictions";
import Login from "./scenes/login/Login";
import Signup from "./scenes/Signup/Signup";

// Authentication check
const isAuthenticated = () => Boolean(localStorage.getItem("authToken")); 

// Component to protect routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

// Layout component to manage Navbar visibility
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
              <Route path="/" element={<Dashboard />} />
              <Route path="/predictions" element={<Predictions />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </Box>
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
