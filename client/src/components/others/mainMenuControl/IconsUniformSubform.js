import React, { useContext } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { cloneDeep } from 'lodash';

// import contexts
import ConsCache from '../../contexts/ConsCache.js'
import ConsFixed from '../../contexts/ConsFixed.js'
import consCacheLib from '../../contexts/consCacheLib'

// import atoms
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext } from '../../atoms/atsVarState.js'
import { useRecoilState } from 'recoil';
import consFixedLib from '../../contexts/consFixedLib.js';

const ICON_TYPE = "uniform"


const IconsUniformSubform = ({ settings }) => {
  // ** SET HOOKS ******************************************************************************

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)

  const [ atomVarStateContext, setAtVarStateContext ] = useRecoilState(atVarStateContext)

  // ** BASIC CHECK ****************************************************************************

  if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== ICON_TYPE) { return (null) }

  // 
  const filterId = atsVarStateLib.getContextFilterId(atomVarStateContext)
  const timeseriesIds = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
  
  if (!timeseriesIds) { return (<p>Loading...</p>) }  // TODO: remove this hard-coded

  // ** ON-CLICK FUNCTIONS *********************************************************************

  const changeFilterBy = (selectedItem) => {
    // check if selected item is a parameter or a parameter group
    // TODO

    const selValue = selectedItem.target.value
    const filterValues = (selValue === 'null') ? new Set([]) : new Set([selValue])

    // update the atom
    const atmVarStateContext = cloneDeep(atomVarStateContext)
    atsVarStateLib.setContextIcons(ICON_TYPE, 
      {
        filterBy: 'parameter',
        filterValues: filterValues
      },
      atmVarStateContext)
    console.log("Set filter:", selValue)
    setAtVarStateContext(atmVarStateContext)
  } 

  // ** PREPARE COMPONENTS *********************************************************************

  // identify possible filters - create accumulater variable
  // lastUrl: lastUrlRequest,
  const filterOptions = {
    parameters: new Set(),
    parameterGroups: new Set(),
    modelInstances: new Set()
  }

  // identify possible filters - go through timeseries in the current filter
  const filteredTimeseries = Array.from(timeseriesIds).map((id) => {
    return consCacheLib.getTimeseriesData(id, consCache)
  })
  for (const curFilteredTimeseries of filteredTimeseries) {
    filterOptions.parameters.add(curFilteredTimeseries.header.parameterId)
    // TODO: add parameterGroups
    // TODO: add modelInstances
  }

  // ** BUILD COMPONENT ************************************************************************

  // if (!filterOptions) { return (<p>Loading...</p>) }

  // build options
  const allOptions = [(<option value={'null'} key='null'>No filter</option>)]
  allOptions.push.apply(allOptions, Array.from(filterOptions.parameters).map(
    (parameterId) => {
      const optValue = 'parameter.'.concat(parameterId)
      return (<option value={optValue} key={optValue}>
        { consFixedLib.getParameterData(parameterId, consFixed).shortName }
      </option>)
    }
  ))

  return (
    <Row><Col>
      <FloatingLabel label='Filter bye'>
        <Form.Control
            as='select'
            className='rounded-1'
            label='Filter bye'
            onChange={changeFilterBy}
            defaultValue={'null'}>
          {allOptions}
        </Form.Control>
      </FloatingLabel>
    </Col></Row>
  )
}

export default IconsUniformSubform
