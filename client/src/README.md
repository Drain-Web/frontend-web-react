# Frontend Client Code

## "Global variables"

Document pattern:

```$xyz$```: variable that represents "xyz". Multiple values for "xyz" may be present.

```<a|b|c>```: variable that can hold values ```a```, ```b``` or ```c```.

### ConsFixed | Constants - Load-on-startup

These variables are loaded as the application starts and **don't change or expand** during the session.

They should be hooked by ```useState``` **only** in *App.js* by the ```App``` and ```AppSettings``` components.

After loaded, they are propagated to other components vias ```React props```.

    region: {

    }

-- 

    boundaries: {
      
    }

--

    filters: {
      $filterId$: 
    }

--

    locations: {
      $locationId$: {

      }
    }

--

    parameters: {
      $parameterId$: {

      }
    }

--

    parameterGroups: {
      $parameterGroupId$: {

      }
    }

--

    thresholdValueSets: {
      $thresholdValueSetId$: {

      }
    }

--

    thresholdGroup: {
      $thresholdGroupId$: {

      }
    }

--

    settings: {
      *the content of client/public/settings.json, described in client/public/README.md*
    }


### ConsCache | Constants - Load-on-the-go

These variables start empty (or with default values) and are filled during the session to avoid re-requests. Thus, the values set **don't change, but expand** during the session, acting like a "cache".

Before doing a, HTTP request for data, *ConsCache* should be consulted. If data is available, return the data without proceeding with the request. If data is ```null```, interpret as "the data is not available in the database" and avoid performing the request. If the desired entry is not found, perform the request and fill the entry during callback.

They should **not** be hooked by ```useState```.



--

    filters: {
      $filterId$: {
        hasTimeseries: {
          $timeseriesId$
        }
      }
    }

--

    locations: {
      $locationId$: {
        inFilters: {
          $filterId$: {
            hasTimeseries: {
              $timeseriesId$
            }
          },
          $filterId$: null
        }
      }
    }


### VarsState | Variables - Current State

These are the variables that indicate the state of the system and change responding the user selections.

They are **expected** to be hooked by ```useState```.

    context: {
      filterId: $filterId$,
      icons: {
        iconType: <uniform|alerts|evaluation|competition|comparison>
        typeUniform: {
          filterBy: <null|parameter|parameterGroup|moduleInstance>,
          filterValues: set(<parameterIds|parameterGroupIds|moduleInstanceIds>)
        },
        typeAlert: {
          threshold_TODO_Id: $threshold_TODO_Id$,
          moduleInstanceId: <observations|simulations|$moduleInstanceId$>
        },
        typeEvaluation: {
          parameterGroupId: $parameterGroupId$,
          metric: <KGE|RMSE>,
          observationModuleInstanceId: $moduleInstanceId$,
          simulationModuleInstanceId: $moduleInstanceId$
        },
        typeCompetition: {
          parameterGroupId: $parameterGroupId$,
          metric: <KGE|RMSE>,
          observationModuleInstanceId: $moduleInstanceId$,
          simulationModuleInstanceIds: set($moduleInstanceId$)
        },
        typeComparison: {
          parameterGroupId: $parameterGroupId$,
          metric: <higherMax|higherMean|lowerMax|lowerMean>,
          moduleInstanceIds: set($moduleInstanceId$)
        }
      }
    }

--

    locations: {
      $locationId$: {
        icon: $iconUrl$,
        display: <true|false>
      }
    }

--

    domObjects: {
      mainMenuControl: {
        show: <true|false>,
        activeTab: <tabOverview|tabFilters|tabActiveFeatureInfo>
      }
    }