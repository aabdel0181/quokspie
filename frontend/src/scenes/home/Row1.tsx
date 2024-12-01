import DashboardBox from '../../components/DashboardBox';
import { Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import BoxHeader from '../../components/BoxHeader';
import { useState } from 'react';
import { Link } from 'react-router-dom';



const Row1 = () => {
    const [selected, setSelected] = useState("dashboard");   

    return (
        <>
            {/* Dropdown menu */}
            <DashboardBox gridArea="a">
                <Box 
                    display="flex" 
                    justifyContent="flex-end"
                >

                </Box>
                <BoxHeader
                    title="Health Score"
                    subtitle="Relative GPU cluster health"
                    sideText="+35%"
                    fontSize="1.25rem"
                />
            {/* Health score chart */}
                <Box 
                    display="flex" 
                    justifyContent="center" 
                    alignItems="center" 
                    fontSize="1rem"
                    height="100%"
                    style={{ marginTop: '-60px' }}
                >
                    <h1 style={{ fontSize: "7rem", color: "white" }}>123</h1>
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row1;
