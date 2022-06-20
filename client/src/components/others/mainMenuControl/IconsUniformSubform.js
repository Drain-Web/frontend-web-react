import React, { useContext } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'

// import contexts
import ConsCache from '../../contexts/ConsCache.js'
import consCacheLib from '../../contexts/consCacheLib'

// import atoms
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext } from '../../atoms/atsVarState.js'
import { useRecoilValue } from 'recoil';


const IconsUniformSubform = ({ settings }) => {
  // ** SET HOOKS ******************************************************************************

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)

  const atomVarStateContext = useRecoilValue(atVarStateContext)

  // ** BASIC CHECK ****************************************************************************

  if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== 'uniform') { return (null) }

  // 
  const filterId = atsVarStateLib.getContextFilterId(atomVarStateContext)
  const timeseriesIds = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
  
  if (!timeseriesIds) { return (<p>Loading...</p>) }  // TODO: remove this hard-coded

  // ** SOME LOGIC *****************************************************************************

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
  const allOptions = [(<option value={null} key='null'>No filter</option>)]
  allOptions.push.apply(allOptions, Array.from(filterOptions.parameters).map(
    (parameterId) => {
      const optValue = 'parameter.'.concat(parameterId)
      return (<option value={optValue} key={optValue}>{parameterId}</option>)
    }
  ))

  return (
    <Row><Col>
      <FloatingLabel label='Filter by'>
        <Form.Control
          as='select'
          className='rounded-1'
          label='Filter by'>
            {allOptions}
        </Form.Control>
      </FloatingLabel>
    </Col></Row>
  )
}

export default IconsUniformSubform
