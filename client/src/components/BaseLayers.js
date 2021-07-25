import { TileLayer, LayersControl } from "react-leaflet";
import React from 'react';


const { BaseLayer } = LayersControl;


const BaseLayers = ({ baseLayerData }) => {

    return (
        <React.Fragment>
            {baseLayerData.map((baseLayer) => {  
                        
                if (baseLayer.maxNativeZoom) {
                    return(
                        <BaseLayer checked={baseLayer.checked} name={baseLayer.name} key={baseLayer.name}>
                            <TileLayer
                                attribution={baseLayer.attribution}
                                url={baseLayer.url}
                                maxNativeZoom={baseLayer.maxNativeZoom}
                            />
                        </BaseLayer>
                    );
                } else {
                    return(
                        <BaseLayer checked={baseLayer.checked} name={baseLayer.name} key={baseLayer.name}>
                            <TileLayer
                                attribution={baseLayer.attribution}
                                url={baseLayer.url}
                            />
                        </BaseLayer>
                    );
                }
            })}
        </React.Fragment>


    );
}

export default BaseLayers;





