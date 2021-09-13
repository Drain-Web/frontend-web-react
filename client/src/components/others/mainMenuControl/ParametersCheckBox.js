import React, { useContext } from 'react'
import { Form, FloatingLabel} from 'react-bootstrap'

import MapLocationsContext, { reviewMapLocationsContextData, 
  showThresholdValueSetsBySelectedParameters } from '../../contexts/MapLocationsContext'
import ownStyles from '../../../style/MainMenuControl.module.css'

/* Set of check boxes used to select to sub-filter out location icons
 */

export const ParametersCheckBox = () => {
  /* ** SET HOOKS ****************************************************************************** */

  // retireves context data
  const { mapLocationsContextData, setMapLocationsContextData } = useContext(MapLocationsContext)

  const parametersDict = mapLocationsContextData.byParameter
  if ((!parametersDict) || (!Object.keys(parametersDict).length)) {
    return <div className={'mb-2 h-auto '.concat(ownStyles['labeled-content'])}>Loading...</div>
  }

  /* ** FUNCTIONS ****************************************************************************** */

  const numLocations = (nLocations) => {
    /* simple function to create '(_ location[s])' string */
    const s = (nLocations === 1 ? '' : 's')
    return `(${nLocations} location${s})`
  }

  const groupOnChange = (evt) => {
    /* updates the LocationsContext with the new parameters */

    const parameterId = evt.target.attributes.parameter.nodeValue
    const parameterSelected = evt.target.checked

    //
    const newMapLocationsContextData = { ...mapLocationsContextData }
    const showParamLocations = (
      newMapLocationsContextData.showParametersLocations
        ? newMapLocationsContextData.showParametersLocations
        : new Set()
    )

    // update newMapLocationsContextData
    if (parameterSelected && !(showParamLocations.has(parameterId))) {
      showParamLocations.add(parameterId)
    } else if ((!parameterSelected) && showParamLocations.has(parameterId)) {
      showParamLocations.delete(parameterId)
    }
    newMapLocationsContextData.showParametersLocations = showParamLocations

    const pos = showThresholdValueSetsBySelectedParameters(
                  reviewMapLocationsContextData(newMapLocationsContextData))

    setMapLocationsContextData(pos)
  }

  /* ** BUILD COMPONENT ************************************************************************ */

  return (
    <FloatingLabel label='Parameters'>
      <div className='rounded-1 form-control pt-2 pb-0 h-auto'>
        <Form.Group className={'mb-2 h-auto '.concat(ownStyles['labeled-content'])} 
            onChange={groupOnChange}>
          {
            Object.entries(parametersDict).map(
              ([key, value]) => (
                <Form.Check
                  parameter={key}
                  key={key}
                  type='checkbox'
                  label={key.concat(' ', numLocations(parametersDict[key].length))}
                />
              )
            )
          }
        </Form.Group>
      </div>
    </FloatingLabel>
  )
}
