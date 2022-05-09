import React, { useContext, useEffect, useRef } from "react";
import { DomEvent } from "leaflet";
import { Col, Container, Row, CloseButton } from "react-bootstrap";
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
        nextDatetime.setTime(nextDatetime.getTime() + (timeDelta * 60000));
    } else if (timeUnit === "h") {
        nextDatetime.setHours(nextDatetime.getHours() + timeDelta);
    } else if (timeUnit === "d") {
        nextDatetime.setHours(nextDatetime.getHours() + (timeDelta * 24));
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
            dangerouslySetInnerHTML={{ __html: innerHTML}}
        />
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
    // only show if not playing
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
    // only show if not playing
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
    // only show if not playing
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

const PlayerButtonFaster = (varsState, setVarState) => {
    // only show if playing
    if (!varsStateLib.getVectorGridAnimationIsRunning(varsState)) { return (null) }

    // define inner HTML and function
    const innerHTML = `▶<sup><strong>+</strong></sup> `
    const onClickFunction = () => {
        const oldPlaySpeed = varsStateLib.getVectorGridAnimationInterval(varsState)
        const newPlaySpeed = oldPlaySpeed / 2
        varsStateLib.setVectorGridAnimationInterval(newPlaySpeed, varsState)
        setVarState(Math.random());
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonSlower = (varsState, setVarState) => {
    // only show if playing
    if (!varsStateLib.getVectorGridAnimationIsRunning(varsState)) { return (null) }

    // define inner HTML and function
    const innerHTML = `▶<sub><strong>-</strong></sub>`
    const onClickFunction = () => {
        const oldPlaySpeed = varsStateLib.getVectorGridAnimationInterval(varsState)
        const newPlaySpeed = oldPlaySpeed * 2
        varsStateLib.setVectorGridAnimationInterval(newPlaySpeed, varsState)
        setVarState(Math.random());
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

/* ** MAIN PLAYER ****************************************************************************** */
const VectorGridPlayer = ({ settings }) => {
    // TODO: remove hard-codedimport
    const dateFormatStr = "HH:MM dd-mm-yyyy (Z)"
    const initDateTime = "2022-02-14T22:00:00"

    /* ** SET HOOKS **************************************************************************** */
    // Get global states and set local states
    const { varsState, setVarState } = useContext(VarsState);

    const divRef = useRef(null);
    useEffect(() => {
        DomEvent.disableClickPropagation(divRef.current);
    })

    /* ** GET VARIABLES ************************************************************************ */
    
    const timeUnit = varsStateLib.getVectorGridAnimationTimeResolution(varsState)
    const curTimeIdx = varsStateLib.getVectorGridAnimationCurrentFrameIdx(varsState)

    let curDateStr = null
    if (timeUnit) {
        curDateStr = dateFormat(indexToDatetime(curTimeIdx, initDateTime, timeUnit), dateFormatStr)
    } else {
        curDateStr = "Loading..."
    }

    /* ** RENDER ******************************************************************************* */
    return (
        <div className={`${ownStyles.mainContainer} leaflet-control leaflet-bar`} ref={divRef}>
            <Container className={`${ownStyles.content}`} >
                <Row>
                    <Col xs={2} md={2} lg={2}>
                        <span>
                            { (timeUnit ? "(".concat(timeUnit, ")") : "") }
                        </span>
                    </Col>
                    <Col xs={8} md={8} lg={8}>
                        <span className={`${ownStyles.dateTimeSting} col-6`} >
                            {curDateStr}
                        </span>
                    </Col>
                    <Col xs={2} md={2} lg={2}>
                        <CloseButton onClick={() => { console.log("Close me.") }} />
                    </Col>
                </Row>
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
                <Row className={`${ownStyles.noGutterX}`}>
                    <Col xs={3} md={3} lg={3}>
                        &nbsp;
                    </Col>
                    <Col xs={6} md={6} lg={6}>
                        {PlayerButtonToBegin(varsState, setVarState)}
                        {PlayerButtonPrev(varsState, setVarState)}
                        {PlayerButtonStop(varsState, setVarState)}
                        {PlayerButtonPlay(varsState, setVarState)}
                        {PlayerButtonNext(varsState, setVarState)}
                        {PlayerButtonToEnd(varsState, setVarState)}
                    </Col>
                    <Col xs={3} md={3} lg={3}>
                        {PlayerButtonSlower(varsState, setVarState)}
                        {PlayerButtonFaster(varsState, setVarState)}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default VectorGridPlayer;
