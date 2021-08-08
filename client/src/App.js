import React, { useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import 'regenerator-runtime/runtime'
import axios from 'axios'
import useSWR from 'swr'
// import 'core-js/stable'

// import react-compatible components
import { MapContainer } from 'react-leaflet'

// import custom components
import MapControler from './components/MapControler'
import MapContext from './components/MapContext'

// import CSS styles
import 'style/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import './App.css'

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

// function used to fill the filterContext dictionary
const fillFilterContextData = (filterId, filterContextData) => {
  // filterId: full string of the filter Id
  // filterContextData: dictionary to be filled

  if (!filterId) return {}

  const curFilterIdSplit = filterId.split('.')

  // TODO - make it more general
  if (curFilterIdSplit.length !== 2) {
    console.log('Unable to parse filter ID: ', filterId)
    return null
  }

  // set attributes
  filterContextData.evtFilterId = curFilterIdSplit[0]
  filterContextData.geoFilterId = curFilterIdSplit[1]
  filterContextData.filterId = filterId

  return null
}

//
const getMapCenter = (mapExtent) => {
  return {
    x: (mapExtent.right + mapExtent.left) / 2,
    y: (mapExtent.top + mapExtent.bottom) / 2
  }
}

const App = () => {
  /* ** SET HOOKS ****************************************************************************** */

  // Estado - enpoint para series de tiempo
  const [timeSerieUrl, setTimeSerieUrl] = useState(null)

  // Panel state - show or hide
  const [isHidden, setIsHidden] = useState(false)

  // request location data -> store in const 'locationsData'
  const locationsData = useState({})[0]
  const { data: data2, error: error2 } = useSWR(
    'https://hydro-web.herokuapp.com/v1/locations', fetcher
  )
  if (data2 && !error2 && !Object.keys(locationsData).length) {
    for (const i in data2) { locationsData[i] = data2[i] }
  }

  // request boundaries data -> store in const 'boundariesData'
  const boundariesData = useState([])[0]
  const { data: data1, error: error1 } = useSWR(
    'https://hydro-web.herokuapp.com/v1dw/boundaries', fetcher
  )
  if ((data1 && !error1 && !boundariesData.length)) {
    for (const i in data1) { boundariesData.push(data1[i]) }
  }

  // request region data -> store in const 'regionData'
  const regionData = useState({})[0]
  const { data: data3, error: error3 } = useSWR(
    'https://hydro-web.herokuapp.com/v1/region', fetcher
  )
  if (data3 && !error3 && !Object.keys(regionData).length) {
    for (const i in data3) { regionData[i] = data3[i] }
  }

  // request filters data -> store in 'ids'
  // only proceeds when the request is received or fails
  const filtersData = useState([])[0]
  const { data: dataids, error: errorids } = useSWR(
    'https://hydro-web.herokuapp.com/v1/filters', fetcher
  )
  if (dataids && !errorids && !filtersData.length) {
    for (const i in dataids) { filtersData.push(dataids[i]) }
  }

  // define filterContext
  const [filterContextData, setFilterContextData] = useState({})
  const [mapLocationsContextData, setMapLocationsContextData] = useState({})

  // basic check for opening the system
  if (errorids) return <div>failed to load</div>
  if ((!dataids) || (!data1) || (!data2) || (!data3)) return <div>Loading...</div>

  /* ** MAIN RENDER  *************************************************************************** */

  const ids = filtersData.map((filter) => filter.id)

  // currently active filter
  if (!('filterId' in filterContextData)) {
    fillFilterContextData(regionData.defaultFilter, filterContextData)
  }

  // basic check - boundaries must load, if no data is returned by the API shows an error message
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
  const posXY = getMapCenter(regionData.map.defaultExtent)
  const position = [posXY.y, posXY.x]

  // defines zoom level
  // TODO: make it a function of the map extents
  const zoom = 9

  // build page if everithing worked fine
  return (
    <MapContext.Provider value={{
      locationsData,
      isHidden,
      setIsHidden,
      timeSerieUrl,
      setTimeSerieUrl,
      filterContextData,
      setFilterContextData,
      mapLocationsContextData,
      setMapLocationsContextData,
      boundariesData,
      regionData,
      filtersData,
      ids
    }}
    >
      <MapContainer center={position} zoom={zoom} zoomControl={false}>
        <MapControler />
      </MapContainer>
    </MapContext.Provider>
  )
}

export default App
