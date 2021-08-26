# React Contexts

Each ```Context``` object in this folder has a ```...Data``` dictionary and a ```set...Data``` function.

Context can be seen as "*global variables*" through the application.

## FilterContext.js

Holds the information that describe the current filter information.

When system is loaded, all variables are filled with default options.

Values are chenged when user changes overview/filter tab or active filter select box.

*evtFilterId*: str.

*geoFilterId*: str.

*filterId*: str.

*inOverview*: bool.

## MapContext.js

## MapLocationsContext.js

Holds the variables that describe the locations to be presented in the map.

Must be updated after updates in ```FilterContext``` data.

*filterId*: str.

- TODO: redundant?

*byLocations:* dictionary.

- When system is loaded, all locations are set. ```set``` value changes depending on the selected filter/overview option.

- E.g.:

    {
      locationId: {
        show: True | False
      }
    }

*byParameters*: dict.

- TODO: describe it

*showParametersLocations*: set.

- parameter ids selected to be shown.

- E.g.: {'Q.obs', 'Q.sim', ...}