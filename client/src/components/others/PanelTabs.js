import React, { Suspense, useEffect, useRef, useContext } from "react";
import Draggable from "react-draggable";
import { DomEvent } from "leaflet";
import Spinner from "react-bootstrap/Spinner";
import { Tab, Tabs } from "react-bootstrap";
import { apiUrl } from "../../libs/api.js";
import { Scrollbars } from "react-custom-scrollbars";
import axios from "axios";

// import components
import LoadTimeSeriesData from "./plots/LoadTimeSeriesData";
import TimeSeriesPlot from "./plots/TimeSeriesPlot";
import CloseButton from "react-bootstrap/CloseButton";
import MetricsTable from "./MetricsTable";

// import contexts
import ConsCache from '../contexts/ConsCache.js'
import consCacheLib from '../contexts/consCacheLib'
import ConsFixed from '../contexts/ConsFixed.js'
import VarsState from "../contexts/VarsState";
import varsStateLib from "../contexts/varsStateLib";

// import styles
import "../../style/Panel.css";

// function 'fetcher' will do HTTP requests
const fetcher = (url) => axios.get(url).then((res) => res.data)

// same as 'fetcher', but includes extra info in response
async function fetcherWith (url, extra) {
  const jsonData = await fetcher(url)
  return new Promise((resolve, reject) => { resolve([jsonData, extra]) })
}

/* Panel open with the list of timeseries of a Location to be plot and the timeseries plot
 * Referenced by MapControler.
 */

//
const showLoading = () => {
  return (
    <div className="loading-spinner">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  )
}

//
const showTimeseriesPlot = (parameterGroupId, varsState) => {
  const tsData = varsState.domObjects.timeSeriesData
  return (
    <TimeSeriesPlot
      plotData={tsData.plotData[parameterGroupId]}
      plotArray={tsData.plotArrays[parameterGroupId]}
      availableVariables={tsData.availableVariables[parameterGroupId]}
      unitsVariables={tsData.unitsVariables[parameterGroupId]}
      thresholdsArray={tsData.thresholdsArray[parameterGroupId]}
    />
  )
}

//
const metricMatrixTab = (id, consCache) => {
  // wrapping function to create Tab object
  const wrapTab = (tabInnerContent) => (
    <Tab eventKey={'Metrics' + id} title={'Metrics' + id}>
      {tabInnerContent}
    </Tab>
  )

  // check anything was requested
  const lastUrlRequested = consCacheLib.getEvaluationsLastRequestUrl(consCache)
  if (!lastUrlRequested) {
    return wrapTab((<div>No URL requested.</div>))
  }

  // check we have content
  const urlRequestedContent = consCacheLib.getEvaluationsResponseData(lastUrlRequested, consCache)
  if (!urlRequestedContent) {
    return wrapTab(showLoading())
  }

  // return content tabled
  return wrapTab((
    <MetricsTable timeSeriesMetrics={{
      evaluations: urlRequestedContent
    }}/>
  ))
}

//
const timeseriesTab = (parameterGroupId, varsState) => {
  return (
    <Tab
      eventKey={parameterGroupId}
      title={parameterGroupId}
      key={parameterGroupId}
    >
      {showTimeseriesPlot(parameterGroupId, varsState)}
    </Tab>
  );
}

//
const listMetrics = (settings) => {
  /*
   * settings: Full settings data
   * returns: list of metric names
   */

  const evalDict = settings.locationIconsOptions.evaluation
  if (!evalDict) { return null }

  // remove items meta-entries
  const allMetrics = Object.keys(evalDict.options)
  for (let i = allMetrics.length - 1; i >= 0; i--) {
    if (allMetrics[i].charAt(0) === '_') { allMetrics.pop(i) }
  }

  return allMetrics
}

//
const listMetricsAndParameters = (settings) => {
  // basic check
  const evalDict = settings.locationIconsOptions.evaluation
  if (!evalDict) { return null }

  //
  const retDict = {}
  for (const curMetricId of Object.keys(evalDict.options)) {
    if (curMetricId.charAt(0) === '_') { continue } // ignore meta

    const curMetricDict = evalDict.options[curMetricId]

    for (const curParameterGroupId of Object.keys(curMetricDict.parameterGroups)) {
      if (curParameterGroupId in retDict) {
        console.log(curParameterGroupId + ' already added.')
      } else {
        const curParameterIds = curMetricDict.parameterGroups[curParameterGroupId].parameters
        retDict[curParameterGroupId] = {
          parameterIdObs: curParameterIds.obs,
          parameterIdSim: curParameterIds.sim,
          metrics: []
        }
      }
      retDict[curParameterGroupId].metrics.push(curMetricId)
    }
  }
  return retDict
}


// 
const getParametersAndModuleInstanceIds = (varsState, parameterGroupId) => {
  /*
   * return {"parameterId": [moduleInstanceId, ...]}
   */
  const plotData = varsStateLib.getTimeSeriesPlotData(varsState)

  if (!plotData) { return null }
  if (!plotData[parameterGroupId]) { return null }

  // identify the module instance of each parameter
  const returnDict = {}
  for (const curTimeseriesDict of plotData[parameterGroupId]) {
    const curParameterId = curTimeseriesDict.properties.parameterId
    if (!(curParameterId in returnDict)) {
      returnDict[curParameterId] = new Set()
    }
    returnDict[curParameterId].add(
      curTimeseriesDict.properties.moduleInstanceId
    )
  }

  // turn the sets into arrays
  for (const curParameterId of Object.keys(returnDict)) {
    returnDict[curParameterId] = Array.from(returnDict[curParameterId])
  }

  return(returnDict)
}

