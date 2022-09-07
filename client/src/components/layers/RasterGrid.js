import { LayersControl, TileLayer } from 'react-leaflet'
import { useRecoilValue } from 'recoil';
import React from 'react'

// atoms
/*
import atsVarStateLib from '../atoms/atsVarStateLib';
import { atVarStateRasterGridAnimation, atVarStateVectorGridAnimation } from
  '../atoms/atsVarState';
*/


/* ** INFO ************************************************************************************* */
//
// Adds a multitile raster. Follows BaseLayers structure.


/* ** CONSTANTS ******************************************************************************** */

// TODO: replace the constants 'AVAILABLE_DATETIMES', 'BASE_URL_1', 'BASE_URL_2' by dynamic values
const AVAILABLE_DATETIMES = ["evt041_20130708_2030_ldtime-04",
                             "evt041_20130708_2115_ldtime-08",
                             "evt041_20130708_2200_ldtime-12",
                             "evt041_20130708_2315_ldtime-16"];
const BASE_URL_1 = "https://wb-trca-api.herokuapp.com/v1dw/multitiles_server/"
const BASE_URL_2 = "/{z}/{x}/{y}"


/* ** MAIN COMPONENT *************************************************************************** */
const RasterGrid = ({ layerName, tilesUrl, zIdx1st, zIdx2nd, key1st, key2nd })  => {

  /* ** SET HOOKS ****************************************************************************** */

  // const atomVarStateRasterGridAnimation = useRecoilValue(atVarStateRasterGridAnimation)
  // const atomVarStateVectorGridAnimation = useRecoilValue(atVarStateVectorGridAnimation)

  /* ** LOGIC ********************************************************************************** */

  // define new to show
  /*
  const imageTimeIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(
    atomVarStateVectorGridAnimation) % AVAILABLE_DATETIMES.length
  const curTileUrl = BASE_URL_1 + AVAILABLE_DATETIMES[imageTimeIdx] + BASE_URL_2

  const k1st = `tileLayer1st{atomVarStateRasterGridAnimation.currentFrame1stZindex}`
  const k2nd = `tileLayer1st{atomVarStateRasterGridAnimation.currentFrame2ndZindex}`

  console.log("Tiles URL:", curTileUrl)
  console.log(" -", atomVarStateRasterGridAnimation.currentFrame1stZindex, k1st)
  console.log(" =", atomVarStateRasterGridAnimation.currentFrame2ndZindex, k2nd)
  */

  /* ** MAIN RENDER **************************************************************************** */

  // maxNativeZoom={baseLayer.maxNativeZoom}
  // attribution={baseLayer.attribution}
  // <TileLayer url={tilesUrl} />
  // <TileLayer url={curTilesUrl} />
  return (
    <LayersControl.Overlay checked name={layerName}>
      <TileLayer url={tilesUrl} zIndex={zIdx1st} key={key1st} />
      <TileLayer url={tilesUrl} zIndex={zIdx2nd} key={key2nd} />
    </LayersControl.Overlay>
  )
}

export default RasterGrid