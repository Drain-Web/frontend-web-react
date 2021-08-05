import React from 'react'
import { LayersControl, LayerGroup, Polygon } from 'react-leaflet'

let polygon

const PolygonLayer = ({
  layerData,
  layerName,
  reversePolygon = false,
  color = '#069292'
}) => {
  return (
    <>
      <LayersControl.Overlay checked name={layerName}>
        <LayerGroup name={layerName}>
          {
            /* points in geojson are in [lat, lon] (or [y, x]) - need to be inverted */

            layerData.map((poly) => {
              if (reversePolygon) {
                polygon = Array.from(poly.polygon.values()).map((pol) => [
                  pol[1],
                  pol[0]
                ])

                return (
                  <Polygon
                    pathOptions={{
                      color: color,
                      fillColor: null
                    }}
                    positions={polygon}
                    key={poly.id}
                  />
                )
              } else {
                polygon = Array.from(poly.polygon.values())

                return (
                  <Polygon
                    pathOptions={{
                      color: color,
                      fillColor: null
                    }}
                    positions={polygon}
                    key={poly.id}
                  />
                )
              }
            })
          }
        </LayerGroup>
      </LayersControl.Overlay>
    </>
  )
}

export default PolygonLayer
