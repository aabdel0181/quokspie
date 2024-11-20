import { useState, useEffect } from 'react';
import axios from 'axios';
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

axios.defaults.withCredentials = true;

const defaultTheme = createTheme();

const Login: React.FC = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const logout = async () => {
      try {
        await axios.get('/api/logout');
      } catch (err) {
        console.error('Error logging out', err);
      }
    };
    logout();
  }, []);

  const handleLogin = async () => {
    try {
      await axios.post('/api/login', { username, password });
      navigate(`/${username}/home`);
    } catch (err) {
      setError('Invalid username or password.');
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
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <Typography color="error" sx={{ mt: 2 }}>
                {error}
              </Typography>
            )}
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: indigo[900] }}
              onClick={handleLogin}
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
