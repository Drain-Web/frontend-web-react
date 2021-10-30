import React, { useContext, useState } from 'react'

// import contexts
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

const IconsModelsCompetitionSubform = ( ) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { varsState } = useContext(VarsState)

  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) != "competition") { return (null) }
  
  return (<div>Icons Models Competition Subform !</div>)
}

export default IconsModelsCompetitionSubform
