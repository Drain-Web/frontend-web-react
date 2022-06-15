import React from 'react'
import { useRecoilValue } from "recoil";
import { Form } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

// import contexts
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext } from "../../atoms/atsVarState";


const IconsViewSelectBox = ( { onChange, label } ) => {
  /* ** SET HOOKS **************************************************************************** */

  // get atom
  const atomVarStateContext = useRecoilValue(atVarStateContext)  
  
  /* ** BUILD COMPONENT ********************************************************************** */

  return (
    <FloatingLabel label={label}>
      <Form.Control
        as='select'
        defaultValue={atsVarStateLib.getContextIconsType(atomVarStateContext)}
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
