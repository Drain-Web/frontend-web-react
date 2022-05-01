import React, { useContext, useEffect, useRef } from "react";
import { DomEvent } from "leaflet";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import dateFormat, { masks } from "dateformat";

import varsStateLib from "../../contexts/varsStateLib";
import VarsState from "../../contexts/VarsState";

// import CSS styles
import ownStyles from "../../../style/VectorGridPlayer.module.css";

const indexToDatetime = (idx, initDatetimeStr, timeStepStr) => {
    // parse inputs
    const timeStep = parseInt(timeStepStr.substring(0, 2));
    const timeUnit = timeStepStr[2];
    const timeDelta = timeStep * idx
    const nextDatetime = new Date(initDatetimeStr);
    
    // walk in time
    if (timeUnit === "m") {
        nextDatetime.setTime(nextDatetime.getTime() + (timeDelta*60000));
    } else if (timeUnit === "h") {
        nextDatetime.setHours(nextDatetime.getHours() + timeDelta);
    } else if (timeUnit === "d") {
        nextDatetime.setHours(nextDatetime.getHours() + (timeDelta*24));
    } else {
        console.log("3rd character of", timeStepStr, "should be 'm', 'h' or 'd'. Is:", timeUnit)
        return null
    }
    return nextDatetime
}

// base class of all buttons
const PlayerButton = (innerHTML, onClickFunction) => {
    return (
        <div
            className={`${ownStyles.controlButton}`}
            onClick={onClickFunction}
        >
            {innerHTML}
        </div>
    )
}

/* ** PLAYER BUTTONS *************************************************************************** */
const PlayerButtonToBegin = (varsState, setVarState) => {
    // only show if not playing
    if (varsStateLib.getVectorGridAnimationIsRunning(varsState)) { return (null) }

    // define inner HTML and function
    const innerHTML = "|◀"
    const onClickFunction = () => {
        varsStateLib.setVectorGridAnimationCurrentFrameIdx(0, varsState)
        setVarState(Math.random());
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonPrev = (varsState, setVarState) => {
    // only show if not playing
    if (varsStateLib.getVectorGridAnimationIsRunning(varsState)) { return (null) }

    // define inner HTML and function
    const innerHTML = "◁"
    const onClickFunction = () => {
        const curFrameIdx = varsStateLib.getVectorGridAnimationCurrentFrameIdx(varsState)
        const nextFrameIdx = Math.max(0, (curFrameIdx - 1)) // TODO: emove hard coded
        varsStateLib.setVectorGridAnimationCurrentFrameIdx(nextFrameIdx, varsState)
        setVarState(Math.random());
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonStop = (varsState, setVarState) => {
    // only show if playing
    if (!varsStateLib.getVectorGridAnimationIsRunning(varsState)) { return (null) }

    // define inner HTML and function
    const innerHTML = "◼"
    const onClickFunction = () => {
        varsStateLib.toggleVectorGridAnimationIsRunning(varsState)
        setVarState(Math.random());
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonPlay = (varsState, setVarState) => {
    // only show if playing
    if (varsStateLib.getVectorGridAnimationIsRunning(varsState)) { return (null) }

    // define inner HTML and function
    const innerHTML = "▶"
    const onClickFunction = () => {
        varsStateLib.toggleVectorGridAnimationIsRunning(varsState)
        setVarState(Math.random());
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonNext = (varsState, setVarState) => {
    // only show if playing
    if (varsStateLib.getVectorGridAnimationIsRunning(varsState)) { return (null) }

    // define inner HTML and function
    const innerHTML = "▷"
    const onClickFunction = () => {
        const curFrameIdx = varsStateLib.getVectorGridAnimationCurrentFrameIdx(varsState)
        const nextFrameIdx = (curFrameIdx + 1) % 24 // TODO: emove hard coded
        varsStateLib.setVectorGridAnimationCurrentFrameIdx(nextFrameIdx, varsState)
        setVarState(Math.random());
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonToEnd = (varsState, setVarState) => {
    // only show if playing
    if (varsStateLib.getVectorGridAnimationIsRunning(varsState)) { return (null) }

    // define inner HTML and function
    const innerHTML = "▶| "
    const onClickFunction = () => {
        varsStateLib.setVectorGridAnimationCurrentFrameIdx(23, varsState)
        setVarState(Math.random());
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

/* ** MAIN PLAYER ****************************************************************************** */
const VectorGridPlayer = ({ settings }) => {
    // TODO: remove hard-coded
    const dateFormatStr = "HH:MM dd-mm-yyyy (Z)"
    const initDateTime = "2022-02-14T22:00:00"
    const timeUnit = "01h"

    /* ** SET HOOKS **************************************************************************** */
    // Get global states and set local states
    const { varsState, setVarState } = useContext(VarsState);

    const divRef = useRef(null);
    useEffect(() => {
        DomEvent.disableClickPropagation(divRef.current);
    })

    /* ** RENDER ******************************************************************************* */
    const curTimeIdx = varsStateLib.getVectorGridAnimationCurrentFrameIdx(varsState)
    return (
        <div className={`${ownStyles.mainContainer} leaflet-control leaflet-bar`} ref={divRef}>
            <Container className={`${ownStyles.content}`} >
                <Row><Col>
                    <span className={`${ownStyles.dateTimeSting}`} >
                        {dateFormat(indexToDatetime(curTimeIdx, initDateTime, timeUnit), dateFormatStr)}
                    </span>
                </Col></Row>
                <Row><Col>
                    <RangeSlider
                        className={`${ownStyles.timelineRange}`}
                        min={0}
                        max={24}
                        value={varsStateLib.getVectorGridAnimationCurrentFrameIdx(varsState)}
                        tooltip={`off`}
                        disabled={false}
                        onChange={changeEvent => console.log("Changed to:", changeEvent.target.value)}
                    />
                </Col></Row>
                <Row><Col>
                    {PlayerButtonToBegin(varsState, setVarState)}
                    {PlayerButtonPrev(varsState, setVarState)}
                    {PlayerButtonStop(varsState, setVarState)}
                    {PlayerButtonPlay(varsState, setVarState)}
                    {PlayerButtonNext(varsState, setVarState)}
                    {PlayerButtonToEnd(varsState, setVarState)}
                </Col></Row>
            </Container>
        </div>
    );
}

// <div className={`d-inline-block w-100 text-cente`}>

export default VectorGridPlayer;
