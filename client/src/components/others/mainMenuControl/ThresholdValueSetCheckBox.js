import React, { useContext } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'

import MapLocationsContext from '../../contexts/MapLocationsContext'

export const ThresholdValueSetCheckBox = ({ thresholdValueSets }) => {
  /* ** SET HOOKS ****************************************************************************** */

  const { mapLocationsContextData, setMapLocationsContextData } = useContext(MapLocationsContext)

  /* ** SHOW NOTHING IF ABOVE NOT LOADED ******************************************************* */

  const parametersDict = mapLocationsContextData.byParameter
  if ((!parametersDict) || (!Object.keys(parametersDict).length)) {
    return <></>
  }

  /* ** OTHERS ********************************************************************************* */

  const threshValueSetDict = mapLocationsContextData.byThresholdValueSet

  // shows options
  const allOptions = [(<option value='raw' key='raw'>Simple locations</option>)]
  if ((threshValueSetDict) && (Object.keys(threshValueSetDict).length > 0)){
    allOptions.push.apply(allOptions, Object.entries(threshValueSetDict).map(
      ([key, value]) => {
        const tValSet = thresholdValueSets[key].name
        return (value.showAsOption ? <option value={key} key={key}>{tValSet}</option> : null)
      }
    ))
  }

  /* ** MAIN RENDER **************************************************************************** */
  return(
    <FloatingLabel label='Icons - Thresh Value Set'>
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
