import DashboardBox from '../../components/DashboardBox';
import { Box, useMediaQuery } from '@mui/material';
import BoxHeader from '../../components/BoxHeader';


const Row1 = () => {
    const isSmallScreen = useMediaQuery("(max-width: 1200px)");

    return (
        <>
            <DashboardBox gridArea="a" sx={{ boxShadow: 'none' }}>
                <BoxHeader title="" sideText="" />
                <Box 
                    display="flex" 
                    flexDirection="column"
                    justifyContent="center" 
                    alignItems="center" 
                    height="100%"
                    style={{ marginTop: '-60px', position: 'relative', zIndex: 1, fontFamily: 'FKGrotesk, Helvetica' }}
                >
                    <div style={{ 
                        fontSize: isSmallScreen ? "1rem" : "2rem", 
                        color: "white", 
                        marginTop: isSmallScreen ? "7rem" : "12rem",
                        textAlign: "center" }}
                    >
                            Manage, Sell, and Optimize Your GPUs
                    </div>
                    <h1 style={{ 
                        fontSize: isSmallScreen ? "3rem" : "6rem", 
                        color: "white", 
                        marginTop: "0rem",
                        textAlign: "center" }}
                    >
                        The First GPU Odometer
                    </h1>
                    <div style={{ 
                        fontSize: isSmallScreen ? "0.75rem" : "1.5rem", 
                        color: "white", 
                        marginTop: isSmallScreen ? "0rem" : "0rem",
                        textAlign: "center" }}
                    >
                            Number of Users
                    </div>
                    <h2 style={{ 
                        fontSize: isSmallScreen ? "1.5em" : "3rem", 
                        color: "white", 
                        marginTop: "0rem",
                        textAlign: "center",
                    }}>
                        1,000,000
                    </h2>
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row1;
