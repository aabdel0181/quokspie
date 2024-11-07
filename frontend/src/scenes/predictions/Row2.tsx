import React, { useMemo } from 'react'
import DashboardBox from '../../components/DashboardBox'
import { useGetKpisQuery, useGetProductsQuery, useGetDeviceDataQuery } from '../../state/api'
import BoxHeader from '../../components/BoxHeader'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import { useTheme } from '@mui/material'

type Props = {}

const Row2 = (props: Props) => {
  const { palette } = useTheme();
  const { data, isLoading, error } = useGetDeviceDataQuery();
 
  // Process data for Temperature chart
  const temperatureData = useMemo(() => {
    return data?.map(({ Timestamp, Temperature }) => ({
        name: new Date(Timestamp).toLocaleString(), // Format timestamp to full date and time for the x-axis
        value: Temperature,
    }));
}, [data]);

// Process data for PowerUsage chart
const powerUsageData = useMemo(() => {
    return data?.map(({ Timestamp, PowerUsage }) => ({
        name: new Date(Timestamp).toLocaleString(), // Format timestamp to full date and time for the x-axis
        value: PowerUsage,
    }));
}, [data]);

  return (
    <>
    {/* Temperature Chart */}
    <DashboardBox gridArea="c">
                <BoxHeader
                    title="Temperature Over Time"
                    subtitle="Visualizing temperature of devices over time"
                    sideText=""
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={temperatureData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: -15,
                          bottom: 60,
                        }}
                    >
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke={palette.error.main} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>

            {/* PowerUsage Chart */}
            <DashboardBox gridArea="d">
                <BoxHeader
                    title="Power Usage Over Time"
                    subtitle="Visualizing power usage of devices over time"
                    sideText=""
                />
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={powerUsageData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: -15,
                          bottom: 60,
                        }}
                    >
                        <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis tickLine={false} style={{ fontSize: "10px" }} />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke={palette.info.main} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </DashboardBox>
    </>
    
  )
}

export default Row2