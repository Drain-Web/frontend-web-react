import { LayersControl, ZoomControl, useMap } from 'react-leaflet'
import React, { useEffect, useContext, useState } from 'react'
import axios from 'axios'
import { useSpring } from 'react-spring'

// import components
import { MainMenuControl } from './MainMenuControl'
import MapLocationsContext, { constraintLocationsShownByParameters, 
  showThresholdValueSetsBySelectedParameters } from '../contexts/MapLocationsContext'
import FilterContext from '../contexts/FilterContext'
import PolygonLayer from '../layers/PolygonLayer'
import PointsLayer from '../layers/PointsLayer'
import MapContext from '../contexts/MapContext'
import BaseLayers from '../layers/BaseLayers'
import Panel from './Panel'

// import assets
import { baseLayersData } from '../../assets/MapBaseLayers'

// import libs
import { apiUrl } from '../../libs/api.js'

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

const updateLocationsByFilter = (jsonData, mapLocationsContextData, setMapLocationsContextData) => {
  // this function updates the view of the locations when the view is for filter
  const updLocs = mapLocationsContextData.byLocations ? mapLocationsContextData.byLocations : {}
  const updParams = {}
  const updThreshValueSets = {}
  const selectedParams = mapLocationsContextData.showParametersLocations

  // hide all pre existing locations
  for (const curLocationId of Object.keys(updLocs)) {
    updLocs[curLocationId].show = false
  }

  //
  for (const curFilteredTimeseries of jsonData) {
    const locationId = curFilteredTimeseries.header.location_id
    const parameterId = curFilteredTimeseries.header.parameterId
    const timeseriesId = curFilteredTimeseries.id
    const thresholdValueSets = curFilteredTimeseries.thresholdValueSets

    // add parameter no matter what
    if (!(parameterId in updParams)) {
      updParams[parameterId] = []
    }
    updParams[parameterId].push({
      timeseriesId: timeseriesId,
      locationId: locationId
    })

    // add threshold value sets
    thresholdValueSets.forEach((curThresholdValueSet) => {
      if (!(curThresholdValueSet.id in updThreshValueSets)){
        updThreshValueSets[curThresholdValueSet.id] = {
          timeseries: [],
          showAsOption: false
        }
      }
      updThreshValueSets[curThresholdValueSet.id].timeseries.push({
        timeseriesId: timeseriesId,
        locationId: locationId,
        iconUrl: null,  // TODO - ignored now, make use of it
        parameterId: parameterId
      })
    });

    // verifies if add location
    if (selectedParams && (!selectedParams.has(parameterId))) {
      console.log(parameterId, 'not in', selectedParams)
      continue
    }

    // add location if needed
    if (!(locationId in updLocs)) {
      updLocs[locationId] = {
        timeseries: {}
      }
    }
    if (!(updLocs[locationId].timeseries[parameterId])) {
      updLocs[locationId].timeseries[parameterId] = new Set()
    }

    // set to be show and include timeseries
    updLocs[locationId].timeseries[parameterId].add(timeseriesId)
    updLocs[locationId].show = true
  }

  const pre = {
    ...mapLocationsContextData,
    byLocations: updLocs,
    byThresholdValueSet: updThreshValueSets,
    byParameter: updParams
  }

  const pos = showThresholdValueSetsBySelectedParameters(constraintLocationsShownByParameters(pre))

  setMapLocationsContextData(pos)
}


const updateLocationsToOverview = (mapLocationsContextData, setMapLocationsContextData) => {
  // this function updates the view of the locations when the view if for overview

  if (!mapLocationsContextData.byLocations) return

  const updLocs = mapLocationsContextData.byLocations
  for (const curLocationId of Object.keys(updLocs)) {
    updLocs[curLocationId].show = true
  }
  setMapLocationsContextData({ ...mapLocationsContextData, byLocations: updLocs })
}

const MapControler = ({ overviewFilter, apiBaseUrl, generalLocationIcon }) => {
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

  const [showMainMenuControl, setShowMainMenuControl] = useState(true)

  // when filterContextData is changed, load new filter data and refresh map
  useEffect(() => {
    // updates mapLocationsContextData

    if (filterContextData.inOverview) {
      // if it is overview, show all locations and all boundaries

      // move map to initial zoom
      const defaultExt = regionData.map.defaultExtent
      map.flyToBounds([
        [defaultExt.bottom, defaultExt.left],
        [defaultExt.top, defaultExt.right]
      ])

      // show all locations
      updateLocationsToOverview(mapLocationsContextData, setMapLocationsContextData)

      return null

    } else {
      // if it is not overview, apply filter changes

      if (!('filterId' in filterContextData)) return null

      // define URLs
      const urlFilterRequest = apiUrl(apiBaseUrl, 'v1', 'filter', filterContextData.filterId)
      const urlTimeseriesRequest = apiUrl(apiBaseUrl, 'v1', 'timeseries', {
        filter: filterContextData.filterId
      })

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
        updateLocationsByFilter(jsonData, mapLocationsContextData, setMapLocationsContextData)
      })
    }
  }, [filterContextData])

  return (
    <>
      <div> {/* <FlexContainer> */}
        {/* add the main floating menu */}
        <FilterContext.Provider
          value={{ filterContextData, setFilterContextData }}
        >
          <MapLocationsContext.Provider
            value={{ mapLocationsContextData, setMapLocationsContextData }}
          >
            <MainMenuControl
              regionName={regionData.systemInformation.name}
              filtersData={filtersData}
              overviewFilter={overviewFilter}
              showMainMenuControl={showMainMenuControl}
              setShowMainMenuControl={setShowMainMenuControl}
              position='leaflet-right'
            />

          </MapLocationsContext.Provider>
        </FilterContext.Provider>

        {/* hyrographs panel */}
        <Panel
          hideAll={timeSerieUrl}
          isHidden={isHidden}
          setIsHidden={setIsHidden}
          timeSerieUrl={timeSerieUrl}
          position='leaflet-right'
        />

        <LayersControl>
          <BaseLayers baseLayerData={baseLayersData} />

          {/* adds layer of points as a react component */}
          <MapLocationsContext.Provider value={{ mapLocationsContextData }}>
            <FilterContext.Provider value={{ filterContextData }}>
              <PointsLayer
                layerData={locationsData}
                layerName='Locations'
                iconUrl={generalLocationIcon}
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
      </div> {/* </FlexContainer> */}
    </>
  )
}

export default MapControler
