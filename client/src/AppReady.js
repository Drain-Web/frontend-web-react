import React, { useContext } from "react";
import { MapContainer } from "react-leaflet";

// import lib
import VarsStateManager from "./components/logic/VarsStateManager";

// import contexts
import ConsFixed from "./components/contexts/ConsFixed";

// import components
import GetZoomLevel from "./components/others/GetZoomLevel";
import MapControler from "./components/others/MapControler";

const AppReady = ({ settings }) => {

  // ** SET HOOKS ******************************************************************************

  const { consFixed } = useContext(ConsFixed)

  // ** MAIN RENDER ****************************************************************************

  return (
    <>
      <VarsStateManager settings={settings} consFixed={consFixed} />
      <MapContainer zoomControl={false}>

        <GetZoomLevel />
        
        <MapControler settings={settings} />
      </MapContainer>
    </>
  )

}

export default AppReady