import { useCallback, useMemo } from 'react';
import DashboardBox from '../../components/DashboardBox';
import { useGetDeviceDataQuery } from '../../state/api';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '@mui/material/styles';
import BoxHeader from '../../components/BoxHeader';

interface DeviceData {
    Timestamp: string; // or Date if it's a Date object
    ClockSpeed: number; // Adjust types as necessary
    MemoryUsed: number; // Adjust types as necessary
}

const Row2 = () => {
    const { palette } = useTheme();
    const { data, isLoading, error } = useGetDeviceDataQuery();

    // Function to calculate average data
    const calculateAverageData = useCallback((data: DeviceData[], key: keyof DeviceData) => {
        const groupedData = data?.reduce((acc: { [key: string]: { total: number; count: number } }, { Timestamp, [key]: value }) => {
            const time = new Date(Timestamp).toLocaleString();
            if (!acc[time]) {
                acc[time] = { total: 0, count: 0 };
            }
            acc[time].total += Number(value);
            acc[time].count += 1;
            return acc;
        }, {} as { [key: string]: { total: number; count: number } });

        return Object.entries(groupedData || {}).map(([name, { total, count }]) => ({
            name,
            value: total / count, // Calculate average
        }));
    }, []);

    // Filter and process data for ClockSpeed chart
    const clockSpeedData = useMemo(() => calculateAverageData(data || [], 'ClockSpeed'), [data, calculateAverageData]);

    // Filter and process data for MemoryUsage chart
    const memoryUsageData = useMemo(() => calculateAverageData(data || [], 'MemoryUsed'), [data, calculateAverageData]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading data.</div>;

    return (
        <>
            {/* ClockSpeed Chart */}
            <DashboardBox gridArea="b">
                <BoxHeader
                    title="Average Clock Speed Over Time"
                    subtitle="Visualizing average clock speed of devices over time"
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
                        <XAxis 
                          dataKey="name" 
                          tickLine={false} 
                          style={{ fontSize: "10px" }} />
                        <YAxis 
                          tickLine={false} 
                          style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke={palette.primary.main} fill="url(#colorClockSpeed)" />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>

            {/* MemoryUsage Chart */}
            <DashboardBox gridArea="c">
                <BoxHeader
                    title="Average Memory Usage Over Time"
                    subtitle="Visualizing average memory usage of devices over time"
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
                        <XAxis 
                          dataKey="name" 
                          tickLine={false} 
                          style={{ fontSize: "10px" }} />
                        <YAxis 
                        tickLine={false} 
                        style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Area type="monotone" dataKey="value" stroke={palette.secondary.main} fill="url(#colorMemoryUsage)" />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row2;
