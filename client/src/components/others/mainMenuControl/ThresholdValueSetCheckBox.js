import React, { useContext } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'

import MapLocationsContext from '../../contexts/MapLocationsContext'

export const ThresholdValueSetCheckBox = () => {
  /* ** SET HOOKS ****************************************************************************** */

  const { mapLocationsContextData, setMapLocationsContextData } = useContext(MapLocationsContext)

  /* ** OTHERS ********************************************************************************* */

  const threshValueSetDict = mapLocationsContextData.byThresholdValueSet

  // shows options
  const allOptions = [(<option value='raw' key='raw'>Simple locations</option>)]
  if ((threshValueSetDict) && (Object.keys(threshValueSetDict).length > 0)){
    allOptions.push.apply(allOptions, Object.entries(threshValueSetDict).map(
      ([key, value]) => {
        return (value.showAsOption ? <option valye={key} key={key}>{key}</option> : null)
      }
    ))
  }

  /* ** MAIN RENDER **************************************************************************** */
  return(
    <FloatingLabel label='Icons'>
      <Form.Control
        as='select'
        defaultValue='raw'
        onChange={() => { console.log('Changed select!') }}
        className='rounded-1'
        label='Icons'
      >
        { allOptions }
      </Form.Control>
    </FloatingLabel>
  )
}

// <option value='raw' key='raw'>Simple locations</option>