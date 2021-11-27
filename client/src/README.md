# Frontend Client Code

## React Contexts | "Global variables"

The project uses *React Contexts* to share data among components. They act as "Global variables" and a proper documentation on their structure is present to avoid duplication and inconsistencies.

Only three contexts should be present in the final version of v1.0, as further explained in this document: ```ConsFixed```, ```ConsCache``` and ```VarsState```.

Document pattern:

```$xyz$```: variable that represents "xyz". Multiple values for "xyz" may be present.

```<a|b|c>```: variable that can hold values ```a```, ```b``` or ```c```.

```(...)```: yet to be documented.

### ConsFixed | Constants - Load-on-startup

These variables are loaded as the application starts and **don't change or expand** during the session.

They should:

- be hooked by ```useState``` **only** in the ```App``` component;
- be changed **only** by ```appLoad.loadConsFixed()```;
- be read only through the components using the ```ConsFixed``` context.

Structure:

    region: {
      systemInformation: {
        name: $regionName$
      },
      (...)
    }

-- 

    boundaries: {
      (...)
    }

--

    filters: {
      $filterId$: 
    }

--

    locations: {
      $locationId$: {
        (...)
      }
    }

--

    parameters: {
      $parameterId$: {
        (...)
      }
    }

--

    parameterGroups: {
      $parameterGroupId$: {
        (...)
      }
    }

--

    thresholdValueSets: {
      $thresholdValueSetId$: {
        (...)
      }
    }

--

    thresholdGroup: {
      $thresholdGroupId$: {
        (...)
      }
    }

--

    settings: {
      *the content of client/public/settings.json, described in client/public/README.md*
    }


### ConsCache | Constants - Load-on-the-go

These variables start empty (or with default values) and are filled during the session to avoid re-requests. Thus, the values set **don't change, but expand** during the session, acting like a "cache".

Before doing a, HTTP request for data, *ConsCache* should be consulted (```requestedUrls``` entry). If the URL was already requested, retrieve the data from cache. Otherwise, perform request, store in cache and then retrieve data from cache.

They should **not** be hooked by ```useState``` and **only** be accessed/manipulated through ```consCacheLib```.

The entry ```requestedUrls``` stores all URL already requested and stored.

--

    requestedUrls: set($apiURL$)

--

The entry ```indexes``` only store relationships of ids for fast querying.

--

    indexes: {
      evaluationResponseData: {
        $requestURL$: $rawApiResponse$
      },
      locationIdByTimeseriesId: {
        $timeseriesId$: $locationId$
      },
      moduleInstanceIdsByThresholdGroupId: {
        $thresholdGroupId$: set($moduleInstanceIds$)
      },
      parameterIdsByThresholdGroupId: {
        $thresholdGroupId$: set($parameterIds$)
      },
      timeseriesIdsByFilterId: {
        $filterId$: set($timeseriesId$)
      },
      timeseriesIdsByLocationId: {
        $locationId: set($timeseriesId$)
      },
      timeseriesIdsByParameterId: {
        $parameterId$: set($timeseriesId$)
      }
      (...)
    }

--

The entry ```timeseries``` stores as much information as possible (header and/or data) of already requested timeseries.

--

    data: {
      timeseries: {
        $timeseriesId$: (...)
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
          thresholdGroupId: $thresholdGroupId$,
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