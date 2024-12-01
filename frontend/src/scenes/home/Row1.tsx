import DashboardBox from '../../components/DashboardBox';
import { Box } from '@mui/material';
import BoxHeader from '../../components/BoxHeader';




const Row1 = () => {

    return (
        <>
            {/* Dropdown menu */}
            <DashboardBox gridArea="a" sx={{ boxShadow: 'none' }}>
                <BoxHeader
                />
                <Box 
                    display="flex" 
                    flexDirection="column"
                    justifyContent="center" 
                    alignItems="center" 
                    fontSize="1rem"
                    height="100%"
                    style={{ marginTop: '-60px', position: 'relative', zIndex: 1 }}
                >
                    <h1 style={{ 
                        fontSize: "2rem", 
                        color: "white", 
                        marginTop: "4rem",
                        textAlign: "center" }}
                        >
                            Manage, Resell, and Optimize your GPUs
                    </h1>
                    <h2 style={{ 
                        fontSize: "7rem", 
                        color: "white", 
                        marginTop: "-2rem",
                        textAlign: "center" }}
                        >
                            The First GPU Odometer
                    </h2>
                </Box>
                <Box 
                    display="flex" 
                    flexDirection="column"
                    justifyContent="center" 
                    alignItems="center" 
                    height="100%"
                    style={{ marginTop: '20px', position: 'relative', zIndex: 1 }}
                >
                    <div style={{ 
                        fontSize: "1.5rem", 
                        color: "white", 
                        marginTop: "-47rem",
                        textAlign: "center" }}
                        >
                            Number of Users
                    </div>
                    <h2 style={{ 
                        fontSize: "4rem", 
                        color: "white", 
                        marginTop: "-1rem",
                        textAlign: "center" }}
                        >
                            1,000,000
                    </h2>
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row1;
