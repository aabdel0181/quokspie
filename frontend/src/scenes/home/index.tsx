import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Navbar from './navbar'; // Adjust the import path as necessary
import Footer from './Footer'; // Create a Footer component if you don't have one

const Home: React.FC = () => {
  return (
    <Box>
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '80vh',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          padding: '2rem',
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Our Platform
        </Typography>
        <Typography variant="h5" gutterBottom>
          Discover the power of our tools and services.
        </Typography>
        <Button variant="contained" color="primary" href="/signup">
          Get Started
        </Button>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home; 