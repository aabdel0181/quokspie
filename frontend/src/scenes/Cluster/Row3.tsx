import { useMemo, useCallback } from 'react';
import DashboardBox from '../../components/DashboardBox';
import { useGetDeviceDataQuery } from '../../state/api';
import BoxHeader from '../../components/BoxHeader';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '@mui/material';

interface DeviceData {
    Timestamp: string; // or Date if it's a Date object
    Temperature: number; // Adjust types as necessary
    PowerUsage: number; // Adjust types as necessary
}

const Row3 = () => {
    const { palette } = useTheme();
    const { data } = useGetDeviceDataQuery();

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

    const temperatureData = useMemo(() => calculateAverageData(data || [], 'Temperature'), [data, calculateAverageData]);
    const powerUsageData = useMemo(() => calculateAverageData(data || [], 'PowerUsage'), [data, calculateAverageData]);

    return (
        <>
            {/* Temperature Chart */}
            <DashboardBox gridArea="d">
                <BoxHeader
                    title="Average Temperature Over Time"
                    subtitle="Visualizing average temperature of devices over time"
                    sideText=""
                />
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={temperatureData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: -15,
                            bottom: 60,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorTemperature" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.error.main} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={palette.error.main} stopOpacity={0} />
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
                        <Area type="monotone" dataKey="value" stroke={palette.error.main} fill="url(#colorTemperature)" />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>

            {/* PowerUsage Chart */}
            <DashboardBox gridArea="e">
                <BoxHeader
                    title="Average Power Usage Over Time"
                    subtitle="Visualizing average power usage of devices over time"
                    sideText=""
                />
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={powerUsageData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: -15,
                            bottom: 60,
                        }}
                    >
                        <defs>
                            <linearGradient id="colorPowerUsage" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={palette.info.main} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={palette.info.main} stopOpacity={0} />
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
                        <Area type="monotone" dataKey="value" stroke={palette.info.main} fill="url(#colorPowerUsage)" />
                    </AreaChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row3;