import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { apiUrl } from "../../../libs/api.js";
import { useRecoilState, useRecoilValue } from "recoil";
import { cloneDeep } from "lodash";

// import contexts
import atsVarStateLib from "../../atoms/atsVarStateLib.js";
import { atVarStateActiveLocation, atVarStateContext, atVarStateDomTimeseriesPanel,
         atVarStateDomTimeSeriesData, atVarStateDomMainMenuControl}
  from "../../atoms/atsVarState";


const getInstructionsDiv = (isOpen, setIsOpen) => {
  //

  const handleShowDialog = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="popuptext tutorial">
      Click on a location icon to get more information.
      <img
        className="img"
        src="img/tutorial.gif"
        alt=""
        onClick={handleShowDialog}
      />
      {isOpen && (
        <dialog
          className="dialog"
          style={{ position: "absolute" }}
          open
          onClick={handleShowDialog}
        >
          <img
            className="image"
            src="img/tutorial.gif"
            onClick={handleShowDialog}
            alt="no image"
          />
        </dialog>
      )}
    </div>
  )
}

//
const getLocationInfoDiv = (activeLocation, settings, atomVarStateContext, 
                            atmVarStateDomTimeseriesPanel, setAtVarStateDomTimeseriesPanel,
                            atmVarStateDomTimeSeriesData, setAtVarStateDomTimeSeriesData,
                            atVarStateDomMainMenuControl) => {
  //

  const onButtonClick = () => {
    const timeseriesUrl = apiUrl(
      settings.apiBaseUrl,
      'v1',
      'timeseries',
      {
        filter: atsVarStateLib.getContextFilterId(atomVarStateContext),
        location: activeLocation.locationId
      }
    )

    // show panel tab
    atsVarStateLib.showPanelTabs(atmVarStateDomTimeseriesPanel)
    setAtVarStateDomTimeseriesPanel(atmVarStateDomTimeseriesPanel)
    
    // put url to load
    atsVarStateLib.setTimeSerieUrl(timeseriesUrl, atmVarStateDomTimeSeriesData)
    setAtVarStateDomTimeSeriesData(atmVarStateDomTimeSeriesData)
  }

  const getButtonObj = () => {
    return (
      <Button variant='primary' onClick={onButtonClick}>
        <Spinner as='span' size='sm' role='status' aria-hidden='true' />
        Plot event!
      </Button>
    )
  }

  return (
    <div>
      <h5>
        <span className='popuptitle'>{activeLocation.shortName}</span>
      </h5>
      <p>
        <span className='popupsubtitle'>Id: </span>
        <span className='popuptext'>{activeLocation.locationId}</span>
      </p>
      <p>
        <span className='popupsubtitle'>Longitude: </span>
        <span className='popuptext'>{activeLocation.x}</span>
      </p>
      <p>
        <span className='popupsubtitle'>Latitude: </span>
        <span className='popuptext'>{activeLocation.y}</span>
      </p>
      {
        !(atsVarStateLib.getLastActiveTab(atVarStateDomMainMenuControl) === 'tabOverview') ?
          getButtonObj() :
          (<></>)
      }
    </div>
  )
}

// 
export const TabActiveFeatureInfo = ({ settings }) => {
  // ** SET HOOKS ******************************************************************************

  // get atoms
  const atomVarStateDomMainMenuControl = useRecoilValue(atVarStateDomMainMenuControl)
  const atomVarStateActiveLocation = useRecoilValue(atVarStateActiveLocation)
  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
  const [atomVarStateDomTimeseriesPanel, setAtVarStateDomTimeseriesPanel] = useRecoilState(atVarStateDomTimeseriesPanel)
  const [atomVarStateDomTimeSeriesData, setAtVarStateDomTimeSeriesData] = useRecoilState(atVarStateDomTimeSeriesData)

  // internal state
  const [isOpen, setIsOpen] = useState(false)

  const atmVarStateDomTimeseriesPanel = cloneDeep(atomVarStateDomTimeseriesPanel)
  const atmVarStateDomTimeSeriesData = cloneDeep(atomVarStateDomTimeSeriesData)

  // ** MAIN RENDER  ***************************************************************************
  if (atomVarStateActiveLocation) {
    return getLocationInfoDiv(atomVarStateActiveLocation, settings, atomVarStateContext,
                              atmVarStateDomTimeseriesPanel, setAtVarStateDomTimeseriesPanel,
                              atmVarStateDomTimeSeriesData, setAtVarStateDomTimeSeriesData,
                              atomVarStateDomMainMenuControl)
  } else {
    return getInstructionsDiv(isOpen, setIsOpen)
  }
}
