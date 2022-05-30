import React, { useState } from "react";
import { useRecoilValue } from "recoil";

// import custom components
import AppLoading from "./components/others/AppLoading";
import AppOnInit from "./AppOnInit";

// import contexts
import ConsCache from "./components/contexts/ConsCache";
import ConsFixed from "./components/contexts/ConsFixed";

// import contexts
import { atVarStateContext } from "./components/atoms/atsVarState";

// import libs
import appLoad from "./libs/appLoad.js";

const AppOnLoad = ({ settings }) => {
  // ** SET HOOKS ******************************************************************************

  // Contexts
  const consCache = useState(ConsCache._currentValue.consCache)[0];
  const consFixed = useState(appLoad.loadConsFixed(settings))[0];

  const atomVarStateContext = useRecoilValue(atVarStateContext)

  // ** MAIN RENDER ****************************************************************************

  if (appLoad.isStillLoadingConsFixed(consFixed)) {
    // still loading
    return (<AppLoading />);
  
  } else  {
    // loaded
    return (
      <ConsFixed.Provider value={{ consFixed }}>
        <ConsCache.Provider value={{ consCache }}>
          <AppOnInit settings={settings} />
        </ConsCache.Provider>
      </ConsFixed.Provider>
    );

  }
}

export default AppOnLoad;
