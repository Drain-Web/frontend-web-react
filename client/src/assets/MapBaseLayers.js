export const baseLayersData = [
  {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    name: 'OpenStreetMap',
    checked: true,
    maxNativeZoom: false
  },
  {
    url: 'http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg',
    attribution: '&copy; <a href="https://stamen.com/open-source/">Stamen</a> contributors',
    name: 'Terrain',
    checked: false,
    maxNativeZoom: false
  },
  {
    url: 'https://gibs-{s}.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default//EPSG3857_500m/{z}/{y}/{x}.jpeg',
    attribution: '&copy; NASA Blue Marble, image service by OpenGeo',
    name: 'NASA Gibs Blue Marble',
    checked: false,
    maxNativeZoom: 12
  },
  {
    url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    name: 'World Imagery',
    checked: false,
    maxNativeZoom: 17
  }
]
