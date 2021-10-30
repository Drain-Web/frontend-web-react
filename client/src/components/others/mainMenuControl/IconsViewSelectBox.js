import React, { useContext, useState } from 'react'
import { Form } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

// import contexts
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

const IconsViewSelectBox = ( { onChange, label } ) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { varsState } = useContext(VarsState)
  
  /* ** BUILD COMPONENT ********************************************************************** */

  return (
    <FloatingLabel label={label}>
      <Form.Control
        as='select'
        defaultValue={varsStateLib.getContextIconsType(varsState)}
        onChange={onChange}
        className='rounded-1'
        label={label}
      >
        <option value='uniform'>Default</option>
        <option value='alerts'>State</option>
        <option value='evaluation'>Model Evaluation</option>
        <option value='competition'>Model Competition</option>
        <option value='comparison'>Model Comparison</option>
      </Form.Control>
    </FloatingLabel>
  )
}

export default IconsViewSelectBox
