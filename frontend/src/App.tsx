import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useMemo } from "react";
import { Box, CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./scenes/navbar";
import Dashboard from "./scenes/dashboard";
import Predictions from "./scenes/predictions";
function App() {
  const theme = useMemo(() => createTheme(themeSettings), [])
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box width="100%" height="100%" padding="1rem 2rem 4rem 2rem">
            <Navbar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route 
              path="/predictions" 
              element={<Predictions />} 
              />
            </Routes>
          </Box>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

