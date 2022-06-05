import React, { useEffect, useRef, useState } from "react";
import { DomEvent } from "leaflet";
import { Col, Container, Row, CloseButton, Button } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import dateFormat from "dateformat";
import { useRecoilState } from "recoil";
import { cloneDeep } from 'lodash';

// context and atoms
import { atVarStateVectorGridMode, atVarStateVectorGridAnimation } from "../../atoms/atsVarState";

import atsVarStateLib from "../../atoms/atsVarStateLib";

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
            dangerouslySetInnerHTML={{ __html: innerHTML }}
        />
    )
}

/* ** PLAYER BUTTONS *************************************************************************** */
const PlayerButtonAnimation = (atomVarStateVectorGridMode, setAtVarStateVectorGridMode) => {
    // only show if is in static mode
    if (atomVarStateVectorGridMode === 'animated') { return (null) }

    // define inner HTML and function
    const innerHTML = ('<img src="img/vectorplayer_icons/animation.png" style="height: 100%; width: 100%; object-fit: contain" />')
    const onClickFunction = () => { setAtVarStateVectorGridMode('animated') }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonStatic = (atomVarStateVectorGridMode, setAtVarStateVectorGridMode) => {
    // only show if is in animation mode
    if (atomVarStateVectorGridMode === 'static') { return (null) }

    const innerHTML = '<img src="img/vectorplayer_icons/static.png" style="height: 100%; width: 100%; object-fit: contain" />'
    const onClickFunction = () => { setAtVarStateVectorGridMode('static') }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonToBegin = (atomVarStateVectorGridAnimation,
                             setAtVarStateVectorGridAnimation,
                             atomVarStateVectorGridMode) => {
    // only show if not playing
    if (atomVarStateVectorGridMode === 'static') { return (null) }
    if (atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
        return (null)
    }

    // define inner HTML and function
    const innerHTML = "|◀"
    const onClickFunction = () => {
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        atsVarStateLib.setVectorGridAnimationCurrentFrameIdx(0, atmVarStateVectorGridAnimation)
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonPrev = (atomVarStateVectorGridAnimation,
                          setAtVarStateVectorGridAnimation,
                          atomVarStateVectorGridMode) => {
    // only show if not playing
    if (atomVarStateVectorGridMode === 'static') { return (null) }
    if (atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
        return (null)
    }

    // define inner HTML and function
    const innerHTML = "◁"
    const onClickFunction = () => {
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        const curFrameIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atmVarStateVectorGridAnimation)
        const nextFrameIdx = Math.max(0, (curFrameIdx - 1)) // TODO: emove hard coded
        atsVarStateLib.setVectorGridAnimationCurrentFrameIdx(nextFrameIdx, atmVarStateVectorGridAnimation)
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonStop = (atomVarStateVectorGridAnimation,
                          setAtVarStateVectorGridAnimation,
                          atomVarStateVectorGridMode) => {
    // only show if playing
    if (atomVarStateVectorGridMode === 'static') { return (null) }
    if (!atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
        return (null)
    }

    // define inner HTML and function
    const innerHTML = "◼"
    const onClickFunction = () => {
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        atsVarStateLib.toggleVectorGridAnimationIsRunning(atmVarStateVectorGridAnimation)
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonPlay = (atomVarStateVectorGridAnimation,
                          setAtVarStateVectorGridAnimation,
                          atomVarStateVectorGridMode) => {
    // only show if not playing
    if (atomVarStateVectorGridMode === 'static') { return (null) }
    if (atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
        return (null)
    }

    // define inner HTML and function
    const innerHTML = "▶"
    const onClickFunction = () => {
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        atsVarStateLib.toggleVectorGridAnimationIsRunning(atmVarStateVectorGridAnimation)
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonNext = (atomVarStateVectorGridAnimation,
                          setAtVarStateVectorGridAnimation,
                          atomVarStateVectorGridMode) => {
    // only show if not playing
    if (atomVarStateVectorGridMode === 'static') { return (null) }
    if (atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
        return (null)
    }

    // define inner HTML and function
    const innerHTML = "▷"
    const onClickFunction = () => {
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        const curFrameIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atmVarStateVectorGridAnimation)
        const nextFrameIdx = (curFrameIdx + 1) % 24 // TODO: emove hard coded
        atsVarStateLib.setVectorGridAnimationCurrentFrameIdx(nextFrameIdx, atmVarStateVectorGridAnimation)
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonToEnd = (atomVarStateVectorGridAnimation,
                           setAtVarStateVectorGridAnimation,
                           atomVarStateVectorGridMode) => {
    // only show if not playing
    if (atomVarStateVectorGridMode === 'static') { return (null) }
    if (atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
        return (null)
    }

    // define inner HTML and function
    const innerHTML = "▶| "
    const onClickFunction = () => {
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        atsVarStateLib.setVectorGridAnimationCurrentFrameIdx(23, atmVarStateVectorGridAnimation)  // TODO: emove hard coded
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonFaster = (atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation) => {
    // only show if playing
    if (!atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
        return (null)
    }

    // define inner HTML and function
    const innerHTML = `▶<sup><strong>+</strong></sup> `
    const onClickFunction = () => {
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        const oldPlaySpeed = atsVarStateLib.getVectorGridAnimationInterval(atmVarStateVectorGridAnimation)
        const newPlaySpeed = oldPlaySpeed / 2
        atsVarStateLib.setVectorGridAnimationInterval(newPlaySpeed, atmVarStateVectorGridAnimation)
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

const PlayerButtonSlower = (atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation) => {
    // only show if playing
    if (!atsVarStateLib.getVectorGridAnimationIsRunning(atomVarStateVectorGridAnimation)) {
        return (null)
    }

    // define inner HTML and function
    const innerHTML = `▶<sub><strong>-</strong></sub>`
    const onClickFunction = () => {
        const atmVarStateVectorGridAnimation = cloneDeep(atomVarStateVectorGridAnimation)
        const oldPlaySpeed = atsVarStateLib.getVectorGridAnimationInterval(atmVarStateVectorGridAnimation)
        const newPlaySpeed = oldPlaySpeed * 2
        atsVarStateLib.setVectorGridAnimationInterval(newPlaySpeed, atmVarStateVectorGridAnimation)
        setAtVarStateVectorGridAnimation(atmVarStateVectorGridAnimation)
    }

    // render
    return PlayerButton(innerHTML, onClickFunction)
}

/* ** MAIN PLAYER ****************************************************************************** */
const VectorGridPlayer = ({ settings }) => {
    // TODO: remove hard-codedimport
    const dateFormatStr = "HH:MM dd-mm-yyyy" //(Z)
    const initDateTime = "2012-07-08T22:00:00"

    // ** SET HOOKS ****************************************************************************

    // Get atoms
    const [isVisible, setIsVisible] = useState(true)
    const [atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation] =
        useRecoilState(atVarStateVectorGridAnimation)
    const [atomVarStateVectorGridMode, setAtVarStateVectorGridMode] =
        useRecoilState(atVarStateVectorGridMode)

    // Avoid click propagation
    const divRef = useRef(null);
    useEffect(() => { DomEvent.disableClickPropagation(divRef.current); })

    /* ** GET VARIABLES ************************************************************************ */

    const timeUnit = atsVarStateLib.getVectorGridAnimationTimeResolution(atomVarStateVectorGridAnimation)
    const curTimeIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation)

    let curDateStr = null
    if (timeUnit) {
        curDateStr = dateFormat(indexToDatetime(curTimeIdx, initDateTime, timeUnit), dateFormatStr) + " (EST)"
    } else {
        curDateStr = "Loading..."
    }

    /* ** RENDER ******************************************************************************* */

    // TODO: create an way to 'reopen' it
    // check if it is shown
    if (!isVisible) {
        return (<div className={`leaflet-control leaflet-bar`} ref={divRef}>
            <Button onClick={() => { setIsVisible(true) }} > + </Button>
        </div>)
    }

    return (
        <div className={`${ownStyles.mainContainer} leaflet-control leaflet-bar`} ref={divRef}>
            <Container className={`${ownStyles.content}`} >
                <Row>
                    <Col xs={2} md={2} lg={2}>
                        <span>
                            {
                                (timeUnit && (atomVarStateVectorGridMode === "animated")) ? 
                                "(".concat(timeUnit, ")") : 
                                (" ")
                            }
                        </span>
                    </Col>
                    <Col xs={8} md={8} lg={8}>
                        <span className={`${ownStyles.dateTimeSting} col-6`} >
                            {   
                                (atomVarStateVectorGridMode === "animated") ?
                                curDateStr :
                                "Drainage network"
                            }
                        </span>
                    </Col>
                    <Col xs={2} md={2} lg={2}>
                        <CloseButton onClick={() => { setIsVisible(false) }} />
                    </Col>
                </Row>
                <Row><Col>
                    {
                        (atomVarStateVectorGridMode === "animated") ?
                        (<RangeSlider
                            className={`${ownStyles.timelineRange}`}
                            min={0}
                            max={24}
                            value={atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation)}
                            tooltip={`off`}
                            disabled={false}
                            onChange={changeEvent => console.log("Changed to:", changeEvent.target.value)}
                        />) :
                        (<br />)
                    }
                </Col></Row>
                <Row className={`${ownStyles.noGutterX}`}>
                    <Col xs={3} md={3} lg={3}>
                        {PlayerButtonAnimation(atomVarStateVectorGridMode, setAtVarStateVectorGridMode)}
                        {PlayerButtonStatic(atomVarStateVectorGridMode, setAtVarStateVectorGridMode)}
                    </Col>
                    <Col xs={6} md={6} lg={6}>
                        {PlayerButtonToBegin(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation, atomVarStateVectorGridMode)}
                        {PlayerButtonPrev(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation, atomVarStateVectorGridMode)}
                        {PlayerButtonStop(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation, atomVarStateVectorGridMode)}
                        {PlayerButtonPlay(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation, atomVarStateVectorGridMode)}
                        {PlayerButtonNext(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation, atomVarStateVectorGridMode)}
                        {PlayerButtonToEnd(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation, atomVarStateVectorGridMode)}
                    </Col>
                    <Col xs={3} md={3} lg={3}>
                        {PlayerButtonSlower(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation)}
                        {PlayerButtonFaster(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation)}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default VectorGridPlayer;
