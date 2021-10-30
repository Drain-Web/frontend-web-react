import React, { useContext, useState } from 'react'

// import contexts
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

const IconsModelsComparisonSubform = ( ) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { varsState } = useContext(VarsState)

  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) != "comparison") { return (null) }
  
  return (<div>Icons Models Comparison Subform !</div>)
}

export default IconsModelsComparisonSubform
