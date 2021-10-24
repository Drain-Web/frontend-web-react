import { createContext } from 'react'

/*
 * VarsState should only be changed using functions from varsStateLib.js for consistency
 */

const VarsState = createContext(
  {
    varsState: {
      // 'context' stores what is currently selected by the user
      context: {
        filterId: null,                         // filterId
        icons: {
          iconType: null,                       // <uniform|alerts|evaluation|competition|comparison>
          typeUniform: {
            filterBy: null,                     // <null|parameter|parameterGroup|moduleInstance>
            filterValues: new Set()                 // <parameterIds|parameterGroupIds|moduleInstanceIds>
          },
          typeAlert: {
            threshold_TODO_Id: null,            // threshold_TODO_Id
            moduleInstanceId: null              // <observations|simulations|$moduleInstanceId$>
          },
          typeEvaluation: {
            parameterGroupId: null,             // parameterGroupId
            metric: null,                       // <KGE|RMSE>
            observationModuleInstanceId: null,  // moduleInstanceId
            simulationModuleInstanceId: null    // moduleInstanceId
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
    },
    setVarsState: (filter) => {}
  }
)

export default VarsState
