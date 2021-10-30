import React, { useContext, useState } from 'react'

// import contexts
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

const IconsModelEvaluationSubform = ( ) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { varsState } = useContext(VarsState)

  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) != "evaluation") { return (null) }

  return (<div>Icons Model Evaluation Subform !</div>)
}

export default IconsModelEvaluationSubform
