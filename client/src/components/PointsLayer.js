import React, { useState, useContext, Fragment } from 'react'
import { Icon } from 'leaflet'
import DropDownTimeSeries from './DropDownTimeSeries'
import { Marker, Polygon, Popup, LayersControl, LayerGroup } from 'react-leaflet'
import MapLocationsContext from './MapLocationsContext'

// ids should be removed later, just used to keep the same current functionalities while creating basic components (a.k.a. machetazo)

const PointsLayer = ({
  layerData,
  layerName,
  iconUrl,
  iconSize = 22,
  ids,
  timeSerieUrl,
  setTimeSerieUrl,
  setIsHidden
}) => {
  // regular location icon
  const icon = new Icon({
    iconUrl: iconUrl,
    iconSize: [iconSize, iconSize],
    popupAnchor: [0, -15]
  })

  // mock location icon for a place not-to-be-shown
  const noIcon = new Icon({
    iconUrl: iconUrl,
    iconSize: [0, 0]
  })

  /* ** SET HOOKS ****************************************************************************** */

  // retireves context data
  const { mapLocationsContextData } = useContext(MapLocationsContext)

  const [activePointFeature, setActivePointFeature] = useState(null)

  /* ** MAIN RENDER  *************************************************************************** */
  return (
    <>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          {layerData.locations.map((layerData) => {
            // maker will be displayed if its location Id is in the mapLocationsContextData
            const displayMarker = () => {
              if (mapLocationsContextData.byLocations &&
                (layerData.locationId in mapLocationsContextData.byLocations)) {
                return true
              }
              return false
            }

            return (
              <Fragment key={layerData.locationId}>
                <Marker
                  position={[layerData.y, layerData.x]}
                  eventHandlers={{
                    click: () => { }
                  }}
                  icon={displayMarker() ? icon : noIcon}
                >
                  <Popup
                    position={[layerData.y, layerData.x]}
                    onOpen={() => {
                      setActivePointFeature(layerData)
                    }}
                    onClose={() => {
                      /*
                      if (activePointFeature &&
                          (activePointFeature.locationId === layerData.locationId)) {
                        
                      }
                      */
                      setActivePointFeature(null)
                    }}
                  >
                    <div>
                      <h5>
                        <span className='popuptitle'>{layerData.shortName}</span>
                      </h5>
                      <p>
                        <span className='popuptitle'>Id:</span>{' '}
                        {layerData.locationId}
                      </p>
                      <p>
                        <span className='popuptitle'>Longitude:</span> {layerData.x}
                      </p>
                      <p>
                        <span className='popuptitle'>Latitude:</span> {layerData.y}
                      </p>
                    </div>
                    <DropDownTimeSeries
                      ids={ids}
                      locationid={layerData.locationId}
                      timeSerieUrl={timeSerieUrl}
                      setTimeSerieUrl={setTimeSerieUrl}
                      setIsHidden={setIsHidden}
                    />
                    {/* <timeSeriesPlot data={data} /> */}
                  </Popup>
                </Marker>
                {
                  (layerData.polygon
                    ?
                      <Polygon
                        pathOptions={{
                          color: '#0000AA',
                          fillColor: '#7777FF',
                          fill: (activePointFeature && (activePointFeature.locationId === layerData.locationId)),
                          opacity: (activePointFeature && (activePointFeature.locationId === layerData.locationId)) ? 0.5 : 0
                        }}
                        positions={
                            JSON.parse(layerData.polygon).map((pol) => [
                              pol[1], pol[0]
                            ])
                          }
                        display='none'
                        filter={false}
                      />
                    :
                      <></>
                  )
                }
              </Fragment>
            )
          })}
        </LayerGroup>
      </LayersControl.Overlay>
    </>
  )
}

export default PointsLayer
