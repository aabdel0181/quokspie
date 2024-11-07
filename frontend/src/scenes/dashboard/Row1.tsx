import React, { useMemo } from 'react';
import DashboardBox from '../../components/DashboardBox';
import { useGetDeviceDataQuery } from '../../state/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useTheme } from '@mui/material/styles';
import BoxHeader from '../../components/BoxHeader';

const Row1 = () => {
    const { palette } = useTheme();
    const { data, isLoading, error } = useGetDeviceDataQuery();

    // Process data for ClockSpeed chart
    const clockSpeedData = useMemo(() => {
        return data?.map(({ Timestamp, ClockSpeed }) => ({
            name: new Date(Timestamp).toLocaleTimeString(), // Format timestamp for the x-axis
            value: ClockSpeed,
        }));
    }, [data]);

    // Process data for MemoryUsage chart
    const memoryUsageData = useMemo(() => {
        return data?.map(({ Timestamp, MemoryUsed }) => ({
            name: new Date(Timestamp).toLocaleTimeString(), // Format timestamp for the x-axis
            value: MemoryUsed,
        }));
    }, [data]);

    // Process data for Temperature chart
    const temperatureData = useMemo(() => {
        return data?.map(({ Timestamp, Temperature }) => ({
            name: new Date(Timestamp).toLocaleTimeString(), // Format timestamp for the x-axis
            value: Temperature,
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
                    sideText="Last updated"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={clockSpeedData}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 0,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke={palette.primary.main} />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            {/* MemoryUsage Chart */}
            <DashboardBox gridArea="b">
                <BoxHeader
                    title="Memory Usage Over Time"
                    subtitle="Visualizing memory usage of devices over time"
                    sideText="Last updated"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={memoryUsageData}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 0,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke={palette.secondary.main} />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            {/* Temperature Chart */}
            <DashboardBox gridArea="c">
                <BoxHeader
                    title="Temperature Over Time"
                    subtitle="Visualizing temperature of devices over time"
                    sideText="Last updated"
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={temperatureData}
                        margin={{
                            top: 20,
                            right: 20,
                            left: 0,
                            bottom: 20,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="value" stroke={palette.error.main} />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>
        </>
    );
};

export default Row1;
