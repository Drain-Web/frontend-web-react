import React, { useContext, useEffect, useRef } from "react";
import { DomEvent } from "leaflet";
import { Col, Container, Row, CloseButton } from "react-bootstrap";
import RangeSlider from 'react-bootstrap-range-slider';
import dateFormat, { masks } from "dateformat";
import { useRecoilState } from "recoil";
import { cloneDeep } from 'lodash';

// context and atoms
import { atVarStateVectorGridAnimation } from "../../atoms/atsVarState";
import varsStateLib from "../../contexts/varsStateLib";

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
            dangerouslySetInnerHTML={{ __html: innerHTML}}
        />
    )
}

/* ** PLAYER BUTTONS *************************************************************************** */
const PlayerButtonToBegin = (atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation) => {
    // only show if not playing
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

const PlayerButtonPrev = (atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation) => {
    // only show if not playing
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

const PlayerButtonStop = (atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation) => {
    // only show if playing
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

const PlayerButtonPlay = (atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation) => {
    // only show if not playing
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

const PlayerButtonNext = (atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation) => {
    // only show if not playing
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

const PlayerButtonToEnd = (atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation) => {
    // only show if not playing
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
    const dateFormatStr = "HH:MM dd-mm-yyyy (Z)"
    const initDateTime = "2022-02-14T22:00:00"

    /* ** SET HOOKS **************************************************************************** */
    
    // Get atoms
    const [atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation] = 
        useRecoilState(atVarStateVectorGridAnimation)

    // Avoid click propagation
    const divRef = useRef(null);
    useEffect(() => {
        DomEvent.disableClickPropagation(divRef.current);
    })

    /* ** GET VARIABLES ************************************************************************ */

    const timeUnit =   atsVarStateLib.getVectorGridAnimationTimeResolution(atomVarStateVectorGridAnimation)
    const curTimeIdx = atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation)

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
                        value={atsVarStateLib.getVectorGridAnimationCurrentFrameIdx(atomVarStateVectorGridAnimation)}
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
                        {PlayerButtonToBegin(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation)}
                        {PlayerButtonPrev(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation)}
                        {PlayerButtonStop(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation)}
                        {PlayerButtonPlay(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation)}
                        {PlayerButtonNext(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation)}
                        {PlayerButtonToEnd(atomVarStateVectorGridAnimation, setAtVarStateVectorGridAnimation)}
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
