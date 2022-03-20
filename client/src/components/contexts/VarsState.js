import { createContext } from 'react'

/*
 * VarsState should only be changed using functions from varsStateLib.js for consistency
 */

const VarsState = createContext({
  varsState: {
    // 'context' stores what is currently selected by the user
    context: {
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
    },

    // 'locations' stores what expected to be shown in the map with respect to location icons
    locations: {},

    // 'activeLocation' holds the information for the selected location
    // NOTE: old 'activePointFeature'
    activeLocation: null,

    // 'domObjects' stores the visual states of DOM objects
    domObjects: {
      mainMenuControl: {
        show: true,
        activeTab: null // <tabOverview|tabFilters|tabActiveFeatureInfo>
      },
      timeSeriesData: {
        timeSerieUrl: null,
        plotData: null,
        plotArrays: null,
        availableVariables: null,
        unitsVariables: null,
        thresholdsArray: null
      },
      timeseriesPanel: {
        show: false
      },
      map: {
        zoomLevel: null
      },
      mapLegend: {
        subtitle: null,
        iconsUrls: [],
        iconsTitles: [],
        display: false
      }
    }
  }
})

export default VarsState
