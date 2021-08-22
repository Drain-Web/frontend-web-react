import React, { Fragment, useContext } from 'react'
import { LayersControl, LayerGroup, Polygon } from 'react-leaflet'
import FilterContext from '../contexts/FilterContext'

let polygon

const PolygonLayer = ({
  layerData,
  layerName,
  reversePolygon = false,
  color = '#069292'
}) => {
  /* ** SET HOOKS ****************************************************************************** */

  // retireves context data
  const { filterContextData } = useContext(FilterContext)

  /* ** MAIN RENDER  *************************************************************************** */
  return (
    <>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          {
            layerData.map((poly) => {
              /* points in geojson are in [lat, lon] (or [y, x]) - need to be inverted */
              if (reversePolygon) {
                polygon = Array.from(poly.polygon.values()).map((pol) => [
                  pol[1], pol[0]
                ])
              } else {
                polygon = Array.from(poly.polygon.values())
              }

              const displayPolygon = () => {
                return ((filterContextData.geoFilterId === poly.id) ||
                         filterContextData.inOverview) // false
              }

              /* build polygons */
              return (
                (displayPolygon() && polygon)
                  ? <Polygon
                      pathOptions={{
                        color: color,
                        fillColor: null
                      }}
                      positions={polygon}
                      key={poly.id}
                      filter={false}
                    />
                  : <Fragment key={poly.id} />
              )
            })
          }
        </LayerGroup>
      </LayersControl.Overlay>
    </>
  )
}

export default PolygonLayer
