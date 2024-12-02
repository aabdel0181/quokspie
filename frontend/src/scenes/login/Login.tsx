import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';

const defaultTheme = createTheme();

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '', // Username field
    password: '', // Password field
  });
  const [error, setError] = useState<string | null>(null); // Error state
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value, // Dynamically update username or password
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      username: formData.username,
      password: formData.password,
    };

    try {
      const response = await fetch('http://localhost:9000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for session
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful:", data);
        navigate('/cluster'); // Redirect to the root route
      } else {
        const error = await response.json();
        console.error("Login failed:", error);
        setError(error.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please try again later.");
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            bgcolor: 'white', // White background
            padding: 4, // Add padding
            borderRadius: 2, // Rounded corners
            boxShadow: 3, // Add subtle shadow
          }}
        >
          <Avatar sx={{ width: 100, height: 100, bgcolor: indigo[900] }}>
            <LockOutlinedIcon sx={{ width: 60, height: 60 }} />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            Sign In
          </Typography>
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formData.username} // Use formData.username
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={formData.password} // Use formData.password
              onChange={handleChange}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: indigo[900] }}
            >
              Login
            </Button>
            <Typography>
              Don&apos;t have an account?{' '}
              <Link href="/signup" variant="body2">
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Login;
