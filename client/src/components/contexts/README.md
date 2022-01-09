# React Contexts

**IMPORTANT: THIS PART IS BEING REFACTORED TO REDUCE THE NUMBER OF COMPONENTS**

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