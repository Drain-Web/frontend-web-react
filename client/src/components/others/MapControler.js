import { LayersControl, ZoomControl, useMap } from 'react-leaflet'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'

// import components
import { MainMenuControl } from './MainMenuControl'
import MapLocationsContext from '../contexts/MapLocationsContext'
import FilterContext from '../contexts/FilterContext'
import PolygonLayer from '../layers/PolygonLayer'
import PointsLayer from '../layers/PointsLayer'
import MapContext from '../contexts/MapContext'
import BaseLayers from '../layers/BaseLayers'
import Panel from './Panel'
import FlexContainer from './FlexContainer'

// import assets
import { baseLayersData } from '../../assets/MapBaseLayers'

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

const updateLocations = (jsonData, mapLocationsContextData, setMapLocationsContextData) => {
  // this function updates TODO
  const filteredLocations = {}
  const filteredParameters = {}
  const selectedParams = mapLocationsContextData.showParametersLocations

  //
  for (const curFilteredTimeseries of jsonData) {
    const locationId = curFilteredTimeseries.header.location_id
    const parameterId = curFilteredTimeseries.header.parameterId

    // add parameter no matter what
    if (!(parameterId in filteredParameters)) {
      filteredParameters[parameterId] = []
    }
    filteredParameters[parameterId].push({
      timeseriesId: curFilteredTimeseries.id,
      locationId: locationId
    })

    // verifies if add location
    if (selectedParams && (!selectedParams.has(curFilteredTimeseries.header.parameterId))) {
      console.log(curFilteredTimeseries.header.parameterId, 'not in', selectedParams)
      continue
    }

    // add location
    if (!(locationId in filteredLocations)) {
      filteredLocations[locationId] = []
    }
    filteredLocations[locationId].push({
      timeseriesId: curFilteredTimeseries.id
    })
  }

  setMapLocationsContextData({
    byLocations: filteredLocations,
    byParameter: filteredParameters
  })
}

const MapControler = () => {
  // this specific component is needed to allow useMap()

  const {
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
  } = useContext(MapContext)
  const map = useMap()

  // when filterContextData is changed, load new filter data and refresh map
  useEffect(() => {
    if (!('filterId' in filterContextData)) return null

    const urlFilterRequest =
      'https://hydro-web.herokuapp.com/v1/filter/'.concat(
        filterContextData.filterId
      )

    const urlTimeseriesRequest =
      'https://hydro-web.herokuapp.com/v1/timeseries/?filter='.concat(
        filterContextData.filterId
      )

    // move map view to fit the map extent
    fetcher(urlFilterRequest).then((jsonData) => {
      const newMapExtent = jsonData.map.defaultExtent
      map.flyToBounds([
        [newMapExtent.bottom, newMapExtent.left],
        [newMapExtent.top, newMapExtent.right]
      ])
    })

    // only show locations with timeseries in the filter
    fetcher(urlTimeseriesRequest).then((jsonData) => {
      updateLocations(jsonData, mapLocationsContextData, setMapLocationsContextData)
    })
  }, [filterContextData])

  return (
    <>
      <FlexContainer>
        {/* add the main floating menu */}
        <FilterContext.Provider
          value={{ filterContextData, setFilterContextData }}
        >
          <MapLocationsContext.Provider
            value={{ mapLocationsContextData, setMapLocationsContextData }}
          >
            <MainMenuControl
              position='topleft'
              regionName={regionData.systemInformation.name}
              filtersData={filtersData}
            />
          </MapLocationsContext.Provider>
        </FilterContext.Provider>

        {/* hyrographs panel */}
        <Panel
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
          position='leaflet-right'
        />
        {/* position='Right' */}

        <LayersControl>
          <BaseLayers baseLayerData={baseLayersData} />

          {/* adds layer of points as a react component */}
          <MapLocationsContext.Provider value={{ mapLocationsContextData }}>
            <FilterContext.Provider value={{ filterContextData }}>
              <PointsLayer
                layerData={locationsData}
                layerName='Locations'
                iconUrl='./img/browndot.png'
                ids={ids}
                timeSerieUrl={timeSerieUrl}
                setTimeSerieUrl={setTimeSerieUrl}
                setIsHidden={setIsHidden}
                filterContextData={filterContextData}
              />
            </FilterContext.Provider>
          </MapLocationsContext.Provider>

          {/* adds a polygon layer to the control and the map as a component  */}
          <FilterContext.Provider value={{ filterContextData }}>
            <PolygonLayer
              layerData={boundariesData}
              layerName='Boundaries'
              reversePolygon
            />
          </FilterContext.Provider>
        </LayersControl>

        <ZoomControl position='bottomright' />
      </FlexContainer>
    </>
  )
}

export default MapControler
