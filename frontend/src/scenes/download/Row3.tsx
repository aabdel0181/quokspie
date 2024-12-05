import DashboardBox from '../../components/DashboardBox';
import WindowIcon from '@mui/icons-material/Window';
import BugReportIcon from '@mui/icons-material/BugReport';
import AppleIcon from '@mui/icons-material/Apple';
import { styled } from '@mui/system';
import { Box } from '@mui/material';

const BackgroundBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.light,
    borderRadius: "1rem",
    padding: "0.5rem",
    textAlign: "center",
}));

const Row3 = () => {
    
    return (
        <>
            <DashboardBox gridArea="c" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <WindowIcon style={{ fontSize: '60px', color: 'white' }} />
                    <BackgroundBox>
                        <span style={{ color: 'white', fontSize: '16px' }}>
                            Windows Installer
                        </span>
                    </BackgroundBox>
                </div>
            </DashboardBox>
            <DashboardBox gridArea="d" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <BugReportIcon style={{ fontSize: '48px', color: 'white' }} />
                    <BackgroundBox>
                        <span style={{ color: 'white', marginTop: '20px', fontSize: '16px' }}>
                            .deb and .rpm Installer
                        </span>
                    </BackgroundBox>
                </div>
            </DashboardBox>
            <DashboardBox gridArea="e" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    < AppleIcon style={{ fontSize: '48px', color: 'white' }} />
                    <BackgroundBox>
                        <span style={{ color: 'white', marginTop: '20px', fontSize: '16px' }}>
                            Mac Installer
                        </span>
                    </BackgroundBox>
                </div>
            </DashboardBox>
        </>
    );
};

export default Row3;