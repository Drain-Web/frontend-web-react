import React, { Suspense, useEffect,useState, useRef, useContext } from "react";
import Draggable from "react-draggable";
import { DomEvent } from "leaflet";
import Spinner from "react-bootstrap/Spinner";
import { Tab, Tabs } from "react-bootstrap";
import { apiUrl } from "../../libs/api.js";
import { Scrollbars } from "react-custom-scrollbars";
import { cloneDeep } from 'lodash';
import axios from "axios";

// import components
import LoadTimeSeriesData from "./plots/LoadTimeSeriesData";
import TimeSeriesPlot from "./plots/TimeSeriesPlot";
import CloseButton from "react-bootstrap/CloseButton";
import MetricsTable from "./MetricsTable";

// import contexts
import ConsCache from '../contexts/ConsCache.js'
import consCacheLib from '../contexts/consCacheLib'

// context and atoms
import atsVarStateLib from "../atoms/atsVarStateLib";
import { atVarStateActiveLocation, atVarStateContext,
         atVarStateDomTimeSeriesData, atVarStateDomTimeseriesPanel }
  from "../atoms/atsVarState";

// import styles
import "../../style/Panel.css";
import { useRecoilState, useRecoilValue } from "recoil";

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
const showTimeseriesPlot = (parameterGroupId, timeSeriesData) => {
  return (
    <TimeSeriesPlot
      plotData={timeSeriesData.plotData[parameterGroupId]}
      plotArray={timeSeriesData.plotArrays[parameterGroupId]}
      availableVariables={timeSeriesData.availableVariables[parameterGroupId]}
      unitsVariables={timeSeriesData.unitsVariables[parameterGroupId]}
      thresholdsArray={timeSeriesData.thresholdsArray[parameterGroupId]}
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
  const lastUrlRequested = consCacheLib.getEvaluationLastRequestUrl(consCache)
  if (!lastUrlRequested) {
    return wrapTab((<div>No URL requested.</div>))
  }

  // check we have content
  const urlRequestedContent = consCacheLib.getEvaluationResponseData(lastUrlRequested, consCache)
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
const timeseriesTab = (parameterGroupId, timeSeriesData) => {

  // define tab content
  const tabContent = (!timeSeriesData.plotData) ?
                     (<div>No timeseries data!</div>) :
                     showTimeseriesPlot(parameterGroupId, timeSeriesData)

  // build object
  return (
    <Tab eventKey={parameterGroupId} title={parameterGroupId} key={parameterGroupId}>
      {tabContent}
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
      if (!(curParameterGroupId in retDict)) {
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
const getParametersAndModuleInstanceIds = (atomVarStateDomTimeSeriesData, parameterGroupId) => {
  /*
   * return {"parameterId": [moduleInstanceId, ...]}
   */
  const plotData = atsVarStateLib.getTimeSeriesPlotData(atomVarStateDomTimeSeriesData)

  if (!plotData) { return null }
  if (!plotData[parameterGroupId]) { return null }

  // identify the module instance of each parameter
  const returnDict = {}
  for (const curTimeseriesDict of plotData[parameterGroupId]) {
    const curParameterId = curTimeseriesDict.properties.parameterId
    if (!(curParameterId in returnDict)) {
      returnDict[curParameterId] = new Set()
    }
    returnDict[curParameterId].add(curTimeseriesDict.properties.moduleInstanceId)
  }

  // turn the sets into arrays
  for (const curParameterId of Object.keys(returnDict)) {
    returnDict[curParameterId] = Array.from(returnDict[curParameterId])
  }

  return(returnDict)
}

//
const DraggableTimeseriesDiv = ({ settings }) => {
  // ** SET HOOKS ******************************************************************************
  const divRef = useRef(null)
  const { consCache } = useContext(ConsCache)

  useEffect(() => {
    if (divRef.current !== null) {
      DomEvent.disableClickPropagation(divRef.current)
    }
  })

  const atomVarStateDomTimeSeriesData = useRecoilValue(atVarStateDomTimeSeriesData)
  const [ atomVarStateDomTimeseriesPanel, setAtVarStateDomTimeseriesPanel ] = 
    useRecoilState(atVarStateDomTimeseriesPanel)

  const atmVarStateDomTimeseriesPanel = cloneDeep(atomVarStateDomTimeseriesPanel);

  // ** MAIN RENDER  ***************************************************************************

  const timeSeriesPlotAvailableVariables =
    atsVarStateLib.getTimeSeriesPlotAvailableVariables(atomVarStateDomTimeSeriesData)

  return (
    <div
      className={`${
        atsVarStateLib.getPanelTabsShow(atomVarStateDomTimeseriesPanel) ? "Panel" : "Panel hide"
      }`}
      ref={divRef}
    >
      {/* <Draggable bounds='parent'> */}
      {/* <Draggable> */}
      <div className="Panel-content">
        {atsVarStateLib.getTimeSerieUrl(atomVarStateDomTimeSeriesData) && (
          <Suspense fallback={showLoading()}>
            <div>
              <LoadTimeSeriesData settings={settings} />
              {timeSeriesPlotAvailableVariables && (
                <Tabs
                  defaultActiveKey={ timeSeriesPlotAvailableVariables[0] }
                  id="uncontrolled-tab-example"
                  className="mb-3"
                >
                  {
                    /* Add one tab per time series */
                    Object.keys(timeSeriesPlotAvailableVariables).map(
                      (parameterGroupId) => timeseriesTab(parameterGroupId,
                                                          atomVarStateDomTimeSeriesData)
                    )
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
            const atmVarStateDomTimeseriesPanel = cloneDeep(atomVarStateDomTimeseriesPanel)
            atsVarStateLib.hidePanelTabs(atmVarStateDomTimeseriesPanel)
            setAtVarStateDomTimeseriesPanel(atmVarStateDomTimeseriesPanel)
          }}
        />
      </div>

      {/* </Draggable> */}
    </div>
  );
};

const PanelTabs = ({ position, settings }) => {
  const { consCache } = useContext(ConsCache)
  const setVarState = useState(null)[1];

  const atomVarStateContext = useRecoilValue(atVarStateContext)
  const atomVarStateActiveLocation = useRecoilValue(atVarStateActiveLocation)
  const atomVarStateDomTimeSeriesData = useRecoilValue(atVarStateDomTimeSeriesData)
  const atomVarStateDomTimeseriesPanel = useRecoilValue(atVarStateDomTimeseriesPanel)

  // TODO - move to VarsStateManager
  // updates matrix table if needed
  useEffect(() => {

    // only does something if the tab is being shown
    if (!atsVarStateLib.getPanelTabsShow(atomVarStateDomTimeseriesPanel)) { 
      return
    }

    // and only if there is at least one evaluation metric available
    const evaluationMetrics = listMetrics(settings)
    if ((!evaluationMetrics) || (evaluationMetrics.length === 0)) {
      consCacheLib.setEvaluationLastRequestUrl(null, consCache)
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
    const parametersAndModules = getParametersAndModuleInstanceIds(atomVarStateDomTimeSeriesData, parameterGroupId)
    if ((!parametersAndModules) || (!parametersAndModules[simParameterId]) || (!parametersAndModules[obsParameterId])) {
      consCacheLib.setEvaluationLastRequestUrl(null, consCache)
      setVarState(Math.random())
      return
    }

    // final response function: get data from consCache and update varsState
    const callbackFunc = (urlRequested) => {
      consCacheLib.setEvaluationLastRequestUrl(urlRequested, consCache)
      setVarState(Math.random())
    }

    // build URL to be requested
    const urlTimeseriesCalcRequest = apiUrl(
      settings.apiBaseUrl, 'v1dw', 'timeseries_calculator', {
        filter: atsVarStateLib.getContextFilterId(atomVarStateContext),
        calcs: evaluationMetrics.join(','),
        simParameterId: simParameterId,
        obsParameterId: obsParameterId,
        obsModuleInstanceId: parametersAndModules[obsParameterId],
        simModuleInstanceIds: parametersAndModules[simParameterId].join(','),
        locationId: atomVarStateActiveLocation.locationId
      }
    )

    //
    consCacheLib.setEvaluationLastRequestUrl(urlTimeseriesCalcRequest, consCache)
    if (consCacheLib.wasUrlRequested(urlTimeseriesCalcRequest, consCache) ||
        !urlTimeseriesCalcRequest) {
      callbackFunc(urlTimeseriesCalcRequest)
    } else {
      // request URL, update local states, update cache, access cache
      const extraArgs = { url: urlTimeseriesCalcRequest }
      fetcherWith(urlTimeseriesCalcRequest, extraArgs).then(([jsonData, extras]) => {
        consCacheLib.addUrlRequested(extras.url, consCache)
        consCacheLib.storeEvaluationResponseData(extras.url, jsonData.evaluations, consCache)
        callbackFunc(extras.url)
      })
    }
  }, [atsVarStateLib.getContextFilterId(atomVarStateContext),
      atomVarStateActiveLocation,
      atsVarStateLib.getPanelTabsShow(atomVarStateDomTimeseriesPanel),
      atsVarStateLib.getTimeSeriesPlotData(atomVarStateDomTimeSeriesData)])

  /* TimeSeriesPlot */
  return <DraggableTimeseriesDiv settings={settings} />
}

export default PanelTabs