//
const DraggableTimeseriesDiv = ({ settings }) => {
  const divRef = useRef(null)
  const { consCache } = useContext(ConsCache)
  const { varsState, setVarState } = useContext(VarsState)

  useEffect(() => {
    if (divRef.current !== null) {
      DomEvent.disableClickPropagation(divRef.current)
    }
  })

  // ${position}
  return (
    <div
      className={`${
        varsStateLib.getPanelTabsShow(varsState) ? "Panel" : "Panel hide"
      }`}
      ref={divRef}
    >
      {/* <Draggable bounds='parent'> */}
      {/* <Draggable> */}
      <div className="Panel-content">
        {varsStateLib.getTimeSerieUrl(varsState) && (
          <Suspense fallback={showLoading()}>
            <div>
              <LoadTimeSeriesData settings={settings} />
              {varsState.domObjects.timeSeriesData.availableVariables && (
                <Tabs
                  defaultActiveKey={
                    varsState.domObjects.timeSeriesData.availableVariables[0]
                  }
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  {
                    /* Add one tab per time series */
                    Object.keys(
                      varsState.domObjects.timeSeriesData.availableVariables
                    ).map((parameterGroupId) => timeseriesTab(parameterGroupId, varsState))
                  }
                  {metricMatrixTab('', consCache)}
                </Tabs>
              )}
            </div>
          </Suspense>
        )}
      </div>
      {/* </Draggable> */}
      <div className='close-button'>
        <CloseButton
          onClick={() => {
            varsStateLib.hidePanelTabs(varsState)
            setVarState(Math.random())
          }}
        />
      </div>

      {/* </Draggable> */}
    </div>
  );
};

const PanelTabs = ({ position, settings }) => {
  const { consCache } = useContext(ConsCache)
  const { consFixed } = useContext(ConsFixed)
  const { varsState, setVarState } = useContext(VarsState)

  // updates matrix table if needed
  useEffect(() => {
    // only does something if the tab is being shown
    if (!varsStateLib.getPanelTabsShow(varsState)) { return }

    // and only if there is at least one evaluation metric available
    const evaluationMetrics = listMetrics(settings)
    if ((!evaluationMetrics) || (evaluationMetrics.length === 0)) {
      consCacheLib.setEvaluationsLastRequestUrl(null, consCache)
      setVarState(Math.random())
      return
    }

    // TODO: generalize for multiple parameter groups
    const parameterGroupDicts = listMetricsAndParameters(settings)
    const parameterGroupId = Object.keys(parameterGroupDicts)[0]
    const parameterGroupDict = parameterGroupDicts[parameterGroupId]
    const simParameterId = parameterGroupDict.parameterIdSim
    const obsParameterId = parameterGroupDict.parameterIdObs

    // get parameters available
    const parametersAndModules = getParametersAndModuleInstanceIds(varsState, parameterGroupId)
    if ((!parametersAndModules) || (!parametersAndModules[simParameterId]) || (!parametersAndModules[obsParameterId])) {
      consCacheLib.setEvaluationsLastRequestUrl(null, consCache)
      setVarState(Math.random())
      return
    }

    // final response function: get data from consCache and update varsState
    const callbackFunc = (urlRequested) => {
      consCacheLib.setEvaluationsLastRequestUrl(urlRequested, consCache)
      setVarState(Math.random())
    }

    // build URL to be requested
    const urlTimeseriesCalcRequest = apiUrl(
      settings.apiBaseUrl, 'v1dw', 'timeseries_calculator', {
        filter: varsStateLib.getContextFilterId(varsState),
        calcs: evaluationMetrics.join(','),
        simParameterId: simParameterId,
        obsParameterId: obsParameterId,
        obsModuleInstanceId: parametersAndModules[obsParameterId],
        simModuleInstanceIds: parametersAndModules[simParameterId].join(','),
        locationId: varsStateLib.getActiveLocation(varsState).locationId
      }
    )

    //
    consCacheLib.setEvaluationsLastRequestUrl(urlTimeseriesCalcRequest, consCache)
    if (consCacheLib.wasUrlRequested(urlTimeseriesCalcRequest, consCache) ||
        !urlTimeseriesCalcRequest) {
      callbackFunc(urlTimeseriesCalcRequest)
    } else {
      // request URL, update local states, update cache, access cache
      const extraArgs = { url: urlTimeseriesCalcRequest }
      fetcherWith(urlTimeseriesCalcRequest, extraArgs).then(([jsonData, extras]) => {
        consCacheLib.addUrlRequested(extras.url, consCache)
        consCacheLib.storeEvaluationsResponseData(extras.url, jsonData.evaluations, consCache)
        callbackFunc(extras.url)
      })
    }
  }, [varsStateLib.getContextFilterId(varsState),
      varsStateLib.getActiveLocation(varsState),
      varsStateLib.getPanelTabsShow(varsState),
      varsStateLib.getTimeSeriesPlotData(varsState)])

  /* TimeSeriesPlot */
  return <DraggableTimeseriesDiv settings={settings} />
}

export default PanelTabs
