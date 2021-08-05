import React, { useState, useEffect } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Line,
  Legend
} from 'recharts'
import '../style/TimeSeriePlot.css'
import useSWR from 'swr'
import axios from 'axios'

const TimeSeriesPlot = ({ timeSeriesUrl }) => {
  const [plotData, setPlotData] = useState(null)
  const fetcher = (url) => axios.get(url).then((res) => res.data)

  const { data: apiData, error } = useSWR(timeSeriesUrl, fetcher, {
    suspense: true
  })
  if (error) return <div>failed to load</div>
  if (!apiData) return <div>loading...</div>

  let plotDataAux
  console.log('apiData: ', apiData)

  const getPlotData = async () => {
    setPlotData(null)
    plotDataAux = await apiData[0].events.map((timeStep) => {
      return {
        date: parseInt((new Date(timeStep.date + ' ' + timeStep.time).getTime() / 1000).toFixed(0)),
        value: timeStep.value
      }
    })
    setPlotData(plotDataAux)
  }

  // getPlotData();
  useEffect(() => getPlotData(), [])

  return (
    <>
      {plotData && (
        <ResponsiveContainer width='90%' height='60%' className='grafica'>
          <LineChart
            width={500}
            height={300}
            data={plotData}
            margin={{
              top: 5,
              right: 30,
              left: 14,
              bottom: 5
            }}
          >
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis type='number' dataKey='date' domain={['dataMin', 'dataMax']}>
              <Label
                value='Date'
                position='bottom'
                style={{ textAnchor: 'middle' }}
              />
            </XAxis>
            <YAxis>
              <Label
                value='Value'
                position='left'
                angle={-90}
                style={{ textAnchor: 'middle' }}
              />
            </YAxis>
            <Line dataKey='value' />
            <Tooltip />
            <Legend />
            <LineChart
              type='monotone'
              dataKey='date'
              stroke='#8884d8'
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  )
}

export default TimeSeriesPlot
