import { useMemo } from 'react';
import DashboardBox from '../../components/DashboardBox';
import { useGetDeviceDataQuery } from '../../state/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '@mui/material/styles';
import BoxHeader from '../../components/BoxHeader';

const Row1 = () => {
    const { palette } = useTheme();
    const { data, isLoading, error } = useGetDeviceDataQuery();

    const deviceIdToFilter = "GPU-bbc80d76-6599-a3e1-0cb6-db0b4fb59df6";

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
            {/* ClockSpeed Chart */}
            <DashboardBox gridArea="a">
                <BoxHeader
                    title="Clock Speed Over Time"
                    subtitle="Visualizing clock speed of devices over time"
                    sideText=""
                />
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={clockSpeedData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: -15,
                            bottom: 60,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorClockSpeed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.primary.main} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={palette.primary.main} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke={palette.primary.main} fill="url(#colorClockSpeed)" />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>

            {/* MemoryUsage Chart */}
            <DashboardBox gridArea="b">
                <BoxHeader
                    title="Memory Usage Over Time"
                    subtitle="Visualizing memory usage of devices over time"
                    sideText=""
                />
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={memoryUsageData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: -15,
                          bottom: 60,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorMemoryUsage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.secondary.main} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={palette.secondary.main} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke={palette.secondary.main} fill="url(#colorMemoryUsage)" />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row1;
