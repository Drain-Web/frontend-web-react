import React, { useContext, useState } from 'react'

// import contexts
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

const IconsAlertsSubform = ( ) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { varsState } = useContext(VarsState)

  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) != "alerts") { return (null) }

  return (<div>Icons Alerts Subform !</div>)
}

export default IconsAlertsSubform
