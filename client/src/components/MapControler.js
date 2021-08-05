import { LayersControl, ZoomControl, useMap } from 'react-leaflet'
import React, { useEffect, useContext } from 'react'
import axios from 'axios'

// import components
import { MainMenuControl } from './MainMenuControl'
import FilterContext from './FilterContext'
import PolygonLayer from './PolygonLayer'
import PointsLayer from './PointsLayer'
import MapContext from './MapContext'
import BaseLayers from './BaseLayers'
import Panel from './Panel'

// import assets
import { baseLayersData } from '../assets/MapBaseLayers'

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

const MapControler = () => {
  // this specific component is needed to allow useMap()

  const {
    locationsData,
    isHidden, setIsHidden,
    timeSerieUrl, setTimeSerieUrl,
    filterContextData, setFilterContextData,
    boundariesData, regionData,
    filtersData, ids
  } = useContext(MapContext)
  const map = useMap()

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

      {/* hyrographs panel */}
      <Panel
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        timeSerieUrl={timeSerieUrl}
        position='leaflet-right'
      />
      {/* position='Right' */}

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

export default MapControler
