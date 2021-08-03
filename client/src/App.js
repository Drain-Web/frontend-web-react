import React, { useState } from 'react'
import axios from 'axios'

import { Alert, Spinner } from 'react-bootstrap'
import { MapContainer, LayersControl, LayerGroup } from 'react-leaflet'
import useSWR from 'swr'
import './App.css'
import Panel from './components/Panel'
// import DropDownTimeSeries from "./components/DropDownTimeSeries";
// import timeSeriesPlot from "./components/timeSeriesPlot";
import 'leaflet/dist/leaflet.css'
import { baseLayersData } from './assets/MapBaseLayers'
import BaseLayers from './components/BaseLayers'
import PolygonLayer from './components/PolygonLayer'
import PointsLayer from './components/PointsLayer'
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

const App = () => {
  // Estado - enpoint para series de tiempo
  const [timeSerieUrl, setTimeSerieUrl] = useState(null)

  // Panel state - show or hide
  const [isHidden, setIsHidden] = useState(false)

  // request location data -> store in const 'point_feature'

  const { data: data2, error: error2 } = useSWR(
    'https://hydro-web.herokuapp.com/v1/locations',
    fetcher
  )
  const locationsData = data2 && !error2 ? data2 : {}

  // request boundaries data -> store in const 'boundariesData'
  const [activeBoundaries, setActiveBoundaries] = useState(null)
  const { data: data1, error: error1 } = useSWR(
    'https://hydro-web.herokuapp.com/v1dw/boundaries',
    fetcher
  )
  const boundariesData = data1 && !error1 ? data1 : {}

  // request region data -> store in const 'regionData'
  const [activeRegion, setActiveRegion] = useState(null)
  const { data: data3, error: error3 } = useSWR(
    'https://hydro-web.herokuapp.com/v1/region',
    fetcher
  )
  const regionData = data3 && !error3 ? data3 : {}

  // request filters data -> store in 'ids'
  const { data: dataids, error: errorids } = useSWR(
    'https://hydro-web.herokuapp.com/v1/filters',
    fetcher
  )

  if (errorids) return <div>failed to load</div>
  if (!dataids) return <div>loading...</div>
  let ids = dataids && !errorids ? dataids : {}
  ids = ids.map((filter) => filter.id)

  // basic check - boundaries must load, if no data is returned by the API an error message is displayed
  if (error1) {
    return (
      <Alert variant='danger'>
        There is a problem, data cannot be fecthed from the API or it is taking
        much longer than usual.
      </Alert>
    )
  }

  // if failed to load boundaries does this
  if (!data1) {
    return (
      <Spinner
        animation='border'
        variant='danger'
        role='status'
        style={{
          width: '400px',
          height: '400px',
          margin: 'auto',
          display: 'block'
        }}
      />
    )
  }

  // gets the central coordinates of the map into const 'position'
  const x =
    (regionData.map.defaultExtent.right + regionData.map.defaultExtent.left) /
    2
  const y =
    (regionData.map.defaultExtent.top + regionData.map.defaultExtent.bottom) /
    2
  const position = [y, x]

  // defines zoom level
  // TODO: make it a function of the map extents
  const zoom = 9

  // build page if everithing worked fine
  return (
    <>
      <MapContainer center={position} zoom={zoom}>
        <LayersControl>
          <BaseLayers baseLayerData={baseLayersData} />

          {/* adds layer of points as a react component */}
          <PointsLayer
            layerData={locationsData}
            layerName='Locations'
            iconUrl='./img/browndot.png'
            ids={ids}
            timeSerieUrl={timeSerieUrl}
            setTimeSerieUrl={setTimeSerieUrl}
            setIsHidden={setIsHidden}
          />

          {/* adds a polygon layer to the control and the map as a component  */}
          <PolygonLayer
            layerData={boundariesData}
            layerName='Boundaries'
            reversePolygon
          />
        </LayersControl>

        {/* add */}
        {/* <Panel
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
          position={"Right"}
        /> */}

        <Panel
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
          position='Right'
        />
      </MapContainer>
    </>
  )
}

export default App
