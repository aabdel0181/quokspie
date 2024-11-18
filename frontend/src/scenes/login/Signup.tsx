import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config.json';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import { TextField } from '@mui/material';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import FaceIcon from '@mui/icons-material/Face';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { indigo } from '@mui/material/colors';

axios.defaults.withCredentials = true;
const defaultTheme = createTheme();

export default function Signup() {
    const navigate = useNavigate();

    // Set state variables for user inputs
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [photo, setPhoto] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [gpuModel, setGpuModel] = useState('');
    const [gpuSerial, setGpuSerial] = useState('');

    const rootURL = config.serverRootURL;

    // Handle photo upload
    const handleUpload = (e: React.ChangeEvent<any>) => {
        const uploadedFile = e.target.files[0];
        setFile(uploadedFile);

        const reader = new FileReader();
        reader.readAsDataURL(uploadedFile);

        reader.onloadend = () => {
            const result = reader.result as string;
            setPhoto(result);
        };
    };

    // Submit form for registration
    const handleSubmit = async () => {
        // Ensure passwords match
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);
        formData.append("file", file as Blob); // Append the photo file
        formData.append("gpuModel", gpuModel);
        formData.append("gpuSerial", gpuSerial);

        try {
            // Make the request to register the user
            await axios.post(`${rootURL}/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            // Navigate to the user's home page after successful registration
            navigate(`/${username}/home`);
        } catch (err) {
            console.error("Registration failed.", err);
            alert("Registration failed.");
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ width: 100, height: 100, bgcolor: indigo[900] }} src={photo}>
                        <FaceIcon sx={{ width: 60, height: 60 }} />
                    </Avatar>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Username"
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    label="Confirm Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="GPU Model"
                                    value={gpuModel}
                                    onChange={e => setGpuModel(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="GPU Serial Number"
                                    value={gpuSerial}
                                    onChange={e => setGpuSerial(e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    component="label"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ borderColor: indigo[900], color: indigo[900] }}
                                >
                                    Upload Photo
                                    <input
                                        type="file"
                                        name="file"
                                        id="file"
                                        hidden
                                        onChange={handleUpload}
                                    />
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Container component="main" maxWidth="xs">
                <Box sx={{ mt: 3 }}>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        sx={{ mb: 2, bgcolor: indigo[900] }}
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                    <p>
                        Already have an account?{' '}
                        <Link href="/">Sign in</Link>
                    </p>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
