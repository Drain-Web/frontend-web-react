import React, { useContext, useEffect, useRef } from "react";
import { DomEvent } from "leaflet";

// import contexts
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

// import CSS styles
import ownStyles from "../../style/MapLegend.module.css";

/* ** OBJ - Bootstrap div ******************************************************************** */

const MapLegend = ({ settings, position }) => {
  /* ** SET HOOKS **************************************************************************** */

  const { varsState, setVarState } = useContext(VarsState);

  const legendContent = "Content";

  const divRef = useRef(null);

  useEffect(() => {
    if (divRef.current !== null) {
      DomEvent.disableClickPropagation(divRef.current);
    }
  });

  /* ** MAIN RENDER ************************************************************************** */

  //
  if (!varsStateLib.getMapLegendVisibility(varsState)) {
    return <></>;
  }

  const allIconsUrl = varsStateLib.getMapLegendIcons(varsState).icons;
  const allIconsTitle = varsStateLib.getMapLegendIcons(varsState).titles;

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

  // containing div th
  return (
    <div className={`${ownStyles.mainContainer} leaflet-control`}>
      <strong>Legend</strong>
      <br />
      {varsStateLib.getMapLegendSubtitle(varsState)}
      <br />
      {allIcons}
    </div>
  );
};

export default MapLegend;
