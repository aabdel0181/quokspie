import React, { useMemo } from 'react'
import DashboardBox from '../../components/DashboardBox'
import { useGetKpisQuery, useGetProductsQuery, useGetDeviceDataQuery } from '../../state/api'
import BoxHeader from '../../components/BoxHeader'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, Legend } from 'recharts'
import { useTheme } from '@mui/material'

type Props = {}

const Row2 = (props: Props) => {
  const { palette } = useTheme();
  const { data: deviceData } = useGetDeviceDataQuery();
  const { data: productData } = useGetProductsQuery();
  console.log("data:", deviceData)
 
  const powerUsageData = useMemo(() => {
    return deviceData?.map(({ Timestamp, PowerUsage }) => ({
      name: new Date(Timestamp).toLocaleString(),
      value: PowerUsage,
    }));
  }, [deviceData]);

  const productExpenseData = useMemo(() => {
    return (
      productData && 
      productData.map(({ _id, price, expense}) => {
        return {
          id: _id,
          price: price,
          expense: expense
        }
    })
    )
  }, [productData]);


  return (
    <>
    <DashboardBox gridArea="d">
    <BoxHeader
        title="Power Usage Over Time"
        subtitle="Visualizing power usage of devices over time"
        sideText="Last updated"
      />
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={powerUsageData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 20,
          }}
        >
          <XAxis dataKey="name" tickLine={false} style={{ fontSize: "10px" }} />
          <YAxis tickLine={false} style={{ fontSize: "10px" }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke={palette.info.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </DashboardBox>
    <DashboardBox gridArea="e"></DashboardBox>
    <DashboardBox gridArea="f">
      <BoxHeader
          title="Product Prices vs Expenses"
          sideText="+4%"
        />
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 3,
            bottom: 40,
            left: -10,
          }}
        >
          <CartesianGrid stroke="none" />
          <XAxis type="number" 
          dataKey="price" 
          name="price" 
          axisLine={false}
          tickLine={false}
          style={{fontSize: "10px"}}
          tickFormatter={(v) => `$${v}`}
          />
          <YAxis 
            type="number" 
            dataKey="expense" 
            name="expense" 
            axisLine={false} 
            tickLine={false} 
            style={{fontSize: "10px"}}
            tickFormatter={(v) => `$${v}`}
          />
          <ZAxis type="number" range={[20]}/>
          <Tooltip formatter = {(v) => `$${v}`}/>
          <Scatter name="Product Expense Ratio" data={productExpenseData} fill={palette.tertiary[500]} />
        </ScatterChart>
      </ResponsiveContainer></DashboardBox>
    </>
    
  )
}

export default Row2