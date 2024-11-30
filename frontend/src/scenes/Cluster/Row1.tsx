import DashboardBox from '../../components/DashboardBox';
import { Box, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import BoxHeader from '../../components/BoxHeader';
import { useState } from 'react';
import { Link } from 'react-router-dom';



const Row1 = () => {
    const [selected, setSelected] = useState("dashboard");
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
                        '& .MuiSelect-icon': { color: 'white' },
                        '& .MuiSelect-select': { fontSize: '0.7rem' },
                        marginBottom: '-1rem'
                    }}
                >
                    <MenuItem value="" disabled sx={{ color: 'white' }}>
                        Select Individual GPU
                    </MenuItem>
                    <MenuItem value="option1" sx={{ color: 'black' }}>
                        <Link
                            to="/"
                            onClick={() => setSelected("dashboard")}
                            style={{
                                color: "black",
                                textDecoration: "inherit",
                                width: '100%',
                                display: 'block'
                            }}
                        >
                            Ahmed's GPU
                        </Link>
                    </MenuItem>
                    <MenuItem value="option2" sx={{ color: 'black' }}>
                        <Link
                            to="/TaruGPU"
                            onClick={() => setSelected("predictions")}
                            style={{
                                color: "black",
                                textDecoration: "inherit",
                                width: '100%',
                                display: 'block'
                            }}
                        >
                            Taru's GPU
                        </Link>
                    </MenuItem>
                </Select>
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
