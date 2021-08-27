import React, { Suspense, useEffect, useRef } from 'react'
import Draggable from 'react-draggable'
import * as L from 'leaflet'
import TimeSeriesPlot from './TimeSeriesPlot'
import '../../style/Panel.css'

/* Panel open with the list of timeseries of a Location to be plot and the timeseries plot
 * Referenced by MapControler.
 */

const DraggableTimeseriesDiv = ({ isHidden, timeSerieUrl, position }) => {
  const divRef = useRef(null)

  useEffect(() => {
    if (divRef.current !== null) L.DomEvent.disableClickPropagation(divRef.current)
  })

  // ${position}
  return (
    <div className={`${isHidden ? 'Panel hide' : 'Panel'}`} ref={divRef}>
      {/* <Draggable bounds='parent'> */}
      <div className='Panel-content'>
        {timeSerieUrl && (
          <Suspense fallback={<div>loading...</div>}>
            <TimeSeriesPlot timeSeriesUrl={timeSerieUrl} />
          </Suspense>
        )}
      </div>
      <div className='button-close'>✕</div>
      {/* </Draggable> */}
    </div>
  )
}

const Panel = ({ hideAll, isHidden, setIsHidden, timeSerieUrl, position }) => {
  const buttonHandler = () => {
    setIsHidden(!isHidden)
  }

  if (hideAll) {
    return (
      <>
        {/* TimeSeriesPlot */}
        <DraggableTimeseriesDiv
          isHidden={isHidden}
          timeSerieUrl={timeSerieUrl}
          position={position}
        />

        {/* over-the-point menu */}
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
