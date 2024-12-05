import { Box, useMediaQuery } from '@mui/material';
import Row2 from './Row2';
import Row3 from './Row3';

const gridTemplateLargeScreens = `
    "b b b"
    "b b b"
    "b b b"
    "c d e"
    "c d e"
    "c d e"
`;

const gridTemplateSmallScreens = `
    "b"
    "b"
    "b"
    "c"
    "c"
    "c"
    "d"
    "d"
    "d"
    "e"
    "e"
    "e"
`;

const Dashboard = () => {
    const isAboveMediumScreens = useMediaQuery("(min-width: 1200px)");

    return (
        <Box 
            width="100%" 
            height="100%" 
            display="grid" 
            gap="1.5rem"
            sx={{
                marginTop: '-1.5rem',
                ...(isAboveMediumScreens ? {
                    gridTemplateColumns: "repeat(3, minmax(370px, 1fr))",
                    gridTemplateRows: "repeat(7, minmax(80px, 1fr))",
                    gridTemplateAreas: gridTemplateLargeScreens,
                } : {
                    gridAutoColumns: "1fr",
                    gridAutoRows: "80px",
                    gridTemplateAreas: gridTemplateSmallScreens,
                })
            }}
        >
            <Row2 />
            <Row3 />
        </Box>
    );
};

export default Dashboard;