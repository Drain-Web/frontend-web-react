import React, { useEffect, useRef } from "react";
import { DomEvent } from "leaflet";
import { useRecoilValue } from "recoil";

// import atorms
import atsVarStateLib from "../atoms/atsVarStateLib";
import { atVarStateDomMapLegend } from "../atoms/atsVarState";

// import CSS styles
import ownStyles from "../../style/MapLegend.module.css";

// ** OBJ - Bootstrap div **********************************************************************

const MapLegend = ({ settings, position }) => {
  // ** SET HOOKS ******************************************************************************

  const atomVarStateDomMapLegend = useRecoilValue(atVarStateDomMapLegend)

  const divRef = useRef(null);
  useEffect(() => {
    if (divRef.current !== null) { 
      DomEvent.disableClickPropagation(divRef.current);
    }
  });

  // ** MAIN RENDER ****************************************************************************

  //
  if (!atsVarStateLib.getMapLegendVisibility(atomVarStateDomMapLegend)) {
    return <></>;
  }

  const allIconsUrl = atsVarStateLib.getMapLegendIcons(atomVarStateDomMapLegend).icons;
  const allIconsTitle = atsVarStateLib.getMapLegendIcons(atomVarStateDomMapLegend).titles;

  //
  const allIcons = [];
  allIconsUrl.forEach((iconUrl, i) => {
    const iconTitle = allIconsTitle[i];
    allIcons.push(
      <div key={iconTitle}>
        <img src={iconUrl} />
        <span>{iconTitle}</span>
        <br />
      </div>
    );
  });

  // containing div
  return (
    <div className={`${ownStyles.mainContainer} leaflet-control`}>
      <strong>Legend</strong>
      <br />
      {atsVarStateLib.getMapLegendSubtitle(atomVarStateDomMapLegend)}
      <br />
      {allIcons}
    </div>
  );
};

export default MapLegend;
