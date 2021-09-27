import React, { useContext } from 'react'
import { Form, FloatingLabel } from 'react-bootstrap'

import MapLocationsContext from '../../contexts/MapLocationsContext'

export const ThresholdGroupSelectBox = ({ thresholdGroups, onChangeFunction }) => {
  /* ** SET HOOKS **************************************************************************** */

  const { mapLocationsContextData, setMapLocationsContextData } = useContext(MapLocationsContext)

  /* ** SHOW NOTHING IF ABOVE NOT LOADED ***************************************************** */

  const parametersDict = mapLocationsContextData.byParameter
  if ((!parametersDict) || (!Object.keys(parametersDict).length)) {
    return <></>
  }

  /* ** CHECK IF ONLY ONE PARAMETER WAS SELECTED ********************************************* */

  const selectedParams = mapLocationsContextData.showParametersLocations

  /* ** OTHERS ******************************************************************************* */

  const byParametersDict = mapLocationsContextData.thresholdGroups.byParameter

  // shows options, 
  const allOptions = [(<option value='default' key='default'>Just locations</option>)]
  if ((selectedParams) && (selectedParams.size == 1)) {
    const selectedParamId = selectedParams.values().next().value
    if (selectedParamId in byParametersDict) {
      const byParams = byParametersDict[selectedParamId]
      allOptions.push.apply(allOptions, Object.entries(byParams).map(
        ([key, value]) => {
          return (<option value={key} key={key}>{thresholdGroups[key].name}</option>)
        }
      ))
    } else {
      alert("ISSUE: check log")
      console.log("Not found:", selectedParamId)
      console.log("       in:", byParametersDict)
    }
  }

  /* ** MAIN RENDER ************************************************************************** */
  // onChange={(evt) => { console.log('Selected:', evt.target.value) }}
  return (
    <FloatingLabel label='Icons - Thresh Groups'>
      <Form.Control
        as='select'
        defaultValue='raw'
        onChange={onChangeFunction}
        className='rounded-1'
        label='Icons'
      >
        {allOptions}
      </Form.Control>
    </FloatingLabel>
  )
}