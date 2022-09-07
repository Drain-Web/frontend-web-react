import { atom } from "recoil";

// ** CONTEXT **********************************************************************************

const atVarStateContext = atom({
    key: 'atVarStateContext',
    default: {
        filterId: null,                             // filterId
        icons: {
          iconType: null,                           // <uniform|alerts|evaluation|competition|comparison>
          typeUniform: {
            filterBy: null,                         // <null|parameter|parameterGroup|moduleInstance>
            filterValues: new Set()                 // <parameterIds|parameterGroupIds|moduleInstanceIds>
          },
          typeAlert: {
            thresholdGroupId: null,                // thresholdGroupId
            moduleInstanceId: null                  // <observations|simulations|$moduleInstanceId$>
          },
          typeEvaluation: {
            parameterGroupId: null,                 // parameterGroupId
            metric: null,                           // <KGE|RMSE>
            observationModuleInstanceId: null,      // moduleInstanceId
            simulationModuleInstanceId: null        // moduleInstanceId
          },
          typeCompetition: {
            parameterGroupId: null,                 // parameterGroupId
            metric: null,                           // <KGE|RMSE>
            observationModuleInstanceId: null,      // moduleInstanceId
            simulationModuleInstanceIds: new Set()  // moduleInstanceIds
          },
          typeComparison: {
            parameterGroupId: null,                 // parameterGroupId
            metric: null,                           // <higherMax|higherMean|lowerMax|lowerMean>
            moduleInstanceIds: new Set()            // moduleInstanceIds
          }
        }
    }
})

// ** LOCATIONS ********************************************************************************

const atVarStateLocations = atom({
    key: 'atVarStateLocations',
    default: {}
})

const atVarStateActiveLocation = atom({
    key: 'atVarStateActiveLocation',
    default: null
})

// ** DOMS *************************************************************************************

const atVarStateDomMainMenuControl = atom({
    key: 'atVarStateDomMainMenuControl',
    default: {
        show: true,
        activeTab: null,                        // <tabOverview|tabFilters|tabActiveFeatureInfo>
        activeTabsHistory: [],
        tabParameters: {
          tabFilters: {
            vectorGridMode: 'static'
          }
        }
    }
})

const atVarStateDomTimeSeriesData = atom({
    key: 'atVarStateDomTimeSeriesData',
    default: {
        timeSerieUrl: null,
        plotData: null,
        plotArrays: null,
        availableVariables: null,
        unitsVariables: null,
        thresholdsArray: null
    }
})

const atVarStateDomTimeseriesPanel = atom({
    key: 'atVarStateDomTimeseriesPanel',
    default: {
        show: false
    }
})

const atVarStateDomMap = atom({
    key: 'atVarStateDomMap',
    default: {
        zoomLevel: null
    }
})

const atVarStateDomMapLegend = atom({
  key: 'atVarStateDomMapLegend',
  default: {
    subtitle: null,
    iconsUrls: [],
    iconsTitles: [],
    display: false
  }
})

// ** RASTER GRID ANIMATION ********************************************************************

const atVarStateRasterGridAnimation = atom({
  key: 'atVarStateRasterGridAnimation',
  default: {
    currentFrame1stIdx: 0,
    currentFrame2ndIdx: 0,
    currentFrame1stZindex: 10,
    currentFrame2ndZindex:  9
  }
})

// ** VECTOR GRID ANIMATION ********************************************************************

const atVarStateVectorGridMode = atom({
  key: 'atVarStateVectorGridMode',
  default: 'static'  // can be: 'static', 'animated'. TODO: make it variable.
})

const atVarStateVectorGridAnimation = atom({
  key: 'atVarStateVectorGridAnimation',
  default: {
    currentFrameIdx: 0,
    playSpeed: '01h',  // "15m", "30m", "01h", "06h", "01d"
    interval: 1000,  // update time in milliseconds
    isRunning: true,
    timeResolution: "01h"
  }
})

// ** EXPORT ***********************************************************************************

export { atVarStateContext, atVarStateLocations, atVarStateActiveLocation,
         atVarStateDomMainMenuControl, atVarStateDomTimeSeriesData, 
         atVarStateDomTimeseriesPanel, atVarStateDomMap, atVarStateDomMapLegend,
         atVarStateRasterGridAnimation,
         atVarStateVectorGridAnimation, atVarStateVectorGridMode }