import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import { apiUrl } from "../../../libs/api.js"
import axios from "axios"

// import contexts
import VarsState from "../../contexts/VarsState";
import varsStateLib from "../../contexts/varsStateLib";

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data);


const IconsUniformSubform = ({ onChangeFilter, settings }) => {
  /* ** SET HOOKS **************************************************************************** */

  // Get global states and set local states
  const { varsState } = useContext(VarsState)
  const [filterOptions, setFilterOptions] = useState(null)

  // react on change
  useEffect(() => {

    // only triggers when "uniform" is selected
    if (varsStateLib.getContextIconsType(varsState) != "uniform") { return (null) }
    
    // define url to be called and skip call if this was the last URL called
    const urlTimeseriesRequest = apiUrl(
      settings.apiBaseUrl, "v1", "timeseries",
      {
        filter: varsStateLib.getContextFilterId(varsState),
        showStatistics: true,
        onlyHeaders: true
      }
    )
    if (filterOptions && (filterOptions['lastUrl'] === urlTimeseriesRequest)) {return (null)}

    // so we request URL and update state
    fetcher(urlTimeseriesRequest).then((jsonData) => {
      const filteredTimeseries = jsonData
      const filterOptions = {
        "lastUrl": urlTimeseriesRequest,
        "parameters": new Set(),
        "parameterGroups": new Set(),
        "modelInstances": new Set()
      }
      for (const curFilteredTimeseries of filteredTimeseries) {
        // console.log('Location:', curFilteredTimeseries.header.location_id)
        filterOptions["parameters"].add(curFilteredTimeseries.header.parameterId)
      }
      setFilterOptions(filterOptions)
    })

    // TODO: update ConsCache
    
    console.log('Requested URL.')
  }, [varsStateLib.getContextIconsType(varsState), varsStateLib.getContextFilterId(varsState)])


  /* ** BUILD COMPONENT ********************************************************************** */

  if (varsStateLib.getContextIconsType(varsState) != "uniform") { return (null) }

  if (!filterOptions) { return (<p>Loading...</p>) }

  // build options
  const allOptions = [(<option value={null} key='null'>No filter</option>)]
  allOptions.push.apply(allOptions, Array.from(filterOptions["parameters"]).map(
    (parameterId) => {
      const optValue = "parameter.".concat(parameterId)
      return (<option value={optValue} key={optValue}>{parameterId}</option>)
    }
  ))

  return (<>
    <Row><Col>
      <FloatingLabel label='Filter by'>
        <Form.Control
          as='select'
          onChange={onChangeFilter}
          className='rounded-1'
          label='Filter by'
        >
          {allOptions}
        </Form.Control>
      </FloatingLabel>
    </Col></Row>
    <Row><Col>

    </Col></Row>
  </>)
}

export default IconsUniformSubform
