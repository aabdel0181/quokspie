import React, { useMemo } from 'react';
import DashboardBox from '../../components/DashboardBox';
import { useGetDeviceDataQuery } from '../../state/api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '@mui/material/styles';
import BoxHeader from '../../components/BoxHeader';

const Row1 = () => {
    const { palette } = useTheme();
    const { data, isLoading, error } = useGetDeviceDataQuery();

    // Process data for ClockSpeed chart
    const clockSpeedData = useMemo(() => {
        return data?.map(({ Timestamp, ClockSpeed }) => ({
            name: new Date(Timestamp).toLocaleString(), // Format timestamp to full date and time for the x-axis
            value: ClockSpeed,
        }));
    }, [data]);

    // Process data for MemoryUsage chart
    const memoryUsageData = useMemo(() => {
        return data?.map(({ Timestamp, MemoryUsed }) => ({
            name: new Date(Timestamp).toLocaleString(), // Format timestamp to full date and time for the x-axis
            value: MemoryUsed,
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
                    <LineChart
                        data={clockSpeedData}
                        margin={{
                            top: 20,
                            right: 30,
                            left: -15,
                            bottom: 60,
                        }}
                    >
                        <XAxis 
                          dataKey="name" 
                          tickLine={false} 
                          style={{ fontSize: "10px" }} />
                        <YAxis 
                          tickLine={false} 
                          style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke={palette.primary.main} dot={false} />
                    </LineChart>
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
                    <LineChart
                        data={memoryUsageData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: -15,
                          bottom: 60,
                        }}
                    >
                        <XAxis 
                          dataKey="name" 
                          tickLine={false} 
                          style={{ fontSize: "10px" }} />
                        <YAxis 
                        tickLine={false} 
                        style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke={palette.secondary.main} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            
        </>
    );
};

export default Row1;
