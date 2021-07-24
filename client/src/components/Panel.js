import React from 'react'
import TimeSeriesPlot from './TimeSeriesPlot'
import '../style/Panel.css'

/* Panel open with the list of timeseries of a Location to be plot
 */

const Panel = ({ isHidden, setIsHidden, timeSerieUrl }) => {
  const buttonHandler = () => {
    setIsHidden(!isHidden)
  }

  return (
    <div>
      <button className='boton-prueba' onClick={() => buttonHandler()}>
        {isHidden ? 'Show' : 'Hide'}
      </button>

      <div className={`${isHidden ? 'Panel hide' : 'Panel'}`}>
        <p>{timeSerieUrl}</p>

        {timeSerieUrl && <TimeSeriesPlot />}
      </div>
    </div>
  )
}

export default Panel
