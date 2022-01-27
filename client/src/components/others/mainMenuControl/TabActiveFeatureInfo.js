import React, { useContext, useState } from "react";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { apiUrl } from "../../../libs/api.js";

// import contexts
import varsStateLib from "../../contexts/varsStateLib";
import VarsState from "../../contexts/VarsState";

export const TabActiveFeatureInfo = ({ settings }) => {
  // get context
  const { varsState, setVarState } = useContext(VarsState);
  const activeLocation = varsStateLib.getActiveLocation(varsState);

  const [isOpen, setIsOpen] = useState(false);

  const handleShowDialog = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {activeLocation ? (
        <div>
          <h5>
            <span className="popuptitle">{activeLocation.shortName}</span>
          </h5>
          <p>
            <span className="popupsubtitle">Id: </span>
            <span className="popuptext">{activeLocation.locationId}</span>
          </p>
          <p>
            <span className="popupsubtitle">Longitude: </span>
            <span className="popuptext">{activeLocation.x}</span>
          </p>
          <p>
            <span className="popupsubtitle">Latitude: </span>
            <span className="popuptext">{activeLocation.y}</span>
          </p>
          {!varsStateLib.inMainMenuControlActiveTabOverview(varsState) ? (
            <Button
              variant="primary"
              onClick={() => {
                const timeseriesUrl = apiUrl(
                  settings.apiBaseUrl,
                  "v1",
                  "timeseries",
                  {
                    filter: varsStateLib.getContextFilterId(varsState),
                    location: activeLocation.locationId,
                  }
                );
                varsStateLib.showPanelTabs(varsState);
                varsStateLib.setTimeSerieUrl(timeseriesUrl, varsState);
                setVarState(Math.random());
              }}
            >
              <Spinner as="span" size="sm" role="status" aria-hidden="true" />
              Plot event
            </Button>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <div className="popuptext tutorial">
          Click on a location icon to get more information.
          <img
            className="img"
            src="img/tutorial.gif"
            alt=""
            onClick={() => {
              handleShowDialog();
            }}
          />
          {isOpen && (
            <dialog
              className="dialog"
              style={{ position: "absolute" }}
              open
              onClick={() => {
                handleShowDialog();
              }}
            >
              <img
                className="image"
                src="img/tutorial.gif"
                onClick={() => {
                  handleShowDialog();
                }}
                alt="no image"
              />
            </dialog>
          )}
        </div>
      )}
    </>
  );
};
