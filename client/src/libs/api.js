
const apiUrl = (baseUrl, vPath, entryPoint, parameters) => {
  /* Centralized function to build URLs for the API.
   * should come from settings file
   * vPath: str. 'v1' or 'v1dw'
   * entryPoint: str. E.g.: 'locations', 'region', 'timeseries'
   * parameters: dict [optional]. E.g. {'filter': 'e2019julIni.eer', 'location=usgs_06797500': ''}
   * return: str. E.g. 'https://www.hydro-web.com/v1/timeseries/?filter=e2019julIni.eer&location=usgs_06797500'
   */
  // const baseUrl = 'https://hydro-web.herokuapp.com/' // TODO - make it application-dependent
  let params

  if (!baseUrl) return null

  if (parameters && (parameters.constructor === Object)) {
    params = []
    for (const kv of Object.entries(parameters)) {
      params.push(kv.join('='))
    }
    params = '?'.concat(params.join('&'))
  } else if (parameters && ((typeof parameters === 'string') || (parameters instanceof String))) {
    params = '/'.concat(parameters)
  } else {
    params = ''
  }

  return baseUrl.concat(vPath, '/', entryPoint, params)
}

export { apiUrl }
