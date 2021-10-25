import React, { useContext, useState } from 'react'
import { Spinner } from 'react-bootstrap'

// import context
import ConsFixed from "../../components/contexts/ConsFixed";

// import libs
import appLoad from '../../libs/appLoad.js'

// function for defining the 'loading' or 'loaded' message
const wasLoaded = (k, v) => {
  const pre = "  -  " + k
  return (<>{pre}: {appLoad.isStillLoadingConsFixedValue(v) ? '...' : 'loaded.'}<br /></>)
}

const AppLoading = () => {
  /* ** SET HOOKS **************************************************************************** */

  const { consFixed } = useContext(ConsFixed)

  /* ** MAIN RENDER ************************************************************************** */
  return (
    <div>
      Loading...<br />
      {wasLoaded('regions', consFixed['region'])}
      {wasLoaded('boundaries', consFixed['boundaries'])}
      {wasLoaded('filters', consFixed['filters'])}
      {wasLoaded('locations', consFixed['locations'])}
      {wasLoaded('threshold groups', consFixed['thresholdGroups'])}
      {wasLoaded('threshold value sets', consFixed['thresholdValueSets'])}
      {wasLoaded('parameters', consFixed['parameters'])}
      {wasLoaded('parameter groups', consFixed['parameterGroups'])}
      <br />
      <Spinner
        animation="border"
        variant="danger"
        role="status"
        style={{
          width: "400px",
          height: "400px",
          margin: "auto",
          display: "block",
        }}
      />
    </div>
  );
}

export default AppLoading
