import React, { useState, useEffect, useContext } from 'react'
import { Icon } from 'leaflet'
import axios from 'axios'
import useSWR from 'swr'

// import react-compatible components
import { Alert, Spinner } from 'react-bootstrap'
import {
  MapContainer, Marker, Popup, LayersControl,
  LayerGroup, Polygon, ZoomControl, useMap
} from 'react-leaflet'

// import assets
import { baseLayersData } from './assets/MapBaseLayers'

// import custom components
import Panel from './components/Panel'
import MapContext from './components/MapContext'
import FilterContext from './components/FilterContext'
import DropDownTimeSeries from './components/DropDownTimeSeries'
import { MainMenuControl } from './components/MainMenuControl'
import BaseLayers from './components/BaseLayers'

// import CSS styles
import 'style/bootstrap.min.css'
import 'leaflet/dist/leaflet.css'
import './App.css'

const icon = new Icon({
  iconUrl: 'img/browndot.png',
  iconSize: [25, 25],
  popupAnchor: [0, -15]
})

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

const MapControler = () => {
  // this specific component is needed to allow useMap()

  const {
    pointFeatures, setActivePointFeature,
    isHidden, setIsHidden,
    timeSerieUrl, setTimeSerieUrl,
    filterContextData, setFilterContextData,
    boundariesData, regionData,
    filtersData, ids
  } = useContext(MapContext)
  const map = useMap()

  let reversedPolygon

  // when filterContextData is changed, load new filter data and refresh map
  useEffect(() => {
    if (!('filterId' in filterContextData)) return null

    const urlRequest = 'https://hydro-web.herokuapp.com/v1/filter/'.concat(
      filterContextData.filterId)

    // move map view to fit the map extent
    fetcher(urlRequest).then((jsonData) => {
      const newMapExtent = jsonData.map.defaultExtent
      map.flyToBounds([
        [newMapExtent.bottom, newMapExtent.left],
        [newMapExtent.top, newMapExtent.right]
      ])
    })
  }, [filterContextData])

  return (
    <>
      <LayersControl>

        <BaseLayers baseLayerData={baseLayersData} />

        {/* adds layer control for stations (shouldnt be 'locations'?) */}
        <LayersControl.Overlay checked name='Stations'>
          <LayerGroup name='Locations'>
            {pointFeatures.locations.map((pointFeatures) => (
              <Marker
                key={pointFeatures.locationId}
                position={[pointFeatures.y, pointFeatures.x]}
                onClick={() => {
                  setActivePointFeature(pointFeatures)
                }}
                icon={icon}
              >
                <Popup
                  position={[pointFeatures.y, pointFeatures.x]}
                  onClose={() => {
                    setActivePointFeature(pointFeatures)
                  }}
                >
                  <div>
                    <h5>
                      <span className='popuptitle'>
                        {pointFeatures.shortName}
                      </span>
                    </h5>
                    <p>
                      <span className='popuptitle'>Id:</span>{' '}
                      {pointFeatures.locationId}
                    </p>
                    <p>
                      <span className='popuptitle'>Longitude:</span>{' '}
                      {pointFeatures.x}
                    </p>
                    <p>
                      <span className='popuptitle'>Latitude:</span>{' '}
                      {pointFeatures.y}
                    </p>
                  </div>
                  <DropDownTimeSeries
                    ids={ids}
                    locationid={pointFeatures.locationId}
                    timeSerieUrl={timeSerieUrl}
                    setTimeSerieUrl={setTimeSerieUrl}
                    setIsHidden={setIsHidden}
                  />
                  {/* <timeSeriesPlot data={data} /> */}
                </Popup>
              </Marker>
            ))}
          </LayerGroup>
        </LayersControl.Overlay>

        {/* adds layer control for basins (shouldnt be 'boundaries'?) */}
        <LayersControl.Overlay checked name='Basins'>
          <LayerGroup name='Basins'>
            {
              /* points in geojson are in [lat, lon] (or [y, x]) - need to be inverted */
              boundariesData.map((poly) => {
                reversedPolygon = Array.from(poly.polygon.values()).map(
                  (pol) => [pol[1], pol[0]]
                )

                return (
                  <Polygon
                    pathOptions={{
                      color: '#069292',
                      fillColor: null
                    }}
                    positions={reversedPolygon}
                    key={poly.id}
                  />
                )
              })
            }
          </LayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      {/* add (how to describe this?) */}
      <Panel
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        timeSerieUrl={timeSerieUrl}
        position='leaflet-right'
      />

      {/* add the main floating menu */}
      <FilterContext.Provider value={{ filterContextData, setFilterContextData }}>
        <MainMenuControl
          position='topleft'
          regionName={regionData.systemInformation.name}
          filtersData={filtersData}
        />
      </FilterContext.Provider>

      <ZoomControl position='bottomright' />

    </>
  )
}

const App = () => {
  /* ** SET HOOKS ****************************************************************************** */

  // Estado - enpoint para series de tiempo
  const [timeSerieUrl, setTimeSerieUrl] = useState(null)

  // Panel state - show or hide
  const [isHidden, setIsHidden] = useState(false)

  // request location data -> store in const 'point_feature'
  const setActivePointFeature = useState(null)[1]
  const pointFeatures = useState({})[0]
  const { data: data2, error: error2 } = useSWR(
    'https://hydro-web.herokuapp.com/v1/locations', fetcher
  )
  if (data2 && !error2 && !Object.keys(pointFeatures).length) {
    for (const i in data2) { pointFeatures[i] = data2[i] }
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

  // basic check for opening the system
  if (errorids) return <div>failed to load</div>
  if ((!dataids) || (!data1) || (!data2) || (!data3)) return <div>Loading...</div>

  /* ** MAIN RENDER  *************************************************************************** */

  const ids = filtersData.map((filter) => filter.id)

  // currently active filter
  if (!('filterId' in filterContextData)) {
    fillFilterContextData(regionData.defaultFilter, filterContextData)
    console.log('First filterContextData:', filterContextData)
  }

  // basic check - boundaries must load
  if (error1) {
    return <Alert variant='danger'>There is a problem</Alert>
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
      pointFeatures,
      setActivePointFeature,
      isHidden,
      setIsHidden,
      timeSerieUrl,
      setTimeSerieUrl,
      filterContextData,
      setFilterContextData,
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
