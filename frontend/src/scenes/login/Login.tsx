import { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios
import config from '../../config.json';
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


axios.defaults.withCredentials = true
const defaultTheme = createTheme();

export default function Login() {
  const navigate = useNavigate();

  // Set appropriate state variables for username and password 
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const rootURL = config.serverRootURL;

  const handleLogin = async () => {
    console.log(rootURL);
    console.log(`${rootURL}/login`);
    try {
      console.log("test");
      await axios.post(`${rootURL}/login`, {
        username: username,
        password: password
      })
      navigate(`/${username}/home`);
    } catch (err) {
      alert('Log in failed.');
    }
  };

  const logout = async () => {
    try {
      await axios.get(`${rootURL}/logout`);
    } catch (err) {
    }
  }

  useEffect(() => {
    logout();
  }, []);

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
          }}
        >
          <Avatar sx={{ width: 100, height: 100, bgcolor: indigo[900] }}>
            <LockOutlinedIcon sx={{ width: 60, height: 60 }} />
          </Avatar>
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
              onChange={e => setUsername(e.target.value)}
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
              onChange={e => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, bgcolor: indigo[900] }}
              onClick={handleLogin}
            >
              Sign In
            </Button>
            <p>Don't have an account? <Link href="/signup">
              Sign Up
            </Link></p>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  )
}