import React, { useContext, useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import axios from "axios"
import { apiUrl } from "../../../libs/api.js"

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

  /* ** SET HOOKS **************************************************************************** */

  // react on change
  useEffect(() => {
    console.log('Changed IconType to:', varsState['context']['icons']['iconType'], '(get)')
  }, [varsStateLib.getContextIconsType(varsState)])

  /* ** SET HOOKS **************************************************************************** */

  const urlTimeseriesRequest = apiUrl(
    settings.apiBaseUrl,
    "v1",
    "timeseries",
    {
      filter: varsStateLib.getContextFilterId(varsState),
      showStatistics: true,
      onlyHeaders: true
    }
  );

  // get the options for parameters, parameter groups or module instance ids
  fetcher(urlTimeseriesRequest).then((jsonData) => {
    const filteredTimeseries = jsonData
    const filterOptions = {
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
