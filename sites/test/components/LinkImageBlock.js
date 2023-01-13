import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import LinkImage from './LinkImage'
import { COLORS } from '../utils/styles'
import { ReactComponent as PlayIcon } from '../statics/images/icon-play-button.svg'

const ScLink = styled(LinkImage)`
  display: block;
  position: relative;
`
const ScOverlay = styled.div`
  background-color: ${COLORS.LT_SUN_YELLOW};
  position: absolute;
  /* z-index need to be higher than <img/> tag's
  *  because <img/> has filter css which creates a new stacking context
  */
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  ${props => props.isHovering && `opacity: 0.3;`}
`

const ScPlayIcon = styled(({ buttonSize, isHovering, ...restProps }) => (
  <PlayIcon {...restProps} />
))`
  // Icon size
  ${props =>
    props.buttonSize &&
    `
    height: ${props.buttonSize};
    width: ${props.buttonSize};
    `}

  // Align the icon to center
  position: absolute;
  z-index: 1; // need to be higher than z-index of <img/> tag
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  // Icon color
  fill: ${COLORS.TWILIGHT_BLUE};
  ${props =>
    props.isHovering &&
    `
    // These id names are in the .svg file.
    // If you want to switch the .svg icon file, please update the id names here
    // to match what they are in the new .svg file.

    & #cls-1 {
      fill: ${COLORS.WHITE};
    }

    & #cls-2 {
      fill: ${COLORS.TWILIGHT_BLUE};
    }`}
`
/** --------------------------------------------------------------------------
 * MAIN COMPONENT(s)
 -----------------------------------------------------------------------------*/
const LinkImageBlock = props => {
  const { to, children, isHovering, onMouseOver, onMouseOut } = props
  return (
    <ScLink to={to} withDefaultStyle={false}>
      <ScOverlay isHovering={isHovering} onMouseOver={onMouseOver} onMouseOut={onMouseOut} />
      {children}
    </ScLink>
  )
}

LinkImageBlock.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isHovering: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
}

export default LinkImageBlock

// Add more function on-top of <LinkImageBlock>
export const LinkImageBlockWithPlayIcon = props => {
  const { to, children, isHovering, onMouseOver, onMouseOut, buttonSize } = props
  return (
    <LinkImageBlock
      to={to}
      isHovering={isHovering}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    >
      <ScPlayIcon
        isHovering={isHovering}
        onMouseOver={props.onMouseOver}
        onMouseOut={props.onMouseOut}
        buttonSize={buttonSize}
      />
      {children}
    </LinkImageBlock>
  )
}

LinkImageBlockWithPlayIcon.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  isHovering: PropTypes.bool.isRequired,
  onMouseOver: PropTypes.func.isRequired,
  onMouseOut: PropTypes.func.isRequired,
  buttonSize: PropTypes.string,
}

LinkImageBlockWithPlayIcon.defaultProps = {
  buttonSize: '4.69rem',
}
