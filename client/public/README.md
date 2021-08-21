# Frontend client public

## What

All files in this folder is imported to the deploy build.

## Content

### settings.json

Simple dictionary with the following root variables:

*apiBaseUrl*:

- String. Mandatory.
- E.g.: ```"https://hydro-web.herokuapp.com/"```

*overviewFilter*:

- Boolean. Mandatory.
- Defines if:
    - there will be an ```overview``` option (```true```);
    - no ```overview``` option (```false```).

*typeOfFilters*:

- Mandatory.
- Defines if:
    - there will not be a ```filter``` option (```null```);
    - Event/sub-area pattern (```"event.subarea"```);
    - Regular pattern (```"regular"```).

### img/

Stores static images. Hold only files with ```.png```, ```.svg``` or ```.jpg```.