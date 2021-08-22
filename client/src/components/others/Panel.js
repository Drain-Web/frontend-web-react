import React, { Suspense } from 'react'
import TimeSeriesPlot from './TimeSeriesPlot'
import '../../style/Panel.css'

/* Panel open with the list of timeseries of a Location to be plot.
 * Referenced by MapControler.
 */

const Panel = ({ hideAll, isHidden, setIsHidden, timeSerieUrl, position }) => {
  const buttonHandler = () => {
    setIsHidden(!isHidden)
  }

  if (hideAll) {
    return (
      <>
        <div className={`${isHidden ? 'Panel hide' : 'Panel'} ${position}`}>
          {timeSerieUrl && (
            <Suspense fallback={<div>loading...</div>}>
              {/* <p>{timeSerieUrl}</p> */}
              <TimeSeriesPlot timeSeriesUrl={timeSerieUrl} />
            </Suspense>
          )}
        </div>

        <div className='plotting-panel-button'>
          <button className='boton-prueba' onClick={() => buttonHandler()}>
            {isHidden ? 'Show' : 'Hide'}
          </button>
        </div>
      </>
    )
  } else {
    return (<></>)
  }
}

export default Panel
