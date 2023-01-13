import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ReactComponent as SPLASH_DOT } from '../statics/images/splash-dot.svg'

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const Splashing = ({
  splashSize,
  imgSize,
  color,
  layerTrigger,
  rotate,
  circleSize,
  pointerState,
}) => {
  const margin = (splashSize - imgSize) / 2
  const center = splashSize / 2
  const bezier = '0, 1, 0.5, 0.95'
  const degree = rotate - 160 || Math.floor(Math.random() * (360 - 0 + 1)) + 0
  const Splash = styled(SPLASH_DOT)`
    ${props => `fill: ${props.color};`}
    transform: rotate(${degree}deg);
    position: absolute;
    width: ${splashSize}px;
    height: ${splashSize}px;
    z-index: -2;
    left: -${margin}px;
    top: -${margin}px;
    & circle {
      cx: ${center};
      cy: ${center};
      r: ${circleSize};
    }
    ${layerTrigger}:${pointerState} & .dot-splashing:nth-child(1) {
      animation: moveCircle1 0.8s cubic-bezier(${bezier});
    }
    ${layerTrigger}:${pointerState} & .dot-splashing:nth-child(2) {
      animation: moveCircle2 0.8s cubic-bezier(${bezier});
    }
    ${layerTrigger}:${pointerState} & .dot-splashing:nth-child(3) {
      animation: moveCircle3 0.8s cubic-bezier(${bezier});
    }
    ${layerTrigger}:${pointerState} & .dot-splashing:nth-child(4) {
      animation: moveCircle4 0.8s cubic-bezier(${bezier});
    }
    @keyframes moveCircle1 {
      100% {
        cx: ${splashSize * 0.35};
        cy: ${margin - circleSize};
        r: 1;
      }
    }
    @keyframes moveCircle2 {
      100% {
        cx: ${splashSize * 0.6};
        cy: ${circleSize / 2};
        r: 1;
      }
    }
    @keyframes moveCircle3 {
      100% {
        cx: ${splashSize * 0.3};
        cy: ${splashSize - margin + circleSize / 2};
        r: 1;
      }
    }
    @keyframes moveCircle4 {
      100% {
        cx: ${splashSize - margin * 0.8};
        cy: ${splashSize - margin + circleSize};
        r: 1;
      }
    }
  `
  return <Splash color={color} />
}

Splashing.propTypes = {
  circleSize: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  splashSize: PropTypes.number.isRequired,
  imgSize: PropTypes.number.isRequired,
  layerTrigger: PropTypes.object,
  rotate: PropTypes.number,
  pointerState: PropTypes.string,
}

Splashing.defaultProps = {
  layerTrigger: '& ',
  rotate: 0,
  pointerState: 'active',
}

export default Splashing
