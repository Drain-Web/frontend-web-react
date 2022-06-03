import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { apiUrl } from '../../../libs/api.js'
import { cloneDeep } from 'lodash';
import axios from 'axios'

// import contexts
import ConsCache from '../../contexts/ConsCache.js'
import consCacheLib from '../../contexts/consCacheLib'
import ConsFixed from '../../contexts/ConsFixed.js'
import VarsState from '../../contexts/VarsState'
import varsStateLib from '../../contexts/varsStateLib'

// import atoms
import atsVarStateLib from '../../atoms/atsVarStateLib.js';
import { atVarStateContext, atVarStateDomMapLegend, atVarStateDomMainMenuControl,
         atVarStateLocations } from '../../atoms/atsVarState.js'
import { useRecoilState } from 'recoil'

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

// same as 'fetcher', but includes extra info in response
async function fetcherWith (url, extra) {
  const jsonData = await fetcher(url)
  return new Promise((resolve, reject) => { resolve([jsonData, extra]) })
}

const IconsUniformSubform = ({ settings }) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  const [filterOptions, setFilterOptions] = useState(null)

  const [atomVarStateContext, setAtVarStateContext] = useRecoilState(atVarStateContext)
  const [atomVarStateDomMainMenuControl, setAtVarStateDomMainMenuControl] = useRecoilState(atVarStateDomMainMenuControl)
  const [atomVarStateLocations, setAtVarStateLocations] = useRecoilState(atVarStateLocations)
  const [atomVarStateDomMapLegend, setAtVarStateDomMapLegend] = useRecoilState(atVarStateDomMapLegend)

  // react on change
  useEffect(() => {
    // only triggers when "uniform" is selected

    if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== 'uniform') { return (null) }

    // define url to be called and skip call if this was the last URL called
    const urlTimeseriesRequest = apiUrl(
      settings.apiBaseUrl, 'v1', 'timeseries', {
        filter: atsVarStateLib.getContextFilterId(atomVarStateContext),
        showStatistics: true,
        onlyHeaders: true
      }
    )
    // if (filterOptions && (filterOptions.lastUrl === urlTimeseriesRequest)) { return (null) }

    // final response function: get data from consCache and update varsState
    const callbackFunc = (lastUrlRequest) => {
      const filterOptions = {
        lastUrl: lastUrlRequest,
        parameters: new Set(),
        parameterGroups: new Set(),
        modelInstances: new Set()
      }

      const filterId = atsVarStateLib.getContextFilterId(atomVarStateContext)
      const timeseriesIds = consCacheLib.getTimeseriesIdsInFilterId(filterId, consCache)
      const filteredTimeseries = Array.from(timeseriesIds).map((id) => {
        return consCacheLib.getTimeseriesData(id, consCache)
      })
      for (const curFilteredTimeseries of filteredTimeseries) {
        filterOptions.parameters.add(curFilteredTimeseries.header.parameterId)
        // TODO: add parameterGroups
        // TODO: add modelInstances
      }
      
      // varsStateLib.updateLocationIcons(varsState, consCache, consFixed, settings)

      const atmVarStateLocations = cloneDeep(atomVarStateLocations)
      const atmVarStateDomMapLegend = cloneDeep(atomVarStateDomMapLegend)
      
      atsVarStateLib.updateLocationIcons(atomVarStateDomMainMenuControl, atmVarStateLocations,
        atomVarStateContext, atmVarStateDomMapLegend, consCache, consFixed, settings)
      
      // apply setters
      setAtVarStateLocations(atmVarStateLocations)
      setAtVarStateDomMapLegend(atmVarStateDomMapLegend)

      setFilterOptions(filterOptions)
    }

    // call function after URL request, if needed

    if (!consCacheLib.wasUrlRequested(urlTimeseriesRequest, consCache)) {
      console.log('URL %s was not requested yet:', urlTimeseriesRequest, consCache)
      // request URL, update local states, update cache, access cache
      const extraArgs = {
        filterId: atsVarStateLib.getContextFilterId(atomVarStateContext),
        url: urlTimeseriesRequest
      }
      fetcherWith(urlTimeseriesRequest, extraArgs).then(([jsonData, extras]) => {
        consCacheLib.addUrlRequested(extras.url, consCache)
        jsonData.map((curTimeseries) => {
          consCacheLib.associateTimeseriesIdAndFilterId(curTimeseries.id, extras.filterId, consCache)
          consCacheLib.storeTimeseriesData(curTimeseries, consCache, consFixed)
          return null
        })
        callbackFunc(extras.url)
      })
    } else {
      callbackFunc(urlTimeseriesRequest)
    }
  }, [atsVarStateLib.getContextIconsType(atomVarStateContext), 
      atsVarStateLib.getContextFilterId(atomVarStateContext)])

  /* ** BUILD COMPONENT ********************************************************************** */

  if (atsVarStateLib.getContextIconsType(atomVarStateContext) !== 'uniform') { return (null) }

  if (!filterOptions) { return (<p>Loading...</p>) }

  // build options
  const allOptions = [(<option value={null} key='null'>No filter</option>)]
  allOptions.push.apply(allOptions, Array.from(filterOptions.parameters).map(
    (parameterId) => {
      const optValue = 'parameter.'.concat(parameterId)
      return (<option value={optValue} key={optValue}>{parameterId}</option>)
    }
  ))

  return (
    <Row>
      <Col>
        <FloatingLabel label='Filter by'>
          <Form.Control
            as='select'
            className='rounded-1'
            label='Filter by'
          >
            {allOptions}
          </Form.Control>
        </FloatingLabel>
      </Col>
    </Row>
  )
}

export default IconsUniformSubform
