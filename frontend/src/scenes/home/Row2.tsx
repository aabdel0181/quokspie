import DashboardBox from '../../components/DashboardBox';
import { Box } from '@mui/material';



const Row2 = () => {

    return (
        <>
            {/* Dropdown menu */}
            <DashboardBox gridArea="b" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Box 
                    display="flex" 
                    flexDirection="column"
                    justifyContent="center" 
                    alignItems="center" 
                    fontSize="1rem"
                    height="100%"
                    style={{ marginTop: '-60px', position: 'relative', zIndex: 1 }}
                >
                    <div style={{ 
                        fontSize: "5rem", 
                        color: "white", 
                        marginTop: "5rem",
                        textAlign: "center" }}
                    >
                            Quokspie
                    </div>
                    <div style={{ 
                        fontSize: "1.25rem", 
                        color: "white", 
                        marginTop: "0rem",
                        textAlign: "center" }}
                    >
                        A software that allows users to securely track the overall health of their GPU
                    </div>
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row2;
