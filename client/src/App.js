import React, { useState } from "react";
import "regenerator-runtime/runtime";
import axios from "axios";
import useSWR from "swr";

// import custom components
import AppOnLoad from "./AppOnLoad";

// import recoil to replace contexts
import { RecoilRoot } from "recoil";

// import CSS styles
import "style/bootstrap.min.css";
import "leaflet/dist/leaflet.css";
import "./App.css";

/* ** FUNCTIONS ******************************************************************************** */

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);

//
const getMapCenter = (mapExtent) => {
  return {
    x: (mapExtent.right + mapExtent.left) / 2,
    y: (mapExtent.top + mapExtent.bottom) / 2,
  };
};

/* ** REACT COMPONENTS ************************************************************************* */

const App = () => {
  /* ** SET HOOKS ****************************************************************************** */

  // read app settings
  const settings = useState({})[0];
  const { data: dataSettings, error: errorSettings } = useSWR(
    "settings.json",
    fetcher
  );

  /* ** SUB RENDER ***************************************************************************** */

  // only render base object when the response from 'settings.json' is available

  let content = null
  if (dataSettings && !errorSettings) {
    
    // copy the returned data into state 'settings'
    for (const i in dataSettings) settings[i] = dataSettings[i];  // TODO: use setState instead?

    // content = (<div>Should load AppWithSettings</div>)
    content = (<AppOnLoad settings={settings} />)

  } else {
    content = (<div>Load basic settings...</div>)

  }

  /* ** MAIN RENDER  *************************************************************************** */
    
  return (
    <RecoilRoot>
      {content}
    </RecoilRoot>
  );
};

export default App;
