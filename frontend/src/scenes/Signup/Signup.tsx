import React, { useState } from 'react';
import {
  Box,
  Stack,
  TextField,
  Button,
  Typography,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { indigo } from '@mui/material/colors';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '', // New username field
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (!formData.agreeToTerms) {
      alert("You must agree to the terms and conditions");
      return;
    }

    const payload = {
      username: formData.username, // Username is now explicit
      email: formData.email, // Optional, if you want to store email separately
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      gpuModel: "SomeGPUModel", // Replace with actual GPU data if needed
      gpuSerial: "12345", // Replace with actual GPU serial
    };

    try {
      const response = await fetch('http://localhost:9000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User registered successfully:", data);
        alert("Registration successful!");
        // Redirect user to login or dashboard
      } else {
        const error = await response.json();
        console.error("Registration failed:", error);
        alert(`Error: ${error.error || "Registration failed"}`);
      }
    } catch (err) {
      console.error("Network error:", err);
      alert("Network error. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        margin: '0 auto',
        padding: 3,
        bgcolor: 'white', // White background
        borderRadius: 2, // Rounded corners
        boxShadow: 3, // Add shadow for better visibility
        mt: 8, // Add margin-top to center vertically
      }}
    >
      <Typography variant="h5" component="h1" gutterBottom>
        Sign Up
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="First Name"
            variant="outlined"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Username" // New field for username
            variant="outlined"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Confirm Password"
            variant="outlined"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            fullWidth
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
              />
            }
            label="I agree to the terms and conditions"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, bgcolor: indigo[900] }}
          >
            Sign Up
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Signup;
