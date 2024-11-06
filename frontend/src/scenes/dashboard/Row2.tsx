import React, { useMemo } from 'react'
import DashboardBox from '../../components/DashboardBox'
import { useGetKpisQuery, useGetProductsQuery } from '../../state/api'
import BoxHeader from '../../components/BoxHeader'
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from 'recharts'
import { useTheme } from '@mui/material'

type Props = {}

const Row2 = (props: Props) => {
  const { palette } = useTheme();
  const { data: operationalData } = useGetKpisQuery();
  const { data: productData } = useGetProductsQuery();
  console.log("data:", operationalData)
 
  const operationalExpenses = useMemo(() => {
    return (
      operationalData && 
      operationalData[0].monthlyData.map(({month, operationalExpenses, nonOperationalExpenses}) => {
        return {
          name: month.substring(0, 3),
          "Operational Expenses": operationalExpenses,
          "Non Operational Expenses": nonOperationalExpenses
        }
    })
    )
  }, [operationalData]);

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
        title="Operational vs Non-Operational Expenses"
        sideText="+4%"
      />
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={operationalExpenses}
          margin={{
            top: 20,
            right: 0,
            left: -10,
            bottom: 55,
          }}
        >
          <CartesianGrid vertical={false} stroke={palette.grey[800]}/>
          <XAxis 
            dataKey="name" 
            tickLine={false} 
            style={{fontSize: "10px"}}
          />
          <YAxis 
            yAxisId="left"
            tickLine={false} 
            axisLine={false}
            style={{fontSize: "10px"}}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            tickLine={false} 
            axisLine={false}
            style={{fontSize: "10px"}}
          />
          <Tooltip />
          <Line 
            yAxisId="left"
            orientation="left"
            type="monotone" 
            dataKey="Non Operational Expenses" 
            stroke={palette.tertiary[500]} 
          />
          <Line 
            yAxisId="right"
            orientation="right"
            type="monotone" 
            dataKey="Operational Expenses" 
            stroke={palette.primary.main} 
          />
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
            right: 30,
            bottom: 40,
            left: -10,
          }}
        >
          <CartesianGrid  stroke = {palette.grey[800]}/>
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
          <Scatter name="Prodcut Expense Ratio" data={productExpenseData} fill={palette.tertiary[500]} />
        </ScatterChart>
      </ResponsiveContainer></DashboardBox>
    </>
    
  )
}

export default Row2