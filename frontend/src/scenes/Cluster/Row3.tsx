import { useMemo } from 'react';
import DashboardBox from '../../components/DashboardBox';
import { useGetDeviceDataQuery } from '../../state/api';
import BoxHeader from '../../components/BoxHeader';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useTheme } from '@mui/material';

const Row3 = () => {
    const { palette } = useTheme();
    const { data } = useGetDeviceDataQuery();

    const deviceIdsToFilter = [
        "GPU-eeeb2355-a08f-ee62-eead-751f2c632aba",
        "GPU-bbc80d76-6599-a3e1-0cb6-db0b4fb59df6"
    ];

    // Filter and process data for Temperature chart
    const temperatureData = useMemo(() => {
        const filteredData = data?.filter(({ DeviceId }) => deviceIdsToFilter.includes(DeviceId)); // Filter by DeviceId
        const groupedData = filteredData?.reduce((acc, { Timestamp, Temperature }) => {
            const time = new Date(Timestamp).toLocaleString();
            if (!acc[time]) {
                acc[time] = { totalTemperature: 0, count: 0 };
            }
            acc[time].totalTemperature += Temperature;
            acc[time].count += 1;
            return acc;
        }, {});

        return Object.entries(groupedData || {}).map(([name, { totalTemperature, count }]) => ({
            name,
            value: totalTemperature / count, // Calculate average
        }));
    }, [data]);

    // Filter and process data for PowerUsage chart
    const powerUsageData = useMemo(() => {
        const filteredData = data?.filter(({ DeviceId }) => deviceIdsToFilter.includes(DeviceId)); // Filter by DeviceId
        const groupedData = filteredData?.reduce((acc, { Timestamp, PowerUsage }) => {
            const time = new Date(Timestamp).toLocaleString();
            if (!acc[time]) {
                acc[time] = { totalPowerUsage: 0, count: 0 };
            }
            acc[time].totalPowerUsage += PowerUsage;
            acc[time].count += 1;
            return acc;
        }, {});

        return Object.entries(groupedData || {}).map(([name, { totalPowerUsage, count }]) => ({
            name,
            value: totalPowerUsage / count, // Calculate average
        }));
    }, [data]);

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