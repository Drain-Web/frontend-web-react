import React, { useContext, useState, useRef } from "react";
import { Button, CloseButton } from "react-bootstrap";

// import contexts
import ConsFixed from "../../contexts/ConsFixed";
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

// import CSS styles
import ownStyles from "../../../style/MainMenuControl.module.css";

const OpenCloseButton = ({ show }) => {
  /* ** SET HOOKS **************************************************************************** */
  const { consFixed } = useContext(ConsFixed);

  // Get global states and set local states
  const { varsState, setVarState } = useContext(VarsState);
  const [showMe, setShowMe] = useState(
    varsStateLib.getMainMenuControlShow(varsState)
  );

  const divRef = useRef(null);

  if (varsStateLib.getMainMenuControlShow(varsState)) {
    return (
      <div className="close-button">
        <CloseButton
          onClick={() => {
            varsStateLib.toggleMainMenuControl(varsState);
            setShowMe(varsStateLib.getMainMenuControlShow(varsState));
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="open-button">
        <Button
          onClick={() => {
            varsStateLib.hidePanelTabs(varsState);
            setVarState(Math.random());
          }}
        >
          Primary
        </Button>
      </div>
    );
  }
};

export default OpenCloseButton;
