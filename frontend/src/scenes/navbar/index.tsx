import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import logo from '@/assets/quokspy.png';  // 👈 Add this import

const Navbar = () => {
    const { palette } = useTheme();
    const [selected, setSelected] = useState("dashboard");
    return (
    <FlexBetween mb="0.25rem" p="0.5rem 2rem" color={palette.grey[300]}>
        {/* LEFT SIDE */}
        <FlexBetween gap="0.75rem">
            <Box
                component="img"
                src={logo}
                alt="logo"
                sx={{
                    height: 84,  // Match the original PixIcon size
                    width: 84,
                    objectFit: 'contain'
                }}
            />
            <Typography variant="h4" fontSize="30px">
                Quokspie
            </Typography>
        </FlexBetween>
        {/* RIGHT SIDE */}
        <FlexBetween gap="2rem">
            <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
                <Link
                    to="/cluster"
                    onClick={() => setSelected("cluster")}
                    style={{
                        color: selected === "predictions" ? "inherit" : palette.grey[700],
                        textDecoration: "inherit"
                    }}
                >
                    Cluster
                </Link>
            </Box>
            <Box sx={{ "&:hover": { color: palette.primary[100] } }}>
                <Link
                    to="/logout"
                    onClick={() => setSelected("logout")}
                    style={{
                        color: selected === "predictions" ? "inherit" : palette.grey[700],
                        textDecoration: "inherit"
                    }}
                >
                    Logout
                </Link>
            </Box>

        </FlexBetween>
    </FlexBetween>
    );
};

export default Navbar;