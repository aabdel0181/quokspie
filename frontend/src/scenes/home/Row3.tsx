import DashboardBox from '../../components/DashboardBox';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import HandshakeIcon from '@mui/icons-material/Handshake';

const Row3 = () => {
    
    return (
        <>
            <DashboardBox gridArea="c">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <MonetizationOnIcon style={{ fontSize: '60px', color: 'white' }} />
                    <span style={{ color: 'white', marginTop: '20px', fontSize: '16px' }}>
                        Prevent unforeseen malfunctions and delays in your GPU clusters
                    </span>
                </div>
            </DashboardBox>
            <DashboardBox gridArea="d">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <HandshakeIcon style={{ fontSize: '48px', color: 'white' }} />
                    <span style={{ color: 'white', marginTop: '20px', fontSize: '16px' }}>
                        Increase trust between buyers and sellers on second-hand GPU market
                    </span>
                </div>
            </DashboardBox>
            <DashboardBox gridArea="e">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center' }}>
                    <RocketLaunchIcon style={{ fontSize: '48px', color: 'white' }} />
                    <span style={{ color: 'white', marginTop: '20px', fontSize: '16px' }}>
                        Distribute training workloads across your GPU more effectively
                    </span>
                </div>
            </DashboardBox>
        </>
    );
};

export default Row3;