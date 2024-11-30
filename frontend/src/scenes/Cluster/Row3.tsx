import { useMemo } from 'react'
import DashboardBox from '../../components/DashboardBox'
import { useGetDeviceDataQuery } from '../../state/api'
import BoxHeader from '../../components/BoxHeader'
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useTheme } from '@mui/material'


const Row3 = () => {
  const { palette } = useTheme();
  const { data } = useGetDeviceDataQuery();

  const deviceIdToFilter = "GPU-eeeb2355-a08f-ee62-eead-751f2c632aba";
 
  // Filter and process data for Temperature chart
  const temperatureData = useMemo(() => {
    return data
        ?.filter(({ DeviceId }) => DeviceId === deviceIdToFilter) // Filter by DeviceId
        .map(({ Timestamp, Temperature }) => ({
            name: new Date(Timestamp).toLocaleString(), // Format timestamp to full date and time for the x-axis
            value: Temperature,
        }));
}, [data]);

// Filter and process data for PowerUsage chart
const powerUsageData = useMemo(() => {
  return data
      ?.filter(({ DeviceId }) => DeviceId === deviceIdToFilter) // Filter by DeviceId
      .map(({ Timestamp, PowerUsage }) => ({
          name: new Date(Timestamp).toLocaleString(), // Format timestamp to full date and time for the x-axis
          value: PowerUsage,
      }));
}, [data]);

  return (
    <>
    {/* Temperature Chart */}
    <DashboardBox gridArea="d">
                <BoxHeader
                    title="Temperature Over Time"
                    subtitle="Visualizing temperature of devices over time"
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
                                <stop offset="5%" stopColor={palette.error.main} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={palette.error.main} stopOpacity={0}/>
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
                    title="Power Usage Over Time"
                    subtitle="Visualizing power usage of devices over time"
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
                                <stop offset="5%" stopColor={palette.info.main} stopOpacity={0.8}/>
                                <stop offset="95%" stopColor={palette.info.main} stopOpacity={0}/>
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
    
  )
}

export default Row3