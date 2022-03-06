import React, { Fragment, useContext } from 'react'
import { LayersControl, LayerGroup, Polygon } from 'react-leaflet'

// import contexts
import VarsState from '../contexts/VarsState'
import varsStateLib from '../contexts/varsStateLib'


const displayPolygon = (polygonId, varsState) => {
  return ((varsStateLib.getContextFilterGeoId(varsState) === polygonId) ||
           varsStateLib.inMainMenuControlActiveTabOverview(varsState))
}


const isMultiPolygon = (polygon) => Array.isArray(polygon[0][0])


const revertPoint = (pointCoords) => [pointCoords[1], pointCoords[0]]


const revertPolygon = (polygon) => {
  if (!isMultiPolygon(polygon)) {
    return polygon.map(revertPoint)
  } else {
    return polygon.map((monoPolygon) => monoPolygon.map(revertPoint))
  }
}


const PolygonLayer = ({
  layerData,
  layerName,
  reversePolygon = false,
  color = '#069292',
  lineWidth = 2
}) => {
  /* ** SET HOOKS ****************************************************************************** */

  // retireves context data
  const { varsState } = useContext(VarsState)

  /* ** MAIN RENDER  *************************************************************************** */
  return (
    <>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          {
            layerData.map((poly) => {

              /* points in geojson are in [lat, lon] (or [y, x]) - need to be inverted */
              const polygon = (reversePolygon) ? revertPolygon(poly.polygon) : poly.polygon

              /* build polygons */
              return (
                (displayPolygon(poly.id, varsState) && polygon)
                  ? <Polygon
                      pathOptions={{
                        color: poly.lineColor ? poly.lineColor: color,
                        weight: poly.lineWidth ? poly.lineWidth: lineWidth
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
