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
import Plot from 'react-plotly.js'


const TimeSeriesPlot = ({ timeSeriesUrl }) => {
  const [plotData, setPlotData] = useState(null)
  const fetcher = (url) => axios.get(url).then((res) => res.data)

  const { data: apiData, error } = useSWR(timeSeriesUrl, fetcher, {
    suspense: true
  })
  if (error) return <div>failed to load</div>
  if (!apiData) return <div>loading...</div>

  let plotDataAux
  const 


  const getPlotData = async () => {
    setPlotData(null)
    plotDataAux = await apiData.map((series) => {
      return ({
        date: timeStep.date + ' ' + timeStep.time,
        value: timeStep.value
      })
    })
    setPlotData(plotDataAux)  
  }

  // getPlotData();
  useEffect(() => getPlotData(), [])


console.log(plotData)

  return (
    <>
      {plotData && (
        // <ResponsiveContainer width='90%' height='60%' className='grafica'>
        //   <LineChart
        //     width={500}
        //     height={300}
        //     data={plotData}
        //     margin={{
        //       top: 5,
        //       right: 30,
        //       left: 14,
        //       bottom: 5
        //     }}
        //   >
        //     <CartesianGrid strokeDasharray='3 3' />
        //     <XAxis type='number' dataKey='date' domain={['dataMin', 'dataMax']}>
        //       <Label
        //         value='Date'
        //         position='bottom'
        //         style={{ textAnchor: 'middle' }}
        //       />
        //     </XAxis>
        //     <YAxis>
        //       <Label
        //         value='Value'
        //         position='left'
        //         angle={-90}
        //         style={{ textAnchor: 'middle' }}
        //       />
        //     </YAxis>
        //     <Line dataKey='value' />
        //     <Tooltip />
        //     <Legend />
        //     <LineChart
        //       type='monotone'
        //       dataKey='date'
        //       stroke='#8884d8'
        //       dot={false}
        //     />
        //   </LineChart>
        // </ResponsiveContainer>
      

      

      
      <div>
        {console.log(plotData["date"])}
      <Plot
        
        data={[
          {
            x: plotData["date"],
            y: plotData["value"],
            type: 'scatter',
            mode: 'lines',
          },
        ]}
        layout={ {autosize: true, title: 'A Fancy Plot'} }
      />
      </div>

      )}
    </>
  )
}

export default TimeSeriesPlot;

        // data={[
        //   {
        //     x: {plotData["date"]},
        //     y: {plotData["value"]},
        //     type: 'scatter',
        //     mode: 'lines',
        //   },

        // ]}
        // layout={ {autosize: true, title: 'A Fancy Plot'} }
