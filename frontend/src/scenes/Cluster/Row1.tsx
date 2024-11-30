import { useMemo } from 'react';
import DashboardBox from '../../components/DashboardBox';
import { useGetDeviceDataQuery } from '../../state/api';
import { Box} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BoxHeader from '../../components/BoxHeader';

const Row1 = () => {
    const { palette } = useTheme();
    const { data, isLoading, error } = useGetDeviceDataQuery();

    const deviceIdToFilter = "GPU-eeeb2355-a08f-ee62-eead-751f2c632aba";

    // Filter and process data for ClockSpeed chart
    const clockSpeedData = useMemo(() => {
        return data
            ?.filter(({ DeviceId }) => DeviceId === deviceIdToFilter) // Filter by DeviceId
            .map(({ Timestamp, ClockSpeed }) => ({
                name: new Date(Timestamp).toLocaleString(), // Format timestamp to full date and time for the x-axis
                value: ClockSpeed,
            }));
    }, [data]);

    // Filter and process data for MemoryUsage chart
    const memoryUsageData = useMemo(() => {
      return data
          ?.filter(({ DeviceId }) => DeviceId === deviceIdToFilter) // Filter by DeviceId
          .map(({ Timestamp, MemoryUsed }) => ({
              name: new Date(Timestamp).toLocaleString(), // Format timestamp to full date and time for the x-axis
              value: parseFloat(MemoryUsed.toFixed(3)), // Limit to 3 decimal places
          }));
  }, [data]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data.</div>;

    return (
        <>
            {/* Health score chart */}
            <DashboardBox gridArea="a">
                <BoxHeader
                    title="Health Score"
                    subtitle="Relative GPU Cluster Health"
                    sideText="+35%"
                />
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                    <h1 style={{ fontSize: "7rem", color: "white" }}>123</h1>
                </Box>
            </DashboardBox>
        </>
    );
};

export default Row1;
