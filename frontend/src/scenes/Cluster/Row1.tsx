import DashboardBox from '../../components/DashboardBox';
import { Box, Select, MenuItem, SelectChangeEvent, useTheme } from '@mui/material';
import BoxHeader from '../../components/BoxHeader';
import { useState } from 'react';



const Row1 = () => {
    const { palette } = useTheme();

    const [selectedOption, setSelectedOption] = useState('');

    const handleChange = (event: SelectChangeEvent<string>) => {
        setSelectedOption(event.target.value);
    };

    return (
        <>
            {/* Dropdown menu */}
            <DashboardBox gridArea="a">
                <Select
                    value={selectedOption}
                    onChange={handleChange}
                    displayEmpty
                    fullWidth
                    variant="outlined"
                    sx={{
                        color: 'white',
                        '& .MuiSelect-icon': { color: 'white'}, 
                        marginBottom: '-1rem' 
                    }}
                >
                    <MenuItem value="" disabled sx={{ color: 'black' }}>Select Individual GPU</MenuItem>
                    <MenuItem value="option1" sx={{ color: 'black' }}>Option 1</MenuItem>
                    <MenuItem value="option2" sx={{ color: 'black' }}>Option 2</MenuItem>
                    <MenuItem value="option3" sx={{ color: 'black' }}>Option 3</MenuItem>
                </Select>
                <BoxHeader
                    title="Health Score"
                    subtitle="Relative GPU Cluster Health"
                    sideText="+35%"
                    fontSize="1rem"
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
