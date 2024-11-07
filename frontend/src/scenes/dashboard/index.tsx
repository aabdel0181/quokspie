import { useTheme } from '@emotion/react';
import { Box, useMediaQuery } from '@mui/material';
import React from 'react';
import Row1 from './Row1';
import Row2 from './Row2';


const gridTemplateLargeScreens = `
    "a b"
    "a b"
    "a b"
    "c d"
    "c d"
    "c d"
`;

const gridTemplateSmallScreens = `
    "a"
    "a"
    "a"
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "d"
    "d"
    "d"
`


const Dashboard = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)")
    const { palette } = useTheme();
    return <Box width="100%" height="100%" display="grid" gap="1.5rem"
    sx={
        isAboveMediumScreens? {
            gridTemplateColumns: "repeat(2, minmax(370px, 1fr))",
            gridTemplateRows: "repeat(10, minmax(80px, 1fr))",
            gridTemplateAreas: gridTemplateLargeScreens,
        } : {
            gridAutoColumns: "1fr",
            gridAutoRows: "80px",
            gridTemplateAreas: gridTemplateSmallScreens,
        }
    }
    >
        <Row1 />
        <Row2 />
    </Box>;
};

export default Dashboard;