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
                <Box 
                    display="flex" 
                    justifyContent="flex-end"
                >
                    <Select
                        value={selectedOption}
                        onChange={handleChange}
                        displayEmpty
                        fullWidth={false}
                        variant="outlined"
                        sx={{
                            width: '25%',
                            color: 'white',
                            backgroundColor: '#48494E',
                            '& .MuiSelect-icon': { color: 'white' },
                            '& .MuiSelect-select': { fontSize: '0.7rem' },
                            marginBottom: '-1rem'
                        }}
                        MenuProps={{
                            PaperProps: {
                                style: {
                                    backgroundColor: '#48494E',
                                    color: 'white'
                                }
                            }
                        }}
                    >
                        <MenuItem value="" disabled sx={{ color: 'gray' }}>
                            Select Individual GPU
                        </MenuItem>
                        <MenuItem value="option1">
                            <Link
                                to="/AhmedGPU"
                                onClick={() => setSelected("dashboard")}
                                style={{
                                    color: "white",
                                    textDecoration: "inherit",
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                Ahmed's GPU
                            </Link>
                        </MenuItem>
                        <MenuItem value="option2">
                            <Link
                                to="/TaruGPU"
                                onClick={() => setSelected("predictions")}
                                style={{
                                    color: "white",
                                    textDecoration: "inherit",
                                    width: '100%',
                                    display: 'block'
                                }}
                            >
                                Taru's GPU
                            </Link>
                        </MenuItem>
                    </Select>
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
