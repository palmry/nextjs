import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'
import { ScIconButton, menuBarTransitionStyle } from './sharedStyles'
import IconMenu from '../../statics/images/icon-menu.svg'
import IconNavClose from '../../statics/images/icon-nav-close.svg'

const ScMenuButton = styled(({ isOpen, styleState, ...restProps }) => (
  <ScIconButton {...restProps} />
))`
  position: relative;
  svg {
    height: 15px;
  }

  ${menuBarTransitionStyle}

  ${({ isOpen }) => {
    // animation delay
    const fadingTimeout = '0.2s'
    // animation timing
    const opacityDuration = '0.3s'
    const rotateDuration = '0.1s'

    const rotateDegree = 45
    const iconMenuAnimationTimeout = `${!isOpen ? fadingTimeout : '0s'}`
    const iconCloseAnimationTimeout = `${isOpen ? fadingTimeout : '0s'}`

    return css`
      // cross fading image animation
      ${ScIconMenu} {
        opacity: ${!isOpen ? 1 : 0};
        -webkit-transition: opacity ${opacityDuration}
            ${iconMenuAnimationTimeout},
          -webkit-transform ${rotateDuration} ${iconMenuAnimationTimeout};
        -webkit-transform: rotate(${!isOpen ? 0 : rotateDegree}deg);
        transition: opacity ${opacityDuration} ${iconMenuAnimationTimeout},
          transform ${rotateDuration} ${iconMenuAnimationTimeout};
        transform: rotate(${!isOpen ? 0 : rotateDegree}deg);
      }
      ${ScIconNavClose} {
        opacity: ${isOpen ? 1 : 0};
        -webkit-transform: rotate(${isOpen ? 0 : rotateDegree}deg);
        -webkit-transition: opacity ${opacityDuration}
            ${iconCloseAnimationTimeout},
          -webkit-transform ${rotateDuration} ${iconCloseAnimationTimeout};
        transition: opacity ${opacityDuration} ${iconCloseAnimationTimeout},
          transform ${rotateDuration} ${iconCloseAnimationTimeout};
        transform: rotate(${isOpen ? 0 : rotateDegree}deg);
      }
    `
  }}
`
const ScIconMenu = styled((props) => <IconMenu {...props} />)``
const ScIconNavClose = styled((props) => <IconNavClose {...props} />)`
  position: absolute;
`

/*----------------------------------------------------------------------------------
 *  RENDER PHASE
 *---------------------------------------------------------------------------------*/

const HamburgerButton = (props) => {
  return (
    <ScMenuButton
      color='inherit'
      onClick={props.onClickMobileMenuButton}
      isOpen={props.isOpenMobileMenu}
      styleState={props.styleState}
    >
      <ScIconMenu />
      <ScIconNavClose />
    </ScMenuButton>
  )
}

HamburgerButton.propTypes = {
  styleState: PropTypes.string,
  onClickMobileMenuButton: PropTypes.func.isRequired,
  isOpenMobileMenu: PropTypes.bool.isRequired,
}

HamburgerButton.defaultProps = {
  styleState: null,
}

export default HamburgerButton
