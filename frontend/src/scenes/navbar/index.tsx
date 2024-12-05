import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import logo from '@/assets/quokspy.png';  // 👈 Add this import
import { styled } from '@mui/system'; // 👈 Add this import


const RightSideBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.light, 
    borderRadius: "1rem",
    paddingLeft: "1.5rem",
    paddingRight: "1.5rem",
    paddingTop: "0.5rem",
    paddingBottom: "0.5rem"
}));

const Navbar = () => {
    const { palette } = useTheme();
    const [selected, setSelected] = useState("dashboard");
    return (
    <FlexBetween mb="0.25rem" p="0.5rem 2rem" color={palette.grey[300]}>
        {/* LEFT SIDE */}
        <FlexBetween gap="0.25rem">
            <Link to="/" onClick={() => setSelected("home")}>
                <Box
                    component="img"
                    src={logo}
                    alt="logo"
                    sx={{
                        height: 84,
                        width: 84,
                        objectFit: 'contain'
                    }}
                />
            </Link>
            <Link
                to="/"
                onClick={() => setSelected("home")}
                style={{
                    color: palette.grey[300],
                    textDecoration: "inherit"
                }}
            >
                <Typography variant="h4" fontSize="30px">
                    Quokspie
                </Typography>
            </Link>
        </FlexBetween>
        {/* RIGHT SIDE */}
        <RightSideBox>
            <FlexBetween gap="2rem">
                <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
                    <Link
                        to="/"
                        onClick={() => setSelected("home")}
                        style={{
                            color: selected === "home" ? "inherit" : palette.grey[700],
                            textDecoration: "inherit",
                            fontSize: "18px"
                        }}
                    >
                        Home
                    </Link>
                </Box>
                <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
                    <Link
                        to="/cluster"
                        onClick={() => setSelected("cluster")}
                        style={{
                            color: selected === "cluster" ? "inherit" : palette.grey[700],
                            textDecoration: "inherit",
                            fontSize: "18px"
                        }}
                    >
                        Cluster
                    </Link>
                </Box>
                <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
                    <Link
                        to="/download"
                        onClick={() => setSelected("download")}
                        style={{
                            color: selected === "download" ? "inherit" : palette.grey[700],
                            textDecoration: "inherit",
                            fontSize: "18px"
                        }}
                    >
                        Download
                    </Link>
                </Box>
                <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
                    <Link
                        to="/signup"
                        onClick={() => setSelected("signup")}
                        style={{
                            color: selected === "signup" ? "inherit" : palette.grey[700],
                            textDecoration: "inherit",
                            fontSize: "18px"
                        }}
                    >
                        Sign Up
                    </Link>
                </Box>
                <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
                    <Link
                        to="/logout"
                        onClick={() => setSelected("logout")}
                        style={{
                            color: selected === "logout" ? "inherit" : palette.grey[700],
                            textDecoration: "inherit",
                            fontSize: "18px"
                        }}
                    >
                        Log Out
                    </Link>
                </Box>
            </FlexBetween>
        </RightSideBox>
    </FlexBetween>
    );
};

export default Navbar;