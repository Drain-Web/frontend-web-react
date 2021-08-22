import React, { useState } from 'react'
import { Alert, Spinner } from 'react-bootstrap'
import 'regenerator-runtime/runtime'
import axios from 'axios'
import useSWR from 'swr'
// import 'core-js/stable'

// import react-compatible components
import { MapContainer } from 'react-leaflet'

// import custom components
import MapControler from './components/others/MapControler'
import MapContext from './components/contexts/MapContext'
import FlexContainer from './components/others/FlexContainer'

// import libs
import { apiUrl } from './libs/api.js'

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

const loadingMessage = (dataSettings, dataRegion, dataBounds, dataFilts, dataLocs) => {
  return (
    <div>
      Loading...<br />
      &nbsp;general settings: {dataSettings ? 'loaded.' : '...'}<br />
      &nbsp;region info: {dataRegion ? 'loaded.' : '...'}<br />
      &nbsp;region info: {dataBounds ? 'loaded.' : '...'}<br />
      &nbsp;region info: {dataFilts ? 'loaded.' : '...'}<br />
      &nbsp;region info: {dataLocs ? 'loaded.' : '...'}<br />
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
    </div>
  )
}

const App = () => {
  /* ** SET HOOKS ****************************************************************************** */

  // Estado - enpoint para series de tiempo
  const [timeSerieUrl, setTimeSerieUrl] = useState(null)

  // Panel state - show or hide
  const [isHidden, setIsHidden] = useState(false)

  // Fetched states
  const settingsData = useState({})[0]
  const locationsData = useState({})[0]
  const boundariesData = useState([])[0]
  const regionData = useState({})[0]
  const filtersData = useState([])[0]

  // Context states
  const [filterContextData, setFilterContextData] = useState({})
  const [mapLocationsContextData, setMapLocationsContextData] = useState({})

  // read app settings
  const { data: dataSettings, error: errorSettings } = useSWR(
    'settings.json', fetcher
  )
  if (dataSettings && (!errorSettings) && (!Object.keys(settingsData).length)) {
    for (const i in dataSettings) settingsData[i] = dataSettings[i]
  }

  // request location data -> store in const 'locationsData'
  const { data: dataLocs, error: error2 } = useSWR(
    'https://hydro-web.herokuapp.com/v1dw/locations?showPolygon=true&showAttributes=true', fetcher
  )
  if (dataLocs && !error2 && !Object.keys(locationsData).length) {
    for (const i in dataLocs) { locationsData[i] = dataLocs[i] }
  }

  // request boundaries data -> store in const 'boundariesData'
  const { data: dataBounds, error: error1 } = useSWR(
    'https://hydro-web.herokuapp.com/v1dw/boundaries', fetcher
  )
  if ((dataBounds && !error1 && !boundariesData.length)) {
    for (const i in dataBounds) { boundariesData.push(dataBounds[i]) }
  }

  // request region data -> store in const 'regionData'
  const { data: dataRegion, error: error3 } = useSWR(
    'https://hydro-web.herokuapp.com/v1/region', fetcher
  )
  if (dataRegion && !error3 && !Object.keys(regionData).length) {
    for (const i in dataRegion) { regionData[i] = dataRegion[i] }
  }

  // request filters data -> store in 'ids'
  // only proceeds when the request is received or fails
  const { data: dataFilts, error: errorids } = useSWR(
    'https://hydro-web.herokuapp.com/v1/filters', fetcher
  )
  if (dataFilts && !errorids && !filtersData.length) {
    for (const i in dataFilts) { filtersData.push(dataFilts[i]) }
  }

  // basic check for opening the system
  if (errorids) return <div>failed to load</div>
  // if ((!dataFilts) || (!dataBounds) || (!dataLocs) || (!dataRegion) || (!dataSettings)) {
  if (!(dataFilts && dataBounds && dataLocs && dataRegion && dataSettings)) {
    return loadingMessage(dataSettings, dataRegion, dataBounds, dataFilts, dataLocs)
  }

  // apiUrl(settingsData.apiBaseUrl, 'vA', 'b', { c: 1234 })

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
        <MapControler
          overviewFilter={settingsData.overviewFilter}
          apiBaseUrl={settingsData.apiBaseUrl}
        />
      </MapContainer>
    </MapContext.Provider>

  )
}

export default App
